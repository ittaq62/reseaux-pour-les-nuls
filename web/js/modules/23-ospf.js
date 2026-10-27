(function () {
  function ospf(rid, nets, pas) {
    return ['conf t', 'router ospf 1', 'router-id ' + rid].concat(nets.map(function (x) { return 'network ' + x + ' area 0'; }))
      .concat((pas || []).map(function (p) { return 'passive-interface ' + p; })).concat(['end']);
  }
  /* solution du TP OSPF1-Depart */
  var TP_SOL = [
    { dev: 'Router B', cli: ospf('2.2.2.2', ['172.11.0.0 0.0.0.255', '20.6.6.0 0.0.0.3', '20.5.5.0 0.0.0.3', '20.4.4.0 0.0.0.3', '20.2.2.0 0.0.0.3'], ['g0/1', 's0/0/0']) },
    { dev: 'Router C', cli: ospf('3.3.3.3', ['20.5.5.0 0.0.0.3', '20.1.1.0 0.0.0.3']) },
    { dev: 'Router D', cli: ospf('4.4.4.4', ['20.4.4.0 0.0.0.3', '20.3.3.0 0.0.0.3']) },
    { dev: 'Router E', cli: ospf('5.5.5.5', ['172.12.0.0 0.0.0.255', '20.0.0.0 0.0.0.3', '20.1.1.0 0.0.0.3', '20.2.2.0 0.0.0.3', '20.3.3.0 0.0.0.3'], ['g0/1', 's0/0/0']) }
  ];
  /* routes OSPF d'un routeur vers un préfixe */
  function oRoutes(n, dev, cidr) { var c = NET.parseCIDR(cidr), d = n.dev(dev); return d ? n.routeTable(d).filter(function (r) { return r.code === 'O' && r.net === c.ip && r.len === c.len; }) : []; }
  function only(n, dev, cidr, nh) { var rs = oRoutes(n, dev, cidr); return rs.length === 1 && rs[0].nh === NET.ip2int(nh); }
  function rid(n, dev, x) { var d = n.dev(dev); return !!d && n.ospfRid(d) === NET.ip2int(x); }
  function nbrs(n, dev) { return (n.ospfData().nbrs[dev] || []).length; }
  function opassive(n, dev, ifn) { var o = n.dev(dev).cfg.ospf || {}; return Object.keys(o).some(function (p) { return o[p].passive.indexOf(ifn) >= 0; }); }
  function cost(n, dev, ifn) { var d = n.dev(dev); return n.ospfCost(d, n.iface(d, ifn)); }
  function trace(n, from, ip) { return n.traceroute(n.dev(from), NET.ip2int(ip)).map(function (h) { return h.ip == null ? '*' : NET.int2ip(h.ip); }).join(' > '); }
  function role(n, dev) { return n.ospfData().role[dev + '|GigabitEthernet0/0']; }
  function lanRouter(h, k) {
    return ['conf t', 'hostname ' + h, 'interface g0/0', 'ip address 10.0.0.' + k + ' 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.' + k + '.254 255.255.255.0', 'no shutdown', 'exit',
      'router ospf 1', 'router-id ' + k + '.' + k + '.' + k + '.' + k, 'network 10.0.0.0 0.0.0.255 area 0', 'network 192.168.' + k + '.0 0.0.0.255 area 0', 'passive-interface g0/1', 'end'];
  }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'ospf', num: 23, icon: '🗺️', titre: 'OSPF',
  sous: 'État de liens, coût, voisins, DR/BDR, zones, configuration et vérification',
  source: 'ospf.pdf et OSPF1-Depart.pkt (dossier OSPF), sujet d’évaluation 2025 (exercice 4)',
  cours: `
<h3>1. OSPF en bref</h3>
<table><tr><th>Caractéristique</th><th>OSPF</th><th>(pour comparer : RIP)</th></tr>
<tr><td>Famille</td><td><b>état de liens</b> (link state), IGP</td><td>vecteur de distance, IGP</td></tr>
<tr><td>Algorithme</td><td><b>SPF</b> de <b>Dijkstra</b></td><td>Bellman-Ford</td></tr>
<tr><td>Métrique</td><td><b>coût</b>, calculé à partir du <b>débit</b></td><td>nombre de sauts</td></tr>
<tr><td>Limite</td><td>aucune limite de sauts</td><td>15 sauts</td></tr>
<tr><td>Transport</td><td>directement dans IP, <b>protocole 89</b> ; multicast <b>224.0.0.5</b> (tous les routeurs OSPF) et <b>224.0.0.6</b> (DR et BDR)</td><td>UDP 520</td></tr>
<tr><td>Distance administrative (Cisco)</td><td><b>110</b></td><td>120</td></tr>
<tr><td>Versions</td><td><b>OSPFv2</b> pour IPv4, <b>OSPFv3</b> pour IPv6</td><td>RIPv2, RIPng</td></tr></table>
<div class="nul"><b>🧠 L’analogie de la carte :</b> RIP, c’est demander son chemin aux passants (« c’est à 3 rues d’ici »). OSPF, c’est donner à chaque routeur la <b>même carte complète</b> du réseau, avec la vitesse de chaque route : chacun calcule lui-même le meilleur itinéraire.</div>

<h3>2. Le fonctionnement en 5 étapes</h3>
<ol><li><b>Découverte des voisins</b> : paquets <b>Hello</b> (toutes les 10 s sur Ethernet et sur les liaisons série point à point ; voisin déclaré mort au bout de 40 s).</li>
<li><b>Échange</b> : chaque routeur diffuse des <b>LSA</b> (Link-State Advertisements) qui décrivent ses liens.</li>
<li><b>Base de données</b> : tous les routeurs d’une zone construisent la même <b>LSDB</b> (la carte), puis lancent Dijkstra.</li>
<li><b>Installation</b> des meilleurs chemins dans la table de routage (code <b>O</b>).</li>
<li><b>Maintien</b> : Hello en continu ; un changement déclenche de nouveaux LSA et un nouveau calcul.</li></ol>
<table><tr><th>Type</th><th>Paquet OSPF</th></tr>
<tr><td>1</td><td>Hello</td></tr><tr><td>2</td><td>DBD (Database Description) : résumé de la LSDB</td></tr>
<tr><td>3</td><td>LSR (Link-State Request) : « envoie-moi ce LSA »</td></tr><tr><td>4</td><td>LSU (Link-State Update) : contient les LSA</td></tr>
<tr><td>5</td><td>LSAck : accusé de réception</td></tr></table>
<p>États d’un voisin : <b>Down</b> (aucun Hello) → <b>Init</b> (Hello reçu, pas encore bidirectionnel) → <b>2-Way</b> (chacun se voit dans le Hello de l’autre) → <b>ExStart</b> (qui est maître, qui est esclave) → <b>Exchange</b> (échange des DBD) → <b>Loading</b> (LSR / LSU pour ce qui manque) → <b>Full</b> (bases synchronisées).</p>
<div class="memo"><b>📌 Pour devenir voisins</b>, deux routeurs doivent avoir sur le lien commun : la <b>même zone</b>, les mêmes temporisateurs <b>Hello / Dead</b>, le <b>même sous-réseau</b> (et le même masque sur Ethernet), la même authentification, et ne pas avoir l’interface en <b>passive</b>. Le numéro de processus (<code>router ospf 1</code>) est <b>local</b> : il peut différer d’un routeur à l’autre.</div>

<h3>3. Le coût</h3>
<p>OSPF choisit le chemin dont la <b>somme des coûts</b> (des interfaces de <b>sortie</b> traversées) est la plus faible. Sur Cisco :</p>
<div class="demo">coût d’une interface = bande passante de référence / bande passante de l’interface
                     = 100 Mbit/s / débit de l’interface   (arrondi à l’entier inférieur, minimum 1)</div>
<table><tr><th>Interface</th><th>Débit</th><th>Coût (référence 100 Mbit/s)</th></tr>
<tr><td>Ethernet</td><td>10 Mbit/s</td><td>10</td></tr>
<tr><td>FastEthernet</td><td>100 Mbit/s</td><td>1</td></tr>
<tr><td>GigabitEthernet</td><td>1 000 Mbit/s</td><td><b>1</b> (0,1 arrondi au minimum 1)</td></tr>
<tr><td>Série (par défaut)</td><td>1 544 kbit/s</td><td><b>64</b></td></tr></table>
<div class="warnbox"><b>⚠ La formule de ton poly est à l’envers :</b> il écrit « coût = bande passante de l’interface / bande passante de référence ». C’est <b>référence / interface</b> : plus un lien est rapide, plus son coût est <b>petit</b>.</div>
<ul><li>Problème : Fast et Gigabit ont le même coût (1). Solution : <code>auto-cost reference-bandwidth 10000</code> (en Mbit/s) sous <code>router ospf</code>, <b>sur tous les routeurs</b> (IOS le rappelle d’ailleurs à chaque fois).</li>
<li>Pour forcer un chemin : <code>ip ospf cost N</code> sur l’interface, ou <code>bandwidth N</code> (en kbit/s), qui change le débit pris en compte. Sur une liaison série, c’est la commande <code>bandwidth</code> qui compte, pas le <code>clock rate</code> : une série cadencée à 2 Mbit/s garde 1 544 kbit/s, donc 64.</li></ul>

<h3>4. Les zones, le DR et le BDR</h3>
<ul><li><b>Area 0</b> = la <b>zone dorsale</b> (backbone) ; les autres zones s’y raccordent. Les zones limitent la taille des bases et des calculs.</li>
<li><b>ABR</b> (Area Border Router) : routeur à cheval sur plusieurs zones. <b>ASBR</b> : routeur qui injecte des routes venues d’ailleurs (statiques, autre protocole, route par défaut avec <code>default-information originate</code>).</li>
<li>Sur un réseau <b>multi-accès</b> (Ethernet avec plusieurs routeurs), pour éviter que tout le monde échange avec tout le monde, on élit un <b>DR</b> (Designated Router) et un <b>BDR</b> (Backup). Les autres (DROTHER) ne deviennent « Full » qu’avec le DR et le BDR ; entre eux, ils restent en <b>2-Way</b>.</li></ul>
<table><tr><th>Règle d’élection</th></tr>
<tr><td>1. La plus haute <b>priorité</b> d’interface gagne (<code>ip ospf priority</code>, 1 par défaut, de 0 à 255).</td></tr>
<tr><td>2. Priorité <b>0</b> = ne sera jamais DR ni BDR.</td></tr>
<tr><td>3. À égalité, le plus haut <b>router-id</b> gagne. Le DR est le 1er, le BDR le 2e.</td></tr>
<tr><td>4. <b>Pas de préemption</b> : un routeur plus prioritaire qui arrive après l’élection ne prend pas la place. Si le DR tombe, le BDR devient DR et on élit un nouveau BDR.</td></tr></table>
<div class="warnbox"><b>⚠ Le DR n’est pas « le routeur de la zone » :</b> ton poly le définit comme « le routeur représentant tous les routeurs de la zone ». L’élection a lieu <b>par segment multi-accès</b> : une zone avec cinq réseaux Ethernet a cinq DR. Et sur une liaison <b>point à point</b> (série), il n’y a pas de DR du tout : <code>show ip ospf neighbor</code> affiche « FULL/  - ».</div>
<p><b>Router-ID</b> (identifiant sur 32 bits, écrit comme une adresse IP), choisi dans cet ordre : la commande <code>router-id</code> ; sinon la plus haute adresse de <b>loopback</b> active ; sinon la plus haute adresse d’interface active.</p>

<h3>5. Configurer et vérifier</h3>
<div class="demo dark">R1(config)#router ospf 1                              ← n° de processus local
R1(config-router)#router-id 1.1.1.1
R1(config-router)#network 192.168.1.0 0.0.0.255 area 0     ← masque GÉNÉRIQUE (wildcard)
R1(config-router)#network 10.0.0.0 0.0.0.3 area 0          ← une liaison /30
R1(config-router)#passive-interface g0/1                   ← LAN sans routeur : pas de Hello
R1(config-router)#auto-cost reference-bandwidth 10000
R1(config-router)#default-information originate            ← propage la route par défaut (O*E2)
R1(config)#interface s0/0/0
R1(config-if)#ip ospf cost 100
R1(config-if)#ip ospf priority 0</div>
<p>Le <b>masque générique</b> est l’inverse du masque : 255.255.255.0 → <b>0.0.0.255</b>, 255.255.255.252 → <b>0.0.0.3</b>, une seule adresse → 0.0.0.0. Chaque interface dont l’adresse correspond entre dans OSPF, dans la zone indiquée.</p>
<div class="demo dark">R1#show ip ospf neighbor
Neighbor ID     Pri   State           Dead Time   Address         Interface
3.3.3.3           0   FULL/  -        00:00:33    20.5.5.1        Serial0/0/1    ← liaison série : pas de DR
192.168.3.254     1   FULL/DR         00:00:34    10.0.0.3        GigabitEthernet0/0
R1#show ip route ospf          ← routes « O » [110/coût]
R1#show ip ospf interface brief  ← coût, état (DR, BDR, DROTHER, P2P) et nombre de voisins par interface
R1#show ip ospf                ← router-id, zones, bande passante de référence
R1#show ip protocols           ← réseaux annoncés, interfaces passives, sources de routage
R1#clear ip ospf process       ← relance OSPF (nouveau router-id, nouvelle élection)</div>

<h3>6. Le TP OSPF1-Depart</h3>
<div class="figure"><svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<line x1="170" y1="125" x2="530" y2="125" stroke="#fbab18" stroke-width="2"/><text x="350" y="117" fill="currentColor" text-anchor="middle">20.2.2.0/30</text>
<line x1="170" y1="125" x2="350" y2="40" stroke="#8a9bb3" stroke-width="2"/><text x="235" y="70" fill="currentColor">20.5.5.0/30</text>
<line x1="350" y1="40" x2="530" y2="125" stroke="#8a9bb3" stroke-width="2"/><text x="430" y="70" fill="currentColor">20.1.1.0/30</text>
<line x1="170" y1="125" x2="350" y2="210" stroke="#8a9bb3" stroke-width="2"/><text x="215" y="190" fill="currentColor">20.4.4.0/30</text>
<line x1="350" y1="210" x2="530" y2="125" stroke="#8a9bb3" stroke-width="2"/><text x="440" y="190" fill="currentColor">20.3.3.0/30</text>
<line x1="30" y1="125" x2="170" y2="125" stroke="#8a9bb3" stroke-width="2" stroke-dasharray="5 4"/><text x="40" y="117" fill="currentColor">A (PAT) 20.6.6.0/30</text>
<line x1="530" y1="125" x2="670" y2="125" stroke="#8a9bb3" stroke-width="2" stroke-dasharray="5 4"/><text x="555" y="117" fill="currentColor">20.0.0.0/30 F (PAT)</text>
<ellipse cx="170" cy="125" rx="26" ry="16" fill="#1f6fb2"/><text x="170" y="130" fill="#fff" text-anchor="middle" font-weight="700">B</text>
<ellipse cx="350" cy="40" rx="26" ry="16" fill="#1f6fb2"/><text x="350" y="45" fill="#fff" text-anchor="middle" font-weight="700">C</text>
<ellipse cx="350" cy="210" rx="26" ry="16" fill="#1f6fb2"/><text x="350" y="215" fill="#fff" text-anchor="middle" font-weight="700">D</text>
<ellipse cx="530" cy="125" rx="26" ry="16" fill="#1f6fb2"/><text x="530" y="130" fill="#fff" text-anchor="middle" font-weight="700">E</text>
<text x="170" y="160" fill="#6fd6f5" text-anchor="middle">Serv-B 172.11.0.0/24</text><text x="530" y="160" fill="#6fd6f5" text-anchor="middle">Serv-E 172.12.0.0/24</text>
</svg><div class="figcap">Le cœur du TP : B, C, D, E (routeurs 2901) reliés par des liaisons série de coût 64. A et F (1841) font du PAT pour leurs PC.</div></div>
<ul><li>Les deux sites clients utilisent <b>le même réseau privé</b> 192.168.0.0/24 (PC-A et PC-F1 ont tous les deux 192.168.0.1) : c’est possible parce que A et F font du <b>PAT</b> et ont une <b>route par défaut</b> vers B et E. Le cœur OSPF n’a donc jamais à connaître 192.168.0.0.</li>
<li>OSPF tourne sur <b>B, C, D et E</b>. B et E doivent aussi annoncer les liaisons vers A (20.6.6.0/30) et F (20.0.0.0/30) : c’est l’adresse publique du PAT qui reçoit les réponses des serveurs.</li>
<li>Coûts : de B vers 172.12.0.0/24, lien direct 64 + 1 = <b>65</b>. Par C ou par D : 64 + 64 + 1 = <b>129</b>. Si le lien direct tombe, B garde <b>deux</b> chemins de coût 129 (via C et via D) et répartit la charge.</li></ul>
<div class="tip"><b>✔ Le fichier n’a pas d’énoncé :</b> le .pkt arrive seul. L’objectif logique (et celui du labo de l’appli) : faire tourner OSPF sur le cœur pour que les PC des deux sites ouvrent les pages web des deux serveurs.</div>
`,
  questions: [
    /* ---------- Débutant ---------- */
    { id: 'os1', lvl: 1, type: 'qcm', q: 'OSPF est un protocole de routage…',
      choices: ['à état de liens, qui calcule ses routes avec l’algorithme de Dijkstra', 'à vecteur de distance, basé sur Bellman-Ford', 'statique, configuré route par route', 'de redondance de passerelle'], good: 0,
      hints: ['« Open Shortest Path First » : le plus court chemin d’abord.'],
      explain: 'OSPF est un IGP <b>à état de liens</b> : chaque routeur a la carte complète de sa zone et calcule le plus court chemin avec <b>SPF (Dijkstra)</b>.' },
    { id: 'os2', lvl: 1, type: 'qcm', q: 'Quelle est la métrique d’OSPF ?',
      choices: ['Le coût, calculé à partir du débit des interfaces', 'Le nombre de sauts', 'Le délai mesuré par ping', 'Le nombre de voisins'], good: 0,
      hints: ['C’est ce qui lui permet de préférer deux liens rapides à un seul lien lent.'],
      explain: 'Le <b>coût</b> (cost) : somme des coûts des interfaces de sortie, chaque coût dépendant du <b>débit</b>.' },
    { id: 'os3', lvl: 1, type: 'qcm', q: 'Comment s’appelle la zone OSPF numéro 0 ?',
      choices: ['La zone dorsale (backbone)', 'La zone par défaut des PC', 'La zone démilitarisée (DMZ)', 'La zone de secours'], good: 0,
      hints: ['Toutes les autres zones s’y raccordent.'],
      explain: '<b>Area 0 = backbone</b>, la dorsale. Dans une conception standard, chaque autre zone est reliée à la zone 0 par un ABR.' },
    { id: 'os4', lvl: 1, type: 'match', q: 'Associe chaque sigle OSPF à sa définition.',
      pairs: [['DR', 'Routeur désigné d’un réseau multi-accès'], ['BDR', 'Routeur qui remplace le DR s’il tombe'], ['ABR', 'Routeur à la frontière entre deux zones'], ['ASBR', 'Routeur qui injecte des routes externes'], ['LSA', 'Annonce décrivant l’état d’un lien']],
      hints: ['B = Backup, A = Area, AS = Autonomous System.'],
      explain: 'DR / BDR : élus sur un segment multi-accès. ABR : entre deux zones. ASBR : à la frontière du système autonome (routes statiques, autre protocole, route par défaut). LSA : l’information échangée.' },
    /* ---------- Facile ---------- */
    { id: 'os5', lvl: 2, type: 'order', q: 'Remets dans l’ordre les états d’une relation de voisinage OSPF, de « rien » à « bases synchronisées ».',
      items: ['Down', 'Init', '2-Way', 'ExStart', 'Exchange', 'Loading', 'Full'],
      hints: ['On se découvre (Hello), on se reconnaît, puis on échange les bases.'],
      explain: 'Down → Init (Hello reçu) → 2-Way (chacun se voit) → ExStart (maître / esclave) → Exchange (DBD) → Loading (LSR / LSU) → <b>Full</b>.' },
    { id: 'os6', lvl: 2, type: 'match', q: 'Associe chaque type de paquet OSPF à son numéro.',
      pairs: [['Type 1', 'Hello'], ['Type 2', 'DBD (description de la base)'], ['Type 3', 'LSR (demande d’état de lien)'], ['Type 4', 'LSU (mise à jour d’état de lien)'], ['Type 5', 'LSAck (accusé de réception)']],
      hints: ['On se salue, on décrit sa base, on demande ce qui manque, on reçoit, on acquitte.'],
      explain: '1 Hello, 2 DBD, 3 LSR, 4 LSU (qui transporte les LSA), 5 LSAck.' },
    { id: 'os7', lvl: 2, type: 'text', q: 'Quel <b>masque générique</b> (wildcard) écris-tu dans la commande <code>network</code> d’OSPF pour :',
      fields: [{ label: 'un réseau /24', kind: 'ip', answer: '0.0.0.255' }, { label: 'une liaison /30', kind: 'ip', answer: '0.0.0.3' }],
      hints: ['C’est l’inverse du masque : 255 − chaque octet.'],
      explain: '255.255.255.0 → <b>0.0.0.255</b> ; 255.255.255.252 → <b>0.0.0.3</b>. Exemple : <code>network 20.6.6.0 0.0.0.3 area 0</code>.' },
    { id: 'os8', lvl: 2, type: 'text', q: 'OSPF sur Cisco :',
      fields: [{ label: 'numéro de protocole IP', kind: 'int', answer: 89 }, { label: 'distance administrative', kind: 'int', answer: 110 }],
      hints: ['Le poly donne le numéro de protocole dans l’introduction.', 'Juste en dessous de RIP (120).'],
      explain: 'OSPF n’utilise ni TCP ni UDP : il est directement dans IP, <b>protocole 89</b>. Distance administrative <b>110</b> : entre une route OSPF et une route RIP vers le même réseau, IOS garde l’OSPF.' },
    /* ---------- Moyen ---------- */
    { id: 'os9', lvl: 3, type: 'text', q: 'Avec la bande passante de référence par défaut (100 Mbit/s), donne le coût OSPF de :',
      fields: [{ label: 'une interface Ethernet à 10 Mbit/s', kind: 'int', answer: 10 }, { label: 'une interface FastEthernet', kind: 'int', answer: 1 }, { label: 'une liaison série à 1 544 kbit/s', kind: 'int', answer: 64 }],
      hints: ['Coût = 100 Mbit/s / débit, arrondi à l’entier inférieur, minimum 1.', '100 000 / 1 544 ≈ 64,8.'],
      explain: '100 / 10 = <b>10</b> ; 100 / 100 = <b>1</b> ; 100 000 kbit/s / 1 544 kbit/s = 64,77 → <b>64</b> (on garde la partie entière).' },
    { id: 'os10', lvl: 3, type: 'qcm', q: 'Sur un même réseau Ethernet, quatre routeurs OSPF ont la priorité par défaut et les router-id 1.1.1.1, 2.2.2.2, 3.3.3.3 et 4.4.4.4. Ils démarrent en même temps. Qui est DR, qui est BDR ?',
      choices: ['DR = 4.4.4.4, BDR = 3.3.3.3', 'DR = 1.1.1.1, BDR = 2.2.2.2', 'DR = 4.4.4.4, BDR = 1.1.1.1', 'Il n’y a pas de DR sur Ethernet'], good: 0,
      hints: ['Priorités égales → on départage au router-id.'],
      explain: 'Même priorité (1) → le plus haut router-id est <b>DR</b> (4.4.4.4), le suivant <b>BDR</b> (3.3.3.3). 1.1.1.1 et 2.2.2.2 sont DROTHER : Full avec le DR et le BDR, 2-Way entre eux.' },
    { id: 'os11', lvl: 3, type: 'order', q: 'Dans quel ordre un routeur choisit-il son <b>router-id</b> OSPF ? (de la règle prioritaire à la dernière)',
      items: ['La commande router-id sous router ospf', 'La plus haute adresse IP de loopback active', 'La plus haute adresse IP d’interface physique active'],
      hints: ['Ce qu’on configure explicitement passe avant ce qu’on déduit.'],
      explain: '1) <code>router-id</code> ; 2) la plus haute <b>loopback</b> ; 3) la plus haute interface active. Dans le TP OSPF1-Depart sans router-id, Routeur-B prend 172.11.0.254 (sa plus haute adresse).' },
    { id: 'os12', lvl: 3, type: 'qcm', q: '<code>show ip ospf neighbor</code> affiche « FULL/  - » pour un voisin joint par Serial0/0/1. Que signifie le tiret ?',
      choices: ['Liaison point à point : il n’y a ni DR ni BDR, la relation est complète', 'Le voisin est en panne', 'L’élection DR n’est pas terminée', 'Le voisin a une priorité de 255'], good: 0,
      hints: ['Le DR n’existe que sur les réseaux multi-accès.'],
      explain: 'Sur une liaison <b>point à point</b>, pas d’élection : l’état est FULL et le rôle « - ». Sur Ethernet, on verrait FULL/DR, FULL/BDR ou 2WAY/DROTHER.' },
    /* ---------- Difficile ---------- */
    { id: 'os13', lvl: 4, type: 'qcm', q: '<b>Esprit critique.</b> Le poly écrit : « Coût d’un lien = bande passante de l’interface / bande passante de référence ». Qu’en penses-tu ?',
      choices: ['La formule est inversée : coût = référence / interface, un lien plus rapide a un coût plus petit', 'La formule est juste', 'Il manque une multiplication par 8', 'Le coût ne dépend pas du débit en OSPF'], good: 0,
      hints: ['Avec la formule du poly, un lien Gigabit coûterait 10 et un lien à 10 Mbit/s 0,1.'],
      explain: 'Avec la formule du poly, OSPF préférerait les liens lents ! La bonne formule : <b>référence / débit de l’interface</b> (100 Mbit/s par défaut), arrondie, minimum 1.' },
    { id: 'os14', lvl: 4, type: 'qcm', q: '<b>Esprit critique.</b> Le poly définit le DR comme « le routeur représentant tous les routeurs de la zone ». Quelle correction est juste ?',
      choices: ['Le DR est élu par réseau multi-accès (segment), pas par zone ; il n’y en a pas sur les liaisons point à point', 'Le DR est élu pour tout le système autonome', 'Il y a toujours exactement un DR par zone', 'Le DR est toujours le routeur de la zone 0'], good: 0,
      hints: ['show ip ospf neighbor sur une liaison série affiche « FULL/  - ».'],
      explain: 'L’élection DR/BDR se fait <b>sur chaque segment multi-accès</b> (Ethernet partagé). Une zone peut donc avoir plusieurs DR, ou aucun si elle n’a que des liaisons point à point.' },
    { id: 'os-lab-tp', lvl: 4, type: 'pt', topo: 'OSPF1-Depart', file: 'OSPF1-Depart.pkt', tag: 'OSPF',
      q: '<b>TP OSPF1-Depart.</b> Le cœur du réseau (Routeur-B, C, D, E en 2901, liaisons série) ne fait encore aucun routage : les PC des deux sites (derrière A et F, qui font du PAT) n’atteignent pas le serveur d’en face. Active <b>OSPF (processus 1, zone 0)</b> sur B, C, D et E pour que :<br>• PC-A ouvre <code>http://172.12.0.1</code> (Serv-E) ;<br>• PC-F1 ouvre <code>http://172.11.0.1</code> (Serv-B).<br>Donne des router-id lisibles (<b>B = 2.2.2.2, C = 3.3.3.3, D = 4.4.4.4, E = 5.5.5.5</b>) et rends passives les interfaces des LAN serveurs (G0/1 de B et de E).',
      tasks: [
        { label: 'Router-id : B = 2.2.2.2, C = 3.3.3.3, D = 4.4.4.4, E = 5.5.5.5', check: function (n) { return rid(n, 'Router B', '2.2.2.2') && rid(n, 'Router C', '3.3.3.3') && rid(n, 'Router D', '4.4.4.4') && rid(n, 'Router E', '5.5.5.5'); } },
        { label: 'B et E ont chacun 3 voisins OSPF, C et D en ont 2', check: function (n) { return nbrs(n, 'Router B') === 3 && nbrs(n, 'Router E') === 3 && nbrs(n, 'Router C') === 2 && nbrs(n, 'Router D') === 2; } },
        { label: 'B joint le LAN de Serv-E (172.12.0.0/24) par le lien direct, coût 65', check: function (n) { var rs = oRoutes(n, 'Router B', '172.12.0.0/24'); return rs.length === 1 && rs[0].nh === NET.ip2int('20.2.2.1') && rs[0].metric === 65; } },
        { label: 'G0/1 est passive sur B et sur E', check: function (n) { return opassive(n, 'Router B', 'GigabitEthernet0/1') && opassive(n, 'Router E', 'GigabitEthernet0/1'); } },
        { label: 'PC-A ouvre http://172.12.0.1 et PC-F1 ouvre http://172.11.0.1', check: function (n) { return n.httpGet(n.dev('PC-A'), 'http://172.12.0.1').ok && n.httpGet(n.dev('PC-F1'), 'http://172.11.0.1').ok; } }
      ],
      hints: ['Sur chaque routeur du cœur : <code>router ospf 1</code>, <code>router-id …</code>, puis un <code>network &lt;réseau&gt; &lt;wildcard&gt; area 0</code> par réseau connecté (0.0.0.3 pour les /30, 0.0.0.255 pour les /24).', 'N’oublie pas les liaisons vers A (20.6.6.0/30 sur B) et vers F (20.0.0.0/30 sur E) : les serveurs répondent à l’adresse publique du PAT, il faut une route pour y revenir.', '<code>passive-interface g0/1</code> sur B et E (et pourquoi pas s0/0/0, vers A et F qui ne font pas d’OSPF). Vérifie avec <code>show ip ospf neighbor</code> et <code>show ip route ospf</code>.'],
      solution: TP_SOL,
      explain: 'Sur B, <code>show ip route ospf</code> donne 172.12.0.0/24 [110/<b>65</b>] via 20.2.2.1 (lien direct), et des chemins doubles de coût 128 vers 20.1.1.0/30 et 20.3.3.0/30 (via E ou via C / D). Piège classique : sans <code>network 20.6.6.0 0.0.0.3 area 0</code> sur B, E ne connaît pas l’adresse publique de A (20.6.6.2) et la réponse de Serv-E se perd. Essaie aussi un <code>shutdown</code> de s0/1/1 sur B : la route passe à [110/129] avec deux chemins, via C et via D.' },
    { id: 'os15', lvl: 4, type: 'multi', q: 'Deux routeurs sont reliés par un câble Ethernet. Quelles conditions doivent-ils remplir sur ce lien pour devenir voisins OSPF ?',
      choices: ['Être dans la même zone', 'Avoir les mêmes temporisateurs Hello et Dead', 'Être dans le même sous-réseau, avec le même masque', 'Ne pas avoir l’interface en passive-interface', 'Utiliser le même numéro de processus OSPF', 'Avoir le même router-id'], good: [0, 1, 2, 3],
      hints: ['Deux de ces conditions sont des pièges : l’une est purement locale, l’autre doit au contraire être différente.'],
      explain: 'Zone, Hello / Dead, sous-réseau et masque doivent correspondre, et l’interface ne doit pas être passive. Le numéro de processus est <b>local</b> (router ospf 1 d’un côté, 10 de l’autre : ça marche). Deux router-id <b>identiques</b> empêchent au contraire le voisinage.' },
    /* ---------- Extrême ---------- */
    { id: 'os16', lvl: 5, type: 'text', q: '<b>TP OSPF1-Depart</b> (liaisons série de coût 64, LAN des serveurs en Gigabit, coût 1). Depuis Routeur-B, vers le LAN de Serv-E :',
      fields: [{ label: 'coût par le lien direct B-E', kind: 'int', answer: 65 }, { label: 'coût si le lien B-E est coupé', kind: 'int', answer: 129 }, { label: 'nombre de chemins installés dans ce cas', kind: 'int', answer: 2 }],
      hints: ['On additionne les coûts des interfaces de SORTIE, y compris celle de E vers le LAN.', 'Sans le lien direct : par C ou par D, 2 liaisons série chacun.'],
      explain: 'Direct : 64 (B → E) + 1 (E → LAN) = <b>65</b>. Sans lui : 64 + 64 + 1 = <b>129</b>, par C <b>et</b> par D (coût égal) : <b>2</b> chemins, répartition de charge (Maximum path: 4).' },
    { id: 'os17', lvl: 5, type: 'qcm', q: '<b>Sujet 2025, exercice 4.</b> R1 joint R3 soit directement par une liaison de secours à 4 Mbit/s, soit par R2 avec deux liaisons à 128 Mbit/s. Que choisirait RIP, que choisirait OSPF (référence 100 Mbit/s) ?',
      choices: ['RIP prend la liaison de secours (1 saut contre 2) ; OSPF passe par R2 (1 + 1 = 2 contre 25)', 'Tous les deux passent par R2', 'Tous les deux prennent la liaison de secours', 'RIP passe par R2, OSPF prend la liaison de secours'], good: 0,
      hints: ['RIP compte les sauts. OSPF : 100 / 4 = 25 ; 100 / 128 → minimum 1.'],
      explain: 'RIP ne voit que les <b>sauts</b> : 1 < 2, il utiliserait la liaison lente en permanence. OSPF calcule 25 pour le lien direct contre 1 + 1 = 2 par R2 : il garde les liaisons principales et ne bascule sur le secours qu’en cas de panne. C’est la réponse attendue au sujet : un routage <b>adaptatif</b> qui tient compte du débit = <b>OSPF</b>.' },
    { id: 'os-lab-cout', lvl: 5, type: 'pt', file: 'OSPF1-couts.pkt', tag: 'OSPF',
      q: '<b>Jouer sur les coûts.</b> Le TP OSPF1-Depart fonctionne (OSPF actif sur B, C, D, E). La direction veut maintenant :<br>• que le trafic entre les deux serveurs passe <b>par C</b>, dans les deux sens ;<br>• que le chemin <b>par D</b> serve de 1er secours ;<br>• que le lien direct B-E (S0/1/1) reste branché et actif, mais ne serve <b>qu’en dernier recours</b>.<br>Ne coupe aucune liaison : modifie les coûts.',
      build: function () { return LAB.solved('os-lab-tp'); },
      tasks: [
        { label: 'B joint 172.12.0.0/24 par un seul chemin, via C (20.5.5.1)', check: function (n) { return only(n, 'Router B', '172.12.0.0/24', '20.5.5.1'); } },
        { label: 'E joint 172.11.0.0/24 par un seul chemin, via C (20.1.1.2)', check: function (n) { return only(n, 'Router E', '172.11.0.0/24', '20.1.1.2'); } },
        { label: 'Le lien direct B-E reste actif', check: function (n) { return LAB.ifUp(n, 'Router B', 'Serial0/1/1') && LAB.ifUp(n, 'Router E', 'Serial0/1/1'); } },
        { label: 'Des deux côtés, le chemin par D coûte moins cher que le lien direct', check: function (n) {
          return cost(n, 'Router B', 'Serial0/1/1') > cost(n, 'Router B', 'Serial0/1/0') + cost(n, 'Router D', 'Serial0/0/1')
            && cost(n, 'Router E', 'Serial0/1/1') > cost(n, 'Router E', 'Serial0/0/1') + cost(n, 'Router D', 'Serial0/1/0'); } },
        { label: 'tracert de PC-A vers Serv-E : 192.168.0.254 > 20.6.6.1 > 20.5.5.1 > 20.1.1.1 > 172.12.0.1', check: function (n) { return trace(n, 'PC-A', '172.12.0.1') === '192.168.0.254 > 20.6.6.1 > 20.5.5.1 > 20.1.1.1 > 172.12.0.1'; } }
      ],
      hints: ['Le coût se règle sur l’interface de <b>sortie</b> : <code>interface s0/1/1</code> puis <code>ip ospf cost 1000</code>, sur B <b>et</b> sur E (chaque routeur calcule avec ses propres interfaces).', 'Ensuite C et D sont à égalité (129) : il faut rendre le chemin par D un peu plus cher, par exemple <code>ip ospf cost 100</code> sur s0/1/0 de B et sur s0/0/1 de E.', 'Vérifie : sur B, <code>show ip route ospf</code> doit montrer 172.12.0.0/24 [110/129] via 20.5.5.1 seulement, et <code>show ip ospf interface brief</code> les coûts.'],
      solution: [
        { dev: 'Router B', cli: ['conf t', 'interface s0/1/1', 'ip ospf cost 1000', 'interface s0/1/0', 'ip ospf cost 100', 'end'] },
        { dev: 'Router E', cli: ['conf t', 'interface s0/1/1', 'ip ospf cost 1000', 'interface s0/0/1', 'ip ospf cost 100', 'end'] }
      ],
      explain: 'Coûts obtenus depuis B vers 172.12.0.0/24 : par C 64 + 64 + 1 = <b>129</b>, par D 100 + 64 + 1 = <b>165</b>, en direct 1000 + 1 = <b>1001</b>. Il faut modifier les <b>deux extrémités</b> : OSPF additionne les coûts de sortie, B ne voit pas ce que E a réglé sur son interface (et inversement). Tu peux tester les secours : <code>shutdown</code> sur s0/0/1 de B → la route passe par D [110/165] ; coupe aussi s0/1/0 → elle prend le lien direct [110/1001].' },
    { id: 'os18', lvl: 5, type: 'qcm', q: 'Pourquoi taper <code>auto-cost reference-bandwidth 10000</code> sur un réseau avec des liens FastEthernet et Gigabit ?',
      choices: ['Avec la référence de 100 Mbit/s, Fast et Gigabit ont le même coût (1) ; à 10 000, Gigabit coûte 10 et Fast 100. Il faut le faire sur tous les routeurs', 'Pour accélérer les Hello', 'Pour que les liens Gigabit passent à 10 Gbit/s', 'Il suffit de le faire sur le routeur central'], good: 0,
      hints: ['100 / 1 000 = 0,1 → arrondi au minimum 1.'],
      explain: 'À 100 Mbit/s de référence, tout lien ≥ 100 Mbit/s coûte <b>1</b> : OSPF ne distingue plus Fast et Gigabit. Avec 10 000, Gigabit = 10, Fast = 100. À faire sur <b>tous</b> les routeurs, sinon les coûts additionnés n’ont plus de sens (IOS affiche « Please ensure reference bandwidth is consistent across all routers »).' },
    /* ---------- Impossible ---------- */
    { id: 'os-lab-dr', lvl: 6, type: 'pt', file: 'OSPF-election-DR.pkt', tag: 'OSPF',
      q: '<b>Élection du DR.</b> Quatre routeurs 2901 partagent le réseau 10.0.0.0/24 (G0/0, sur le switch SW). Router-id : R1 = 1.1.1.1, R2 = 2.2.2.2, R3 = 3.3.3.3, R4 = 4.4.4.4. Aujourd’hui, R4 est DR et R3 BDR.<br>Objectif : <b>R1</b> doit être DR et <b>R2</b> BDR, et <b>R3 et R4 ne doivent jamais</b> pouvoir devenir DR ni BDR. Sans toucher aux router-id.',
      build: function () {
        return LAB.make({
          devices: [['R1', '2901', 130, 130], ['R2', '2901', 380, 130], ['R3', '2901', 630, 130], ['R4', '2901', 880, 130], ['SW', '2960-24TT', 505, 310], ['PC1', 'PC-PT', 130, 10], ['PC4', 'PC-PT', 880, 10]],
          links: [['R1', 'GigabitEthernet0/0', 'SW', 'FastEthernet0/1', 'straight'], ['R2', 'GigabitEthernet0/0', 'SW', 'FastEthernet0/2', 'straight'], ['R3', 'GigabitEthernet0/0', 'SW', 'FastEthernet0/3', 'straight'], ['R4', 'GigabitEthernet0/0', 'SW', 'FastEthernet0/4', 'straight'],
            ['PC1', 'FastEthernet0', 'R1', 'GigabitEthernet0/1', 'cross'], ['PC4', 'FastEthernet0', 'R4', 'GigabitEthernet0/1', 'cross']],
          notes: [[60, 420, 'Réseau partagé 10.0.0.0/24 : R1 = .1, R2 = .2, R3 = .3, R4 = .4 · LAN de chaque routeur : 192.168.x.0/24 (passerelle .254)']],
          cli: { R1: lanRouter('R1', 1), R2: lanRouter('R2', 2), R3: lanRouter('R3', 3), R4: lanRouter('R4', 4) },
          hosts: { PC1: { ip: '192.168.1.10', mask: '255.255.255.0', gw: '192.168.1.254' }, PC4: { ip: '192.168.4.10', mask: '255.255.255.0', gw: '192.168.4.254' } }
        });
      },
      tasks: [
        { label: 'R1 est DR sur 10.0.0.0/24', check: function (n) { return role(n, 'R1') === 'DR'; } },
        { label: 'R2 est BDR', check: function (n) { return role(n, 'R2') === 'BDR'; } },
        { label: 'R3 et R4 ont une priorité 0 sur G0/0', check: function (n) { return ['R3', 'R4'].every(function (r) { var d = n.dev(r); return n.iface(d, 'GigabitEthernet0/0').ospfPrio === 0; }); } },
        { label: 'Les router-id n’ont pas changé', check: function (n) { return rid(n, 'R1', '1.1.1.1') && rid(n, 'R2', '2.2.2.2') && rid(n, 'R3', '3.3.3.3') && rid(n, 'R4', '4.4.4.4'); } },
        { label: 'PC1 joint toujours PC4', check: function (n) { return n.canPing('PC1', 'PC4'); } }
      ],
      hints: ['<code>show ip ospf neighbor</code> sur R1 : 4.4.4.4 FULL/DR, 3.3.3.3 FULL/BDR, 2.2.2.2 2WAY/DROTHER.', 'La priorité se règle sur l’interface : <code>interface g0/0</code> puis <code>ip ospf priority …</code> (1 par défaut, 0 = jamais DR / BDR).', 'R3 et R4 à 0. Puis R1 plus haut que R2 : par exemple 255 sur R1 ; R2 peut rester à 1, il sera le seul candidat restant.'],
      solution: [
        { dev: 'R1', cli: ['conf t', 'interface g0/0', 'ip ospf priority 255', 'end'] },
        { dev: 'R3', cli: ['conf t', 'interface g0/0', 'ip ospf priority 0', 'end'] },
        { dev: 'R4', cli: ['conf t', 'interface g0/0', 'ip ospf priority 0', 'end'] }
      ],
      explain: 'Priorité 255 pour R1 → DR ; R3 et R4 à 0 → exclus ; il ne reste que R2 (priorité 1) → BDR. Sur R3, <code>show ip ospf neighbor</code> montre alors 1.1.1.1 FULL/DR, 2.2.2.2 FULL/BDR et 4.4.4.4 <b>2WAY/DROTHER</b> (deux DROTHER restent en 2-Way). Attention : sur un vrai routeur, l’élection <b>n’est pas préemptive</b>, changer les priorités ne suffit pas, il faut relancer avec <code>clear ip ospf process</code> (ou couper / rallumer les interfaces). Le simulateur, lui, refait l’élection tout de suite.' },
    { id: 'os19', lvl: 6, type: 'qcm', q: 'Sur un Ethernet, R1 (priorité 1, router-id 1.1.1.1) est DR et R2 (priorité 1, 2.2.2.2) BDR. On branche R9 (priorité 1, router-id 9.9.9.9). Que se passe-t-il ?',
      choices: ['Rien ne change : pas de préemption, R9 devient DROTHER', 'R9 devient DR immédiatement (plus haut router-id)', 'R9 devient BDR et R2 DROTHER', 'Une nouvelle élection a lieu et R9 devient DR, R1 BDR'], good: 0,
      hints: ['Poly, diapo « Choix du DR et BDR » : « No new election if another router is added ».'],
      explain: 'L’élection <b>n’est pas préemptive</b> : R9 devient DROTHER. Il ne deviendra BDR que si le DR ou le BDR tombe (si R1 tombe, R2 devient DR et on élit un nouveau BDR : R9).' },
    { id: 'os20', lvl: 6, type: 'text', q: 'Avec <code>auto-cost reference-bandwidth 10000</code>, donne le coût OSPF de :',
      fields: [{ label: 'une interface GigabitEthernet', kind: 'int', answer: 10 }, { label: 'une interface FastEthernet', kind: 'int', answer: 100 }, { label: 'une liaison série à 1 544 kbit/s', kind: 'int', answer: 6476 }],
      hints: ['10 000 Mbit/s = 10 000 000 kbit/s.', 'On garde la partie entière.'],
      explain: '10 000 / 1 000 = <b>10</b> ; 10 000 / 100 = <b>100</b> ; 10 000 000 / 1 544 = 6 476,7 → <b>6 476</b>.' },
    { id: 'os21', lvl: 6, type: 'qcm', q: 'R1 et R2 sont reliés par 10.0.0.0/24. R1 a <code>network 10.0.0.0 0.0.0.255 area 0</code>, R2 a <code>network 10.0.0.0 0.0.0.255 area 1</code>. Les deux font <code>show ip ospf neighbor</code>. Que voient-ils ?',
      choices: ['Rien : les numéros de zone ne correspondent pas, aucun voisinage ne se forme', 'Un voisin en FULL, car le réseau est le même', 'Un voisin bloqué en ExStart', 'Un voisin en FULL, et R2 devient ABR'], good: 0,
      hints: ['L’identifiant de zone est dans chaque Hello.'],
      explain: 'Le Hello porte le <b>numéro de zone</b> ; s’il diffère, le Hello est rejeté (IOS journalise « mismatched area ID ») : <b>aucun voisin</b>. Pour qu’un routeur soit ABR, il faut qu’il ait des interfaces dans deux zones, et que chaque lien soit dans la même zone des deux côtés.' }
  ]
  });
})();
