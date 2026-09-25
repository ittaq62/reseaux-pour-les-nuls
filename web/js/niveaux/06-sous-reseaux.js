/* Module 6 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).sousreseaux = [
  /* ---------- Débutant ---------- */
  { id: 'xs1', lvl: 1, type: 'qcm', q: 'Découper un réseau en sous-réseaux, concrètement, c’est…',
    choices: ['Emprunter des bits de la partie hôte pour numéroter des sous-réseaux', 'Acheter de nouvelles adresses IP', 'Ajouter des switchs', 'Changer la classe du réseau'], good: 0,
    hints: ['Le nombre total d’adresses ne change pas : on le partage.'],
    explain: 'On <b>emprunte des bits à la partie hôte</b> : ils servent à numéroter les sous-réseaux. Le bloc d’adresses reste le même, il est juste partagé.' },
  { id: 'xs2', lvl: 1, type: 'qcm', q: 'Quand on emprunte des bits à la partie hôte, le masque devient…',
    choices: ['Plus long (plus de bits à 1)', 'Plus court (moins de bits à 1)', 'Identique', 'Égal à 255.255.255.255'], good: 0,
    hints: ['Les bits empruntés passent du côté « réseau » du masque.'],
    explain: 'Les bits empruntés passent à 1 dans le masque : un /24 découpé devient un /25, /26… Le masque <b>s’allonge</b>.' },
  { id: 'xs3', lvl: 1, type: 'text', kind: 'int', accept: 2, ph: 'sous-réseaux',
    q: 'Si on emprunte <b>1 seul bit</b> à la partie hôte, combien de sous-réseaux obtient-on ?',
    hints: ['Un bit peut valoir 0 ou 1…'],
    explain: '1 bit → 2¹ = <b>2</b> sous-réseaux (le bit à 0, le bit à 1). Chaque bit supplémentaire double ce nombre.' },
  /* ---------- Facile ---------- */
  { id: 'xs4', lvl: 2, type: 'text', q: 'On découpe <code>192.168.1.0/24</code> en sous-réseaux <b>/26</b>.',
    fields: [{ label: 'Nombre de sous-réseaux', kind: 'int', answer: 4 }, { label: 'Hôtes utilisables par sous-réseau', kind: 'int', answer: 62 }],
    hints: ['26 − 24 = 2 bits empruntés.', 'Il reste 32 − 26 = 6 bits d’hôte.'],
    explain: '2 bits empruntés → 2² = <b>4</b> sous-réseaux (.0, .64, .128, .192) ; 6 bits d’hôte → 2⁶ − 2 = <b>62</b> hôtes chacun.' },
  { id: 'xs5', lvl: 2, type: 'qcm', q: 'Dans quel sous-réseau se trouve l’hôte <code>192.168.1.100/26</code> ?',
    choices: ['192.168.1.0/26', '192.168.1.64/26', '192.168.1.96/26', '192.168.1.128/26'], good: 1,
    hints: ['/26 → pas de 64 : .0, .64, .128, .192.'],
    explain: '100 est entre 64 et 127 → sous-réseau <b>192.168.1.64/26</b> (diffusion .127). 192.168.1.96 n’est pas un début de bloc en /26.' },
  /* ---------- Extrême ---------- */
  { id: 'xs6', lvl: 5, type: 'text', q: 'Le réseau <code>10.0.0.0/8</code> est découpé avec le masque <code>255.255.192.0</code>.',
    fields: [{ label: 'Nombre de sous-réseaux', kind: 'int', answer: 1024 }, { label: 'Hôtes par sous-réseau', kind: 'int', answer: 16382 }, { label: '3e sous-réseau (après 10.0.0.0/18 et 10.0.64.0/18)', kind: 'cidr', answer: '10.0.128.0/18', ph: 'a.b.c.d/n' }],
    hints: ['255.255.192.0 = /18 → bits empruntés : 18 − 8.', 'Bits d’hôte : 32 − 18 = 14. Le pas est de 64 sur le 3e octet.'],
    explain: '10 bits empruntés → 2¹⁰ = <b>1024</b> sous-réseaux ; 2¹⁴ − 2 = <b>16 382</b> hôtes ; blocs 10.0.0.0, 10.0.64.0, <b>10.0.128.0</b>, 10.0.192.0, 10.1.0.0…' },
  /* ---------- Impossible ---------- */
  { id: 'xs7', lvl: 6, type: 'text', q: '<b>VLSM express.</b> Découpe <code>10.10.10.0/24</code> sans gaspiller, du plus grand au plus petit et sans trou : réseau A = 100 hôtes, B = 50, C = 20, plus une liaison entre deux routeurs. Donne chaque sous-réseau en notation a.b.c.d/n.',
    fields: [{ label: 'A (100 hôtes)', kind: 'cidr', answer: '10.10.10.0/25', ph: 'a.b.c.d/n' }, { label: 'B (50 hôtes)', kind: 'cidr', answer: '10.10.10.128/26', ph: 'a.b.c.d/n' }, { label: 'C (20 hôtes)', kind: 'cidr', answer: '10.10.10.192/27', ph: 'a.b.c.d/n' }, { label: 'Liaison', kind: 'cidr', answer: '10.10.10.224/30', ph: 'a.b.c.d/n' }],
    hints: ['100 → 126 (/25) ; 50 → 62 (/26) ; 20 → 30 (/27) ; liaison → /30.', 'Enchaîne : 0 (+128) → 128 (+64) → 192 (+32) → 224.'],
    explain: 'A = 10.10.10.0/25, B = .128/26, C = .192/27, liaison = .224/30. Il reste .228 → .255 pour d’autres liaisons ou un petit réseau.' },
  { id: 'xs8', lvl: 6, type: 'text', kind: 'int', accept: 128, ph: 'adresses',
    q: 'On découpe <code>192.168.1.0/24</code> entièrement en <b>/30</b>. Combien d’adresses au total deviennent inutilisables par des hôtes (adresses réseau + adresses de diffusion) ?',
    hints: ['Combien de /30 dans un /24 ?', 'Chaque sous-réseau « perd » 2 adresses.'],
    explain: '256 ÷ 4 = 64 sous-réseaux × 2 = <b>128</b> adresses perdues : la moitié du bloc ! C’est pour ça qu’on réserve les /30 aux liaisons entre routeurs.' },
  { id: 'xs9', lvl: 6, type: 'text', q: 'On découpe <code>10.3.0.0/16</code> en <b>/28</b>. En comptant 10.3.0.0/28 comme le 1er, quel est le <b>37e</b> sous-réseau ?',
    fields: [{ label: '37e sous-réseau', kind: 'cidr', answer: '10.3.2.64/28', ph: 'a.b.c.d/n' }],
    hints: ['Chaque /28 = 16 adresses : le n-ième commence à (n − 1) × 16.', '36 × 16 = 576 = 2 × 256 + 64.'],
    explain: '(37 − 1) × 16 = 576 adresses après 10.3.0.0, soit 2 × 256 + 64 → <b>10.3.2.64/28</b>.' },
  { id: 'xs-lab', lvl: 6, type: 'pt', file: 'VLSM-en-vrai.pkt', tag: 'VLSM',
    q: '<b>VLSM en vrai.</b> Réseau disponible : <code>192.168.10.0/24</code>. LAN-A = <b>50</b> hôtes (G0/0), LAN-B = <b>25</b> hôtes (G0/1), LAN-C = <b>10</b> hôtes (G0/2). Découpe sans gaspiller, du plus grand au plus petit, sans trou, en partant de 192.168.10.0. Règles de la maison : le routeur prend la <b>dernière</b> adresse utilisable de chaque LAN, le PC la <b>première</b>. Configure R1 et les trois PC, puis vérifie que PC-A joint PC-B et PC-C.',
    build: function () {
      return LAB.make({
        devices: [['R1', '2911', 520, 90], ['S-A', '2960-24TT', 200, 280], ['S-B', '2960-24TT', 520, 280], ['S-C', '2960-24TT', 840, 280], ['PC-A', 'PC-PT', 200, 460], ['PC-B', 'PC-PT', 520, 460], ['PC-C', 'PC-PT', 840, 460]],
        links: [['R1', 'GigabitEthernet0/0', 'S-A', 'GigabitEthernet0/1', 'straight'], ['R1', 'GigabitEthernet0/1', 'S-B', 'GigabitEthernet0/1', 'straight'], ['R1', 'GigabitEthernet0/2', 'S-C', 'GigabitEthernet0/1', 'straight'], ['PC-A', 'FastEthernet0', 'S-A', 'FastEthernet0/1', 'straight'], ['PC-B', 'FastEthernet0', 'S-B', 'FastEthernet0/1', 'straight'], ['PC-C', 'FastEthernet0', 'S-C', 'FastEthernet0/1', 'straight']],
        notes: [[120, 560, '192.168.10.0/24 — LAN-A 50 hôtes (G0/0) · LAN-B 25 hôtes (G0/1) · LAN-C 10 hôtes (G0/2)']]
      });
    },
    tasks: [
      { label: 'R1 G0/0 : dernière adresse utilisable de LAN-A, bon masque, active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/0', '192.168.10.62', '255.255.255.192') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/0'); } },
      { label: 'R1 G0/1 : dernière adresse utilisable de LAN-B, bon masque, active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/1', '192.168.10.94', '255.255.255.224') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/1'); } },
      { label: 'R1 G0/2 : dernière adresse utilisable de LAN-C, bon masque, active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/2', '192.168.10.110', '255.255.255.240') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/2'); } },
      { label: 'PC-A : première adresse de LAN-A, masque et passerelle', check: function (n) { return LAB.hostIs(n, 'PC-A', '192.168.10.1', '255.255.255.192', '192.168.10.62'); } },
      { label: 'PC-B : première adresse de LAN-B, masque et passerelle', check: function (n) { return LAB.hostIs(n, 'PC-B', '192.168.10.65', '255.255.255.224', '192.168.10.94'); } },
      { label: 'PC-C : première adresse de LAN-C, masque et passerelle', check: function (n) { return LAB.hostIs(n, 'PC-C', '192.168.10.97', '255.255.255.240', '192.168.10.110'); } },
      { label: 'PC-A joint PC-B et PC-C', check: function (n) { return n.canPing('PC-A', 'PC-B') && n.canPing('PC-A', 'PC-C'); } }
    ],
    hints: ['50 → /26 (62 hôtes), 25 → /27 (30), 10 → /28 (14).', 'LAN-A = 192.168.10.0/26, LAN-B = .64/27, LAN-C = .96/28.', 'R1 : .62 /26, .94 /27, .110 /28. PC : .1, .65, .97 avec la passerelle de leur LAN.'],
    solution: [
      { dev: 'R1', cli: ['conf t', 'interface g0/0', 'ip address 192.168.10.62 255.255.255.192', 'no shutdown', 'interface g0/1', 'ip address 192.168.10.94 255.255.255.224', 'no shutdown', 'interface g0/2', 'ip address 192.168.10.110 255.255.255.240', 'no shutdown', 'end'] },
      { dev: 'PC-A', host: { ip: '192.168.10.1', mask: '255.255.255.192', gw: '192.168.10.62' } },
      { dev: 'PC-B', host: { ip: '192.168.10.65', mask: '255.255.255.224', gw: '192.168.10.94' } },
      { dev: 'PC-C', host: { ip: '192.168.10.97', mask: '255.255.255.240', gw: '192.168.10.110' } }
    ],
    explain: 'LAN-A = 192.168.10.0/26 (R1 .62, PC .1), LAN-B = .64/27 (R1 .94, PC .65), LAN-C = .96/28 (R1 .110, PC .97). Trois masques différents sur le même routeur : c’est ça, le VLSM. Et si tu te trompes de bloc, IOS te le dit : « % … overlaps with GigabitEthernet0/0 ».' }
];
