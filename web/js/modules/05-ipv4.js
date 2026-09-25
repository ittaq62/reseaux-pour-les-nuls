(window.MODULES = window.MODULES || []).push({
  id: 'ipv4', num: 5, icon: '🔢', titre: 'Adressage IPv4',
  sous: 'Binaire, masque, classes, adresses privées, réseau et diffusion',
  source: 'PROTOCOLE IP.pdf, Adresse-routage.pdf (slides 2 à 7), IMT-2026',
  cours: `
<h3>1. Une adresse IP, c’est 32 bits</h3>
<p>Une adresse IPv4 est une suite de <b>32 bits</b> (des 0 et des 1), découpée en <b>4 octets</b> de 8 bits, écrits en décimal et séparés par des points : c’est la <b>notation décimale pointée</b>. Chaque octet vaut de <b>0 à 255</b>.</p>
<div class="nul"><b>🧠 L’analogie de la poste (ton cours) :</b> une adresse IP, c’est comme « code postal + rue ». La <b>partie réseau</b> (le code postal) sert aux routeurs pour amener le paquet dans la bonne ville ; la <b>partie hôte</b> (la rue et le numéro) sert, une fois arrivé, à trouver la bonne machine.</div>
<h4>Convertir un octet : le tableau magique</h4>
<table style="text-align:center"><tr><th>Bit</th><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td></tr>
<tr><th>Poids</th><td><b>128</b></td><td><b>64</b></td><td><b>32</b></td><td><b>16</b></td><td><b>8</b></td><td><b>4</b></td><td><b>2</b></td><td><b>1</b></td></tr>
<tr><th>192 =</th><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><th>168 =</th><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr></table>
<p>Méthode : on part de 128 et on retire les poids tant que c’est possible. 168 = 128 + 32 + 8 → <code>10101000</code>. Exemple du cours : <code>192.168.1.8</code> = <code>11000000.10101000.00000001.00001000</code>.</p>
<div class="memo"><b>📌 Les valeurs d’un octet de masque à connaître par cœur :</b> 128 (1 bit à 1) · 192 (2) · 224 (3) · 240 (4) · 248 (5) · 252 (6) · 254 (7) · 255 (8).</div>

<h3>2. Le masque de sous-réseau</h3>
<p>Les champs « réseau » et « machine » sont de <b>taille variable</b> : c’est le <b>masque</b> qui indique la taille de chaque partie. Ses bits à <b>1</b> couvrent la partie réseau, ses bits à <b>0</b> la partie hôte. Deux notations (ton cours) :</p>
<ul><li><b>décimale pointée</b> : <code>255.255.255.224</code></li><li><b>CIDR</b> (adresse réseau/nombre de bits à 1) : <code>193.49.60.0/27</code></li></ul>
<table><tr><th>CIDR</th><th>Masque</th><th>Bits hôte</th><th>Adresses</th><th>Hôtes utilisables (2<sup>n</sup> − 2)</th></tr>
<tr><td>/8</td><td>255.0.0.0</td><td>24</td><td>16 777 216</td><td>16 777 214</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>16</td><td>65 536</td><td>65 534</td></tr>
<tr><td>/23</td><td>255.255.254.0</td><td>9</td><td>512</td><td>510</td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>8</td><td>256</td><td>254</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>7</td><td>128</td><td>126</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>6</td><td>64</td><td>62</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>5</td><td>32</td><td>30</td></tr>
<tr><td>/28</td><td>255.255.255.240</td><td>4</td><td>16</td><td>14</td></tr>
<tr><td>/29</td><td>255.255.255.248</td><td>3</td><td>8</td><td>6</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>2</td><td>4</td><td>2 (liaison entre 2 routeurs)</td></tr></table>
<p>Pourquoi « − 2 » ? Parce que deux adresses de chaque réseau sont <b>réservées</b> :</p>
<ul><li>partie hôte <b>toute à 0</b> → <b>adresse du réseau</b> (identifie le réseau lui-même) ;</li>
<li>partie hôte <b>toute à 1</b> → <b>adresse de diffusion</b> (broadcast : tous les hôtes du réseau).</li></ul>

<h3>3. Calculer l’adresse réseau et l’adresse de diffusion</h3>
<p><b>Adresse réseau = adresse IP <u>ET</u> masque</b> (ET logique bit à bit : 1 ET 1 = 1, sinon 0). <b>Diffusion</b> = adresse réseau avec tous les bits hôte à 1.</p>
<div class="demo">IP        192.168.1.130   11000000.10101000.00000001.10000010
Masque /26 255.255.255.192 11111111.11111111.11111111.11000000
-------------------------------------------------------------- ET
Réseau    192.168.1.128   11000000.10101000.00000001.10000000
Diffusion 192.168.1.191   11000000.10101000.00000001.10111111
1re adresse utilisable : 192.168.1.129   dernière : 192.168.1.190</div>
<div class="tip"><b>✔ La méthode rapide (le « nombre magique ») :</b> regarde l’octet où le masque n’est ni 255 ni 0 (ici 192). Pas = <b>256 − 192 = 64</b>. Les réseaux sont des multiples de 64 : 0, 64, <b>128</b>, 192… 130 tombe dans le bloc qui commence à 128 → réseau .128, diffusion = début du bloc suivant − 1 = <b>.191</b>.</div>
<div data-tool="ipcalc"></div>

<h3>4. Les classes (adressage « historique »)</h3>
<table><tr><th>Classe</th><th>1er octet</th><th>Bits de tête</th><th>Masque par défaut</th><th>Usage</th></tr>
<tr><td><b>A</b></td><td>1 – 126</td><td>0</td><td>255.0.0.0 (/8)</td><td>très grands réseaux (16 millions d’hôtes)</td></tr>
<tr><td><b>B</b></td><td>128 – 191</td><td>10</td><td>255.255.0.0 (/16)</td><td>réseaux moyens / grands</td></tr>
<tr><td><b>C</b></td><td>192 – 223</td><td>110</td><td>255.255.255.0 (/24)</td><td>petits réseaux (254 hôtes)</td></tr>
<tr><td><b>D</b></td><td>224 – 239</td><td>1110</td><td>—</td><td><b>multicast</b> (non attribuable)</td></tr>
<tr><td><b>E</b></td><td>240 – 255</td><td>1111</td><td>—</td><td>expérimental / tests (non attribuable)</td></tr></table>
<p><b>127.0.0.0</b> est réservé à la <b>boucle locale</b> (<i>loopback</i>, tests : <code>ping 127.0.0.1</code>). <b>255.255.255.255</b> = diffusion générale.</p>
<div class="warnbox"><b>⚠ Aujourd’hui on travaille « sans classe » (CIDR)</b> : c’est le masque qui compte, pas la classe. Mais Packet Tracer propose toujours le masque de classe par défaut quand tu cliques dans « Subnet Mask » (et RIP v1 / l’auto-summary raisonnent encore par classe !).</div>

<h3>5. Adresses publiques et privées</h3>
<p>Les adresses <b>publiques</b> sont uniques au monde, gérées par l’<b>IANA</b> (et obtenues auprès d’un FAI). La pénurie d’adresses a poussé à créer le <b>CIDR</b>, les <b>adresses privées</b> (RFC 1918) et IPv6. Les plages privées sont <b>interdites sur Internet</b> (les routeurs d’Internet les rejettent) : il faut les traduire avec le <b>NAT</b>.</p>
<table><tr><th>Plage privée (RFC 1918)</th><th>De … à …</th></tr>
<tr><td><b>10.0.0.0/8</b></td><td>10.0.0.0 → 10.255.255.255</td></tr>
<tr><td><b>172.16.0.0/12</b></td><td>172.16.0.0 → 172.31.255.255</td></tr>
<tr><td><b>192.168.0.0/16</b></td><td>192.168.0.0 → 192.168.255.255</td></tr></table>
<div class="warnbox"><b>⚠ Piège classique :</b> 172.32.0.1 n’est <b>pas</b> privée (la plage s’arrête à 172.31.255.255). Et <b>169.254.x.x</b> (APIPA) n’est pas une adresse RFC 1918 : c’est l’adresse que se donne un PC Windows quand <b>DHCP ne répond pas</b>.</div>

<h3>6. Statique ou dynamique ?</h3>
<ul><li><b>Statique</b> (à la main) : petits réseaux, et surtout <b>serveurs, imprimantes, routeurs</b> (ils doivent toujours avoir la même adresse).</li>
<li><b>Dynamique</b> : <b>DHCP</b> (successeur de BOOTP ; RARP est l’ancêtre) distribue IP, masque, passerelle, DNS aux postes (module 9).</li>
<li>Règle d’or : <b>deux interfaces ne doivent jamais avoir la même IP</b> (conflit d’adresses).</li></ul>
`,
  questions: [
    { id: 'i1', type: 'text', q: 'Combien de bits compte une adresse IPv4 ?', kind: 'int', accept: 32, hints: ['4 octets de 8 bits.'], explain: '4 × 8 = <b>32 bits</b> (≈ 4,3 milliards d’adresses).' },
    { id: 'i2', type: 'text', q: 'Convertis en binaire (8 bits).', fields: [{ label: '172 =', kind: 'bin', answer: '10101100', ph: '8 bits' }, { label: '16 =', kind: 'bin', answer: '00010000', ph: '8 bits' }, { label: '254 =', kind: 'bin', answer: '11111110', ph: '8 bits' }],
      hints: ['Poids : 128 64 32 16 8 4 2 1.', '172 = 128 + 32 + 8 + 4.'],
      explain: '172 = 128+32+8+4 = <code>10101100</code> ; 16 = <code>00010000</code> ; 254 = 255 − 1 = <code>11111110</code>.' },
    { id: 'i3', type: 'text', q: 'Convertis en décimal.', fields: [{ label: '11000000 =', kind: 'int', answer: 192 }, { label: '11100000 =', kind: 'int', answer: 224 }, { label: '00001010 =', kind: 'int', answer: 10 }],
      hints: ['Additionne les poids des bits à 1.'], explain: '128+64 = 192 ; 128+64+32 = 224 ; 8+2 = 10.' },
    { id: 'i4', type: 'text', q: 'Donne la notation CIDR (/n) de ces masques.', fields: [{ label: '255.255.255.0 =', kind: 'mask', answer: '/24', ph: '/..' }, { label: '255.255.255.192 =', kind: 'mask', answer: '/26', ph: '/..' }, { label: '255.240.0.0 =', kind: 'mask', answer: '/12', ph: '/..' }, { label: '255.255.254.0 =', kind: 'mask', answer: '/23', ph: '/..' }],
      hints: ['Compte les bits à 1 : 255 = 8 bits, 192 = 2 bits, 240 = 4 bits, 254 = 7 bits.'],
      explain: '/24 ; 24+2 = /26 ; 8+4 = /12 ; 16+7 = /23.' },
    { id: 'i5', type: 'text', q: 'Écris ces masques en décimal pointé.', fields: [{ label: '/27 =', kind: 'maskdot', answer: '255.255.255.224', ph: 'a.b.c.d' }, { label: '/30 =', kind: 'maskdot', answer: '255.255.255.252', ph: 'a.b.c.d' }, { label: '/20 =', kind: 'maskdot', answer: '255.255.240.0', ph: 'a.b.c.d' }],
      hints: ['/27 = 24 + 3 : trois octets à 255, puis 3 bits à 1 → 128+64+32.', '/20 = 16 + 4 : deux octets à 255, puis 4 bits à 1.'],
      explain: '/27 = <code>255.255.255.224</code> ; /30 = <code>255.255.255.252</code> ; /20 = <code>255.255.240.0</code>.' },
    { id: 'i6', type: 'match', q: 'À quelle classe appartient chaque adresse ?',
      pairs: [['10.4.2.1', 'Classe A'], ['130.1.2.3', 'Classe B'], ['192.168.59.10', 'Classe C'], ['224.0.0.5', 'Classe D (multicast)'], ['245.1.1.1', 'Classe E (expérimentale)']],
      hints: ['Regarde uniquement le 1er octet : A 1-126, B 128-191, C 192-223, D 224-239, E 240-255.'],
      explain: '10 → A ; 130 → B ; 192 → C ; 224 → D (224.0.0.5 est d’ailleurs l’adresse multicast d’OSPF) ; 245 → E.' },
    { id: 'i7', type: 'multi', q: 'Quelles adresses sont <b>privées</b> (RFC 1918) ?',
      choices: ['10.200.3.4', '172.20.1.1', '172.32.0.1', '192.168.254.10', '193.49.60.1', '169.254.12.3', '11.0.0.1'], good: [0, 1, 3],
      hints: ['Les 3 plages : 10.0.0.0/8, 172.16.0.0/12 (172.16 → 172.31), 192.168.0.0/16.', '169.254 = APIPA : ce n’est pas une plage RFC 1918.'],
      explain: 'Privées : 10.200.3.4, 172.20.1.1 (entre 172.16 et 172.31), 192.168.254.10. 172.32.0.1 est hors plage, 169.254.x.x est de l’APIPA (lien local), 193.49.60.1 et 11.0.0.1 sont publiques.' },
    { id: 'i8', type: 'qcm', q: 'À quoi sert l’adresse <code>127.0.0.1</code> ?', choices: ['C’est l’adresse de la passerelle par défaut', 'C’est la boucle locale (loopback) : tester la pile TCP/IP de sa propre machine', 'C’est l’adresse de diffusion générale', 'C’est une adresse multicast'], good: 1,
      hints: ['Le réseau 127.0.0.0 est réservé aux tests…'], explain: '127.0.0.0/8 = <b>boucle locale</b>. Un ping vers 127.0.0.1 teste ta propre carte / pile réseau sans rien envoyer sur le câble.' },
    { id: 'i9', type: 'text', q: 'Soit l’hôte <code>192.168.1.130/26</code>. Calcule :',
      fields: [{ label: 'Adresse réseau', kind: 'ip', answer: '192.168.1.128' }, { label: 'Adresse de diffusion', kind: 'ip', answer: '192.168.1.191' }, { label: 'Première adresse utilisable', kind: 'ip', answer: '192.168.1.129' }, { label: 'Dernière adresse utilisable', kind: 'ip', answer: '192.168.1.190' }],
      hints: ['/26 → dernier octet du masque = 192 → pas de 256 − 192 = 64.', 'Blocs : 0, 64, 128, 192. 130 est dans le bloc 128 → 191.'],
      explain: 'Réseau = IP ET masque = 192.168.1.128 ; diffusion = 192.168.1.191 ; plage .129 → .190 (62 hôtes).' },
    { id: 'i10', type: 'text', q: 'Même exercice avec <code>172.16.45.200/20</code> :',
      fields: [{ label: 'Adresse réseau', kind: 'ip', answer: '172.16.32.0' }, { label: 'Adresse de diffusion', kind: 'ip', answer: '172.16.47.255' }, { label: 'Nombre d’hôtes utilisables', kind: 'int', answer: 4094 }],
      hints: ['/20 → masque 255.255.240.0 : l’octet « intéressant » est le 3e (240), pas = 16.', 'Blocs sur le 3e octet : 0, 16, 32, 48… 45 est dans le bloc 32 → 47.', 'Bits hôte = 32 − 20 = 12 → 2<sup>12</sup> − 2.'],
      explain: 'Réseau 172.16.<b>32</b>.0, diffusion 172.16.<b>47.255</b>, 2<sup>12</sup> − 2 = <b>4094</b> hôtes.' },
    { id: 'i11', type: 'text', q: 'Combien d’hôtes utilisables dans un réseau…', fields: [{ label: '/24 ?', kind: 'int', answer: 254 }, { label: '/27 ?', kind: 'int', answer: 30 }, { label: '/30 ?', kind: 'int', answer: 2 }, { label: '/16 ?', kind: 'int', answer: 65534 }],
      hints: ['Formule : 2<sup>(32 − n)</sup> − 2.'], explain: '/24 : 256−2 = 254 ; /27 : 32−2 = 30 ; /30 : 4−2 = 2 ; /16 : 65 536−2 = 65 534.' },
    { id: 'i12', type: 'grid', q: 'Tableau façon Excel : complète l’adresse réseau et l’adresse de diffusion de chaque hôte (clique dans une cellule, <b>Entrée</b> ou <b>Tab</b> pour passer à la suivante).',
      file: 'adressage.xlsx', sheet: 'Calculs',
      cols: [{ h: 'Adresse IP / masque', w: 170 }, { h: 'Adresse réseau', kind: 'ip', w: 140 }, { h: 'Adresse de diffusion', kind: 'ip', w: 150 }],
      rows: [
        ['10.1.2.3/8', { a: '10.0.0.0' }, { a: '10.255.255.255' }],
        ['172.31.200.9/16', { a: '172.31.0.0' }, { a: '172.31.255.255' }],
        ['192.168.10.77/27', { a: '192.168.10.64' }, { a: '192.168.10.95' }],
        ['193.49.60.14/28', { a: '193.49.60.0' }, { a: '193.49.60.15' }],
        ['192.168.5.9/23', { a: '192.168.4.0' }, { a: '192.168.5.255' }]
      ],
      hints: ['/27 → pas de 32 ; /28 → pas de 16 ; /23 → pas de 2 sur le 3e octet.', '192.168.5.9/23 : le 3e octet 5 est dans le bloc 4-5 → réseau 192.168.4.0, diffusion 192.168.5.255.'],
      explain: 'Toujours : trouver l’octet « intéressant », calculer le pas (256 − valeur du masque), repérer le bloc. Le /23 est le piège : le réseau couvre deux valeurs du 3e octet (4 et 5).' },
    { id: 'i13', type: 'qcm', q: 'L’adresse <code>192.168.4.255</code> avec le masque <code>255.255.254.0</code> est…',
      choices: ['L’adresse de diffusion du réseau', 'Une adresse d’hôte tout à fait valide', 'L’adresse du réseau', 'Une adresse invalide car 255 est interdit'], good: 1,
      hints: ['Le réseau est un /23 : il s’étend de 192.168.4.0 à 192.168.5.255.'],
      explain: 'En /23, le réseau va de 192.168.4.0 à 192.168.5.255. 192.168.4.255 est au milieu : c’est un <b>hôte valide</b> ! Un « 255 » n’est pas forcément une diffusion (c’est tout l’intérêt de l’exercice 255.255.254.0 du cours).' },
    { id: 'i14', type: 'qcm', q: 'Deux PC : A = 192.168.1.20/25 et B = 192.168.1.140/25. Peuvent-ils communiquer <b>sans routeur</b> ?',
      choices: ['Oui, ils sont dans le même réseau 192.168.1.0', 'Non : A est dans 192.168.1.0/25 et B dans 192.168.1.128/25', 'Oui, grâce au switch', 'Seulement en IPv6'], good: 1,
      hints: ['/25 coupe le dernier octet en deux blocs : 0-127 et 128-255.'],
      explain: 'A → 192.168.1.0/25 ; B → 192.168.1.128/25 : deux réseaux différents → il faut passer par un routeur (passerelle).' },
    { id: 'i15', type: 'qcm', q: 'Quelle machine doit <b>obligatoirement</b> avoir une adresse IP statique ?', choices: ['Le PC portable d’un commercial', 'Le serveur web de l’entreprise', 'Le smartphone d’un visiteur', 'Une borne de consultation'], good: 1,
      hints: ['Les autres doivent toujours pouvoir la retrouver à la même adresse.'], explain: 'Serveurs, imprimantes réseau et routeurs : adresse <b>statique</b>. Les postes clients passent par DHCP.' },
    { id: 'i16', type: 'qcm', q: 'Qui gère l’attribution des adresses IP publiques au niveau mondial (successeur de l’InterNIC) ?', choices: ['L’IETF', 'L’IANA', 'L’ISO', 'Cisco'], good: 1,
      hints: ['Internet Assigned Numbers Authority.'], explain: 'L’<b>IANA</b> garantit l’unicité des adresses publiques (via les registres régionaux et les FAI).' }
  ]
});
