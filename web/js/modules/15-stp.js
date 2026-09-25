(function () {
  function linksBetween(n, a, b) { return n.links.filter(function (l) { return ((l.a.dev === a && l.b.dev === b) || (l.a.dev === b && l.b.dev === a)) && n.cableOk(l); }); }
  function stpRoot(n) { var i = n.stpAll().byVlan[1]; return i && i.roots.length ? i.roots[0] : null; }
  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'stp', num: 15, icon: '🌳', titre: 'Redondance et Spanning Tree',
  sous: 'Boucles, tempêtes de broadcast, pont racine, rôles et états des ports',
  source: 'STP.pdf (Cisco), IMT-2026 (VSS, STP), TP-TAP.pkt',
  cours: `
<h3>1. La redondance… et son problème</h3>
<p>La <b>redondance</b> (plusieurs chemins) permet au réseau de continuer à fonctionner si <b>un seul</b> élément tombe en panne (« une seule voiture = pas de voiture le jour où elle casse »). Mais en couche 2, les boucles sont catastrophiques, car une trame Ethernet n’a pas de TTL :</p>
<ul><li><b>Tempête de broadcast</b> : un broadcast est recopié par chaque switch sur tous ses ports… et tourne indéfiniment en se multipliant, jusqu’à <b>écrouler le réseau</b>.</li>
<li><b>Transmissions de trames multiples</b> : le destinataire reçoit plusieurs copies de la même trame.</li>
<li><b>Instabilité de la table MAC</b> : un switch voit la même MAC arriver sur deux ports différents et « apprend » n’importe quoi.</li></ul>
<div class="nul"><b>🧠 L’analogie du rond-point sans sortie :</b> sans règle, les voitures (les broadcasts) tournent éternellement et chaque tour en crée de nouvelles. <b>Spanning Tree</b> ferme certaines routes (les ports bloqués) pour qu’il n’existe plus qu’<b>un seul chemin</b> entre deux points… tout en gardant les routes fermées prêtes à rouvrir en cas d’accident.</div>

<h3>2. Le principe de STP (IEEE 802.1D)</h3>
<p>STP construit, à partir de la topologie physique, un <b>arbre</b> sans boucle en plaçant certains ports en état <b>bloqué</b>. Les switchs s’échangent des messages <b>BPDU</b> (<i>Bridge Protocol Data Unit</i>) — qui continuent d’être reçus même sur les ports bloqués. Une BPDU contient : le BID de la racine, le coût jusqu’à la racine, le BID de l’émetteur, l’ID du port.</p>
<div class="memo"><b>📌 L’algorithme en 4 étapes :</b><br>1. <b>Élection du pont racine</b> : le switch au <b>BID le plus petit</b> (un seul par réseau).<br>2. <b>Un port racine</b> (<i>Root Port</i>) par switch non racine : celui qui offre le <b>chemin le moins coûteux</b> vers la racine.<br>3. <b>Un port désigné</b> par segment : celui qui rapproche le plus de la racine (tous les ports de la racine sont désignés).<br>4. Les autres ports (<b>non désignés</b>) sont <b>bloqués</b>.</div>
<h4>L’identifiant de pont (BID) : 8 octets</h4>
<table><tr><th>Priorité (2 octets)</th><th>Adresse MAC (6 octets)</th></tr><tr><td>de 0 à 65 535, <b>32 768 par défaut</b> (par pas de 4096 sur Cisco)</td><td>départage à priorité égale : la <b>plus petite</b> MAC gagne</td></tr></table>
<p>Sur Cisco (PVST), la priorité affichée inclut le numéro de VLAN : 32768 + 1 = <b>32769</b> pour le VLAN 1.</p>
<h4>Le coût des liens</h4>
<table><tr><th>Débit</th><th>Coût (IEEE révisé)</th><th>Coût (ancienne norme)</th></tr>
<tr><td>10 Gbit/s</td><td><b>2</b></td><td>1</td></tr><tr><td>1 Gbit/s</td><td><b>4</b></td><td>1</td></tr><tr><td>100 Mbit/s</td><td><b>19</b></td><td>10</td></tr><tr><td>10 Mbit/s</td><td><b>100</b></td><td>100</td></tr></table>
<div class="figure"><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<line x1="320" y1="50" x2="130" y2="190" stroke="#8a9bb3" stroke-width="3"/><line x1="320" y1="50" x2="510" y2="190" stroke="#8a9bb3" stroke-width="3"/><line x1="130" y1="200" x2="510" y2="200" stroke="#8a9bb3" stroke-width="3"/>
<rect x="270" y="28" width="100" height="36" rx="6" fill="#2e9e4f"/><text x="320" y="44" fill="#fff" text-anchor="middle" font-weight="700">Cat-A</text><text x="320" y="58" fill="#fff" text-anchor="middle">RACINE</text>
<rect x="80" y="182" width="100" height="36" rx="6" fill="#1f6fb2"/><text x="130" y="205" fill="#fff" text-anchor="middle" font-weight="700">Cat-B</text>
<rect x="460" y="182" width="100" height="36" rx="6" fill="#1f6fb2"/><text x="510" y="205" fill="#fff" text-anchor="middle" font-weight="700">Cat-C</text>
<text x="240" y="75" fill="#6cc04a" font-weight="700">D</text><text x="390" y="75" fill="#6cc04a" font-weight="700">D</text>
<text x="160" y="170" fill="#fbab18" font-weight="700">R</text><text x="470" y="170" fill="#fbab18" font-weight="700">R</text>
<text x="190" y="195" fill="#6cc04a" font-weight="700">D</text><text x="440" y="195" fill="#e2231a" font-weight="700">✖ bloqué</text>
<text x="200" y="120" fill="currentColor">coût 19</text><text x="400" y="120" fill="currentColor">coût 19</text><text x="300" y="235" fill="currentColor">coût 19</text>
</svg><div class="figcap">R = port racine, D = port désigné. Sur le segment B–C, les deux switchs sont à égalité (coût 19) : le BID le plus petit (Cat-B) garde le port désigné, Cat-C bloque.</div></div>

<h3>3. Les états d’un port</h3>
<table><tr><th>État</th><th>Durée</th><th>Ce qu’il fait</th></tr>
<tr><td><b>Désactivé</b></td><td>—</td><td>shutdown administratif</td></tr>
<tr><td><b>Blocage</b></td><td>max age = <b>20 s</b></td><td>reçoit les BPDU seulement, ne transmet rien</td></tr>
<tr><td><b>Écoute</b></td><td><b>15 s</b></td><td>participe à l’élection (racine / désigné)</td></tr>
<tr><td><b>Apprentissage</b></td><td><b>15 s</b></td><td>remplit la table MAC, ne transmet pas encore</td></tr>
<tr><td><b>Acheminement</b> (forwarding)</td><td>—</td><td>transmet les données et les BPDU</td></tr></table>
<p>Le réseau a <b>convergé</b> quand tous les ports sont en acheminement ou en blocage (jusqu’à ~50 s en 802.1D !). C’est pour ça que les voyants des switchs restent <b>orange</b> quelques secondes dans Packet Tracer.</p>
<div class="tip"><b>✔ RSTP (IEEE 802.1w)</b> — Rapid Spanning Tree : rôles et états clarifiés (port alternatif / de secours), passage rapide à l’état de transmission, chaque switch génère ses propres BPDU. Il remplace 802.1D. Commande : <code>spanning-tree mode rapid-pvst</code>.</div>
<div class="tip"><b>✔ VSS</b> (Virtual Switching System, Cisco, cours IMT) : deux switchs physiques (placés dans deux locaux techniques) vus comme <b>un seul</b> switch logique → plus de boucle, donc plus besoin de STP pour ce lien, avec une forte tolérance de panne.</div>
<div class="demo dark">Switch(config)#spanning-tree vlan 1 priority 4096     ← devenir racine (plus petit = prioritaire)
Switch(config)#spanning-tree vlan 1 root primary     ← (raccourci : priorité 24576)
Switch(config)#no spanning-tree vlan 1               ← DÉSACTIVE STP : dangereux s’il y a une boucle !
Switch#show spanning-tree                             ← Root ID, Bridge ID, rôles (Root/Desg/Altn) et états (FWD/BLK)</div>
`,
  questions: [
    { id: 'st1', type: 'multi', q: 'Quels problèmes provoque une boucle de couche 2 <b>sans</b> Spanning Tree ?', choices: ['Tempête de broadcast', 'Transmissions multiples de la même trame', 'Instabilité de la table MAC', 'Épuisement des adresses IP', 'Expiration du TTL IP au bout de 255 sauts'], good: [0, 1, 2],
      hints: ['Une trame Ethernet n’a pas de TTL : rien ne l’arrête.'], explain: 'Tempêtes, doublons, table MAC instable. Le TTL existe en IP (couche 3), pas dans la trame Ethernet.' },
    { id: 'st2', type: 'qcm', q: 'Comment s’appellent les messages échangés par les switchs pour construire l’arbre STP ?', choices: ['LSA', 'BPDU', 'RA', 'Hello HSRP'], good: 1,
      hints: ['Bridge Protocol Data Unit.'], explain: 'Les <b>BPDU</b>, envoyées toutes les 2 s par défaut, reçues même sur les ports bloqués.' },
    { id: 'st3', type: 'order', q: 'Remets dans l’ordre les étapes de l’algorithme STP.', items: ['Élire le pont racine (BID le plus petit)', 'Choisir un port racine sur chaque switch non racine', 'Choisir un port désigné par segment', 'Bloquer les ports restants'],
      hints: ['On commence par trouver le centre de l’arbre.'], explain: 'Racine → ports racine → ports désignés → blocage des autres.' },
    { id: 'st4', type: 'text', q: 'Le BID (Bridge ID) :', fields: [{ label: 'Taille totale (octets)', kind: 'int', answer: 8 }, { label: 'Priorité par défaut', kind: 'int', answer: 32768 }, { label: 'Taille de la partie priorité (octets)', kind: 'int', answer: 2 }],
      hints: ['Priorité + adresse MAC (6 octets).'], explain: 'BID = 2 octets de priorité (0-65 535, défaut 32 768) + 6 octets de MAC = 8 octets.' },
    { id: 'st5', type: 'qcm', q: 'SW1 : priorité 32768, MAC 0001.1111.1111. SW2 : priorité 4096, MAC 00FF.FFFF.FFFF. SW3 : priorité 32768, MAC 0001.0000.0001. Qui est le pont racine ?', choices: ['SW1', 'SW2', 'SW3'], good: 1,
      hints: ['On compare d’abord la priorité, et seulement en cas d’égalité la MAC.'], explain: 'SW2 a la plus petite priorité (4096) : il gagne, peu importe sa MAC. Entre SW1 et SW3 (égalité de priorité), SW3 gagnerait grâce à sa MAC plus petite.' },
    { id: 'st6', type: 'match', q: 'Coût STP (norme IEEE révisée) de chaque débit :', pairs: [['10 Gbit/s', '2'], ['1 Gbit/s', '4'], ['100 Mbit/s', '19'], ['10 Mbit/s', '100']],
      hints: ['Plus le lien est rapide, plus le coût est faible.'], explain: '2, 4, 19, 100 (ancienne norme : 1, 1, 10, 100).' },
    { id: 'st7', type: 'text', q: 'Un switch peut joindre la racine par deux chemins : (a) deux liens FastEthernet (100 Mbit/s) ; (b) un lien Gigabit puis un lien FastEthernet. Coût de chaque chemin ?', fields: [{ label: 'Chemin (a)', kind: 'int', answer: 38 }, { label: 'Chemin (b)', kind: 'int', answer: 23 }],
      hints: ['On additionne les coûts : 19 par lien 100 Mbit/s, 4 par lien 1 Gbit/s.'], explain: '(a) 19 + 19 = 38 ; (b) 4 + 19 = <b>23</b> → c’est par (b) que passera le port racine.' },
    { id: 'st8', type: 'match', q: 'Schéma du cours (Cat-A, Cat-B, Cat-C en triangle, tous les liens à 100 Mbit/s ; BID : Cat-A 32768.AAAA.AAAA.AAAA, Cat-B 32768.BBBB.BBBB.BBBB, Cat-C 32768.CCCC.CCCC.CCCC). Quel est le rôle de chaque port ?',
      pairs: [['Cat-A, port vers Cat-B', 'Port désigné'], ['Cat-B, port vers Cat-A', 'Port racine'], ['Cat-C, port vers Cat-A', 'Port racine'], ['Cat-B, port vers Cat-C', 'Port désigné'], ['Cat-C, port vers Cat-B', 'Port bloqué (non désigné)']],
      hints: ['Même priorité partout : la racine est celle qui a la plus petite MAC (AAAA…).', 'Sur le segment B-C, les deux switchs sont à 19 de la racine : c’est le plus petit BID (Cat-B) qui garde le port désigné.'],
      explain: 'Cat-A racine : tous ses ports désignés. B et C : port racine vers A. Segment B-C : égalité de coût → B (BID plus petit) est désigné, C bloque. Exactement le schéma du cours.' },
    { id: 'st9', type: 'order', q: 'Remets dans l’ordre les états traversés par un port qui devient actif (802.1D).', items: ['Blocage', 'Écoute', 'Apprentissage', 'Acheminement'],
      hints: ['On écoute avant d’apprendre, on apprend avant de transmettre.'], explain: 'Blocage (20 s) → Écoute (15 s) → Apprentissage (15 s) → Acheminement.' },
    { id: 'st10', type: 'qcm', q: 'Quelle norme définit le <b>Rapid</b> Spanning Tree ?', choices: ['IEEE 802.1D', 'IEEE 802.1Q', 'IEEE 802.1w', 'IEEE 802.3'], good: 2,
      hints: ['« w » comme… « whoa, c’est rapide ».'], explain: 'RSTP = <b>802.1w</b> (remplace 802.1D). 802.1Q = VLAN, 802.3 = Ethernet.' },
    { id: 'st11', type: 'qcm', q: 'Qu’est-ce que le VSS (cours IMT) ?', choices: ['Un protocole de routage', 'Une fonction Cisco qui fait voir deux switchs physiques comme un seul switch logique, alternative à STP', 'Un type de câble fibre', 'La version sécurisée de STP'], good: 1,
      hints: ['Virtual Switching System.'], explain: 'VSS : deux châssis (dans deux locaux techniques) = un seul switch logique ; plus de boucle, donc on se passe de la complexité de STP, avec une forte tolérance de panne.' },
    { id: 'st-lab', type: 'pt', topo: 'TP-TAP', file: 'TP-TAP.pkt', tag: 'STP',
      q: '<b>TP-TAP du prof.</b> Deux switchs de bâtiment (<b>COMM-BAT1</b> et <b>COMM-BAT2</b>) sont reliés par un seul câble (G0/2 ⟷ G0/2) et Spanning Tree a été <b>désactivé</b> sur les deux (<code>no spanning-tree vlan 1</code>).<br>1) Ajoute une <b>liaison redondante</b> entre les deux switchs (câble croisé, par exemple Fa0/24 ⟷ Fa0/24) et observe : que se passe-t-il pour le ping de PC-B1-1 vers SRV1 ?<br>2) Réactive Spanning Tree sur les deux switchs.<br>3) Fais de <b>COMM-BAT2</b> (côté serveurs et routeur) le <b>pont racine</b>.',
      tasks: [
        { label: 'Deux liaisons fonctionnelles entre COMM-BAT1 et COMM-BAT2', check: function (n) { return linksBetween(n, 'COMM-BAT1', 'COMM-BAT2').length >= 2; } },
        { label: 'Spanning Tree actif (VLAN 1) sur les deux switchs', check: function (n) { return n.stpOn(n.dev('COMM-BAT1'), 1) && n.stpOn(n.dev('COMM-BAT2'), 1); } },
        { label: 'COMM-BAT2 est le pont racine', check: function (n) { return stpRoot(n) === 'COMM-BAT2'; } },
        { label: 'Un port de COMM-BAT1 est bloqué (plus de boucle)', check: function (n) { var d = n.dev('COMM-BAT1'); return d.ifaces.some(function (i) { return n.portBlocked(d, i.name, 1); }); } },
        { label: 'PC-B1-1 joint SRV1', check: function (n) { return n.canPing('PC-B1-1', 'SRV1'); } }
      ],
      hints: ['Câble <b>croisé</b> (switch ⟷ switch) entre deux ports libres, par exemple Fa0/24 des deux côtés. Sans STP, le ping échoue : c’est la <b>tempête de broadcast</b>.', 'Sur chaque switch (CLI) : <code>conf t</code> → <code>spanning-tree vlan 1</code>.', 'Sur COMM-BAT2 : <code>spanning-tree vlan 1 priority 4096</code> (ou <code>spanning-tree vlan 1 root primary</code>). Vérifie avec <code>show spanning-tree</code> : « This bridge is the root ».'],
      solution: [
        { link: ['COMM-BAT1', 'FastEthernet0/24', 'COMM-BAT2', 'FastEthernet0/24', 'cross'] },
        { dev: 'COMM-BAT1', cli: ['conf t', 'spanning-tree vlan 1', 'end'] },
        { dev: 'COMM-BAT2', cli: ['conf t', 'spanning-tree vlan 1', 'spanning-tree vlan 1 priority 4096', 'end'] }
      ],
      explain: 'Sans STP, la boucle crée une tempête : plus rien ne passe. Avec STP, COMM-BAT2 (priorité 4096) est racine : ses deux ports sont désignés ; COMM-BAT1 garde un port racine (G0/2, le lien Gigabit au coût 4) et <b>bloque</b> l’autre (Fa0/24, coût 19). Si tu débranches le lien Gigabit, Fa0/24 prend le relais : c’est la redondance.' }
  ]
  });
})();
