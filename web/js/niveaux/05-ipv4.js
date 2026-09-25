/* Module 5 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).ipv4 = [
  /* ---------- Débutant ---------- */
  { id: 'xi1', lvl: 1, type: 'qcm', q: 'Laquelle de ces écritures est une adresse IPv4 <b>valide</b> ?',
    choices: ['192.168.1.300', '192.168.1.30', '192.168.1', '192.168.1.30.5'], good: 1,
    hints: ['4 nombres séparés par des points, chacun entre 0 et 255.'],
    explain: '<code>192.168.1.30</code> : 4 octets, tous entre 0 et 255. 300 dépasse 255, et il faut exactement 4 nombres.' },
  { id: 'xi2', lvl: 1, type: 'qcm', q: 'Dans Packet Tracer, où règles-tu l’adresse IP d’un PC le plus simplement ?',
    choices: ['Onglet Physical', 'Onglet Desktop → IP Configuration', 'Onglet CLI', 'Menu Options → Preferences'], good: 1,
    hints: ['C’est l’onglet où se trouvent aussi la Command Prompt et le Web Browser.'],
    explain: 'Clic sur le PC → <b>Desktop</b> → <b>IP Configuration</b> : Static ou DHCP, adresse, masque, passerelle, DNS. Un PC n’a pas d’onglet CLI (c’est pour les routeurs et les switchs).' },
  { id: 'xi3', lvl: 1, type: 'match', q: 'Associe chaque élément à son rôle (l’analogie de la poste de ton cours).',
    pairs: [['Partie réseau', 'Le code postal : sert aux routeurs pour trouver le bon réseau'], ['Partie hôte', 'La rue et le numéro : désigne la machine dans le réseau'], ['Masque', 'Indique où s’arrête la partie réseau']],
    hints: ['Les routeurs n’ont besoin que de « la ville »…'],
    explain: 'Les routeurs travaillent avec la <b>partie réseau</b> ; une fois dans le bon réseau, la <b>partie hôte</b> désigne la machine. Le <b>masque</b> fixe la frontière entre les deux.' },
  /* ---------- Difficile ---------- */
  { id: 'xi4', lvl: 4, type: 'text', q: 'Un réseau doit accueillir <b>100 machines</b>, en gaspillant le moins d’adresses possible.',
    fields: [{ label: 'Nombre de bits hôte', kind: 'int', answer: 7 }, { label: 'Masque (décimal pointé)', kind: 'maskdot', answer: '255.255.255.128', ph: 'a.b.c.d' }],
    hints: ['2⁶ − 2 = 62 : pas assez. Et 2⁷ − 2 ?', 'Bits réseau = 32 − bits hôte.'],
    explain: '2⁷ − 2 = 126 ≥ 100 → <b>7 bits</b> hôte, donc 32 − 7 = /25 = <b>255.255.255.128</b>.' },
  { id: 'xi5', lvl: 4, type: 'qcm', q: 'Un PC configuré en <b>DHCP</b> affiche l’adresse <code>169.254.23.7</code> / <code>255.255.0.0</code>. Que s’est-il passé ?',
    choices: ['Le serveur DHCP lui a attribué une adresse privée', 'Aucun serveur DHCP n’a répondu : le PC s’est donné une adresse APIPA (lien local)', 'Le PC est en classe B, c’est normal', 'Le PC a reçu une adresse publique'], good: 1,
    hints: ['169.254 ne fait partie d’aucune plage RFC 1918…'],
    explain: '169.254.0.0/16 = <b>APIPA</b> : l’adresse que le PC s’attribue seul quand DHCP ne répond pas. Il ne peut parler qu’à ses voisins dans le même cas, jamais sortir du réseau. Packet Tracer l’affiche : « DHCP failed. APIPA is being used. »' },
  /* ---------- Extrême ---------- */
  { id: 'xi6', lvl: 5, type: 'text', q: 'Soit l’hôte <code>10.45.130.77/13</code>. Calcule :',
    fields: [{ label: 'Adresse réseau', kind: 'ip', answer: '10.40.0.0' }, { label: 'Adresse de diffusion', kind: 'ip', answer: '10.47.255.255' }, { label: 'Nombre d’hôtes utilisables', kind: 'int', answer: 524286 }],
    hints: ['/13 = 8 + 5 : le masque est 255.248.0.0, l’octet « intéressant » est le 2e.', 'Pas = 256 − 248 = 8 : blocs 0, 8, 16, 24, 32, 40, 48… 45 est dans le bloc 40.', 'Bits hôte = 32 − 13 = 19.'],
    explain: 'Réseau 10.<b>40</b>.0.0, diffusion 10.<b>47.255.255</b>, 2¹⁹ − 2 = <b>524 286</b> hôtes. Même méthode que d’habitude, mais sur le 2e octet.' },
  { id: 'xi7', lvl: 5, type: 'qcm', q: 'Tu dois adresser un réseau de <b>500 hôtes</b> en gaspillant le moins d’adresses. Quel masque choisis-tu ?',
    choices: ['/24 (255.255.255.0)', '/23 (255.255.254.0)', '/22 (255.255.252.0)', '/25 (255.255.255.128)'], good: 1,
    hints: ['Calcule 2<sup>n</sup> − 2 pour 8, 9 et 10 bits hôte.'],
    explain: '/24 → 254 hôtes (trop peu). <b>/23 → 510</b> hôtes : c’est le plus petit qui suffit. /22 → 1022 : ça marche mais on gaspille plus de 500 adresses.' },
  { id: 'xi8', lvl: 5, type: 'multi', q: 'Lesquelles de ces adresses peuvent être attribuées à un <b>hôte</b> (avec le masque indiqué) ?',
    choices: ['192.168.1.0/24', '10.0.0.255/16', '192.168.1.255/23', '192.168.3.0/23', '200.1.1.63/26', '172.16.5.64/25'], good: [1, 3, 5],
    hints: ['Pour chaque adresse, calcule l’adresse réseau et la diffusion avec SON masque.', 'Seules la première (réseau) et la dernière (diffusion) adresse du bloc sont interdites.'],
    explain: 'Valides : 10.0.0.255/16 (bloc 10.0.0.0 → 10.0.255.255), 192.168.3.0/23 (bloc 192.168.2.0 → 192.168.3.255) et 172.16.5.64/25 (bloc .0 → .127). Interdites : 192.168.1.0/24 (réseau), 192.168.1.255/23 (diffusion du bloc 192.168.0.0/23), 200.1.1.63/26 (diffusion du bloc .0 → .63).' },
  { id: 'xi9', lvl: 5, type: 'qcm', q: 'Pourquoi <code>255.255.0.255</code> n’est-il <b>pas</b> un masque valide ?',
    choices: ['Parce qu’un octet de masque ne peut pas valoir 255', 'Parce que les bits à 1 d’un masque doivent être contigus, tous à gauche', 'Parce qu’un masque doit se terminer par .0', 'Il est valide : c’est un /24'], good: 1,
    hints: ['Écris-le en binaire : 11111111.11111111.00000000.11111111.'],
    explain: 'Un masque, c’est une suite de 1 <b>puis</b> une suite de 0, sans trou. 255.255.0.255 a bien 24 bits à 1, mais pas contigus : ce n’est pas un masque. Packet Tracer le refuse (« Invalid Subnet Mask »).' },
  /* ---------- Impossible ---------- */
  { id: 'xi10', lvl: 6, type: 'text', q: 'Une machine a l’adresse <code>11000000.10101000.00001111.10010110</code> avec un masque <b>/28</b>. Donne en décimal :',
    fields: [{ label: 'Adresse réseau', kind: 'ip', answer: '192.168.15.144' }, { label: 'Adresse de diffusion', kind: 'ip', answer: '192.168.15.159' }],
    hints: ['Convertis d’abord : 00001111 = 15 et 10010110 = 128 + 16 + 4 + 2.', '/28 → dernier octet du masque = 240 → pas de 16.'],
    explain: 'L’adresse est 192.168.15.150. Pas de 16 : blocs …128, <b>144</b>, 160… 150 est dans le bloc 144 → réseau 192.168.15.144, diffusion 192.168.15.<b>159</b>.' },
  { id: 'xi11', lvl: 6, type: 'text', kind: 'int', accept: 4096, ph: 'réseaux',
    q: 'Combien de réseaux <b>/24</b> différents peut-on découper dans la plage privée <code>172.16.0.0/12</code> ?',
    hints: ['On passe de /12 à /24 : combien de bits en plus pour la partie réseau ?', 'Chaque bit supplémentaire double le nombre de réseaux.'],
    explain: '24 − 12 = 12 bits → 2¹² = <b>4096</b> réseaux /24, de 172.16.0.0/24 à 172.31.255.0/24.' },
  { id: 'xi12', lvl: 6, type: 'text', q: 'Quel est le préfixe le plus <b>long</b> (le bloc CIDR le plus petit) qui contient à la fois <code>192.168.8.0</code> et <code>192.168.15.255</code> ?',
    fields: [{ label: 'Préfixe', kind: 'mask', answer: '/21', ph: '/..' }],
    hints: ['Écris le 3e octet en binaire : 8 = 00001000, 15 = 00001111.', 'Compte les bits communs en partant de la gauche : 16 pour les deux premiers octets, puis…'],
    explain: '8 = 00001<b>000</b> et 15 = 00001<b>111</b> : les 5 premiers bits du 3e octet sont communs → 16 + 5 = <b>/21</b>. Le bloc 192.168.8.0/21 va de 192.168.8.0 à 192.168.15.255 : c’est le principe du <b>CIDR</b> (8 réseaux /24 agrégés en un seul).' },
  { id: 'xi-lab', lvl: 6, type: 'pt', file: 'Adresses-piegees.pkt', tag: 'Adressage /23',
    q: '<b>Des adresses qui font peur.</b> L’entreprise a reçu le réseau <code>192.168.4.0/23</code>. Le règlement impose : PC0 = la <b>255<sup>e</sup></b> adresse utilisable, PC1 = la <b>256<sup>e</sup></b>, et R1 G0/0 (la passerelle) = la <b>dernière</b> adresse utilisable. Configure les deux PC (adresse, masque, passerelle) et R1 G0/0, puis vérifie que PC0 joint PC1 et que les deux PC joignent le serveur <code>10.0.0.10</code> (déjà configuré, tout comme R1 G0/1).',
    build: function () {
      return LAB.make({
        devices: [['PC0', 'PC-PT', 120, 110], ['PC1', 'PC-PT', 120, 330], ['Switch0', '2960-24TT', 360, 220], ['R1', '1941', 620, 220], ['SRV', 'Server-PT', 880, 220]],
        links: [['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'], ['Switch0', 'GigabitEthernet0/1', 'R1', 'GigabitEthernet0/0', 'straight'], ['R1', 'GigabitEthernet0/1', 'SRV', 'FastEthernet0', 'cross']],
        notes: [[80, 440, 'Réseau des postes : 192.168.4.0/23']],
        cli: { R1: ['conf t', 'hostname R1', 'interface g0/1', 'ip address 10.0.0.1 255.255.255.0', 'no shutdown', 'end'] },
        hosts: { SRV: { ip: '10.0.0.10', mask: '255.255.255.0', gw: '10.0.0.1' } }
      });
    },
    tasks: [
      { label: 'PC0 a la 255<sup>e</sup> adresse utilisable, avec le bon masque', check: function (n) { return LAB.hostIs(n, 'PC0', '192.168.4.255', '255.255.254.0'); } },
      { label: 'PC1 a la 256<sup>e</sup> adresse utilisable, avec le bon masque', check: function (n) { return LAB.hostIs(n, 'PC1', '192.168.5.0', '255.255.254.0'); } },
      { label: 'R1 G0/0 a la dernière adresse utilisable, interface active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/0', '192.168.5.254', '255.255.254.0') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/0'); } },
      { label: 'PC0 et PC1 utilisent R1 comme passerelle', check: function (n) { return ['PC0', 'PC1'].every(function (p) { return n.dev(p).host.gw === NET.ip2int('192.168.5.254'); }); } },
      { label: 'PC0 joint PC1', check: function (n) { return n.canPing('PC0', 'PC1'); } },
      { label: 'PC0 et PC1 joignent le serveur', check: function (n) { return n.canPing('PC0', 'SRV') && n.canPing('PC1', 'SRV'); } }
    ],
    hints: ['1re adresse utilisable = 192.168.4.1. Compte : la 255<sup>e</sup> tombe sur 192.168.4.255… et en /23 ce n’est pas une diffusion !', 'Masque /23 = 255.255.254.0. Dernière utilisable = diffusion (192.168.5.255) − 1.', 'PC0 : 192.168.4.255, PC1 : 192.168.5.0, masque 255.255.254.0, passerelle 192.168.5.254. R1 : <code>interface g0/0</code> → <code>ip address 192.168.5.254 255.255.254.0</code> → <code>no shutdown</code>.'],
    solution: [
      { dev: 'R1', cli: ['conf t', 'interface g0/0', 'ip address 192.168.5.254 255.255.254.0', 'no shutdown', 'end'] },
      { dev: 'PC0', host: { ip: '192.168.4.255', mask: '255.255.254.0', gw: '192.168.5.254' } },
      { dev: 'PC1', host: { ip: '192.168.5.0', mask: '255.255.254.0', gw: '192.168.5.254' } }
    ],
    explain: 'En /23, le bloc va de 192.168.4.0 (adresse réseau) à 192.168.5.255 (diffusion). 192.168.4.255 et 192.168.5.0 sont des adresses d’hôte parfaitement valides : seules la toute première et la toute dernière adresse du bloc sont réservées. Un « .255 » ou un « .0 » ne se juge qu’avec le masque !' }
];
