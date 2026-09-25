(function () {
  var RT_COLS = [{ h: 'RÉSEAU DESTINATION', kind: 'cidr', w: 170 }, { h: 'PASSERELLE', kind: 'ip', w: 140 }, { h: 'INTERFACE', kind: 'ip', w: 140 }];
  function row(net, gw, itf) { return [{ a: net }, { a: gw }, { a: itf }]; }
  /* solution des labos EX0 (fichier EX0-ROUTAGE-fin.pkt du prof) */
  var EX0_SOL = [
    { dev: 'PB1', cli: ['conf t', 'ip route 192.168.3.0 255.255.255.0 192.168.10.3', 'ip route 192.168.2.0 255.255.255.0 192.168.10.2', 'ip route 192.168.1.0 255.255.255.0 192.168.10.1', 'ip route 192.168.4.0 255.255.255.0 192.168.0.2', 'ip route 192.168.11.0 255.255.255.0 192.168.0.2', 'end'] },
    { dev: 'PB2', cli: ['conf t', 'ip route 192.168.4.0 255.255.255.0 192.168.11.2', 'ip route 0.0.0.0 0.0.0.0 192.168.0.1', 'end'] },
    { dev: 'RB1E2', cli: ['conf t', 'ip route 0.0.0.0 0.0.0.0 192.168.10.4', 'end'] },
    { dev: 'RB1E1', cli: ['conf t', 'ip route 0.0.0.0 0.0.0.0 192.168.10.4', 'end'] },
    { dev: 'RB1E0', cli: ['conf t', 'ip route 0.0.0.0 0.0.0.0 192.168.10.4', 'end'] },
    { dev: 'RB2', cli: ['conf t', 'ip route 0.0.0.0 0.0.0.0 192.168.11.1', 'end'] }
  ];
  function rip(nets) { return ['conf t', 'router rip', 'version 2'].concat(nets.map(function (x) { return 'network ' + x; })).concat(['no auto-summary', 'end']); }
  var RIP_SOL = [
    { dev: 'PB1', cli: rip(['192.168.10.0', '192.168.0.0']) },
    { dev: 'PB2', cli: rip(['192.168.11.0', '192.168.0.0']) },
    { dev: 'RB1E2', cli: rip(['192.168.3.0', '192.168.10.0']) },
    { dev: 'RB1E1', cli: rip(['192.168.2.0', '192.168.10.0']) },
    { dev: 'RB1E0', cli: rip(['192.168.1.0', '192.168.10.0']) },
    { dev: 'RB2', cli: rip(['192.168.11.0', '192.168.4.0']) }
  ];
  var EX0_NOTE = 'Bâtiment 1 : étages 0, 1, 2 (RB1E0, RB1E1, RB1E2) reliés au backbone BB (192.168.10.0/24) et au routeur principal PB1. Bâtiment 2 : RB2 derrière PB2. PB1 ⟷ PB2 en fibre (192.168.0.0/24).';

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'routage', num: 7, icon: '🧭', titre: 'Routage IP',
  sous: 'Tables de routage, routes statiques, route par défaut, RIP',
  source: 'Support-routage.pptx, Adresse-routage.pdf (slides 28 à 34), routage.pdf (corrigé TD), EX0-ROUTAGE, EX-ROUTAGE',
  cours: `
<h3>1. Le principe : de saut en saut</h3>
<p>Les réseaux IP font un acheminement <b>de bout en bout</b>, mais le routage se fait <b>de saut en saut</b> (<i>next hop</i>) : à chaque routeur, une <b>décision autonome</b> choisit par où envoyer le datagramme. Chaque routeur n’a qu’une <b>connaissance partielle</b> du réseau : c’est pourquoi la <b>route par défaut</b> est au cœur du routage IP. Les routeurs font du <b>best effort</b>.</p>
<div class="nul"><b>🧠 L’analogie des panneaux routiers :</b> à chaque carrefour (routeur), un panneau (la table de routage) dit « Lens → à droite, Arras → tout droit, toutes les autres villes → autoroute (route par défaut) ». Aucun panneau ne connaît le trajet complet, mais en suivant les panneaux de carrefour en carrefour, tu arrives.</div>

<h3>2. La table de routage</h3>
<p>Pour chaque <b>destination</b> (réseau + masque), la table indique la <b>prochaine étape</b> (passerelle / next hop) et l’<b>interface de sortie</b>. Un routeur connaît automatiquement ses réseaux <b>directement connectés</b> (dès que l’interface a une IP et est <code>no shutdown</code>) ; pour tous les autres, il faut une route <b>statique</b> ou un protocole de routage <b>dynamique</b>.</p>
<table><tr><th></th><th>Routage statique</th><th>Routage dynamique</th></tr>
<tr><td>Principe</td><td>routes configurées <b>à la main</b>, ne changent pas toutes seules</td><td>les routeurs <b>échangent</b> des informations et calculent les meilleurs chemins</td></tr>
<tr><td>Quand ?</td><td>sites de <b>faible taille</b></td><td>réseaux plus grands, qui changent</td></tr>
<tr><td>Changement de topologie</td><td>ne sait pas s’adapter</td><td>s’adapte automatiquement (convergence)</td></tr></table>
<div class="figure"><svg viewBox="0 0 700 150" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<line x1="30" y1="40" x2="30" y2="120" stroke="#8a9bb3" stroke-width="3"/><text x="10" y="30" fill="#6fd6f5" font-weight="700">172.16.1.0/24</text>
<line x1="30" y1="80" x2="210" y2="80" stroke="#8a9bb3" stroke-width="2"/><text x="120" y="72" fill="currentColor">Fa0/0</text>
<ellipse cx="250" cy="80" rx="38" ry="20" fill="#1f6fb2"/><text x="250" y="85" fill="#fff" text-anchor="middle" font-weight="700">R1</text>
<path d="M288 80 L340 80 L360 60 L380 100 L400 80 L460 80" stroke="#e2231a" stroke-width="3" fill="none"/><text x="290" y="110" fill="currentColor">S0/0/0</text><text x="400" y="110" fill="currentColor">S0/0/0</text><text x="335" y="45" fill="#6fd6f5" font-weight="700">172.16.2.0/24</text>
<ellipse cx="500" cy="80" rx="38" ry="20" fill="#1f6fb2"/><text x="500" y="85" fill="#fff" text-anchor="middle" font-weight="700">R2</text>
<line x1="538" y1="80" x2="670" y2="80" stroke="#8a9bb3" stroke-width="2"/><text x="570" y="72" fill="currentColor">Fa0/0</text>
<line x1="670" y1="40" x2="670" y2="120" stroke="#8a9bb3" stroke-width="3"/><text x="580" y="30" fill="#6fd6f5" font-weight="700">172.16.3.0/24</text>
</svg><div class="figcap">Le schéma du support : R1 connaît 172.16.1.0 et 172.16.2.0 (connectés). Pour 172.16.3.0, il lui faut une route statique via 172.16.2.2.</div></div>

<h3>3. Configurer une route statique (Cisco)</h3>
<p>En mode <b>configuration globale</b> :</p>
<div class="demo dark">Router(config)#ip route <span class="c">172.16.0.0 255.255.0.0 20.5.5.1</span>
                 réseau destination   masque   passerelle (next hop)
Router(config)#ip route <span class="c">0.0.0.0 0.0.0.0 192.168.10.4</span>     ← route par défaut</div>
<ul><li>La passerelle doit être l’adresse d’un <b>voisin directement joignable</b> (dans un de tes réseaux connectés).</li>
<li>On peut aussi donner une interface de sortie à la place : <code>ip route 172.16.3.0 255.255.255.0 Serial0/0/0</code>.</li>
<li>Supprimer : <code>no ip route …</code> (la même ligne précédée de <code>no</code>).</li>
<li>Dans Packet Tracer, l’onglet <b>Config → ROUTING → Static</b> fait la même chose (Network, Mask, Next Hop, <b>Add</b>) : la commande IOS équivalente s’affiche en bas de la fenêtre.</li></ul>
<div class="tip"><b>✔ La route par défaut</b> (<code>0.0.0.0/0</code>) réduit la taille des tables : un routeur « en bout de réseau » (une seule sortie) n’a besoin <b>que</b> de ça. Dans les exercices, le routeur d’Arras ou de Valenciennes se contente d’une seule ligne !</div>

<h3>4. Lire <code>show ip route</code></h3>
<div class="demo dark">LILLE#show ip route
Gateway of last resort is 192.168.100.6 to network 0.0.0.0

S*   0.0.0.0/0 [1/0] via 192.168.100.6
C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
C    192.168.2.0/24 is directly connected, GigabitEthernet1/0
S    192.168.3.0/24 [1/0] via 192.168.100.2
     192.168.100.0/30 is subnetted, 2 subnets
C       192.168.100.0/30 is directly connected, GigabitEthernet2/0
C       192.168.100.4/30 is directly connected, GigabitEthernet3/0</div>
<table><tr><th>Code</th><th>Signification</th></tr>
<tr><td><b>C</b></td><td>réseau directement connecté</td></tr><tr><td><b>L</b></td><td>adresse locale de l’interface (/32, routeurs IOS 15)</td></tr>
<tr><td><b>S</b></td><td>route statique</td></tr><tr><td><b>S*</b></td><td>route statique <b>par défaut</b> (candidate default)</td></tr>
<tr><td><b>R</b></td><td>apprise par RIP</td></tr><tr><td><b>O</b></td><td>apprise par OSPF</td></tr><tr><td><b>D</b></td><td>apprise par EIGRP</td></tr></table>
<p>Entre crochets : <b>[distance administrative / métrique]</b>. La <b>distance administrative</b> mesure la confiance dans la source : connecté <b>0</b>, statique <b>1</b>, EIGRP <b>90</b>, OSPF <b>110</b>, RIP <b>120</b>. Plus c’est petit, plus c’est prioritaire.</p>
<div class="memo"><b>📌 Choix de la route : la correspondance la plus longue.</b> Pour une destination, le routeur prend la route dont le <b>masque est le plus long</b> (la plus précise). La route par défaut /0 ne sert que si rien d’autre ne correspond.</div>

<h3>5. Le format « tableau » des TD et du DS</h3>
<p>En TD et au DS, on écrit les tables à la main dans Excel. Deux formats :</p>
<ul><li><b>Format du TD</b> : <i>Réseau destination</i> (CIDR) · <i>Passerelle</i> (vide si connecté) · <i>Interface</i> = <b>l’adresse IP de l’interface de sortie</b> du routeur.</li>
<li><b>Format du DS (style Windows)</b> : <i>Adresse réseau</i> · <i>Masque</i> (décimal) · <i>Passerelle</i> · <i>Interface</i> · <i>Métrique</i>. Pour un réseau connecté, la passerelle = l’IP de l’interface elle-même. Les <b>PC</b> ont aussi une table : leur réseau + <b>0.0.0.0 / 0.0.0.0</b> vers leur passerelle par défaut.</li></ul>
<p>Le code couleur de ton prof : <span style="background:#ffff00;color:#000;padding:0 6px">jaune = directement connecté</span> <span style="background:#4ea72e;color:#fff;padding:0 6px">vert = route statique</span> <span style="background:#ffc000;color:#000;padding:0 6px">orange = route par défaut</span>.</p>

<h3>6. Routage dynamique : les algorithmes</h3>
<table><tr><th></th><th>Vecteur de distance (Bellman-Ford)</th><th>État de liens (Link State, SPF)</th></tr>
<tr><td>Principe</td><td>chaque routeur <b>diffuse régulièrement à ses voisins</b> les routes qu’il connaît ; on garde une route reçue si elle est <b>plus courte</b> ou <b>inconnue</b></td><td>chaque routeur construit une <b>carte de toute la topologie</b>, teste l’état (up/down) de ses liens et le diffuse ; calcul du plus court chemin (<b>SPF</b>, Dijkstra)</td></tr>
<tr><td>Vision</td><td>« le routage par rumeur »</td><td>« chacun a la carte complète »</td></tr>
<tr><td>Exemple</td><td><b>RIP</b> (métrique = nombre de sauts, max 15)</td><td><b>OSPF</b> (métrique = coût, lié au débit)</td></tr></table>
<p>Autres protocoles cités : <b>EIGRP</b> (Cisco, vecteur de distance avancé) et <b>BGP</b> (entre les grands réseaux d’Internet, les systèmes autonomes).</p>
<h4>RIP sur Cisco</h4>
<div class="demo dark">Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#network 192.168.10.0      ← chaque réseau DIRECTEMENT connecté (adresse de classe)
Router(config-router)#network 192.168.1.0
Router(config-router)#no auto-summary</div>
<div class="warnbox"><b>⚠ Pièges RIP :</b> on ne déclare dans <code>network</code> que ses <b>propres</b> réseaux connectés (jamais ceux des voisins). La <b>version 1</b> n’envoie pas les masques (classful) : utilise <b>version 2</b> + <code>no auto-summary</code> dès que tu as des sous-réseaux.</div>
`,
  questions: [
    { id: 'rt1', type: 'qcm', q: 'Le routage IP se fait…', choices: ['en calculant tout le chemin à l’avance depuis la source', 'de saut en saut : chaque routeur décide seul du prochain saut', 'uniquement grâce au DNS', 'en diffusant le paquet à tous les routeurs'], good: 1,
      hints: ['Next hop = prochain saut.'], explain: 'Routage <b>de saut en saut</b> : chaque routeur, avec sa connaissance partielle, choisit le next hop.' },
    { id: 'rt2', type: 'match', q: 'Statique ou dynamique ?',
      pairs: [['Routes configurées à la main', 'Routage statique'], ['Convient aux sites de faible taille', 'Routage statique'], ['Les routeurs échangent des informations sur les routes', 'Routage dynamique'], ['S’adapte automatiquement aux pannes', 'Routage dynamique']],
      hints: ['« Statique » = qui ne bouge pas.'], explain: 'Statique : manuel, petit site, ne gère pas les changements. Dynamique : protocoles (RIP, OSPF…), adaptation automatique.' },
    { id: 'rt3', type: 'text', q: 'Écris la commande Cisco (mode config globale) pour joindre le réseau <b>172.16.0.0/16</b> via le routeur voisin <b>20.5.5.1</b> (exemple du support).', kind: 'text',
      accept: ['ip route 172.16.0.0 255.255.0.0 20.5.5.1', /^ip\s+route\s+172\.16\.0\.0\s+255\.255\.0\.0\s+20\.5\.5\.1$/i], ph: 'ip route …',
      hints: ['Syntaxe : <code>ip route &lt;réseau&gt; &lt;masque en décimal&gt; &lt;next hop&gt;</code>.', 'Le masque /16 s’écrit 255.255.0.0.'],
      answerHtml: '<code>ip route 172.16.0.0 255.255.0.0 20.5.5.1</code>', explain: 'Toujours dans cet ordre : réseau, masque (décimal pointé), passerelle.' },
    { id: 'rt4', type: 'text', q: 'Écris la commande de la <b>route par défaut</b> vers la passerelle <b>192.168.10.4</b>.', kind: 'text',
      accept: ['ip route 0.0.0.0 0.0.0.0 192.168.10.4', /^ip\s+route\s+0\.0\.0\.0\s+0\.0\.0\.0\s+192\.168\.10\.4$/i], ph: 'ip route …',
      hints: ['Route par défaut = réseau 0.0.0.0 et masque 0.0.0.0.'], answerHtml: '<code>ip route 0.0.0.0 0.0.0.0 192.168.10.4</code>',
      explain: 'Elle apparaît en <b>S*</b> dans <code>show ip route</code> et définit la « Gateway of last resort ».' },
    { id: 'rt5', type: 'grid', q: '<b>Application du support</b> (schéma du cours : R1 — S0/0/0 — R2, réseaux 172.16.1.0, 172.16.2.0, 172.16.3.0 /24 ; R1 = 172.16.2.1 et R2 = 172.16.2.2 sur la liaison série). Complète la table de <b>R1</b>. Pour un réseau directement connecté, laisse la passerelle <b>vide</b>.',
      file: 'Support-routage.xlsx', sheet: 'R1',
      cols: [{ h: 'RÉSEAU', w: 140 }, { h: 'PASSERELLE', kind: 'ip', w: 140 }, { h: 'INTERFACE', kind: 'iface', w: 130 }],
      rows: [['172.16.1.0/24', { a: null }, { a: 'FastEthernet0/0' }], ['172.16.2.0/24', { a: null }, { a: 'Serial0/0/0' }], ['172.16.3.0/24', { a: '172.16.2.2' }, { a: 'Serial0/0/0' }]],
      routeColors: true, rowTypes: ['c', 'c', 's'],
      hints: ['R1 est directement connecté à 172.16.1.0 (Fa0/0) et 172.16.2.0 (S0/0/0).', 'Pour 172.16.3.0, R1 doit passer par R2 : next hop = l’adresse de R2 sur la liaison série.'],
      explain: '2 réseaux connectés (jaune) + 1 route statique (vert) via 172.16.2.2 par S0/0/0.' },
    { id: 'rt6', type: 'grid', q: 'Même schéma : complète la table de <b>R2</b>.',
      file: 'Support-routage.xlsx', sheet: 'R2',
      cols: [{ h: 'RÉSEAU', w: 140 }, { h: 'PASSERELLE', kind: 'ip', w: 140 }, { h: 'INTERFACE', kind: 'iface', w: 130 }],
      rows: [['172.16.1.0/24', { a: '172.16.2.1' }, { a: 'Serial0/0/0' }], ['172.16.2.0/24', { a: null }, { a: 'Serial0/0/0' }], ['172.16.3.0/24', { a: null }, { a: 'FastEthernet0/0' }]],
      routeColors: true, rowTypes: ['s', 'c', 'c'],
      hints: ['C’est le miroir de R1.'], explain: 'R2 : 172.16.2.0 et 172.16.3.0 connectés ; 172.16.1.0 via 172.16.2.1 (R1).' },
    { id: 'rt7', type: 'grid', q: '<b>TD — table de routage de R1</b> (corrigé routage.pdf). R1 a un LAN 192.168.1.0/24 (R1 = 192.168.1.1), une liaison vers R2 en 192.168.10.0/30 (R1 = .1, R2 = .2) et une liaison vers R4 en 192.168.10.4/30 (R1 = .5, R4 = .6). R4 ne dessert que 192.168.4.0/24 ; tous les autres réseaux (192.168.2.0/24, 192.168.3.0/24, 192.168.5.0/24, et les liaisons 192.168.10.8/30, 192.168.10.12/30, 192.168.10.16/30) sont derrière R2. Écris la table <b>complète</b> (une ligne par réseau, dans l’ordre que tu veux ; passerelle vide si connecté ; interface = IP de sortie de R1).',
      file: 'routage.xlsx', sheet: 'R1',
      cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('192.168.1.0/24', null, '192.168.1.1'), row('192.168.2.0/24', '192.168.10.2', '192.168.10.1'), row('192.168.3.0/24', '192.168.10.2', '192.168.10.1'), row('192.168.4.0/24', '192.168.10.6', '192.168.10.5'), row('192.168.5.0/24', '192.168.10.2', '192.168.10.1'), row('192.168.10.0/30', null, '192.168.10.1'), row('192.168.10.4/30', null, '192.168.10.5'), row('192.168.10.8/30', '192.168.10.2', '192.168.10.1'), row('192.168.10.12/30', '192.168.10.2', '192.168.10.1'), row('192.168.10.16/30', '192.168.10.2', '192.168.10.1')],
      rowTypes: ['c', 's', 's', 's', 's', 'c', 'c', 's', 's', 's'],
      hints: ['3 réseaux sont directement connectés : 192.168.1.0/24, 192.168.10.0/30 et 192.168.10.4/30.', 'Tout ce qui est derrière R2 : passerelle 192.168.10.2, interface de sortie 192.168.10.1. Derrière R4 : passerelle 192.168.10.6, interface 192.168.10.5.', 'Écris les réseaux en CIDR, ex. <code>192.168.10.8/30</code>.'],
      explain: 'Exactement le 1er tableau du corrigé : 3 connectés (jaune), 7 statiques (vert). Remarque : 6 routes sur 7 passent par R2… c’est le signal qu’une <b>route par défaut</b> simplifierait tout (question suivante).' },
    { id: 'rt8', type: 'grid', q: '<b>TD — la même table, optimisée</b> : garde la route vers 192.168.4.0/24 et remplace toutes les routes via R2 par <b>une route par défaut</b>.',
      file: 'routage.xlsx', sheet: 'R1 optimisée',
      cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('192.168.1.0/24', null, '192.168.1.1'), row('192.168.4.0/24', '192.168.10.6', '192.168.10.5'), row('192.168.10.0/30', null, '192.168.10.1'), row('192.168.10.4/30', null, '192.168.10.5'), row('0.0.0.0/0', '192.168.10.2', '192.168.10.1')],
      rowTypes: ['c', 's', 'c', 'c', 'd'],
      hints: ['La route par défaut s’écrit <code>0.0.0.0/0</code>.'],
      explain: '5 lignes au lieu de 10 : c’est le 2e tableau du corrigé (orange = route par défaut). Pour 192.168.4.0, la route /24 est plus précise que /0 : elle reste prioritaire.' },
    { id: 'rt-lab-ex0', type: 'pt', topo: 'EX0-ROUTAGE-debut', file: 'EX0-ROUTAGE-debut.pkt', tag: 'Routage statique',
      q: '<b>Exercice 0 du prof</b> (fichier EX0-ROUTAGE-debut.pkt). ' + EX0_NOTE + ' Les adresses sont déjà configurées, mais aucun routage : configure des <b>routes statiques</b> (et des routes par défaut là où c’est malin) pour que tous les PC communiquent.',
      tasks: [
        { label: 'PC4 (bât. 1, étage 0) joint PC0 (étage 2)', check: function (n) { return n.canPing('PC4', 'PC0'); } },
        { label: 'PC2 (étage 1) joint PC4 (étage 0)', check: function (n) { return n.canPing('PC2', 'PC4'); } },
        { label: 'PC0 (bât. 1) joint PC6 (bât. 2)', check: function (n) { return n.canPing('PC0', 'PC6'); } },
        { label: 'PC6 (bât. 2) joint PC3 (bât. 1, étage 1)', check: function (n) { return n.canPing('PC6', 'PC3'); } }
      ],
      hints: ['Commence par les routeurs d’étage (RB1E0, RB1E1, RB1E2) : ils n’ont qu’une sortie vers le reste du monde, PB1 (192.168.10.4). Une route par défaut suffit.', 'PB1 doit connaître chaque LAN d’étage (via 192.168.10.1, .2, .3) et le bâtiment 2 (192.168.4.0 et 192.168.11.0 via PB2 = 192.168.0.2).', 'PB2 : 192.168.4.0/24 via RB2 (192.168.11.2) et une route par défaut vers PB1 (192.168.0.1). RB2 : route par défaut vers PB2 (192.168.11.1).'],
      solution: EX0_SOL,
      explain: 'C’est le fichier EX0-ROUTAGE-fin.pkt du prof : routes par défaut sur les routeurs « feuilles » (RB1E0-2, RB2), routes précises sur les routeurs centraux (PB1 connaît tout, PB2 connaît le bâtiment 2 + défaut vers PB1). Vérifie avec <code>show ip route</code> et <code>tracert</code> depuis un PC.' },
    { id: 'rt-lab-lille', type: 'pt', file: 'EX-ROUTAGE.pkt', tag: 'Routage statique',
      q: '<b>Exercice Lille / Lens / Arras / Valenciennes</b> (fichier EX-ROUTAGE du prof, routes effacées). Les liaisons entre routeurs sont en /30 : LILLE-ARRAS 192.168.100.0/30 (LILLE .1, ARRAS .2), LILLE-LENS 192.168.100.4/30 (LILLE .5, LENS .6), LENS-VALENCIENNES 192.168.100.8/30 (LENS .9, VAL .10). LAN : Lille 192.168.1.0 et 192.168.2.0, Arras .3.0, Lens .4.0, Valenciennes .5.0 (tous en /24, routeur en .1). Rends tout joignable avec le <b>minimum de routes</b>.',
      build: function () {
        var n = LAB.topo('EX-ROUTAGE-CORR');
        ['LILLE', 'LENS', 'ARRAS', 'VALENCIENNES'].forEach(function (r) { var d = n.dev(r); d.cfg.routes = []; if (d.startup) d.startup.cfg.routes = []; });
        n.touch(); return n;
      },
      tasks: [
        { label: 'PC-L1 (Lille) joint PC-ARRAS', check: function (n) { return n.canPing('PC-L1', 'PC-ARRAS'); } },
        { label: 'PC-L2 (Lille) joint PC-LENS', check: function (n) { return n.canPing('PC-L2', 'PC-LENS'); } },
        { label: 'PC-ARRAS joint PC-VAL', check: function (n) { return n.canPing('PC-ARRAS', 'PC-VAL'); } },
        { label: 'PC-VAL joint le serveur Server0 de Lille', check: function (n) { return n.canPing('PC-VAL', 'Server0'); } },
        { label: 'ARRAS et VALENCIENNES n’ont qu’une seule route : une route par défaut', check: function (n) { return ['ARRAS', 'VALENCIENNES'].every(function (r) { var rs = n.dev(r).cfg.routes; return rs.length === 1 && rs[0].len === 0; }); } }
      ],
      hints: ['ARRAS et VALENCIENNES sont des « culs-de-sac » : une route par défaut chacun (vers LILLE 192.168.100.1 et vers LENS 192.168.100.9).', 'LILLE doit connaître Arras (192.168.3.0 via 192.168.100.2) ; pour le reste (Lens, Valenciennes), une route par défaut vers LENS (192.168.100.6).', 'LENS doit connaître Valenciennes (192.168.5.0 via 192.168.100.10) et envoyer le reste vers LILLE (défaut via 192.168.100.5).'],
      solution: [
        { dev: 'LILLE', cli: ['conf t', 'ip route 192.168.3.0 255.255.255.0 192.168.100.2', 'ip route 0.0.0.0 0.0.0.0 192.168.100.6', 'end'] },
        { dev: 'LENS', cli: ['conf t', 'ip route 192.168.5.0 255.255.255.0 192.168.100.10', 'ip route 0.0.0.0 0.0.0.0 192.168.100.5', 'end'] },
        { dev: 'VALENCIENNES', cli: ['conf t', 'ip route 0.0.0.0 0.0.0.0 192.168.100.9', 'end'] },
        { dev: 'ARRAS', cli: ['conf t', 'ip route 0.0.0.0 0.0.0.0 192.168.100.1', 'end'] }
      ],
      explain: 'Le corrigé du prof (EX-ROUTAGE-CORR) : 6 routes seulement. Attention : LILLE et LENS se renvoient mutuellement leur route par défaut ; pour une destination qui n’existe nulle part, le paquet ferait des allers-retours jusqu’à ce que le TTL tombe à 0. Ce n’est pas grave ici, mais c’est à savoir.' },
    { id: 'rt9', type: 'qcm', q: 'Un routeur a ces routes : <code>10.0.0.0/8 via A</code>, <code>10.1.0.0/16 via B</code>, <code>10.1.2.0/24 via C</code>, <code>0.0.0.0/0 via D</code>. Un paquet arrive pour <b>10.1.2.50</b>. Par où part-il ?', choices: ['A', 'B', 'C', 'D'], good: 2,
      hints: ['Les 4 routes correspondent… on garde la plus précise.'], explain: 'Correspondance la plus longue : /24 &gt; /16 &gt; /8 &gt; /0 → <b>C</b>.' },
    { id: 'rt10', type: 'qcm', q: 'Et un paquet pour <b>10.9.9.9</b> ?', choices: ['A', 'B', 'C', 'D'], good: 0,
      hints: ['10.9.9.9 n’est ni dans 10.1.0.0/16 ni dans 10.1.2.0/24.'], explain: 'Seules 10.0.0.0/8 et 0.0.0.0/0 correspondent : /8 est plus long → <b>A</b>.' },
    { id: 'rt11', type: 'match', q: 'Que signifie chaque code de <code>show ip route</code> ?',
      pairs: [['C', 'Réseau directement connecté'], ['S', 'Route statique'], ['S*', 'Route statique par défaut'], ['R', 'Route apprise par RIP'], ['O', 'Route apprise par OSPF'], ['L', 'Adresse locale de l’interface (/32)']],
      hints: ['L’astérisque signale une route candidate par défaut.'], explain: 'C connected, L local, S static, S* default, R RIP, O OSPF, D EIGRP.' },
    { id: 'rt12', type: 'text', q: 'Donne la <b>distance administrative</b> par défaut de chaque source.', fields: [{ label: 'Réseau connecté', kind: 'int', answer: 0 }, { label: 'Route statique', kind: 'int', answer: 1 }, { label: 'OSPF', kind: 'int', answer: 110 }, { label: 'RIP', kind: 'int', answer: 120 }],
      hints: ['Plus on a confiance, plus c’est petit. Tu la vois entre crochets : [AD/métrique].'], explain: 'Connecté 0, statique 1, EIGRP 90, OSPF 110, RIP 120. Une statique l’emporte donc sur une route RIP vers le même réseau.' },
    { id: 'rt13', type: 'match', q: 'Vecteur de distance ou état de liens ?',
      pairs: [['Chaque routeur diffuse régulièrement ses routes à ses voisins', 'Vecteur de distance'], ['Algorithme de Bellman-Ford', 'Vecteur de distance'], ['Chaque routeur a une carte complète de la topologie', 'État de liens'], ['Calcul du plus court chemin (SPF)', 'État de liens'], ['RIP', 'Vecteur de distance'], ['OSPF', 'État de liens']],
      hints: ['Link State = état des liens = SPF.'], explain: 'Vecteur de distance : Bellman-Ford, « rumeur » entre voisins (RIP). État de liens : carte complète, SPF/Dijkstra (OSPF).' },
    { id: 'rt14', type: 'qcm', q: 'Quelle est la métrique de RIP ?', choices: ['Le débit des liens', 'Le nombre de sauts (routeurs traversés), maximum 15', 'Le délai', 'La charge du CPU'], good: 1,
      hints: ['C’est une métrique très simple…'], explain: 'RIP compte les <b>sauts</b> ; 16 = inaccessible. OSPF, lui, utilise un <b>coût</b> basé sur le débit.' },
    { id: 'rt15', type: 'multi', q: 'Sur PB1 (interfaces 192.168.10.4/24 et 192.168.0.1/24), quelles commandes <code>network</code> faut-il dans <code>router rip</code> ?',
      choices: ['network 192.168.10.0', 'network 192.168.0.0', 'network 192.168.4.0', 'network 192.168.1.0', 'network 0.0.0.0'], good: [0, 1],
      hints: ['On ne déclare que ses <b>propres</b> réseaux directement connectés.'], explain: 'Seulement 192.168.10.0 et 192.168.0.0 : RIP annoncera ensuite ces réseaux aux voisins et apprendra les autres tout seul.' },
    { id: 'rt-lab-rip', type: 'pt', topo: 'EX0-ROUTAGE-debut', file: 'EX0-ROUTAGE-debut.pkt', tag: 'RIP',
      q: 'Même réseau que l’exercice 0, mais cette fois <b>sans aucune route statique</b> : active <b>RIP version 2</b> sur les 6 routeurs (PB1, PB2, RB1E0, RB1E1, RB1E2, RB2) pour qu’ils apprennent les routes tout seuls. ' + EX0_NOTE,
      tasks: [
        { label: 'PB1 a appris 192.168.4.0/24 par RIP (code R)', check: function (n) { return LAB.hasRoute(n, 'PB1', '192.168.4.0/24', 'R'); } },
        { label: 'RB2 a appris 192.168.3.0/24 par RIP', check: function (n) { return LAB.hasRoute(n, 'RB2', '192.168.3.0/24', 'R'); } },
        { label: 'PC4 joint PC6 (d’un bâtiment à l’autre)', check: function (n) { return n.canPing('PC4', 'PC6'); } },
        { label: 'PC0 joint PC2', check: function (n) { return n.canPing('PC0', 'PC2'); } },
        { label: 'Aucune route statique sur les routeurs', check: function (n) { return ['PB1', 'PB2', 'RB1E0', 'RB1E1', 'RB1E2', 'RB2'].every(function (r) { return !n.dev(r).cfg.routes.length; }); } }
      ],
      hints: ['Sur chaque routeur : <code>conf t</code> → <code>router rip</code> → <code>version 2</code> → un <code>network</code> par réseau connecté → <code>no auto-summary</code>.', 'Tu peux aussi passer par l’onglet Config → ROUTING → RIP (champ Network + Add), mais la version 2 se règle en CLI.', 'Réseaux connectés : PB1 → 192.168.10.0 et 192.168.0.0 ; PB2 → 192.168.11.0 et 192.168.0.0 ; RB1E0 → 192.168.1.0 et 192.168.10.0 ; RB1E1 → 192.168.2.0 et .10.0 ; RB1E2 → 192.168.3.0 et .10.0 ; RB2 → 192.168.11.0 et 192.168.4.0.'],
      solution: RIP_SOL,
      explain: 'Après quelques secondes, <code>show ip route</code> montre des lignes <b>R … [120/n]</b> : 120 = distance administrative de RIP, n = nombre de sauts. <code>show ip protocols</code> résume la config RIP.' },
    { id: 'rt16', type: 'grid', q: '<b>TD VLSM, question 4 — table de R2</b> (réseau 2 = 194.132.18.128/27, R2 = .129 ; liaison R1-R2 = 194.132.18.232/30, R1 = .233, R2 = .234). R2 n’a qu’une sortie : écris sa table <b>minimale</b> (réseaux connectés + route par défaut).',
      file: 'TD2-VLSM.xlsx', sheet: 'Table R2', cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('194.132.18.128/27', null, '194.132.18.129'), row('194.132.18.232/30', null, '194.132.18.234'), row('0.0.0.0/0', '194.132.18.233', '194.132.18.234')],
      rowTypes: ['c', 'c', 'd'],
      hints: ['Tout ce qui n’est pas chez R2 passe par R1 (194.132.18.233).'], explain: 'Deux réseaux connectés + une route par défaut via R1. Simple et efficace pour un routeur « feuille ».' },
    { id: 'rt17', type: 'grid', q: '<b>TD VLSM, question 4 — table de R4</b>. R4 : Réseau 4 194.132.18.0/25 (R4 = .1), R1-R4 .236/30 (R1 .237, R4 .238), R3-R4 .240/30 (R3 .241, R4 .242), R4-R5 .248/30 (R4 .249, R5 .250), liaison SDSL 171.127.12.0/24 (R4 = 171.127.12.144). Derrière R1 : Réseau 1 (.160/27), Réseau 2 (.128/27), R1-R2 (.232/30). Derrière R3 : Réseau 3 (.224/29), Réseau 6 (.208/28), R3-R6 (.244/30). Derrière R5 : Réseau 5 (.192/28). Internet par défaut via le FAI (171.127.12.2). Écris la table complète.',
      file: 'TD2-VLSM.xlsx', sheet: 'Table R4', cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('194.132.18.0/25', null, '194.132.18.1'), row('194.132.18.236/30', null, '194.132.18.238'), row('194.132.18.240/30', null, '194.132.18.242'), row('194.132.18.248/30', null, '194.132.18.249'), row('171.127.12.0/24', null, '171.127.12.144'),
        row('194.132.18.160/27', '194.132.18.237', '194.132.18.238'), row('194.132.18.128/27', '194.132.18.237', '194.132.18.238'), row('194.132.18.232/30', '194.132.18.237', '194.132.18.238'),
        row('194.132.18.224/29', '194.132.18.241', '194.132.18.242'), row('194.132.18.208/28', '194.132.18.241', '194.132.18.242'), row('194.132.18.244/30', '194.132.18.241', '194.132.18.242'),
        row('194.132.18.192/28', '194.132.18.250', '194.132.18.249'), [{ a: '0.0.0.0/0' }, { a: ['171.127.12.2', '172.127.12.2'] }, { a: '171.127.12.144' }]],
      rowTypes: ['c', 'c', 'c', 'c', 'c', 's', 's', 's', 's', 's', 's', 's', 'd'],
      hints: ['5 réseaux connectés : le LAN, les 3 liaisons /30 et la liaison SDSL.', 'Pour chaque réseau distant : passerelle = l’adresse du voisin sur la liaison, interface = l’adresse de R4 sur cette même liaison.', 'L’énoncé indique la passerelle 172.127.12.2 : c’est une coquille (elle n’est pas dans 171.127.12.0/24). Les deux sont acceptées ici, mais en DS, signale-le !'],
      explain: '13 lignes : 5 connectées, 7 statiques, 1 par défaut. Astuce de pro : on pourrait résumer les 3 réseaux derrière R3 (.208/28, .224/29, .244/30)… mais ils ne forment pas un bloc aligné unique, donc on les garde séparés.' }
  ]
  });
})();
