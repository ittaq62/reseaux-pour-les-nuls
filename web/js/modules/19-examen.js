(function () {
  function sub(base, n, bits) {
    /* n sous-réseaux consécutifs de taille 2^bits à partir de base */
    var rows = [], b = NET.ip2int(base), size = Math.pow(2, bits), len = 32 - bits;
    for (var i = 0; i < n; i++) {
      var net = (b + i * size) >>> 0, bc = (net + size - 1) >>> 0;
      rows.push([{ a: NET.int2ip(net) }, { a: NET.maskStr(len) }, { a: NET.int2ip(net + 1) }, { a: NET.int2ip(bc - 1) }, { a: NET.int2ip(bc) }]);
    }
    return rows;
  }
  var S1_COLS = [{ h: 'Adresse Réseau', kind: 'ip', w: 130 }, { h: 'Masque', kind: 'maskdot', w: 130 }, { h: 'Adresse de début', kind: 'ip', w: 130 }, { h: 'Adresse de fin', kind: 'ip', w: 130 }, { h: 'Broadcast', kind: 'ip', w: 130 }];
  var S2_COLS = [{ h: 'Adresse réseau', kind: 'ip', w: 130 }, { h: 'Masque', kind: 'mask', w: 130 }, { h: 'Passerelle', kind: 'ip', w: 130 }, { h: 'Interface', kind: 'ip', w: 130 }];
  function rt(l) { return l.map(function (r) { return r.map(function (x) { return { a: x }; }); }); }
  var M24 = '255.255.255.0', M16 = '255.255.0.0';
  var TOPO = `<div class="figure"><svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<g stroke="#5b7fa0" stroke-width="10" stroke-linecap="round"><line x1="20" y1="70" x2="190" y2="70"/><line x1="230" y1="150" x2="370" y2="150"/><line x1="470" y1="150" x2="620" y2="150"/><line x1="560" y1="70" x2="740" y2="70"/><line x1="360" y1="250" x2="500" y2="250"/></g>
<g stroke="#8a9bb3" stroke-width="2"><line x1="70" y1="70" x2="70" y2="120"/><line x1="190" y1="70" x2="230" y2="70"/><line x1="250" y1="95" x2="250" y2="150"/><line x1="370" y1="150" x2="400" y2="150"/><line x1="440" y1="150" x2="470" y2="150"/><line x1="420" y1="170" x2="420" y2="250"/><line x1="600" y1="150" x2="600" y2="95"/><line x1="560" y1="70" x2="530" y2="70"/><line x1="440" y1="250" x2="440" y2="280"/><line x1="690" y1="70" x2="690" y2="25"/><line x1="660" y1="70" x2="660" y2="115"/></g>
<g font-weight="700"><ellipse cx="250" cy="75" rx="32" ry="20" fill="#1f6fb2"/><text x="250" y="80" fill="#fff" text-anchor="middle">R1</text>
<ellipse cx="420" cy="150" rx="32" ry="20" fill="#1f6fb2"/><text x="420" y="155" fill="#fff" text-anchor="middle">R2</text>
<ellipse cx="600" cy="75" rx="32" ry="20" fill="#1f6fb2"/><text x="600" y="80" fill="#fff" text-anchor="middle">R3</text>
<rect x="45" y="120" width="50" height="30" rx="4" fill="#556"/><text x="70" y="140" fill="#fff" text-anchor="middle">PC1</text>
<rect x="415" y="280" width="50" height="30" rx="4" fill="#2e9e4f"/><text x="440" y="300" fill="#fff" text-anchor="middle">SRV1</text>
<rect x="665" y="0" width="50" height="26" rx="4" fill="#2e9e4f"/><text x="690" y="18" fill="#fff" text-anchor="middle">SRV2</text>
<rect x="635" y="115" width="50" height="30" rx="4" fill="#556"/><text x="660" y="135" fill="#fff" text-anchor="middle">PC2</text></g>
<g fill="currentColor"><text x="195" y="60">Eth1 192.168.254.1</text><text x="258" y="125">Eth2 172.31.0.1</text><text x="300" y="175">Eth1 172.31.0.3</text><text x="428" y="205">Eth2 192.168.200.1</text><text x="450" y="140">Eth3 172.30.0.1</text><text x="608" y="125">Eth2 172.30.0.2</text><text x="520" y="55">Eth1 192.168.20.1</text>
<text x="20" y="170">PC1 192.168.254.10</text><text x="470" y="320">SRV1 192.168.200.10</text><text x="560" y="165">PC2 192.168.20.10</text><text x="560" y="18">SRV2 192.168.20.200</text></g>
</svg><div class="figcap">Le schéma du Sujet 2 du DS (masques par défaut : 172.x = /16, 192.168.x = /24). Exigence : PC1 et PC2 accèdent à SRV1 et SRV2, et SRV1 accède à SRV2.</div></div>`;

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'examen', num: 19, icon: '🎓', titre: 'Examen blanc : le DS « routage et IP »',
  sous: 'Le vrai DS du prof, avec son barème, et un QCM de révision',
  source: 'DS routage et IP-correction.xlsx (Sujet 1, Sujet 2, feuilles de correction), adressage-routage.xlsx',
  cours: `
<h3>Le format du DS</h3>
<p>Le DS se fait dans un <b>classeur Excel</b> à remplir, corrigé <b>automatiquement</b> par des formules. Deux sujets :</p>
<ul><li><b>Sujet 1 — adressage</b> : découper <code>10.0.0.0</code> en <b>16 sous-réseaux</b>, puis <code>192.168.254.0</code> en <b>4 sous-réseaux</b> : adresse réseau, masque, adresse de début, de fin, broadcast.</li>
<li><b>Sujet 2 — routage</b> : les tables de routage (format Windows : adresse réseau, masque, passerelle, interface, métrique) de R1, R2, R3, PC1 et PC2.</li></ul>
<h3>Le barème (formules de la feuille de correction)</h3>
<table><tr><th>Élément</th><th>Points</th></tr>
<tr><td>Chaque cellule juste du Sujet 1 (réseau, début, fin, broadcast)</td><td><b>0,25</b></td></tr>
<tr><td>Le masque de chaque découpage (1re ligne)</td><td><b>2,5</b></td></tr>
<tr><td>Chaque route <b>connectée</b> entièrement juste (réseau + masque + passerelle + interface)</td><td><b>1</b></td></tr>
<tr><td>Chaque route <b>distante</b> ou par défaut entièrement juste</td><td><b>2</b></td></tr>
<tr><td><b>Total</b></td><td>25 (IP) + 25 (routage) = <b>50</b>, puis <b>× 20 / 50</b></td></tr></table>
<div class="warnbox"><b>⚠ Deux pièges repérés dans les copies corrigées :</b><br>1. La correction compare <b>ligne par ligne</b> la concaténation « réseau + masque + passerelle + interface » : deux routes justes mais <b>dans le désordre</b> valent 0 (4 points perdus sur une copie !). Écris les réseaux connectés d’abord (Eth1, Eth2, Eth3), puis les routes distantes. Ici, l’appli accepte n’importe quel ordre, mais pas le vrai DS.<br>2. Une faute de frappe (un masque <code>254.255.255.192</code>, une adresse <code>192.168.254.01</code>, une formule mal recopiée) coûte les points de la cellule, même si le raisonnement est bon. <b>Relis-toi.</b></div>
<div class="tip"><b>✔ Rappels express :</b> 16 sous-réseaux = 4 bits empruntés ; /8 + 4 = /12 → <b>255.240.0.0</b>, pas de 16 sur le 2e octet. 4 sous-réseaux d’un /24 = /26 → <b>255.255.255.192</b>, pas de 64. Dans une table « style Windows », pour un réseau connecté, <b>passerelle = interface = l’IP de la machine sur ce réseau</b> ; pour un PC, la route par défaut est <code>0.0.0.0 / 0.0.0.0</code> vers sa passerelle.</div>
${TOPO}
`,
  questions: [
    { id: 'ex-s1a', type: 'grid', tag: 'Sujet 1 (1/2)',
      q: '<b>Sujet 1 — </b>Soit le réseau suivant : <b>10.0.0.0</b> (/8). Réaliser <b>16 sous-réseaux</b>. Complète le tableau (ordre croissant, en commençant par 10.0.0.0).',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet1', title: 'Soit le réseau suivant : 10.0.0.0  Réaliser 16 sous réseaux', colOffset: 3, rowOffset: 2,
      cols: S1_COLS, rows: sub('10.0.0.0', 16, 20), score: { cell: 0.25, maskCol: 1, maskPts: 2.5 },
      hints: ['16 sous-réseaux → 4 bits empruntés → /12 → masque 255.240.0.0. Le pas est de 16 sur le 2e octet.', 'Sous-réseau 1 : 10.0.0.0 → début 10.0.0.1, fin 10.15.255.254, broadcast 10.15.255.255. Puis 10.16.0.0, 10.32.0.0…', 'Astuce Excel : Tab passe à la cellule de droite, Entrée à la ligne du dessous.'],
      explain: 'Masque 255.240.0.0 (/12) ; réseaux 10.0.0.0, 10.16.0.0 … 10.240.0.0 ; fin = réseau suivant − 2, broadcast = réseau suivant − 1. Barème : 16 × 4 × 0,25 = 16 pts + 2,5 pour le masque.' },
    { id: 'ex-s1b', type: 'grid', tag: 'Sujet 1 (2/2)',
      q: '<b>Sujet 1 (suite) — </b>Soit le réseau suivant : <b>192.168.254.0</b> (/24). Réaliser <b>4 sous-réseaux</b>.',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet1', title: 'Soit le réseau suivant : 192.168.254.0  Réaliser 4 sous réseaux', colOffset: 3, rowOffset: 22,
      cols: S1_COLS, rows: sub('192.168.254.0', 4, 6), score: { cell: 0.25, maskCol: 1, maskPts: 2.5 },
      hints: ['4 sous-réseaux → 2 bits → /26 → 255.255.255.192, pas de 64.', 'Attention à ne pas écrire « 192.168.254.01 » : c’est « 192.168.254.1 ».'],
      explain: '192.168.254.0, .64, .128, .192 ; début .1/.65/.129/.193 ; fin .62/.126/.190/.254 ; broadcast .63/.127/.191/.255. Barème : 4 pts + 2,5.' },
    { id: 'ex-s2r1', type: 'grid', tag: 'Sujet 2 — R1',
      q: '<b>Sujet 2</b> (schéma dans l’onglet Cours) — <b>Table de routage de R1</b>. Les PC1 et PC2 doivent accéder à SRV1 et SRV2, et SRV1 à SRV2. Format DS : pour un réseau connecté, passerelle = interface = l’IP de R1 sur ce réseau.',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet2', title: 'Table de routage R1', unordered: true, routeColors: true, cols: S2_COLS,
      rows: rt([['192.168.254.0', M24, '192.168.254.1', '192.168.254.1'], ['172.31.0.0', M16, '172.31.0.1', '172.31.0.1'], ['192.168.200.0', M24, '172.31.0.3', '172.31.0.1'], ['192.168.20.0', M24, '172.31.0.3', '172.31.0.1']]),
      rowTypes: ['c', 'c', 's', 's'], score: { rows: [1, 1, 2, 2] },
      hints: ['R1 est connecté à 192.168.254.0/24 (Eth1 .1) et 172.31.0.0/16 (Eth2 .1).', 'Pour SRV1 (192.168.200.0) et le réseau de PC2/SRV2 (192.168.20.0), R1 passe par R2 : passerelle 172.31.0.3, interface 172.31.0.1.'],
      explain: '2 connectées (1 pt chacune) + 2 distantes via R2 (2 pts chacune) = 6 pts.' },
    { id: 'ex-s2r2', type: 'grid', tag: 'Sujet 2 — R2',
      q: '<b>Sujet 2 — Table de routage de R2</b> (Eth1 172.31.0.3, Eth2 192.168.200.1, Eth3 172.30.0.1).',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet2', title: 'Table de routage R2', unordered: true, routeColors: true, cols: S2_COLS,
      rows: rt([['172.31.0.0', M16, '172.31.0.3', '172.31.0.3'], ['192.168.200.0', M24, '192.168.200.1', '192.168.200.1'], ['172.30.0.0', M16, '172.30.0.1', '172.30.0.1'], ['192.168.254.0', M24, '172.31.0.1', '172.31.0.3'], ['192.168.20.0', M24, '172.30.0.2', '172.30.0.1']]),
      rowTypes: ['c', 'c', 'c', 's', 's'], score: { rows: [1, 1, 1, 2, 2] },
      hints: ['3 réseaux connectés (un par interface).', 'Vers PC1 (192.168.254.0) : via R1 (172.31.0.1). Vers PC2/SRV2 (192.168.20.0) : via R3 (172.30.0.2).'],
      explain: '3 connectées + 2 distantes = 7 pts. Dans le corrigé, l’ordre attendu des routes distantes était 192.168.254.0 puis 192.168.20.0 : c’est exactement là qu’une copie a perdu 4 points en les inversant.' },
    { id: 'ex-s2r3', type: 'grid', tag: 'Sujet 2 — R3',
      q: '<b>Sujet 2 — Table de routage de R3</b> (Eth1 192.168.20.1, Eth2 172.30.0.2).',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet2', title: 'Table de routage R3', unordered: true, routeColors: true, cols: S2_COLS,
      rows: rt([['192.168.20.0', M24, '192.168.20.1', '192.168.20.1'], ['172.30.0.0', M16, '172.30.0.2', '172.30.0.2'], ['192.168.200.0', M24, '172.30.0.1', '172.30.0.2'], ['192.168.254.0', M24, '172.30.0.1', '172.30.0.2']]),
      rowTypes: ['c', 'c', 's', 's'], score: { rows: [1, 1, 2, 2] },
      hints: ['Tout ce qui n’est pas connecté passe par R2 (172.30.0.1).'], explain: '2 connectées + 2 distantes via R2 = 6 pts.' },
    { id: 'ex-s2pc', type: 'grid', tag: 'Sujet 2 — PC1',
      q: '<b>Sujet 2 — Table de routage de PC1</b> (192.168.254.10).',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet2', title: 'Table de routage PC1', unordered: true, routeColors: true, cols: S2_COLS,
      rows: rt([['192.168.254.0', M24, '192.168.254.10', '192.168.254.10'], ['0.0.0.0', '0.0.0.0', '192.168.254.1', '192.168.254.10']]),
      rowTypes: ['c', 'd'], score: { rows: [1, 2] },
      hints: ['Un PC a son réseau connecté + une route par défaut (0.0.0.0 / 0.0.0.0) vers sa passerelle.'], explain: '1 connectée + 1 par défaut = 3 pts.' },
    { id: 'ex-s2pc2', type: 'grid', tag: 'Sujet 2 — PC2',
      q: '<b>Sujet 2 — Table de routage de PC2</b> (192.168.20.10). <i>(Dans le fichier du prof, ce tableau est titré « Table de routage R2 » par erreur : c’est bien celui de PC2.)</i>',
      file: 'DS routage et IP.xlsx', sheet: 'Sujet2', title: 'Table de routage PC2', unordered: true, routeColors: true, cols: S2_COLS,
      rows: rt([['192.168.20.0', M24, '192.168.20.10', '192.168.20.10'], ['0.0.0.0', '0.0.0.0', '192.168.20.1', '192.168.20.10']]),
      rowTypes: ['c', 'd'], score: { rows: [1, 2] },
      hints: ['Même principe que PC1, avec la passerelle R3 (192.168.20.1).'],
      explain: '1 + 2 = 3 pts. Total Sujet 2 : 6 + 7 + 6 + 3 + 3 = 25 pts. Avec le Sujet 1 (25 pts) : /50, ramené sur 20.' },
    { id: 'ex-note', type: 'text', tag: 'Calcul de note',
      q: 'Une copie obtient 25/25 au Sujet 1 et 21/25 au Sujet 2 (deux routes distantes de R2 inversées). Quelle est sa note sur 20 ?', kind: 'num', accept: 18.4, ph: 'ex. 15,5',
      hints: ['(25 + 21) × 20 / 50.'], explain: '46 × 20 / 50 = <b>18,4</b> : c’est exactement la copie corrigée fournie… 1,6 point perdu pour un simple ordre de lignes !' },
    { id: 'ex-q1', type: 'qcm', tag: 'Révision', q: 'Un PC a l’adresse 172.16.5.130/25. Quelle est son adresse de diffusion ?', choices: ['172.16.5.255', '172.16.5.127', '172.16.255.255', '172.16.5.128'], good: 0,
      hints: ['/25 : blocs de 128 sur le dernier octet.'], explain: '130 est dans le bloc 128-255 → diffusion 172.16.5.255.' },
    { id: 'ex-q2', type: 'qcm', tag: 'Révision', q: 'Dans une table de routage, deux routes correspondent : 192.168.0.0/16 via A et 192.168.10.0/24 via B. Paquet vers 192.168.10.7 ?', choices: ['Via A', 'Via B', 'Il est jeté', 'Il part par les deux'], good: 1,
      hints: ['Correspondance la plus longue.'], explain: '/24 est plus précis que /16 → B.' },
    { id: 'ex-q3', type: 'match', tag: 'Révision', q: 'Qui travaille à quelle couche ?', pairs: [['Hub', 'Couche 1'], ['Switch (N2)', 'Couche 2'], ['Routeur', 'Couche 3'], ['TCP / UDP', 'Couche 4'], ['HTTP, DNS, SMTP', 'Couche 7']],
      hints: ['Physique, liaison, réseau, transport… application.'], explain: 'Hub 1, switch 2, routeur 3, TCP/UDP 4, protocoles applicatifs 7.' },
    { id: 'ex-q4', type: 'multi', tag: 'Révision', q: 'Un PC en DHCP obtient 169.254.12.4. Quelles causes sont possibles ?', choices: ['Le serveur DHCP est arrêté', 'Le PC est dans un VLAN sans serveur DHCP ni relais (ip helper-address)', 'Le câble ou le port du switch est mauvais', 'Le DNS est mal configuré', 'L’étendue DHCP est pleine'], good: [0, 1, 2, 4],
      hints: ['APIPA = aucune réponse DHCP. Le DNS n’intervient pas dans l’obtention de l’adresse.'], explain: 'Serveur arrêté, pas de relais, problème physique/VLAN, plus d’adresses libres. Le DNS n’y est pour rien.' },
    { id: 'ex-q5', type: 'text', tag: 'Révision', q: 'Simplifie l’adresse IPv6 <code>2001:0db8:0000:0000:0000:ff00:0042:8329</code>.', kind: 'ip6s', accept: '2001:db8::ff00:42:8329',
      hints: ['Zéros de tête supprimés, puis « :: » pour la suite de 3 blocs nuls.'], explain: '<code>2001:db8::ff00:42:8329</code>.' },
    { id: 'ex-q6', type: 'qcm', tag: 'Révision', q: 'Tu relies deux switchs avec des VLAN 10 et 20 des deux côtés. Quel mode pour les ports qui les relient ?', choices: ['Access VLAN 10', 'Trunk (802.1Q)', 'Access VLAN 1', 'Désactivé'], good: 1,
      hints: ['Plusieurs VLAN sur un seul câble.'], explain: 'Trunk 802.1Q : les trames sont étiquetées avec leur VID.' },
    { id: 'ex-q7', type: 'qcm', tag: 'Révision', q: 'Quelle commande Cisco affiche les traductions NAT en cours ?', choices: ['show ip route', 'show ip nat translations', 'show nat', 'show running-config nat'], good: 1,
      hints: ['show ip nat …'], explain: '<code>show ip nat translations</code> (et <code>show ip nat statistics</code>).' },
    { id: 'ex-q8', type: 'qcm', tag: 'Révision', q: 'Le routeur actif HSRP (priorité 150, preempt) tombe. Que voient les PC ?', choices: ['Ils doivent changer leur passerelle à la main', 'Rien ou presque : le routeur en veille reprend l’IP et la MAC virtuelles', 'Ils passent en APIPA', 'Ils perdent leur adresse IP'], good: 1,
      hints: ['C’est tout l’intérêt de l’IP virtuelle.'], explain: 'La bascule est transparente : même IP, même MAC virtuelle (0000.0c07.acXX).' }
  ]
  });
})();
