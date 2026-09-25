/* Niveau de difficulté des questions du parcours classique
   1 Débutant · 2 Facile · 3 Moyen · 4 Difficile · 5 Extrême · 6 Impossible
   (les nouvelles questions portent directement leur « lvl ») */
window.NIVEAUX = {
  map: {
    /* 1 bases */
    b1: 1, b2: 1, b12: 1, b3: 2, b4: 2, b5: 2, b8: 2, b10: 2, b11: 2, b6: 3, b7: 3, b9: 3,
    /* 2 OSI */
    o1: 1, o6: 1, o16: 1, o2: 2, o3: 2, o4: 2, o7: 2, o11: 2, o5: 3, o8: 3, o9: 3, o10: 3, o14: 3, o12: 4, o13: 4, o15: 4,
    /* 3 câbles */
    c2: 1, c1: 2, c4: 2, c9: 2, c10: 2, c3: 3, c6: 3, c7: 3, c11: 3, c12: 3, c5: 4, 'c-lab': 4, c8: 5,
    /* 4 équipements */
    e1: 1, e4: 2, e5: 2, e9: 2, e10: 2, 'e-lab': 2, e2: 3, e3: 3, e6: 3, e11: 3, e7: 4, e8: 4,
    /* 5 IPv4 */
    i1: 1, i8: 1, i15: 1, i2: 2, i3: 2, i6: 2, i16: 2, i4: 3, i5: 3, i7: 3, i11: 3, i9: 4, i10: 4, i14: 4, i12: 5, i13: 5,
    /* 6 sous-réseaux */
    s1: 1, s2: 2, s3: 3, s4: 3, s5: 3, s6: 4, s10: 4, s12: 4, s14: 4, s7: 5, s8: 5, s11: 5, s13: 5, s9: 6,
    /* 7 routage */
    rt1: 1, rt2: 1, rt11: 2, rt13: 2, rt14: 2, rt3: 3, rt4: 3, rt5: 3, rt6: 3, rt12: 3, rt15: 3,
    rt8: 4, 'rt-lab-ex0': 4, rt9: 4, rt10: 4, rt16: 4, rt7: 5, 'rt-lab-lille': 5, 'rt-lab-rip': 5, rt17: 5,
    /* 8 VLAN */
    v1: 1, v2: 2, v3: 2, v5: 2, v4: 3, v6: 3, v8: 3, 'v-lab1': 4, v9: 4, v7: 5, 'v-lab2': 5, 'v-lab3': 5,
    /* 9 DHCP */
    d1: 1, d2: 2, d4: 2, d6: 2, d3: 3, d5: 3, d7: 3, d8: 3, d10: 3, d9: 4, 'd-lab1': 4, 'd-lab2': 5,
    /* 10 DNS */
    n1: 1, n2: 2, n4: 2, n5: 2, n3: 3, n7: 3, n8: 3, n10: 3, n6: 4, n9: 4, 'n-lab': 4,
    /* 11 web */
    w1: 1, w2: 1, w3: 2, w4: 2, w5: 2, w6: 3, w7: 3, w9: 3, w8: 4, w10: 4, 'w-term': 5,
    /* 12 messagerie */
    m1: 1, m10: 1, m2: 2, m3: 2, m7: 2, m11: 2, m4: 3, m5: 3, m6: 3, m9: 3, m8: 4, 'm-term2': 4, 'm-term1': 5,
    /* 13 NAT */
    nt1: 2, nt2: 2, nt9: 2, nt3: 3, nt5: 3, nt6: 3, nt7: 3, nt4: 4, nt8: 4, 'nt-lab': 5,
    /* 14 IPv6 */
    'v6-1': 1, 'v6-7': 2, 'v6-8': 2, 'v6-14': 2, 'v6-2': 3, 'v6-4': 3, 'v6-9': 3, 'v6-13': 3,
    'v6-3': 4, 'v6-6': 4, 'v6-10': 4, 'v6-11': 4, 'v6-12': 4, 'v6-5': 5, 'v6-lab1': 5, 'v6-lab2': 5,
    /* 15 STP */
    st2: 1, st1: 2, st6: 2, st9: 2, st10: 2, st3: 3, st4: 3, st5: 3, st11: 3, st7: 4, st8: 5, 'st-lab': 5,
    /* 16 HSRP */
    hs1: 1, hs2: 2, hs3: 2, hs4: 3, hs5: 4, hs6: 4, hs7: 4, 'hs-lab': 5, hs8: 6,
    /* 17 SDN */
    sd1: 1, sd2: 2, sd4: 2, sd5: 2, sd3: 3, sd6: 3, sd7: 3, sd9: 3, 'sd-rest1': 4, sd8: 4, 'sd-rest2': 5,
    /* 18 Datamax */
    dm1: 2, dm3: 3, 'dm-lab1': 4, dm2: 4, 'dm-lab2': 5, 'dm-lab3': 5, dm4: 5,
    /* 19 examen */
    'ex-q3': 2, 'ex-q6': 2, 'ex-q7': 2, 'ex-s2pc': 3, 'ex-s2pc2': 3, 'ex-note': 3, 'ex-q2': 3, 'ex-q5': 3, 'ex-q8': 3,
    'ex-s1b': 4, 'ex-q1': 4, 'ex-q4': 4, 'ex-s1a': 5, 'ex-s2r1': 5, 'ex-s2r2': 5, 'ex-s2r3': 5
  }
};
