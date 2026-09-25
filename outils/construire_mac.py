"""Compile l'exécutable Mac « Réseaux pour les nuls (Mac) » à la racine du projet.

Un seul fichier universel (Apple Silicon + Intel), fabriqué depuis Windows :
  1. go build pour darwin/arm64 et darwin/amd64 (le linker de Go signe la version arm64,
     sans quoi macOS refuse de la lancer sur les puces Apple) ;
  2. assemblage des deux dans un binaire « fat » (ce que fait lipo sur Mac).

Usage : python outils/construire_mac.py [chemin vers go.exe]   (sinon : variable GO, puis go du PATH)
"""
import os
import shutil
import struct
import subprocess
import sys
import tempfile

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(RACINE, 'outils', 'mac')
SORTIE = os.path.join(RACINE, 'Réseaux pour les nuls (Mac)')

LC_CODE_SIGNATURE = 0x1D
LC_BUILD_VERSION = 0x32
CPU = {0x01000007: 'x86_64 (Intel)', 0x0100000C: 'arm64 (Apple Silicon)'}


def trouver_go():
    if len(sys.argv) > 1:
        return sys.argv[1]
    return os.environ.get('GO') or shutil.which('go') or sys.exit('Go introuvable : python outils/construire_mac.py <chemin vers go.exe>')


def compiler(go, arch, dest):
    env = dict(os.environ, GOOS='darwin', GOARCH=arch, CGO_ENABLED='0')
    subprocess.run([go, 'build', '-trimpath', '-ldflags=-s -w', '-o', dest, '.'], cwd=SOURCE, env=env, check=True)


def examiner(octets):
    """(cputype, cpusubtype, signé ?, macOS minimum) d'un Mach-O 64 bits."""
    magic, cputype, cpusub, _, ncmds, _, _, _ = struct.unpack_from('<IiiIIIII', octets, 0)
    if magic != 0xFEEDFACF:
        sys.exit('Mach-O 64 bits attendu')
    pos, signe, mini = 32, False, None
    for _ in range(ncmds):
        cmd, taille = struct.unpack_from('<II', octets, pos)
        if cmd == LC_CODE_SIGNATURE:
            signe = True
        if cmd == LC_BUILD_VERSION:
            v = struct.unpack_from('<I', octets, pos + 12)[0]
            mini = '%d.%d' % (v >> 16, (v >> 8) & 0xFF)
        pos += taille
    return cputype, cpusub, signe, mini


def assembler(tranches):
    """Binaire universel : en-tête fat (big-endian), table des tranches, puis chaque tranche alignée sur 2^14 octets."""
    aligne = 14
    pas = 1 << aligne
    fichier = bytearray(struct.pack('>II', 0xCAFEBABE, len(tranches)) + b'\0' * (20 * len(tranches)))
    for i, oct_ in enumerate(tranches):
        cputype, cpusub, _, _ = examiner(oct_)
        debut = -(-len(fichier) // pas) * pas
        fichier += b'\0' * (debut - len(fichier)) + oct_
        struct.pack_into('>iiIII', fichier, 8 + 20 * i, cputype, cpusub, debut, len(oct_), aligne)
    return bytes(fichier)


def main():
    go = trouver_go()
    with tempfile.TemporaryDirectory() as tmp:
        tranches = []
        for arch in ('amd64', 'arm64'):
            dest = os.path.join(tmp, arch)
            compiler(go, arch, dest)
            with open(dest, 'rb') as f:
                tranches.append(f.read())
    for t in tranches:
        cputype, _, signe, mini = examiner(t)
        print('  %-22s %6.1f Mo  signé : %-3s  macOS minimum : %s' % (CPU.get(cputype, hex(cputype)), len(t) / 1048576, 'oui' if signe else 'NON', mini))
        if cputype == 0x0100000C and not signe:
            sys.exit('La tranche arm64 doit être signée (sinon macOS la tue au lancement).')
    with open(SORTIE, 'wb') as f:
        f.write(assembler(tranches))
    print('  ->', SORTIE, '(%.1f Mo)' % (os.path.getsize(SORTIE) / 1048576))


if __name__ == '__main__':
    main()
