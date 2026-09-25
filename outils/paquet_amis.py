"""Fabrique dist/Reseaux-pour-les-nuls.zip, prêt à partager (Windows + Mac).

- Contenu : web/, le lanceur Windows (.bat + serveur.ps1), l'exécutable Mac et un LISEZMOI.
- Jamais la progression personnelle (sauvegarde/), ni git, ni les tests et outils.
- Les droits Unix sont écrits dans le zip : l'exécutable Mac reste exécutable une fois
  décompressé sur Mac (un zip fait avec l'Explorateur Windows perd ce droit).

Usage : python outils/paquet_amis.py
"""
import os
import sys
import time
import zipfile

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOSSIER = 'Réseaux pour les nuls'
MAC = 'Réseaux pour les nuls (Mac)'
SORTIE = os.path.join(RACINE, 'dist', 'Reseaux-pour-les-nuls.zip')

# (source dans le projet, nom dans le zip)
FICHIERS = [
    ('lancer.bat', 'Réseaux pour les nuls (Windows).bat'),
    ('serveur.ps1', 'serveur.ps1'),
    ('reseaux.ico', 'reseaux.ico'),
    (MAC, MAC),
]


def entree(zf, nom, octets, mode, date):
    zi = zipfile.ZipInfo(DOSSIER + '/' + nom, date_time=date)
    zi.create_system = 3  # Unix : l'Utilitaire d'archive du Mac applique alors les droits
    zi.external_attr = mode << 16
    zi.compress_type = zipfile.ZIP_DEFLATED
    zf.writestr(zi, octets)


def date_de(chemin):
    return time.localtime(os.path.getmtime(chemin))[:6]


def main():
    if not os.path.isfile(os.path.join(RACINE, MAC)):
        sys.exit('Exécutable Mac absent : lance d\'abord python outils/construire_mac.py')
    os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
    n = 0
    with zipfile.ZipFile(SORTIE, 'w') as zf:
        maintenant = time.localtime()[:6]
        zi = zipfile.ZipInfo(DOSSIER + '/', date_time=maintenant)
        zi.create_system = 3
        zi.external_attr = (0o40755 << 16) | 0x10
        zf.writestr(zi, b'')
        for src, nom in FICHIERS:
            chemin = os.path.join(RACINE, src)
            with open(chemin, 'rb') as f:
                entree(zf, nom, f.read(), 0o100755 if src == MAC else 0o100644, date_de(chemin))
            n += 1
        with open(os.path.join(RACINE, 'outils', 'LISEZMOI-amis.txt'), 'rb') as f:
            texte = f.read().replace(b'\r\n', b'\n').replace(b'\n', b'\r\n')
        entree(zf, 'LISEZMOI.txt', texte, 0o100644, maintenant)
        n += 1
        web = os.path.join(RACINE, 'web')
        for dossier, sous, fichiers in os.walk(web):
            sous.sort()
            rel = os.path.relpath(dossier, RACINE).replace(os.sep, '/')
            zi = zipfile.ZipInfo(DOSSIER + '/' + rel + '/', date_time=date_de(dossier))
            zi.create_system = 3
            zi.external_attr = (0o40755 << 16) | 0x10
            zf.writestr(zi, b'')
            for nom in sorted(fichiers):
                chemin = os.path.join(dossier, nom)
                with open(chemin, 'rb') as f:
                    entree(zf, rel + '/' + nom, f.read(), 0o100644, date_de(chemin))
                n += 1
    print('  %d fichiers -> %s (%.1f Mo)' % (n, SORTIE, os.path.getsize(SORTIE) / 1048576))


if __name__ == '__main__':
    main()
