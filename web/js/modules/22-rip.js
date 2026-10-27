(function () {
  function rip(nets) { return ['conf t', 'router rip', 'version 2'].concat(nets.map(function (x) { return 'network ' + x; })).concat(['no auto-summary', 'end']); }
  /* route RIP (code R) vers cidr, avec passerelle et métrique attendues */
  function ripRoute(n, dev, cidr, nh, metric) {
    var c = NET.parseCIDR(cidr), d = n.dev(dev);
    return !!d && n.routeTable(d).some(function (r) { return r.code === 'R' && r.net === c.ip && r.len === c.len && r.nh === NET.ip2int(nh) && (metric == null || r.metric === metric); });
  }
  /* chemin suivi par un tracert (adresses des sauts) */
  function trace(n, from, ip) { return n.traceroute(n.dev(from), NET.ip2int(ip)).map(function (h) { return h.ip == null ? '*' : NET.int2ip(h.ip); }).join(' > '); }
  function passive(n, dev, ifn) { var r = n.dev(dev).cfg.rip; return !!r && r.passive.indexOf(ifn) >= 0; }
  /* TP du 23/10 : RIP v2 déjà actif sur les 6 routeurs du labo du module 7 */
  var RIP6 = { PB1: ['192.168.10.0', '192.168.0.0'], PB2: ['192.168.11.0', '192.168.0.0'], RB1E2: ['192.168.3.0', '192.168.10.0'], RB1E1: ['192.168.2.0', '192.168.10.0'], RB1E0: ['192.168.1.0', '192.168.10.0'], RB2: ['192.168.11.0', '192.168.4.0'] };
  /* labo « réseaux discontinus » du document Configuration Routage RIP (liaisons série, LAN en 172.16.x.0/24) */
  function tri(h, lan, s2, s3, nets) {
    return ['conf t', 'hostname ' + h, 'interface fa0/0', 'ip address ' + lan + ' 255.255.255.0', 'no shutdown', 'interface s2/0', 'ip address ' + s2 + ' 255.255.255.0', 'clock rate 64000', 'no shutdown', 'interface s3/0', 'ip address ' + s3 + ' 255.255.255.0', 'no shutdown', 'exit', 'router rip', 'version 2']
      .concat(nets.map(function (x) { return 'network ' + x; })).concat(['passive-interface fa0/0', 'end']);
  }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'rip', num: 22, icon: '📣', titre: 'RIP en profondeur (et RIPng)',
  sous: 'Vecteur de distance, temporisateurs, boucles, RIPv1 / RIPv2, auto-summary, RIPng',
  source: 'ROUTAGE RIP (Routing Information Protocol).pdf, le protocoleRIP.pdf (traduction de la RFC 1058), Configuration Routage RIP.pdf, ROUTAGE-RIP-Depart.pkt (CV du 23/10)',
  cours: `
<h3>1. RIP en une phrase</h3>
<p><b>RIP</b> (<i>Routing Information Protocol</i>) est un protocole de routage dynamique <b>IGP</b> (à l’intérieur d’un système autonome) à <b>vecteur de distance</b>, basé sur l’algorithme de <b>Bellman-Ford</b>. RFC 1058 (v1) et RFC 2453 (v2).</p>
<table><tr><th>Caractéristique</th><th>Valeur</th></tr>
<tr><td>Métrique</td><td><b>nombre de sauts</b> (hop count) : Distance(X) = min [coût du voisin + distance annoncée par ce voisin]</td></tr>
<tr><td>Maximum</td><td><b>15 sauts</b> ; <b>16 = infini</b> (inaccessible)</td></tr>
<tr><td>Distance administrative (Cisco)</td><td><b>120</b> (statique 1, OSPF 110)</td></tr>
<tr><td>Transport</td><td><b>UDP 520</b> (port source et destination)</td></tr>
<tr><td>Répartition de charge</td><td>jusqu’à <b>4 chemins de même métrique</b> par défaut (Maximum path: 4)</td></tr></table>
<p>Ses défauts : <b>convergence lente</b>, une mauvaise information peut créer une <b>boucle</b>, et une <b>métrique peu pertinente</b> (2 sauts en fibre perdent contre 1 saut en ADSL). D’où le conseil du cours : utiliser RIPv2, et préférer <b>OSPF</b> (module 23) dès que le réseau grandit.</p>

<h3>2. Comment un routeur RIP apprend (RFC 1058)</h3>
<ul><li>Chaque routeur garde, pour chaque destination, la <b>distance</b> D et la <b>passerelle</b> G (le premier routeur sur le chemin).</li>
<li>Toutes les <b>30 secondes</b>, il envoie toute sa table à ses voisins.</li>
<li>À réception d’une annonce du voisin G’ : distance D’ = distance annoncée + 1. Si D’ &lt; D, il adopte la nouvelle route. <b>Si G’ est déjà sa passerelle pour cette destination, il croit la nouvelle valeur même si elle est plus grande</b> (c’est comme ça qu’une panne se propage).</li></ul>
<table><tr><th>Temporisateur</th><th>RFC 1058</th><th>Cisco (show ip protocols)</th></tr>
<tr><td>Mise à jour périodique</td><td>30 s (+ un petit délai aléatoire)</td><td>30 s</td></tr>
<tr><td>Route invalide (plus de nouvelles)</td><td>180 s (timeout)</td><td>invalid 180 s</td></tr>
<tr><td>Retenue</td><td>—</td><td>hold down 180 s</td></tr>
<tr><td>Suppression</td><td>120 s <b>après</b> le timeout (« ramassage des déchets »), soit 300 s</td><td>flushed after 240 s (depuis la dernière mise à jour)</td></tr></table>

<h4>Le format des messages</h4>
<ul><li>En-tête de 4 octets : <b>commande</b> (1 = request, 2 = response), <b>version</b>, 2 octets à zéro.</li>
<li>Puis jusqu’à <b>25 entrées de 20 octets</b> : famille d’adresses (2 = IP), adresse, métrique (RIPv2 y ajoute masque, prochain saut et étiquette). Taille maximale : 4 + 25 × 20 = 504 octets, sous la limite de <b>512 octets</b> fixée par la RFC (sans les en-têtes IP et UDP).</li></ul>

<h3>3. Boucles et « comptage à l’infini »</h3>
<p>Quand un réseau disparaît, deux routeurs peuvent se « tromper mutuellement » : chacun croit pouvoir l’atteindre par l’autre, et les métriques montent lentement jusqu’à 16. Les parades :</p>
<table><tr><th>Mécanisme</th><th>Principe</th></tr>
<tr><td><b>Split horizon</b> (horizon partagé)</td><td>ne jamais annoncer une route sur l’interface par laquelle on l’a apprise</td></tr>
<tr><td><b>Poison reverse</b> (horizon partagé avec empoisonnement)</td><td>annoncer quand même cette route au voisin qui nous l’a apprise, mais avec la métrique <b>16</b> : la fausse route est cassée tout de suite, au prix de messages plus gros</td></tr>
<tr><td><b>Route poisoning</b></td><td>le routeur qui perd un réseau l’annonce à <b>16</b> au lieu de se taire</td></tr>
<tr><td><b>Triggered updates</b></td><td>envoyer une mise à jour <b>tout de suite</b> en cas de changement, sans attendre les 30 s</td></tr>
<tr><td><b>Hold-down</b> (retenue)</td><td>une route tombée est « gelée » un moment : on ignore les annonces moins bonnes qui pourraient venir d’un voisin pas encore au courant</td></tr></table>
<div class="memo"><b>📌 Limite du split horizon :</b> il empêche les boucles entre <b>deux</b> routeurs. Avec trois (A croit passer par B, B par C, C par A), seules la limite de 16 et les mises à jour déclenchées en viennent à bout.</div>

<h3>4. RIPv1 et RIPv2</h3>
<table><tr><th></th><th>RIPv1</th><th>RIPv2</th></tr>
<tr><td>Masque dans les annonces</td><td><b>non</b> (classful)</td><td><b>oui</b> (classless, VLSM)</td></tr>
<tr><td>Destination des annonces</td><td>diffusion 255.255.255.255</td><td>multicast <b>224.0.0.9</b></td></tr>
<tr><td>Authentification</td><td>non</td><td>oui (texte clair ou MD5)</td></tr>
<tr><td>Prochain saut, étiquette de route</td><td>non</td><td>oui</td></tr></table>
<p>Sans masque, un routeur RIPv1 devine : si le réseau annoncé est dans la <b>même classe</b> que l’interface de réception, il prend le masque de cette interface ; sinon, il prend le <b>masque de la classe</b>.</p>

<h3>5. Configurer RIP sur Cisco (document « Configuration Routage RIP »)</h3>
<div class="demo dark">R1(config)#router rip
R1(config-router)#version 2
R1(config-router)#network 192.168.1.0          ← ses PROPRES réseaux, en adresse de classe
R1(config-router)#network 192.168.12.0
R1(config-router)#network 192.168.13.0
R1(config-router)#passive-interface f0/0       ← LAN sans routeur : n’envoie plus d’annonces
R1(config-router)#no auto-summary              ← indispensable si les réseaux sont discontinus
R1(config-router)#default-information originate ← propage sa route par défaut</div>
<div class="demo dark">R1#show ip route rip
R    192.168.23.0/24 [120/1] via 192.168.13.1, 00:00:26, Serial0/1   ← [distance administrative / métrique]
                     [120/1] via 192.168.12.2, 00:00:06, Serial0/0   ← 2e chemin de même coût
R    192.168.2.0/24 [120/1] via 192.168.12.2, 00:00:06, Serial0/0
R1#show ip protocols        ← version, temporisateurs, réseaux, interfaces passives, voisins
R1#show ip rip database     ← toutes les routes connues par RIP
R1#debug ip rip             ← les annonces en direct (undebug all pour arrêter)</div>
<ul><li>Une <b>interface passive</b> n’envoie plus d’annonces RIP mais <b>écoute et enregistre</b> toujours celles qu’elle reçoit. Intérêts : ne pas gaspiller les ressources des postes et la bande passante, et ne pas exposer les annonces (en clair) sur le LAN.</li>
<li>Avec <code>debug ip rip</code>, on voit le split horizon à l’œuvre : vers R2, R1 annonce 192.168.1.0 et 192.168.13.0, mais jamais 192.168.12.0 (le réseau de la liaison elle-même) ni ce qu’il a appris de R2.</li></ul>
<div class="warnbox"><b>⚠ Erreurs et raccourcis du document « Configuration Routage RIP » :</b><br>• Étape 3 : <code>network 172.16.1.0</code> sur R1 est une coquille pour <b>192.168.1.0</b> (le show ip protocols juste après affiche bien 192.168.1.0). Avec 172.16.1.0, R1 n’annoncerait pas son LAN.<br>• « La métrique de 120 est bien celle par défaut de RIP » : <b>120 est la distance administrative</b>. La métrique est le 2e nombre de [120/1] : 1 saut.<br>• « Seule RIPv2 a la capacité de <b>chiffrer</b> les messages en MD5 » : MD5 sert à <b>authentifier</b> les annonces (prouver qu’elles viennent d’un routeur qui connaît la clé). Elles restent lisibles en clair.<br>• La capture « poison reverse avec métrique infinie » (R1 perd son LAN et l’annonce aussitôt à 16) montre en réalité une <b>mise à jour déclenchée</b> avec <b>route poisoning</b>. Le poison reverse, c’est renvoyer à 16 une route <b>apprise</b> du voisin.<br>• « hold-on-timer » : c’est le <b>hold-down timer</b> (temporisateur de retenue).<br>• « Pas de changement ! Vous avez une idée ? » : la réponse est simplement que R2 et R3 ne font pas encore de RIP. R1 envoie ses annonces, mais n’en reçoit aucune.</div>

<h3>6. Auto-summary et réseaux discontinus</h3>
<p>Par défaut (sur les IOS du cours), RIP <b>résume à la classe</b> les réseaux qu’il annonce sur une interface d’un autre réseau principal. Si R1, R2 et R3 ont chacun un LAN 172.16.<b>x</b>.0/24, séparés par des liaisons en 192.168.x.0, chacun annonce « 172.16.0.0/16 » : R1 reçoit deux fois 172.16.0.0/16 (de R2 et de R3) et répartit le trafic au hasard entre les deux. Le document le montre par des <code>traceroute</code> qui passent une fois par R2, une fois par R3.</p>
<div class="tip"><b>✔ Remède :</b> <code>version 2</code> et <code>no auto-summary</code> sur <b>tous</b> les routeurs. Vérification : <code>show ip protocols | section Automatic</code> → « Automatic network summarization is not in effect ». Sur un vrai routeur, l’ancienne route 172.16.0.0/16 reste visible jusqu’à expiration de ses temporisateurs (c’est pour ça qu’elle apparaît encore, à 00:02:17, dans la table du document).</div>

<h3>7. RIPng (RIP pour IPv6)</h3>
<ul><li><b>UDP 521</b>, multicast <b>FF02::9</b>, et les annonces partent de l’adresse <b>link-local</b> (les routes ont pour prochain saut une adresse FE80::…).</li>
<li>Il faut d’abord <code>ipv6 unicast-routing</code>. Puis RIPng s’active <b>par interface</b> (pas de commande network) :</li></ul>
<div class="demo dark">R1(config)#ipv6 unicast-routing
R1(config)#interface f0/0
R1(config-if)#ipv6 rip FORMATION enable
R1(config-if)#interface s0/0
R1(config-if)#ipv6 rip FORMATION enable
R1(config-if)#ipv6 rip FORMATION default-information originate   ← route par défaut, interface par interface
R1#show ipv6 route rip
R   2001:DB8:ACAD:2::/64 [120/2]
     via FE80::C002:1DFF:FEDC:0, Serial0/0</div>
<ul><li>Métrique : le routeur d’origine annonce ses réseaux à 1 et <b>celui qui reçoit ajoute 1</b>. Le LAN du voisin direct apparaît donc à <b>[120/2]</b>, là où RIP IPv4 affiche [120/1].</li>
<li>Pas de <code>passive-interface</code> en RIPng sur ces IOS : les annonces partent aussi vers les LAN.</li></ul>
<div class="warnbox"><b>⚠ Le nom après <code>ipv6 rip</code> n’est pas un système autonome :</b> le document parle de « nom de domaine… donné au système autonome » et dit qu’il « faut naturellement utiliser le même nom » partout. En fait, c’est le nom du <b>processus RIPng local</b> : il n’est pas transmis dans les annonces et peut différer d’un routeur à l’autre (garder le même nom reste une bonne habitude). Et FF02::9 est une adresse <b>multicast</b>, pas « de diffusion » : IPv6 n’a pas de broadcast.</div>

<h3>8. Le TP du 23/10 : ROUTAGE-RIP-Depart</h3>
<p>C’est le réseau de l’exercice 0 (bâtiment 1 avec RB1E0, RB1E1, RB1E2 et PB1 ; bâtiment 2 avec PB2 et RB2), plus un 7e routeur, <b>RouterInactif</b> (ISR 4331), qui relie directement le backbone BB (192.168.10.5) au réseau de RB2 (192.168.4.253). Une fois RIP actif partout, il offre un raccourci : depuis le bâtiment 1, 192.168.4.0/24 passe de <b>3 sauts</b> (PB1, PB2, RB2) à <b>1 saut</b>. Et s’il tombe, RIP revient tout seul sur l’ancien chemin : c’est l’intérêt du routage dynamique.</p>
`,
  questions: [
    /* ---------- Débutant ---------- */
    { id: 'rp1', lvl: 1, type: 'qcm', q: 'Quelle est la métrique utilisée par RIP ?',
      choices: ['Le nombre de sauts (routeurs à traverser)', 'Le coût, calculé à partir du débit', 'Le délai mesuré', 'La charge des liens'], good: 0,
      hints: ['« Hop count ».'],
      explain: 'RIP compte les <b>sauts</b>, sans regarder le débit des liens. C’est sa grande faiblesse face à OSPF.' },
    { id: 'rp2', lvl: 1, type: 'qcm', q: 'Combien de sauts RIP accepte-t-il au maximum, et que signifie une métrique de 16 ?',
      choices: ['15 sauts au maximum ; 16 = réseau inaccessible (infini)', '16 sauts au maximum ; 17 = infini', '255 sauts ; 16 = valeur par défaut', '30 sauts ; 16 = moitié du maximum'], good: 0,
      hints: ['La limite est petite exprès : elle borne le comptage à l’infini.'],
      explain: '<b>15</b> sauts au plus ; <b>16 = infini</b>. Un réseau annoncé à 16 est inaccessible : c’est le principe du route poisoning.' },
    { id: 'rp3', lvl: 1, type: 'qcm', q: 'Sur un routeur Cisco, quelle est la <b>distance administrative</b> de RIP ?',
      choices: ['120', '110', '1', '90'], good: 0,
      hints: ['C’est le premier nombre entre crochets dans [120/1].'],
      explain: '<b>120</b>. À comparer : connecté 0, statique 1, OSPF 110. Entre deux protocoles, la plus petite distance administrative gagne.' },
    { id: 'rp4', lvl: 1, type: 'match', q: 'Associe chaque temporisateur RIP de Cisco (show ip protocols) à sa valeur par défaut.',
      pairs: [['Sending updates every', '30 secondes'], ['Invalid after', '180 secondes'], ['Flushed after', '240 secondes']],
      hints: ['Une mise à jour toutes les 30 s ; 6 mises à jour manquées → route invalide.'],
      explain: 'Mises à jour toutes les <b>30 s</b>, route invalide au bout de <b>180 s</b> sans nouvelles (le hold down vaut aussi 180 s), supprimée au bout de <b>240 s</b>.' },
    /* ---------- Facile ---------- */
    { id: 'rp5', lvl: 2, type: 'multi', q: 'Qu’apporte RIPv2 par rapport à RIPv1 ? Coche tout ce qui convient.',
      choices: ['Le masque de sous-réseau dans les annonces (VLSM possible)', 'Des annonces en multicast 224.0.0.9 au lieu de la diffusion', 'L’authentification des annonces', 'L’adresse du prochain saut dans les annonces', 'Une métrique basée sur le débit', 'Une limite portée à 255 sauts'], good: [0, 1, 2, 3],
      hints: ['La métrique et la limite de 15 sauts n’ont pas bougé.'],
      explain: 'RIPv2 est <b>classless</b> (masques), parle en <b>multicast 224.0.0.9</b>, sait <b>authentifier</b> et transporte le <b>prochain saut</b>. Mais il compte toujours les sauts, avec 15 au maximum.' },
    { id: 'rp6', lvl: 2, type: 'text', q: 'Donne les ports UDP utilisés par :',
      fields: [{ label: 'RIP (v1 et v2)', kind: 'int', answer: 520 }, { label: 'RIPng', kind: 'int', answer: 521 }],
      hints: ['RIPng prend le port juste après.'],
      explain: 'RIP : <b>UDP 520</b>. RIPng : <b>UDP 521</b> (et multicast FF02::9).' },
    { id: 'rp7', lvl: 2, type: 'qcm', q: 'Que fait <code>passive-interface f0/0</code> sous <code>router rip</code> ?',
      choices: ['Le routeur n’envoie plus d’annonces RIP sur f0/0, mais continue d’écouter celles qu’il y reçoit, et le réseau de f0/0 reste annoncé ailleurs', 'f0/0 est désactivée (shutdown)', 'Le réseau de f0/0 n’est plus annoncé aux autres routeurs', 'Le routeur n’accepte plus aucun paquet sur f0/0'], good: 0,
      hints: ['Le document précise : « une interface passive n’envoie pas de mises à jour mais écoute ».'],
      explain: 'Passive = <b>muette mais pas sourde</b> en RIP. Le LAN de f0/0 continue d’être annoncé sur les autres interfaces. On l’utilise sur les LAN sans routeur.' },
    { id: 'rp8', lvl: 2, type: 'qcm', q: 'Sous <code>router rip</code>, quels réseaux déclare-t-on avec <code>network</code> ?',
      choices: ['Les réseaux directement connectés au routeur, en adresse de classe', 'Tous les réseaux de l’entreprise', 'Les réseaux des routeurs voisins', 'Uniquement le réseau de la route par défaut'], good: 0,
      hints: ['Chaque routeur ne parle que de ce qu’il connaît directement ; les autres l’apprennent par RIP.'],
      explain: 'Ses <b>propres</b> réseaux. IOS les ramène à la classe : <code>network 172.16.1.0</code> devient <code>network 172.16.0.0</code> dans la running-config. Les réseaux des voisins arriveront par leurs annonces.' },
    /* ---------- Moyen ---------- */
    { id: 'rp9', lvl: 3, type: 'qcm', q: 'Qu’est-ce que le <b>split horizon</b> ?',
      choices: ['Ne jamais annoncer une route sur l’interface par laquelle on l’a apprise', 'Annoncer chaque route à 16 sur toutes les interfaces', 'Couper le réseau en deux zones', 'Envoyer la moitié de la table toutes les 15 secondes'], good: 0,
      hints: ['« Horizon partagé » : on ne raconte pas à quelqu’un ce qu’il vient de nous dire.'],
      explain: 'Ne <b>jamais renvoyer</b> une information à celui qui nous l’a donnée : ça casse les boucles entre deux routeurs. La variante <b>poison reverse</b> la renvoie, mais à 16.' },
    { id: 'rp10', lvl: 3, type: 'text', q: '<b>Triangle du document</b> (R1, R2, R3 reliés deux à deux, chacun avec son LAN). Dans la table de R1 :',
      fields: [{ label: 'métrique vers le LAN de R2 (192.168.2.0/24)', kind: 'int', answer: 1 }, { label: 'nombre de chemins vers 192.168.23.0/24 (liaison R2-R3)', kind: 'int', answer: 2 }],
      hints: ['R2 est un voisin direct.', 'La liaison R2-R3 est à 1 saut par R2 comme par R3.'],
      explain: 'LAN de R2 : <b>1</b> saut. 192.168.23.0 : R2 et R3 l’annoncent tous deux à 1 saut, donc <b>2</b> chemins de même coût ; IOS garde les deux et répartit la charge (la 2e ligne, sans préfixe, dans show ip route).' },
    { id: 'rp11', lvl: 3, type: 'qcm', q: 'Dans le document, après avoir configuré RIP sur <b>R1 seulement</b>, la table de R1 ne change pas : « Pas de changement ! Vous avez une idée ? ». La réponse :',
      choices: ['R2 et R3 ne font pas encore de RIP : R1 envoie ses annonces mais n’en reçoit aucune', 'Il faut redémarrer R1', 'RIP met 240 secondes avant d’envoyer sa première annonce', 'La commande network est fausse sur toutes les lignes'], good: 0,
      hints: ['Regarde la section « Routing Information Sources » de show ip protocols juste après : elle est vide.'],
      explain: 'Pour apprendre une route, il faut un <b>voisin qui l’annonce</b>. Le debug ip rip de R1 montre des « sending » mais aucun « received » : d’où la suite du document, qui active RIP sur R2 et R3.' },
    { id: 'rp12', lvl: 3, type: 'match', q: 'Associe chaque commande à ce qu’elle montre.',
      pairs: [['show ip protocols', 'Version, temporisateurs, réseaux annoncés, interfaces passives, voisins'], ['show ip route rip', 'Les routes apprises par RIP installées dans la table'], ['show ip rip database', 'Toutes les routes connues de RIP, y compris les résumés'], ['debug ip rip', 'Les annonces envoyées et reçues, en direct']],
      hints: ['debug = en direct ; database = la base de RIP ; protocols = les réglages.'],
      explain: '<code>show ip protocols</code> pour la configuration, <code>show ip route rip</code> pour les routes utilisées, <code>show ip rip database</code> pour la base complète, <code>debug ip rip</code> pour voir passer les annonces (et <code>undebug all</code> pour l’arrêter).' },
    /* ---------- Difficile ---------- */
    { id: 'rp13', lvl: 4, type: 'qcm', q: '<b>Esprit critique.</b> Le document affirme : « R 192.168.2.0/24 [120/1]… La métrique de 120 est bien celle par défaut de RIP. » Qu’en penses-tu ?',
      choices: ['C’est faux : 120 est la distance administrative ; la métrique est 1 (un saut)', 'C’est juste : la métrique par défaut de RIP vaut 120', 'C’est faux : 120 est le temporisateur de suppression', 'C’est faux : 120 est le numéro de port'], good: 0,
      hints: ['[distance administrative / métrique].'],
      explain: 'Entre crochets : <b>[distance administrative / métrique]</b>. 120 = la confiance accordée à RIP par IOS ; 1 = le nombre de sauts.' },
    { id: 'rp14', lvl: 4, type: 'qcm', q: 'Le document configure R1 avec <code>network 172.16.1.0</code>, alors que son LAN est 192.168.1.0/24 (première topologie). Conséquence si on tape ça tel quel ?',
      choices: ['R1 n’annonce pas son LAN 192.168.1.0 : aucune interface n’est dans 172.16.0.0, la ligne ne sert à rien', 'R1 annonce son LAN en 172.16.1.0', 'IOS refuse la commande', 'Tout fonctionne, network n’a pas d’importance en RIPv1'], good: 0,
      hints: ['La commande network sert à choisir les interfaces qui participent à RIP.'],
      explain: '<code>network</code> active RIP sur les interfaces dont l’adresse est dans ce réseau (de classe) et annonce leurs réseaux. Aucune interface en 172.16.x → le LAN 192.168.1.0 reste inconnu des autres. C’est une coquille : le show ip protocols du document affiche bien 192.168.1.0.' },
    { id: 'rp-lab-inactif', lvl: 4, type: 'pt', topo: 'RIP-Depart', file: 'ROUTAGE-RIP-Depart.pkt', tag: 'RIP',
      q: '<b>TP du 23/10 (ROUTAGE-RIP-Depart).</b> RIP v2 tourne déjà sur les 6 routeurs habituels (c’est le labo RIP du module 7). Le 7e routeur, <b>RouterInactif</b> (G0/0/0 = 192.168.10.5 sur le backbone BB, G0/0/1 = 192.168.4.253 sur le réseau de RB2), ne fait pas encore de RIP.<br>1. Intègre RouterInactif au routage RIP, et regarde la table de RB1E2 avant et après.<br>2. Rends passives les interfaces LAN des 3 routeurs d’étage (Fa0/0 de RB1E0, RB1E1, RB1E2) : il n’y a que des PC derrière.<br>3. Vérifie le nouveau chemin avec un <code>tracert</code> de PC0 (192.168.3.1) vers PC6 (192.168.4.1).',
      build: function () {
        var n = LAB.topo('RIP-Depart');
        Object.keys(RIP6).forEach(function (r) { LAB.cli(n, r, rip(RIP6[r])); });
        return LAB.save(n);
      },
      tasks: [
        { label: 'RB1E2 joint 192.168.4.0/24 en 1 saut via RouterInactif (192.168.10.5)', check: function (n) { return ripRoute(n, 'RB1E2', '192.168.4.0/24', '192.168.10.5', 1); } },
        { label: 'RB2 joint le LAN de l’étage 0 (192.168.1.0/24) en 2 sauts via RouterInactif', check: function (n) { return ripRoute(n, 'RB2', '192.168.1.0/24', '192.168.4.253', 2); } },
        { label: 'Fa0/0 est passive sur RB1E0, RB1E1 et RB1E2', check: function (n) { return ['RB1E0', 'RB1E1', 'RB1E2'].every(function (r) { return passive(n, r, 'FastEthernet0/0'); }); } },
        { label: 'tracert PC0 → PC6 : un seul routeur après RB1E2 (192.168.10.5)', check: function (n) { return trace(n, 'PC0', '192.168.4.1') === '192.168.3.254 > 192.168.10.5 > 192.168.4.1'; } }
      ],
      hints: ['Avant : sur RB1E2, <code>show ip route rip</code> montre 192.168.4.0/24 [120/<b>3</b>] via 192.168.10.4 (PB1).', 'RouterInactif : <code>router rip</code>, <code>version 2</code> (sinon les autres, en v2, ignorent ses annonces), <code>network 192.168.10.0</code>, <code>network 192.168.4.0</code>, <code>no auto-summary</code>.', 'Sur chaque routeur d’étage : <code>router rip</code> puis <code>passive-interface fa0/0</code>. Surtout pas sur Fa0/1 de RB2 : RouterInactif est sur ce réseau !'],
      solution: [
        { dev: 'RouterInactif', cli: rip(['192.168.10.0', '192.168.4.0']) },
        { dev: 'RB1E0', cli: ['conf t', 'router rip', 'passive-interface fa0/0', 'end'] },
        { dev: 'RB1E1', cli: ['conf t', 'router rip', 'passive-interface fa0/0', 'end'] },
        { dev: 'RB1E2', cli: ['conf t', 'router rip', 'passive-interface fa0/0', 'end'] }
      ],
      explain: 'Dès que RouterInactif annonce ses réseaux, RB1E2 remplace 192.168.4.0/24 [120/3] via PB1 par <b>[120/1] via 192.168.10.5</b>, et 192.168.11.0/24 obtient <b>deux</b> chemins à 2 sauts (via PB1 et via RouterInactif). Pour voir la convergence dans l’autre sens, fais un <code>shutdown</code> sur G0/0/0 de RouterInactif : la route repasse à 3 sauts par PB1. Les interfaces passives n’enlèvent rien aux tables : les LAN des étages restent annoncés, simplement les PC ne reçoivent plus d’annonces RIP.' },
    { id: 'rp16', lvl: 4, type: 'text', q: 'D’après la RFC 1058, un message RIP contient au plus combien d’entrées de route, et quelle est sa taille maximale (en octets, sans les en-têtes IP et UDP) ?',
      fields: [{ label: 'entrées de route', kind: 'int', answer: 25 }, { label: 'taille maximale (octets)', kind: 'int', answer: 512 }],
      hints: ['Chaque entrée fait 20 octets, l’en-tête 4.', 'La RFC fixe une limite ronde, en puissance de 2.'],
      explain: '<b>25 entrées</b> de 20 octets + 4 octets d’en-tête = 504 octets, sous la limite de <b>512 octets</b>. Une grosse table part donc en plusieurs messages.' },
    /* ---------- Extrême ---------- */
    { id: 'rp17', lvl: 5, type: 'qcm', q: 'Le document coupe le LAN de R1 et capture aussitôt une annonce de R1 vers R2 avec 192.168.1.0 à la métrique 16, envoyée 9 s après la mise à jour périodique. Il appelle ça du « poison reverse ». Quel est le bon nom ?',
      choices: ['Une mise à jour déclenchée (triggered update) avec route poisoning', 'Du poison reverse, le document a raison', 'Du split horizon', 'Une expiration du temporisateur invalid'], good: 0,
      hints: ['Poison reverse = renvoyer à 16 une route qu’on a apprise du voisin. Ici, d’où vient 192.168.1.0 ?'],
      explain: '192.168.1.0 est le réseau <b>de R1</b>, pas une route apprise de R2. R1 l’annonce à 16 (<b>route poisoning</b>) immédiatement, sans attendre les 30 s (<b>triggered update</b>). Le poison reverse, ce serait R2 renvoyant à R1 une route apprise de R1, avec la métrique 16.' },
    { id: 'rp18', lvl: 5, type: 'qcm', q: 'LAN 172.16.1.0/24 sur R1, 172.16.2.0/24 sur R2, 172.16.3.0/24 sur R3, liaisons en 192.168.x.0. RIPv2 avec ses réglages par défaut. Pourquoi R1 a-t-il « 172.16.0.0/16 » via R2 <b>et</b> via R3 ?',
      choices: ['L’auto-summary : R2 et R3 résument leur LAN à la classe (172.16.0.0/16) en l’annonçant sur les liaisons 192.168', 'RIPv2 ne transporte pas les masques', 'R1 a mal configuré son LAN', 'C’est la route par défaut'], good: 0,
      hints: ['Le résumé se fait quand on annonce un réseau sur une interface d’un autre réseau principal.'],
      explain: 'Avec l’<b>auto-summary</b>, un réseau 172.16.x.0/24 annoncé vers 192.168.x devient 172.16.0.0/16. R1 reçoit ce même résumé de R2 et de R3 et répartit le trafic entre les deux, sans savoir lequel cache 172.16.2.0. Remède : <code>no auto-summary</code> partout.' },
    { id: 'rp-lab-resume', lvl: 5, type: 'pt', file: 'RIP-reseaux-discontinus.pkt', tag: 'RIP',
      q: '<b>Réseaux discontinus (document « Configuration Routage RIP », §f).</b> Trois routeurs en triangle (liaisons série 192.168.12.0, 192.168.13.0 et 192.168.23.0), chacun avec un LAN en 172.16.x.0/24 et un PC. RIP v2 est configuré partout… avec ses réglages par défaut.<br>Regarde <code>show ip route</code> sur R1, puis fais un <code>tracert</code> de PC1 vers PC3 (172.16.3.10) : il fait un détour ! Corrige la configuration pour que chaque routeur connaisse les trois LAN séparément et que le trafic aille au plus court.',
      build: function () {
        return LAB.make({
          devices: [['R1', 'Router-PT', 160, 170], ['R2', 'Router-PT', 620, 170], ['R3', 'Router-PT', 390, 380], ['PC1', 'PC-PT', 160, 40], ['PC2', 'PC-PT', 620, 40], ['PC3', 'PC-PT', 390, 510]],
          links: [['R1', 'Serial2/0', 'R2', 'Serial3/0', 'serial'], ['R1', 'Serial3/0', 'R3', 'Serial2/0', 'serial'], ['R2', 'Serial2/0', 'R3', 'Serial3/0', 'serial'],
            ['PC1', 'FastEthernet0', 'R1', 'FastEthernet0/0', 'cross'], ['PC2', 'FastEthernet0', 'R2', 'FastEthernet0/0', 'cross'], ['PC3', 'FastEthernet0', 'R3', 'FastEthernet0/0', 'cross']],
          notes: [[40, 600, 'R1 : 172.16.1.254 · S2/0 192.168.12.1 · S3/0 192.168.13.2 — R2 : 172.16.2.254 · S2/0 192.168.23.1 · S3/0 192.168.12.2 — R3 : 172.16.3.254 · S2/0 192.168.13.1 · S3/0 192.168.23.2']],
          cli: {
            R1: tri('R1', '172.16.1.254', '192.168.12.1', '192.168.13.2', ['172.16.0.0', '192.168.12.0', '192.168.13.0']),
            R2: tri('R2', '172.16.2.254', '192.168.23.1', '192.168.12.2', ['172.16.0.0', '192.168.12.0', '192.168.23.0']),
            R3: tri('R3', '172.16.3.254', '192.168.13.1', '192.168.23.2', ['172.16.0.0', '192.168.13.0', '192.168.23.0'])
          },
          hosts: { PC1: { ip: '172.16.1.10', mask: '255.255.255.0', gw: '172.16.1.254' }, PC2: { ip: '172.16.2.10', mask: '255.255.255.0', gw: '172.16.2.254' }, PC3: { ip: '172.16.3.10', mask: '255.255.255.0', gw: '172.16.3.254' } }
        });
      },
      tasks: [
        { label: 'R1 connaît 172.16.2.0/24 via R2 et 172.16.3.0/24 via R3', check: function (n) { return ripRoute(n, 'R1', '172.16.2.0/24', '192.168.12.2') && ripRoute(n, 'R1', '172.16.3.0/24', '192.168.13.1'); } },
        { label: 'R2 et R3 connaissent eux aussi chacun des autres LAN en /24', check: function (n) { return ripRoute(n, 'R2', '172.16.1.0/24', '192.168.12.1') && ripRoute(n, 'R2', '172.16.3.0/24', '192.168.23.2') && ripRoute(n, 'R3', '172.16.1.0/24', '192.168.13.2') && ripRoute(n, 'R3', '172.16.2.0/24', '192.168.23.1'); } },
        { label: 'tracert PC1 → PC3 passe directement par R3', check: function (n) { return trace(n, 'PC1', '172.16.3.10') === '172.16.1.254 > 192.168.13.1 > 172.16.3.10'; } },
        { label: 'tracert PC2 → PC1 passe directement par R1', check: function (n) { return trace(n, 'PC2', '172.16.1.10') === '172.16.2.254 > 192.168.12.1 > 172.16.1.10'; } }
      ],
      hints: ['Sur R1, <code>show ip route</code> : « R 172.16.0.0/16 » via 192.168.12.2 et via 192.168.13.1. Le /16 est un <b>résumé</b>.', '<code>show ip protocols</code> : « Automatic network summarization is in effect ».', 'Sur les <b>trois</b> routeurs : <code>router rip</code> puis <code>no auto-summary</code>.'],
      solution: [
        { dev: 'R1', cli: ['conf t', 'router rip', 'no auto-summary', 'end'] },
        { dev: 'R2', cli: ['conf t', 'router rip', 'no auto-summary', 'end'] },
        { dev: 'R3', cli: ['conf t', 'router rip', 'no auto-summary', 'end'] }
      ],
      explain: 'Avec l’auto-summary, chaque routeur annonce « 172.16.0.0/16 » sur ses liaisons 192.168 : R1 reçoit deux résumés identiques et envoie tout le 172.16 vers le premier (R2), d’où le détour PC1 → R2 → R3 → PC3. Sur un vrai routeur, le trafic serait réparti entre les deux chemins, d’où les traceroutes qui alternent dans le document. Après <code>no auto-summary</code> sur les trois routeurs, les /24 circulent tels quels : 172.16.0.0/24 « is subnetted, 3 subnets », et chaque LAN est à 1 saut.' },
    { id: 'rp20', lvl: 5, type: 'qcm', q: 'En RIPng, R2 affiche le LAN de son voisin direct R1 avec <b>[120/2]</b>, alors qu’en RIP IPv4 le LAN d’un voisin direct est à [120/1]. Pourquoi ?',
      choices: ['R1 annonce ses réseaux à 1 et, en RIPng, le routeur qui reçoit ajoute 1', 'RIPng compte 2 sauts par liaison série', 'R2 passe par R3 pour joindre R1', 'C’est une erreur d’affichage de l’IOS'], good: 0,
      hints: ['Le debug du document montre R1 annonçant 2001:DB8:ACAD:1::/64 avec metric=1.'],
      explain: 'R1 annonce son LAN à <b>1</b> et R2, à la réception, ajoute le coût de son interface (1) : <b>2</b>. En RIP IPv4 sur Cisco, l’incrément est déjà compté à l’émission et le voisin installe 1. Conséquence pratique : en RIPng, une métrique de 2 = le voisin direct.' },
    /* ---------- Impossible ---------- */
    { id: 'rp21', lvl: 6, type: 'multi', q: '<b>Esprit critique sur la partie RIPng du document.</b> Quelles affirmations sont <b>fausses</b> ?',
      choices: ['« Le nom après ipv6 rip correspond au nom logique donné au système autonome »', '« Il faut naturellement utiliser le même nom de domaine sur les autres routeurs »', '« RIPng utilise l’adresse de diffusion FF02::9 »', '« RIPng utilise le port UDP 521 »', '« Les annonces RIPng partent de l’adresse link-local du routeur »'], good: [0, 1, 2],
      hints: ['Deux affirmations sont exactes : le port et l’adresse source.'],
      explain: 'Le nom est celui du <b>processus RIPng local</b>, pas d’un système autonome, et il n’a <b>pas besoin</b> d’être identique sur les voisins (il ne circule pas). FF02::9 est un groupe <b>multicast</b> (IPv6 n’a pas de diffusion). Le port 521 et la source link-local sont justes.' },
    { id: 'rp22', lvl: 6, type: 'qcm', q: 'Un routeur en <b>RIPv1</b> reçoit l’annonce « 172.16.5.0, métrique 1 » sur son interface 192.168.12.1/24. Quel masque suppose-t-il ?',
      choices: ['255.255.0.0 : le réseau annoncé n’est pas de la même classe que l’interface, il prend le masque de classe B', '255.255.255.0 : le masque de l’interface de réception', '255.255.255.255 : une route d’hôte', 'Il ignore l’annonce'], good: 0,
      hints: ['RIPv1 ne transporte aucun masque : il applique deux règles (rappelées dans le document).'],
      explain: 'Règle RIPv1 : même réseau de classe que l’interface → masque de l’interface ; sinon → <b>masque de la classe</b>. 172.16 est en classe B : le routeur installe <b>172.16.0.0/16</b>. C’est ce qui rend les réseaux discontinus impossibles en RIPv1.' },
    { id: 'rp23', lvl: 6, type: 'qcm', q: '<b>TP RIP-Depart.</b> Un camarade met <code>passive-interface fa0/1</code> sur <b>RB2</b> « parce que c’est son LAN ». Or RouterInactif est aussi sur ce réseau (192.168.4.253). Que se passe-t-il ?',
      choices: ['RouterInactif n’entend plus RB2 : il joint 192.168.11.0/24 en 2 sauts via PB1 au lieu d’1 saut via RB2 ; RB2, lui, apprend toujours les routes de RouterInactif', 'Plus personne ne joint 192.168.4.0/24', 'RB2 n’apprend plus rien de RouterInactif', 'Rien du tout : passive-interface ne change jamais aucune route'], good: 0,
      hints: ['Passive = muette, mais pas sourde.'],
      explain: 'RB2 n’envoie plus d’annonces sur Fa0/1, mais <b>écoute</b> toujours : il garde les routes apprises de RouterInactif. RouterInactif, lui, ne reçoit plus 192.168.11.0/24 de RB2 et ne l’apprend que via le backbone : [120/2] via 192.168.10.4. Règle : passive uniquement sur un LAN <b>sans autre routeur</b>.' },
    { id: 'rp24', lvl: 6, type: 'text', q: 'Une route RIP ne reçoit plus aucune mise à jour. Au bout de combien de secondes (depuis la dernière mise à jour) est-elle supprimée :',
      fields: [{ label: 'sur un routeur Cisco (flush)', kind: 'int', answer: 240 }, { label: 'selon la RFC 1058 (timeout + ramassage des déchets)', kind: 'int', answer: 300 }],
      hints: ['Cisco : « flushed after … » dans show ip protocols.', 'RFC : 180 s de timeout, puis 120 s de ramassage des déchets.'],
      explain: 'Cisco : <b>240 s</b> (invalide à 180 s, supprimée à 240 s). RFC 1058 : invalide à 180 s, puis encore 120 s avant suppression, soit <b>300 s</b>. Deux réponses justes chacune dans son contexte : précise toujours la référence.' }
  ]
  });
})();
