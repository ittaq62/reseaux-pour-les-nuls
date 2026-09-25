# Pure-Python Twofish (128-bit key) + EAX(CTR part) + Packet Tracer .pkt decoding
import sys, zlib, os

T = [
 [[0x8,0x1,0x7,0xD,0x6,0xF,0x3,0x2,0x0,0xB,0x5,0x9,0xE,0xC,0xA,0x4],
  [0xE,0xC,0xB,0x8,0x1,0x2,0x3,0x5,0xF,0x4,0xA,0x6,0x7,0x0,0x9,0xD],
  [0xB,0xA,0x5,0xE,0x6,0xD,0x9,0x0,0xC,0x8,0xF,0x3,0x2,0x4,0x7,0x1],
  [0xD,0x7,0xF,0x4,0x1,0x2,0x6,0xE,0x9,0xB,0x3,0x0,0x8,0x5,0xC,0xA]],
 [[0x2,0x8,0xB,0xD,0xF,0x7,0x6,0xE,0x3,0x1,0x9,0x4,0x0,0xA,0xC,0x5],
  [0x1,0xE,0x2,0xB,0x4,0xC,0x3,0x7,0x6,0xD,0xA,0x5,0xF,0x9,0x0,0x8],
  [0x4,0xC,0x7,0x5,0x1,0x6,0x9,0xA,0x0,0xE,0xD,0x8,0x2,0xB,0x3,0xF],
  [0xB,0x9,0x5,0x1,0xC,0x3,0xD,0xE,0x6,0x4,0x7,0xF,0x2,0x0,0x8,0xA]]]
def ror4(x): return ((x >> 1) | ((x << 3) & 8)) & 15
def mkq(t):
    q = []
    for i in range(256):
        a, b = i >> 4, i & 15
        a1 = a ^ b; b1 = a ^ ror4(b) ^ ((a << 3) & 8)
        a, b = t[0][a1], t[1][b1]
        a1 = a ^ b; b1 = a ^ ror4(b) ^ ((a << 3) & 8)
        a, b = t[2][a1], t[3][b1]
        q.append((b << 4) | a)
    return q
Q0, Q1 = mkq(T[0]), mkq(T[1])

def gfmul(a, b, p):
    r = 0
    while b:
        if b & 1: r ^= a
        a <<= 1
        if a & 0x100: a ^= p
        b >>= 1
    return r
MDS = [[0x01,0xEF,0x5B,0x5B],[0x5B,0xEF,0xEF,0x01],[0xEF,0x5B,0x01,0xEF],[0xEF,0x01,0xEF,0x5B]]
RS = [[0x01,0xA4,0x55,0x87,0x5A,0x58,0xDB,0x9E],[0xA4,0x56,0x82,0xF3,0x1E,0xC6,0x68,0xE5],
      [0x02,0xA1,0xFC,0xC1,0x47,0xAE,0x3D,0x19],[0xA4,0x55,0x87,0x5A,0x58,0xDB,0x9E,0x03]]
M32 = 0xFFFFFFFF
def rol(x, n): return ((x << n) | (x >> (32 - n))) & M32
def ror(x, n): return ((x >> n) | (x << (32 - n))) & M32
def b(x, i): return (x >> (8 * i)) & 0xFF

def col(j, x, L):
    l0 = b(L[0], j); l1 = b(L[1], j)
    if j == 0: y = Q1[Q0[Q0[x] ^ l1] ^ l0]
    elif j == 1: y = Q0[Q0[Q1[x] ^ l1] ^ l0]
    elif j == 2: y = Q1[Q1[Q0[x] ^ l1] ^ l0]
    else: y = Q0[Q1[Q1[x] ^ l1] ^ l0]
    z = 0
    for i in range(4): z |= gfmul(MDS[i][j], y, 0x169) << (8 * i)
    return z
def h(X, L):  # k = 2
    return col(0, b(X, 0), L) ^ col(1, b(X, 1), L) ^ col(2, b(X, 2), L) ^ col(3, b(X, 3), L)

class Twofish:
    def __init__(self, key):
        assert len(key) == 16
        M = [int.from_bytes(key[4*i:4*i+4], 'little') for i in range(4)]
        Me, Mo = [M[0], M[2]], [M[1], M[3]]
        S = []
        for i in range(2):
            m = key[8*i:8*i+8]; s = 0
            for r in range(4):
                v = 0
                for c in range(8): v ^= gfmul(RS[r][c], m[c], 0x14D)
                s |= v << (8 * r)
            S.append(s)
        self.S = [S[1], S[0]]
        rho = 0x01010101; K = []
        for i in range(20):
            A = h((2*i*rho) & M32, Me); B = rol(h(((2*i+1)*rho) & M32, Mo), 8)
            K.append((A + B) & M32); K.append(rol((A + 2*B) & M32, 9))
        self.K = K
        # precompute g as 4 byte tables for speed
        self.gt = [[col(i, x, self.S) for x in range(256)] for i in range(4)]
    def g(self, X):
        gt = self.gt
        return gt[0][X & 255] ^ gt[1][(X >> 8) & 255] ^ gt[2][(X >> 16) & 255] ^ gt[3][X >> 24]
    def encrypt(self, blk):
        K = self.K
        R = [int.from_bytes(blk[4*i:4*i+4], 'little') ^ K[i] for i in range(4)]
        for r in range(16):
            T0 = self.g(R[0]); T1 = self.g(rol(R[1], 8))
            F0 = (T0 + T1 + K[2*r+8]) & M32; F1 = (T0 + 2*T1 + K[2*r+9]) & M32
            R = [ror(R[2] ^ F0, 1), rol(R[3], 1) ^ F1, R[0], R[1]]
        C = [R[(i+2) % 4] ^ K[i+4] for i in range(4)]
        return b''.join(c.to_bytes(4, 'little') for c in C)

def xorb(a, c): return bytes(x ^ y for x, y in zip(a, c))
def dbl(x):
    v = int.from_bytes(x, 'big') << 1
    if v >> 128: v = (v & ((1 << 128) - 1)) ^ 0x87
    return v.to_bytes(16, 'big')
def cmac(tf, msg):
    L = tf.encrypt(bytes(16)); K1 = dbl(L); K2 = dbl(K1)
    n = max(1, (len(msg) + 15) // 16)
    blocks = [msg[16*i:16*i+16] for i in range(n)]
    last = blocks[-1]
    if len(last) == 16: last = xorb(last, K1)
    else: last = xorb(last + b'\x80' + bytes(15 - len(last)), K2)
    blocks[-1] = last
    x = bytes(16)
    for bl in blocks: x = tf.encrypt(xorb(x, bl))
    return x
def eax_decrypt(tf, nonce, data):
    N = cmac(tf, bytes(15) + b'\x00' + nonce)
    ct = data[:-16]
    ctr = int.from_bytes(N, 'big'); out = bytearray()
    for i in range(0, len(ct), 16):
        ks = tf.encrypt(ctr.to_bytes(16, 'big')); ctr = (ctr + 1) & ((1 << 128) - 1)
        out += xorb(ct[i:i+16], ks)
    return bytes(out)

def selftest():
    tf = Twofish(bytes(16))
    c = tf.encrypt(bytes(16)).hex().upper()
    assert c == '9F589F5CF6122C32B6BFEC2F2AE8C35A', c

def decode_pkt(raw):
    L = len(raw)
    p = bytes((raw[L - 1 - i] ^ ((L - i * L) & 0xFF)) for i in range(L))
    tf = Twofish(bytes([137] * 16))
    d = eax_decrypt(tf, bytes([16] * 16), p)
    n = len(d)
    d = bytes((d[i] ^ ((n - i) & 0xFF)) for i in range(n))
    return zlib.decompress(d[4:])

if __name__ == '__main__':
    selftest(); print('twofish selftest OK')
    src = sys.argv[1]; dst = sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if f.lower().endswith('.pkt'):
            try:
                xml = decode_pkt(open(os.path.join(src, f), 'rb').read())
                open(os.path.join(dst, f[:-4] + '.xml'), 'wb').write(xml)
                print('OK', f, len(xml))
            except Exception as e:
                print('FAIL', f, e)
