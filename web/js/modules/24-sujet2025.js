(function () {
  var RT_COLS = [{ h: 'RÉSEAU DESTINATION', kind: 'cidr', w: 170 }, { h: 'PASSERELLE', kind: 'ip', w: 150 }, { h: 'INTERFACE', kind: 'ip', w: 150 }];
  function row(net, gw, itf) { return [{ a: net }, { a: gw }, { a: itf }]; }
  /* le sujet ne donne pas l'adresse du modem : toute adresse libre de 213.30.180.96/28 convient */
  function modem(v) {
    v = String(v).trim();
    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(v)) return false;
    var x = NET.ip2int(v), base = NET.ip2int('213.30.180.96');
    if (x == null || x - base < 1 || x - base > 14) return false;
    return ['213.30.180.97', '213.30.180.100', '213.30.180.101', '213.30.180.102'].indexOf(v) < 0;
  }
  var OUI = ['oui', 'o'], NON = ['non', 'n'];
  /* labo : le site de Lille après la restructuration */
  var LILLE_PC = ['ADM-A', 'PROD-A', 'ADM-N', 'PROD-N'];
  function inRange(n, dev, a, b) { var h = n.dev(dev).host; return h.ip != null && h.ip >= NET.ip2int(a) && h.ip <= NET.ip2int(b); }
  function sub(n, dev, vlan, ip) { return n.dev(dev).ifaces.filter(function (i) { return i.encap && i.encap.vlan === vlan && i.ip === NET.ip2int(ip) && i.len === 24; })[0]; }
  var SW_LILLE = ['conf t', 'vlan 3', 'name ADMINISTRATIF', 'vlan 6', 'name PRODUCTION', 'interface fa0/1', 'switchport mode access', 'switchport access vlan 3', 'interface fa0/2', 'switchport mode access', 'switchport access vlan 6', 'interface g0/2', 'switchport mode trunk', 'end'];

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'sujet2025', num: 24, icon: '📝', titre: 'Sujet d’évaluation 2025 corrigé',
  sous: 'QCM, DHCP en /22, VLSM, IPv6, tables de routage, OSPF, VLAN et relais, étude de cas Armatis-LC',
  source: 'sujet imt-blanc.pdf (dossier « Exemple de sujets d’évaluation »)',
  cours: `
<h3>1. Le sujet en un coup d’œil</h3>
<table><tr><th>Partie</th><th>Ce qu’on te demande</th><th>Modules à réviser</th></tr>
<tr><td>QCM (18 questions)</td><td>OSI, protocoles, adresses réseau / diffusion, ARP, VLAN</td><td>2, 5, 6, 8, 15, 16</td></tr>
<tr><td>Exercice 2</td><td>réservation DHCP en /22, plan VLSM, IPv6 compacté / étendu, IPv4 contre IPv6</td><td>6, 9, 14</td></tr>
<tr><td>Exercice 3</td><td>tables de routage d’un pare-feu et d’un commutateur de niveau 3</td><td>7</td></tr>
<tr><td>Exercice 4</td><td>choix d’un routage adaptatif, VLAN entre deux bâtiments, DHCP et relais, HSRP</td><td>8, 9, 16, 23</td></tr>
<tr><td>Étude de cas Armatis-LC</td><td>IPv6, DNS (round-robin, AAAA), table d’un pare-feu, tolérance de panne, nouveau réseau</td><td>10, 14, 16, 9</td></tr></table>
<div class="tip"><b>✔ Méthode :</b> pour chaque adresse, écris le masque en binaire ou trouve le « pas » (256 − octet du masque) avant de répondre. Dans les questions ouvertes, <b>justifie toujours</b> et signale les incohérences de l’énoncé : un correcteur valorise un « l’énoncé dit R6, il s’agit de R5 ».</div>

<h3>2. Corrigé du QCM</h3>
<table><tr><th>N°</th><th>Réponse(s)</th><th>Pourquoi</th></tr>
<tr><td>1</td><td>1 et 3</td><td>7 couches ; la couche N rend des services à N+1 (et utilise ceux de N−1, donc la 5 est fausse)</td></tr>
<tr><td>2</td><td>UDP, TCP</td><td>STP est en couche 2, ICMP en couche 3, ARP entre 2 et 3</td></tr>
<tr><td>3</td><td>les ports</td><td>l’en-tête UDP : ports, longueur, somme de contrôle. IP = couche 3, ACK et séquence = TCP, MAC = couche 2</td></tr>
<tr><td>4 et 11</td><td>STP</td><td>la même question posée deux fois (seuls les choix changent)</td></tr>
<tr><td>5</td><td>HSRP</td><td>redondance de la passerelle</td></tr>
<tr><td>6</td><td>1, 3, 4</td><td>en /23, 192.168.0.255 est une adresse d’hôte (diffusion : 192.168.1.255)</td></tr>
<tr><td>7</td><td>1, 2, 3</td><td>192.168.1.128/24 n’est pas une adresse réseau (le réseau est 192.168.1.0)</td></tr>
<tr><td>8</td><td>192.168.1.64/26</td><td>pas de 64 : 0, 64, 128… ; 66 est dans le bloc 64</td></tr>
<tr><td>9</td><td>2 et 4</td><td>IP de destination = SWITCH_B (destination finale), MAC de destination = RouterA (la passerelle)</td></tr>
<tr><td>10</td><td>OSPF, RIP</td><td>HSRP est une redondance de passerelle, TCP un protocole de transport</td></tr>
<tr><td>12</td><td>1 et 4</td><td>en /16, la diffusion est 192.168.255.255 ; 192.168.1.255/16 est un hôte</td></tr>
<tr><td>13</td><td>2 et 3</td><td>192.168.1.255/23 (bloc 192.168.0.0 à 192.168.1.255) et 192.168.0.31/27</td></tr>
<tr><td>14</td><td>1 et 3</td><td>192.168.1.128/8 est dans le réseau 192.0.0.0</td></tr>
<tr><td>15</td><td>2 et 4</td><td>192.168.1.0/16 → réseau 192.168.0.0 ; 10.1.0.0/8 → réseau 10.0.0.0</td></tr>
<tr><td>16</td><td>192.168.0.0/23</td><td>pas de 2 sur le 3e octet : 192.168.0.0 à 192.168.1.255</td></tr>
<tr><td>17</td><td>ARP, ICMP, IP, DNS</td><td>ARP (passerelle ou DNS), requête DNS (UDP, dans IP), puis ping ICMP (dans IP). Pas de TCP</td></tr>
<tr><td>18</td><td>3 et 4</td><td>le lien SW1-SW2 (port 24) et G0/0 de R1 (router-on-a-stick) transportent VLAN 10 et 20 ; le port de SW1 vers R1 doit l’être aussi, mais il n’est pas proposé</td></tr></table>
<div class="warnbox"><b>⚠ Piège de mise en page :</b> sous les questions 12 à 15, le sujet a des « 1. », « 2. », « 3. », « 4. » isolés. Ce sont des restes de numérotation automatique, <b>pas des réponses</b> (la « réponse » 1 de la question 14 serait d’ailleurs incomplète).</div>

<h3>3. Exercice 2</h3>
<h4>Question 1 : la réservation DHCP en /22</h4>
<p>Masque 255.255.252.0 (/22) : le réseau va de <b>192.168.4.0</b> (adresse réseau) à <b>192.168.7.255</b> (diffusion). Toutes les adresses entre les deux sont des adresses d’hôte, y compris celles qui « finissent par 0 ou 255 » comme 192.168.4.255 ou 192.168.5.0 : c’est <b>le</b> piège de la question.</p>
<table><tr><th>Adresse</th><th>Hôte valide et libre ?</th><th>Justification</th></tr>
<tr><td>192.168.4.0</td><td>non</td><td>adresse du réseau</td></tr>
<tr><td>192.168.4.10</td><td>non</td><td>déjà prise par le serveur DHCP</td></tr>
<tr><td>192.168.4.100</td><td>oui</td><td>dans l’étendue : il faut qu’elle ne soit pas déjà louée</td></tr>
<tr><td>192.168.4.230</td><td>oui</td><td>hors étendue mais dans le réseau</td></tr>
<tr><td>192.168.4.255</td><td>oui</td><td>en /22 ce n’est <b>pas</b> une diffusion</td></tr>
<tr><td>192.168.5.0</td><td>oui</td><td>en /22 ce n’est <b>pas</b> une adresse réseau</td></tr>
<tr><td>192.168.5.255</td><td>oui</td><td>idem</td></tr>
<tr><td>192.168.8.1</td><td>non</td><td>hors du réseau (192.168.8.0/22, celui du DNS2)</td></tr></table>
<div class="memo"><b>📌 Dans l’étendue ou hors étendue ?</b> Ça dépend du serveur, et le sujet ne le précise pas. Avec le DHCP de <b>Windows Server</b>, une réservation se prend <b>dans la plage</b> de l’étendue (seule 192.168.4.100 conviendrait). Avec d’autres serveurs (Cisco, ISC), on prend au contraire une adresse <b>hors du pool</b> pour éviter qu’elle soit distribuée à quelqu’un d’autre. Écris la règle que tu appliques : c’est la justification qui rapporte les points.</div>
<h4>Question 2 : le plan VLSM de 172.32.32.0/24</h4>
<p>On alloue du <b>plus gros besoin au plus petit</b>, en prenant à chaque fois le plus petit bloc suffisant (que les besoins soient des « adresses » ou des « hôtes », on tombe sur les mêmes blocs) :</p>
<table><tr><th>Réseau (besoin)</th><th>Adresse</th><th>Masque</th><th>Première</th><th>Dernière</th></tr>
<tr><td>Réseau4 (120)</td><td>172.32.32.0</td><td>/25 (255.255.255.128)</td><td>.1</td><td>.126</td></tr>
<tr><td>Réseau2 (30)</td><td>172.32.32.128</td><td>/27 (255.255.255.224)</td><td>.129</td><td>.158</td></tr>
<tr><td>Réseau1 (19)</td><td>172.32.32.160</td><td>/27</td><td>.161</td><td>.190</td></tr>
<tr><td>Réseau5 (12)</td><td>172.32.32.192</td><td>/28 (255.255.255.240)</td><td>.193</td><td>.206</td></tr>
<tr><td>Réseau6 (10)</td><td>172.32.32.208</td><td>/28</td><td>.209</td><td>.222</td></tr>
<tr><td>Réseau3 (5)</td><td>172.32.32.224</td><td>/29 (255.255.255.248)</td><td>.225</td><td>.230</td></tr></table>
<p>Total utilisé : 128 + 32 + 32 + 16 + 16 + 8 = 232 adresses ; il reste 172.32.32.232 à .255. Attention, 30 hôtes dans un /27, c’est <b>pile</b> : aucune marge.</p>
<div class="warnbox"><b>⚠ 172.32.32.0 n’est pas une adresse privée :</b> la plage privée de classe B est 172.16.0.0 à <b>172.31</b>.255.255. 172.32.x.x appartient à quelqu’un sur Internet : un vrai site ne devrait pas l’utiliser en interne (sans doute une coquille pour 172.31 ou 172.16).</div>
<h4>Questions 3 et 4 : IPv6</h4>
<ul><li>FC80:0000:0000:0000:00B1:0000:0000:0001 → <b>FC80::B1:0:0:1</b> (on compresse la <b>plus longue</b> suite de zéros, ici les 3 groupes, et une seule fois).</li>
<li>2001:0000:…:0001 → <b>2001::1</b>.</li>
<li>2001:0:0:A01::1 → <b>2001:0000:0000:0A01:0000:0000:0000:0001</b> (4 groupes écrits + 1 après le « :: », le « :: » vaut donc 3 groupes).</li>
<li><b>FC80:0B1:0:A1 n’est pas une adresse valide</b> : 4 groupes seulement et pas de « :: ». À signaler. Si l’on suppose FC80:0B1::A1, cela donne FC80:00B1:0000:0000:0000:0000:0000:00A1.</li></ul>
<h4>Question 5 : IPv4 contre IPv6</h4>
<table><tr><th></th><th>IPv4</th><th>IPv6</th></tr>
<tr><td>Adresses</td><td>32 bits, décimal pointé</td><td>128 bits, 8 groupes hexadécimaux</td></tr>
<tr><td>En-tête</td><td>20 à 60 octets, avec somme de contrôle</td><td>40 octets fixes + en-têtes d’extension, sans somme de contrôle</td></tr>
<tr><td>Durée de vie</td><td>TTL</td><td>Hop Limit</td></tr>
<tr><td>Diffusion</td><td>broadcast</td><td>pas de broadcast : multicast et anycast</td></tr>
<tr><td>Résolution d’adresse</td><td>ARP</td><td>NDP (ICMPv6)</td></tr>
<tr><td>Configuration</td><td>manuelle ou DHCP</td><td>manuelle, SLAAC, DHCPv6</td></tr>
<tr><td>Fragmentation</td><td>par l’émetteur ou les routeurs</td><td>par l’émetteur seulement</td></tr>
<tr><td>NAT</td><td>indispensable (pénurie d’adresses)</td><td>inutile en principe</td></tr></table>

<h3>4. Exercice 3 : PIX et commutateur de niveau 3</h3>
<p>Le PIX a trois interfaces : 213.30.180.97 (réseau public 213.30.180.96/28), 10.50.1.1 (DMZ 10.50.1.0/24) et 172.16.0.1 (VLAN 6, 172.16.0.0/24). Le commutateur de niveau 3 a une adresse dans chaque VLAN (toujours la <b>dernière</b> du réseau : .30, .62, .126, .14…) et 172.16.0.254 vers le PIX.</p>
<ul><li><b>PIX</b> : ses 3 réseaux connectés ; les 6 VLAN internes (192.168.1.0/27, 2.0/27, 3.0/25, 4.0/27, 5.0/26, 7.0/28) via <b>172.16.0.254</b> ; une route par défaut vers le <b>modem</b>… dont le sujet ne donne pas l’adresse (une adresse libre de 213.30.180.96/28, à préciser dans la copie).</li>
<li><b>Commutateur N3</b> : ses 7 réseaux connectés, et une <b>route par défaut vers 172.16.0.1</b>, qui couvre la DMZ et Internet.</li></ul>
<div class="warnbox"><b>⚠ Le résumé qui crée une boucle :</b> on pourrait remplacer les 6 routes du PIX par 192.168.0.0/21. Mais 192.168.0.0 et 192.168.6.0 n’existent pas : un paquet vers 192.168.6.10 irait au commutateur, qui n’a pas ce réseau et le renverrait au PIX par sa route par défaut… et ainsi de suite jusqu’à TTL 0. Si on résume, on ajoute sur le commutateur une route vers <code>null0</code> pour ce résumé.</div>

<h3>5. Exercice 4</h3>
<p><b>Question 1</b> : il faut un routage <b>dynamique</b> qui tienne compte du <b>débit</b> : <b>OSPF</b>. Avec la référence de 100 Mbit/s, une liaison de secours à 4 Mbit/s coûte 25, une liaison à 128 Mbit/s coûte 1 : R1 → R3 passe par R2 (coût 2) et ne prend le secours que si une liaison principale tombe. RIP (sauts) utiliserait la liaison de secours en permanence (1 saut contre 2). Mieux : <code>auto-cost reference-bandwidth</code> à 1000 ou plus sur tous les routeurs, et <code>bandwidth</code> réglé sur les interfaces série.</p>
<div class="warnbox"><b>⚠ Coquilles de la question 1 :</b> l’énoncé parle des liaisons « R1-R3 et R3-<b>R6</b> » : il n’y a pas de R6, c’est <b>R5</b>. Sur le schéma, l’adresse de R5 sur la liaison de secours est écrite « 192.168.<b>1</b>.22 » : c’est 192.168.<b>10</b>.22 (réseau 192.168.10.20/30, R3 = .21). Et la légende parle de « PL » pour les liaisons notées « LP ».</div>
<p><b>Question 2</b> (Lille) : administratifs et production sont dans les deux bâtiments → des <b>VLAN</b>. Sur les deux commutateurs : créer le VLAN administratif (192.168.3.0/24) et le VLAN production (192.168.6.0/24), affecter chaque port d’accès au bon VLAN, passer en <b>trunk 802.1Q</b> le lien entre les bâtiments et le port vers R4. Sur R4 : <b>router-on-a-stick</b>, deux sous-interfaces 802.1Q (192.168.3.1 et 192.168.6.1), et annonce du nouveau réseau 192.168.6.0/24 dans le protocole de routage.</p>
<p><b>Question 3</b> (DHCP) : garder l’étendue 192.168.3.0/24 (passerelle 192.168.3.1, DNS 192.168.3.4) et en créer une seconde pour <b>192.168.6.0/24</b> : par exemple 192.168.6.100 à .199, masque 255.255.255.0, passerelle <b>192.168.6.1</b>, DNS 192.168.3.4 (le même serveur). Service supplémentaire : un <b>relais DHCP</b> (<code>ip helper-address 192.168.3.3</code> sur la sous-interface 192.168.6.1 de R4), car les requêtes DHCP sont des diffusions qui ne traversent pas le routeur.</p>
<p><b>Question 4</b> (second routeur 192.168.3.2 / 192.168.6.2) : <b>HSRP</b> (ou VRRP) sur les deux routeurs, un groupe par VLAN, avec une <b>IP virtuelle</b> par réseau, une priorité plus haute et la préemption sur le routeur principal. L’IP virtuelle devient la passerelle : options « passerelle » des deux étendues DHCP et passerelle des serveurs fixes à modifier (ou bien on garde .1 comme IP virtuelle et on donne une autre adresse réelle à R4). Sur le nouveau routeur : sous-interfaces 802.1Q, relais DHCP sur le VLAN production, protocole de routage ; son port de commutateur en trunk.</p>
<div class="tip"><b>✔ Le détail qui fait la différence :</b> la « seconde liaison » (192.168.10.16/30, vers R5) est un <b>/30</b> : deux adresses seulement (R5 = .17, R4 = .18). Pour y brancher le nouveau routeur, on lui <b>donne</b> l’adresse .18, l’ancien routeur ne garde que la liaison 192.168.10.12/30 (vers R3) : on ne peut pas mettre trois équipements sur un /30.</div>

<h3>6. L’étude de cas Armatis-LC</h3>
<ul><li><b>Mission 1</b> : le réseau entre le Firewall BDN (94.125.168.126) et BDN R1 (.125) est <b>94.125.168.124/30</b>. DNS maître : 2001:52d9:1000:510::1 → <b>2001:52d9:1000:0510:0000:0000:0000:0001</b> (et sa link-local fe80::ca0a:a9ff:fec8:e8b4 → fe80:0000:0000:0000:ca0a:a9ff:fec8:e8b4) ; son réseau global : <b>2001:52d9:1000:510::/64</b>. Les deux interfaces du firewall (2001:52d9:1000:<b>500</b>::ffff/64 et 2001:52d9:1000:<b>510</b>::7e/64) sont dans des réseaux <b>différents</b> : les 64 premiers bits diffèrent (4e groupe 0500 contre 0510), ce qui est normal pour un équipement qui route entre deux réseaux.</li>
<li><b>Mission 2 et fin de la mission 5</b> (IPv6 dans le DNS) : ajouter des enregistrements <b>AAAA</b> : <code>www.armatis-lc.com. IN AAAA 2001:52d9:1000:510::3</code> et <code>… ::4</code> (round-robin en IPv6 aussi), et de préférence <code>ns1 … AAAA 2001:52d9:1000:510::1</code> et <code>ns2 … ::2</code>. Le CNAME extranet suit tout seul. Et surtout : <b>incrémenter le numéro de série</b> du SOA (2017060101 → 2017060102), sinon le DNS secondaire ne recopie pas la zone.</li>
<li><b>Mission 3</b> (table du firewall) : 94.125.168.124/30 et 94.125.168.128/25 connectés ; <b>172.16.0.0/16</b> (le WAN MPLS) via <b>94.125.168.253</b> (BDN R2) ; <b>route par défaut</b> via <b>94.125.168.125</b> (BDN R1). En IPv6 : les deux /64 connectés et ::/0 via 2001:52d9:1000:500::1.</li>
<li><b>Mission 4</b> (deux routeurs Internet) : HSRP ou <b>VRRP</b> (standard, utile si les routeurs sont de marques différentes) entre BDN R1 et R1-bis, côté firewall, avec une IP virtuelle ; la route par défaut du firewall pointe vers cette IP virtuelle ; priorité et préemption sur le routeur principal, suivi (<i>tracking</i>) de son lien Internet. Problème : le réseau firewall-routeur est un <b>/30</b> (2 adresses) ; il faut l’agrandir (un /29 : deux routeurs, l’IP virtuelle et le firewall).</li>
<li><b>Mission 5</b> (plateau technique) : le firewall route le nouveau réseau sur une nouvelle interface logique (VLAN dédié) : on tague le port du commutateur DMZ relié au firewall et le lien entre les deux commutateurs. DHCP sur 94.125.168.129 : étendue dans 192.168.1.0/24 avec au moins 35 adresses (par exemple .1 à .50), masque 255.255.255.0, passerelle <b>192.168.1.254</b> (la dernière adresse possible), DNS internes <b>94.125.168.129</b> et <b>.130</b>. Services en plus : un <b>relais DHCP</b> sur l’interface 192.168.1.254 (le serveur est dans un autre réseau), et les règles du firewall qui laissent passer DHCP (UDP 67/68) et DNS.</li></ul>
<div class="warnbox"><b>⚠ Les incohérences de l’étude de cas :</b> « Firewall <b>DBN</b> » (mission 3) au lieu de BDN ; « Domaine Name System » ; le texte annonce <b>35 postes</b>, le schéma et la contrainte DHCP en annoncent <b>30</b> (prévois au moins 35 adresses). « Adressage suffisant pour 30 postes » avec un /24 imposé : ne te lance pas dans un /27 (30 adresses, dont la passerelle : il n’en resterait que 29).</div>
`,
  questions: [
    /* ---------- Débutant ---------- */
    { id: 'sj1', lvl: 1, type: 'multi', q: '<b>QCM 1.</b> Lesquelles de ces affirmations sur le modèle OSI sont vraies ?',
      choices: ['Le modèle comporte 7 couches', 'La couche N corrige les erreurs engendrées dans la couche N+1', 'La couche N fournit des services à la couche N+1', 'Chaque couche est associée à un seul protocole', 'La couche N utilise les services fournis par la couche N+1'], good: [0, 2], noShuffle: true,
      hints: ['Une couche sert celle du dessus et s’appuie sur celle du dessous.'],
      explain: '7 couches ; la couche N rend des services à la couche <b>N+1</b> et utilise ceux de la couche <b>N−1</b>. Une couche peut avoir plusieurs protocoles (TCP et UDP en couche 4).' },
    { id: 'sj2', lvl: 1, type: 'multi', q: '<b>QCM 2.</b> Parmi ces protocoles, lesquels sont dans la couche 4 (transport) ?',
      choices: ['STP', 'ICMP', 'UDP', 'ARP', 'TCP'], good: [2, 4], noShuffle: true,
      hints: ['Transport = les protocoles qui ont des ports.'],
      explain: '<b>UDP et TCP</b>. STP agit en couche 2 (commutateurs), ICMP en couche 3 (transporté dans IP), ARP fait le lien entre les couches 2 et 3.' },
    { id: 'sj3', lvl: 1, type: 'qcm', q: '<b>QCM 4 et 11</b> (la même question, posée deux fois). Quel protocole évite la formation de tempêtes de diffusion dans un réseau commuté ?',
      choices: ['STP', 'HSRP', 'RIP', 'OSPF', 'SFTP', 'NOBROADCAST'], good: 0,
      hints: ['Les tempêtes viennent des boucles entre commutateurs.'],
      explain: '<b>STP</b> (Spanning Tree) bloque les liens en trop pour supprimer les boucles. NOBROADCAST n’existe pas, SFTP est un transfert de fichiers.' },
    { id: 'sj4', lvl: 1, type: 'qcm', q: '<b>QCM 5.</b> Lequel de ces protocoles met en œuvre la tolérance aux pannes de la passerelle dans un LAN ?',
      choices: ['HSRP', 'RIP', 'BGP', 'OSPF', 'TCP'], good: 0, noShuffle: true,
      hints: ['FHRP = First Hop Redundancy Protocol.'],
      explain: '<b>HSRP</b> : deux routeurs partagent une IP et une MAC virtuelles qui servent de passerelle aux PC.' },
    /* ---------- Facile ---------- */
    { id: 'sj5', lvl: 2, type: 'multi', q: '<b>QCM 3.</b> Lequel ou lesquels de ces éléments sont dans l’en-tête de couche 4 d’un datagramme <b>UDP</b> ?',
      choices: ['Les numéros de ports source et destination', 'Les adresses IP source et destination', 'Les ACK (accusés de réception)', 'Les adresses physiques', 'Le numéro de séquence'], good: [0], noShuffle: true,
      hints: ['L’en-tête UDP n’a que 4 champs.'],
      explain: 'Seulement les <b>ports</b> (avec longueur et somme de contrôle). Les adresses IP sont en couche 3, les MAC en couche 2, ACK et séquence n’existent qu’en TCP.' },
    { id: 'sj6', lvl: 2, type: 'qcm', q: '<b>QCM 8.</b> Quelle est l’adresse réseau de la machine 192.168.1.66/26 ?',
      choices: ['192.168.1.64/26', '192.168.1.0/26', '192.168.1.128/26', '192.168.1.0/24'], good: 0, noShuffle: true,
      hints: ['/26 → pas de 64 : 0, 64, 128, 192.'],
      explain: '66 est entre 64 et 127 : réseau <b>192.168.1.64/26</b>.' },
    { id: 'sj7', lvl: 2, type: 'multi', q: '<b>QCM 10.</b> On vous demande de mettre en place un routage dynamique. Quels protocoles pouvez-vous utiliser ?',
      choices: ['OSPF', 'RIP', 'HSRP', 'TCP'], good: [0, 1], noShuffle: true,
      hints: ['Deux protocoles de routage, un protocole de redondance, un protocole de transport.'],
      explain: '<b>OSPF</b> (état de liens) et <b>RIP</b> (vecteur de distance). HSRP ne calcule aucune route.' },
    { id: 'sj8', lvl: 2, type: 'text', q: '<b>Armatis-LC, mission 1.</b> Le firewall BDN a l’adresse 94.125.168.126/30 et le routeur BDN R1 94.125.168.125/30. Quelle est l’adresse du réseau qui les relie (notation CIDR) ?',
      kind: 'cidr', accept: '94.125.168.124/30',
      hints: ['/30 → blocs de 4 : …120, 124, 128…'],
      explain: '125 et 126 sont dans le bloc 124-127 : réseau <b>94.125.168.124/30</b> (diffusion .127). Un /30 n’a que deux adresses utilisables : ce détail compte à la mission 4.' },
    /* ---------- Moyen ---------- */
    { id: 'sj9', lvl: 3, type: 'multi', q: '<b>QCM 6.</b> Lesquelles sont des adresses de <b>diffusion</b> ?',
      choices: ['192.168.1.255/24', '192.168.0.255/23', '192.168.0.31/27', '192.168.0.63/26'], good: [0, 2, 3], noShuffle: true,
      hints: ['En /23, le bloc va de 192.168.0.0 à 192.168.1.255.'],
      explain: '.255 en /24 : oui. .31 en /27 (bloc 0-31) : oui. .63 en /26 (bloc 0-63) : oui. Mais 192.168.0.255/23 est au <b>milieu</b> du bloc 192.168.0.0-192.168.1.255 : c’est un hôte.' },
    { id: 'sj10', lvl: 3, type: 'multi', q: '<b>QCM 7.</b> Lesquelles sont des adresses <b>réseau</b> ?',
      choices: ['192.168.1.0/24', '192.168.1.128/25', '192.168.1.128/26', '192.168.1.128/24'], good: [0, 1, 2], noShuffle: true,
      hints: ['Une adresse réseau a tous ses bits d’hôte à 0.'],
      explain: '128 est un début de bloc en /25 (0, 128) et en /26 (0, 64, 128, 192). En /24, le réseau est 192.168.1.0 : 192.168.1.128/24 est un hôte.' },
    { id: 'sj11', lvl: 3, type: 'multi', q: '<b>QCM 9.</b> HostA (derrière RouterA) envoie un message à SWITCH_B (dans le réseau de ServerB, derrière RouterB). Quelles affirmations décrivent l’adressage généré par HostA ?',
      choices: ['Une trame avec l’adresse MAC de destination de SWITCH_B', 'Un paquet avec l’adresse IP de destination de SWITCH_B', 'Un paquet avec l’adresse IP de destination de RouterA', 'Une trame avec l’adresse MAC de destination de RouterA'], good: [1, 3], noShuffle: true,
      hints: ['L’IP vise la destination finale, la MAC le prochain saut.'],
      explain: 'IP de destination = <b>SWITCH_B</b> (son adresse de gestion) ; MAC de destination = <b>RouterA</b>, la passerelle de HostA. HostA ne connaît pas la MAC de SWITCH_B, qui est dans un autre réseau.' },
    { id: 'sj12', lvl: 3, type: 'multi', q: '<b>QCM 14.</b> Lesquelles sont des adresses réseau ?',
      choices: ['192.168.1.0/24', '192.168.1.128/24', '192.168.1.128/26', '192.168.1.128/8'], good: [0, 2], noShuffle: true,
      hints: ['Applique le masque : que deviennent les bits d’hôte ?'],
      explain: '192.168.1.0/24 et 192.168.1.128/26 : oui. En /24, le réseau de .128 est 192.168.1.0 ; en /8, c’est 192.0.0.0.' },
    { id: 'sj13', lvl: 3, type: 'qcm', q: '<b>QCM 16.</b> Quelle est l’adresse réseau de la machine 192.168.1.5/23 ?',
      choices: ['192.168.1.0/23', '192.168.0.0/23', '192.168.0.0/24', '192.168.1.0/24'], good: 1, noShuffle: true,
      hints: ['/23 → pas de 2 sur le 3e octet.'],
      explain: 'Blocs de 2 sur le 3e octet : 0-1, 2-3… 1 est dans le bloc 0 : <b>192.168.0.0/23</b>. 192.168.1.0/23 n’est pas une adresse réseau.' },
    { id: 'sj14', lvl: 3, type: 'text', q: '<b>Exercice 2, question 3.</b> Donne la forme compactée de :',
      fields: [{ label: 'FC80:0000:0000:0000:00B1:0000:0000:0001', kind: 'ip6s', answer: 'FC80::B1:0:0:1' }, { label: '2001:0000:0000:0000:0000:0000:0000:0001', kind: 'ip6s', answer: '2001::1' }],
      hints: ['Supprime les zéros de tête de chaque groupe.', 'Le « :: » remplace la PLUS LONGUE suite de groupes nuls, une seule fois.'],
      explain: 'FC80:0:0:0:B1:0:0:1 a deux suites de zéros (3 groupes, puis 2) : on compresse la plus longue → <b>FC80::B1:0:0:1</b>. Et <b>2001::1</b>.' },
    { id: 'sj15', lvl: 3, type: 'multi', q: '<b>Exercice 2, question 5.</b> Coche ce qui est vrai pour <b>IPv6</b> (par rapport à IPv4).',
      choices: ['Les adresses font 128 bits', 'Il n’y a plus de broadcast', 'ARP est remplacé par NDP (ICMPv6)', 'L’en-tête de base fait 40 octets et n’a pas de somme de contrôle', 'Les routeurs fragmentent les paquets trop gros', 'Le TTL est remplacé par un champ de même rôle, Hop Limit', 'Le NAT y est indispensable'], good: [0, 1, 2, 3, 5],
      hints: ['Deux affirmations décrivent IPv4.'],
      explain: '128 bits, pas de broadcast (multicast), NDP au lieu d’ARP, en-tête fixe de 40 octets sans somme de contrôle, Hop Limit. Mais en IPv6 seul l’<b>émetteur</b> fragmente, et le NAT n’a plus de raison d’être.' },
    { id: 'sj16', lvl: 3, type: 'qcm', q: '<b>Exercice 4, question 1.</b> Des liaisons de secours à 4 Mbit/s doublent des liaisons principales à 128 Mbit/s. L’administrateur veut un routage <b>adaptatif</b>. Que proposes-tu ?',
      choices: ['OSPF, dont le coût dépend du débit : les liaisons de secours ne servent qu’en cas de panne', 'RIP, plus simple à configurer', 'Des routes statiques sur chaque routeur', 'HSRP entre tous les routeurs'], good: 0,
      hints: ['Adaptatif = dynamique. Et il faut que le protocole voie la différence entre 4 et 128 Mbit/s.'],
      explain: '<b>OSPF</b> : avec la référence de 100 Mbit/s, la liaison de secours coûte 25 et une principale 1 ; le trafic suit les principales. RIP, qui compte les sauts, utiliserait la liaison de secours directe en permanence (1 saut contre 2). Les routes statiques ne sont pas adaptatives, HSRP ne route pas.' },
    { id: 'sj17', lvl: 3, type: 'text', q: '<b>Armatis-LC, mission 1.</b> Le serveur DNS maître a l’adresse <b>2001:52d9:1000:510::1/64</b>. Donne :',
      fields: [{ label: 'son adresse expansée (128 bits)', kind: 'ip6full', answer: '2001:52d9:1000:0510:0000:0000:0000:0001' }, { label: 'son préfixe réseau', kind: 'pfx6', answer: '2001:52d9:1000:510::/64' }],
      hints: ['4 groupes avant « :: » et 1 après : le « :: » vaut 4 groupes.', 'Préfixe /64 : les 4 premiers groupes.'],
      explain: '<b>2001:52d9:1000:0510:0000:0000:0000:0001</b> (chaque groupe sur 4 chiffres, 8 groupes). Réseau : <b>2001:52d9:1000:510::/64</b>.' },
    /* ---------- Difficile ---------- */
    { id: 'sj18', lvl: 4, type: 'multi', q: '<b>QCM 12.</b> Lesquelles sont des adresses de diffusion ?',
      choices: ['192.168.1.255/24', '192.168.1.255/16', '192.168.255.254/16', '192.168.255.255/16'], good: [0, 3], noShuffle: true,
      hints: ['En /16, seuls les deux derniers octets sont la partie hôte.'],
      explain: '192.168.1.255/24 : oui. En /16, la diffusion de 192.168.0.0 est <b>192.168.255.255</b> ; 192.168.1.255/16 et 192.168.255.254/16 sont des hôtes.' },
    { id: 'sj19', lvl: 4, type: 'multi', q: '<b>QCM 13.</b> Lesquelles sont des adresses de diffusion ?',
      choices: ['192.168.0.0/24', '192.168.1.255/23', '192.168.0.31/27', '192.168.255.5/24'], good: [1, 2], noShuffle: true,
      hints: ['/23 : bloc 192.168.0.0 - 192.168.1.255.'],
      explain: '192.168.1.255/23 est la <b>fin</b> du bloc 192.168.0.0/23 : diffusion. 192.168.0.31/27 aussi. 192.168.0.0/24 est une adresse réseau, 192.168.255.5/24 un hôte.' },
    { id: 'sj20', lvl: 4, type: 'multi', q: '<b>QCM 15.</b> Lesquelles sont des adresses réseau ?',
      choices: ['192.168.1.0/16', '192.168.0.0/16', '10.1.0.0/8', '10.0.1.0/24'], good: [1, 3], noShuffle: true,
      hints: ['Masque court = le réseau « remonte » vers des zéros.'],
      explain: '192.168.1.0/16 → réseau 192.168.0.0 ; 10.1.0.0/8 → réseau 10.0.0.0. Restent <b>192.168.0.0/16</b> et <b>10.0.1.0/24</b>.' },
    { id: 'sj21', lvl: 4, type: 'multi', q: '<b>QCM 17.</b> Les caches de ta machine sont vides. Tu tapes <code>ping www.univ-lille.fr</code>. Quels paquets ou trames ta machine émet-elle ?',
      choices: ['Une trame ARP', 'Un paquet ICMP', 'Un paquet IP', 'Un paquet DNS', 'Un segment TCP'], good: [0, 1, 2, 3], noShuffle: true,
      hints: ['Il faut d’abord un nom → une adresse, puis une adresse → une MAC, puis le ping.'],
      explain: 'Requête <b>DNS</b> (UDP 53, dans un paquet <b>IP</b>), précédée d’un <b>ARP</b> (pour la passerelle ou le serveur DNS local), puis l’echo <b>ICMP</b> (dans IP). Ni le DNS classique ni le ping n’utilisent TCP.' },
    { id: 'sj22', lvl: 4, type: 'multi', q: '<b>QCM 18.</b> SW1 a des postes du VLAN 10 et du VLAN 20 ; SW2 aussi ; SW1 et SW2 sont reliés par leurs ports 24 ; SW1 est relié à G0/0 de R1 ; R1 (G0/1) est relié à R2 (G0/1) ; R2 (G0/0) dessert le VLAN 30. Quels ports dois-tu passer en mode tagué (trunk) ?',
      choices: ['Ports 1 et 2 du commutateur SW1', 'Ports 10 et 11 du commutateur SW2', 'Port 24 du commutateur SW1', 'Port G0/0 de R1', 'Port G0/1 de R1', 'Port G0/0 de R2'], good: [2, 3], noShuffle: true,
      hints: ['Un lien est tagué s’il transporte plusieurs VLAN.', 'Qui fait le routage entre VLAN 10 et VLAN 20 ?'],
      explain: 'Le lien SW1-SW2 (port <b>24</b>) porte les VLAN 10 et 20, et <b>G0/0 de R1</b> fait du router-on-a-stick pour les deux VLAN. Le port de SW1 relié à R1 doit aussi être en trunk, mais il n’est pas proposé (il n’a pas de numéro sur le schéma). Les ports des postes sont en accès, R1-R2 et R2-VLAN 30 sont des liens routés à un seul réseau.' },
    { id: 'sj23', lvl: 4, type: 'grid', q: '<b>Exercice 3 — table de routage du PIX</b> (format du TD : passerelle vide pour un réseau connecté, interface = adresse IP de sortie). Écris les routes vers les VLAN une par une, sans résumé. Pour la route par défaut, le sujet ne donne pas l’adresse du modem : prends une adresse libre du réseau public.',
      file: 'sujet-2025.xlsx', sheet: 'PIX',
      cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('213.30.180.96/28', null, '213.30.180.97'), row('10.50.1.0/24', null, '10.50.1.1'), row('172.16.0.0/24', null, '172.16.0.1'),
        row('192.168.1.0/27', '172.16.0.254', '172.16.0.1'), row('192.168.2.0/27', '172.16.0.254', '172.16.0.1'), row('192.168.3.0/25', '172.16.0.254', '172.16.0.1'),
        row('192.168.4.0/27', '172.16.0.254', '172.16.0.1'), row('192.168.5.0/26', '172.16.0.254', '172.16.0.1'), row('192.168.7.0/28', '172.16.0.254', '172.16.0.1'),
        [{ a: '0.0.0.0/0' }, { a: ['213.30.180.98', modem] }, { a: '213.30.180.97' }]],
      rowTypes: ['c', 'c', 'c', 's', 's', 's', 's', 's', 's', 'd'],
      hints: ['3 réseaux connectés : le réseau public, la DMZ, le VLAN 6.', 'Les 6 VLAN internes : passerelle 172.16.0.254 (le commutateur N3), interface 172.16.0.1.', 'Route par défaut : 0.0.0.0/0 vers le modem (par exemple 213.30.180.98), interface 213.30.180.97.'],
      explain: '3 connectés, 6 routes statiques vers le commutateur N3, 1 route par défaut. Le modem n’a pas d’adresse sur le schéma : n’importe quelle adresse libre de 213.30.180.96/28 (sauf .97, et .100 à .102 déjà utilisées par les services) est acceptée, à condition de le <b>signaler</b> dans la copie.' },
    { id: 'sj24', lvl: 4, type: 'grid', q: '<b>Exercice 3 — table de routage du commutateur de niveau 3</b> (même format). Table minimale : une seule route non connectée suffit.',
      file: 'sujet-2025.xlsx', sheet: 'Commutateur N3',
      cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('172.16.0.0/24', null, '172.16.0.254'), row('192.168.1.0/27', null, '192.168.1.30'), row('192.168.2.0/27', null, '192.168.2.30'), row('192.168.3.0/25', null, '192.168.3.126'),
        row('192.168.4.0/27', null, '192.168.4.30'), row('192.168.5.0/26', null, '192.168.5.62'), row('192.168.7.0/28', null, '192.168.7.14'), row('0.0.0.0/0', '172.16.0.1', '172.16.0.254')],
      rowTypes: ['c', 'c', 'c', 'c', 'c', 'c', 'c', 'd'],
      hints: ['7 réseaux connectés : le VLAN 6 et les 6 VLAN internes (l’interface = l’adresse du commutateur dans chaque VLAN).', 'Tout le reste (DMZ, Internet) est derrière le PIX : une route par défaut vers 172.16.0.1.'],
      explain: 'Le commutateur N3 connaît tous les VLAN en direct. La DMZ (10.50.1.0/24) et Internet passent par le PIX : <b>0.0.0.0/0 via 172.16.0.1</b>. Une route explicite vers 10.50.1.0/24 serait juste aussi, mais inutile.' },
    { id: 'sj25', lvl: 4, type: 'grid', q: '<b>Armatis-LC, mission 3 — table de routage du firewall BDN</b> (format du TD). Le WAN MPLS (172.16.0.0/16) est derrière BDN R2 (94.125.168.253), Internet derrière BDN R1.',
      file: 'armatis.xlsx', sheet: 'Firewall',
      cols: RT_COLS, unordered: true, routeColors: true,
      rows: [row('94.125.168.124/30', null, '94.125.168.126'), row('94.125.168.128/25', null, '94.125.168.254'), row('172.16.0.0/16', '94.125.168.253', '94.125.168.254'), row('0.0.0.0/0', '94.125.168.125', '94.125.168.126')],
      rowTypes: ['c', 'c', 's', 'd'],
      hints: ['Deux interfaces : 94.125.168.126/30 (vers R1) et 94.125.168.254/25 (VLAN 50).', 'Le MPLS passe par BDN R2, qui est dans le VLAN 50.'],
      explain: 'Deux réseaux connectés, <b>172.16.0.0/16 via 94.125.168.253</b> (R2, interface .254) et la <b>route par défaut via 94.125.168.125</b> (R1, interface .126). C’est la table « de secours » demandée au cas où OSPF tomberait.' },
    { id: 'sj26', lvl: 4, type: 'multi', q: '<b>Armatis-LC, missions 2 et 5.</b> Pour que les deux serveurs web répondent aussi en IPv6 par leur nom, que faut-il faire dans la zone db.armatis-lc.com ?',
      choices: ['Ajouter www.armatis-lc.com. IN AAAA 2001:52d9:1000:510::3', 'Ajouter www.armatis-lc.com. IN AAAA 2001:52d9:1000:510::4', 'Ajouter des AAAA pour ns1 (::1) et ns2 (::2)', 'Incrémenter le numéro de série du SOA', 'Ajouter un enregistrement A contenant les adresses IPv6', 'Transformer le CNAME extranet en AAAA'], good: [0, 1, 2, 3],
      hints: ['L’enregistrement IPv6 s’appelle « quadruple A ».', 'Comment le DNS secondaire sait-il que la zone a changé ?'],
      explain: 'Deux <b>AAAA</b> pour www (round-robin IPv6), des AAAA pour les serveurs de noms, et le <b>numéro de série</b> du SOA à incrémenter pour que le secondaire recopie la zone. Un A ne contient que de l’IPv4 ; le CNAME extranet pointe vers www, il suit tout seul.' },
    { id: 'sj27', lvl: 4, type: 'multi', q: '<b>Exercice 4, question 2 (Lille).</b> Administratifs (192.168.3.0/24) et production (192.168.6.0/24) sont répartis dans les deux bâtiments. Que faut-il modifier ?',
      choices: ['Créer les deux VLAN sur les deux commutateurs', 'Affecter chaque port d’accès au VLAN de son utilisateur', 'Passer en trunk 802.1Q le lien entre les bâtiments et le port vers R4', 'Sur R4, deux sous-interfaces 802.1Q : 192.168.3.1 et 192.168.6.1', 'Annoncer 192.168.6.0/24 dans le protocole de routage', 'Acheter un routeur par bâtiment', 'Changer l’adresse des serveurs'], good: [0, 1, 2, 3, 4],
      hints: ['Deux réseaux sur la même infrastructure physique : VLAN + routage inter-VLAN.'],
      explain: 'VLAN sur les deux commutateurs, ports d’accès, <b>trunks</b> (inter-bâtiments et vers R4), <b>router-on-a-stick</b> sur R4, et le nouveau réseau annoncé aux autres routeurs. Les serveurs restent dans 192.168.3.0/24 : rien à changer chez eux.' },
    { id: 'sj28', lvl: 4, type: 'text', q: '<b>Exercice 4, question 3.</b> Nouvelle étendue DHCP pour la production. Donne :',
      fields: [{ label: 'adresse du réseau', kind: 'ip', answer: '192.168.6.0' }, { label: 'passerelle par défaut', kind: 'ip', answer: '192.168.6.1' }, { label: 'serveur DNS', kind: 'ip', answer: '192.168.3.4' }, { label: 'adresse à donner au relais (ip helper-address)', kind: 'ip', answer: '192.168.3.3' }],
      hints: ['La passerelle de la production est la nouvelle sous-interface de R4.', 'Le DNS ne change pas ; le relais pointe vers le serveur DHCP.'],
      explain: 'Étendue <b>192.168.6.0/24</b> (par exemple .100 à .199), passerelle <b>192.168.6.1</b>, DNS <b>192.168.3.4</b>. Et le service supplémentaire : le <b>relais DHCP</b> (<code>ip helper-address 192.168.3.3</code> sur la sous-interface 192.168.6.1), car les DISCOVER en diffusion ne traversent pas R4.' },
    { id: 'sj29', lvl: 4, type: 'multi', q: '<b>Armatis-LC, mission 5.</b> Le plateau technique (192.168.1.0/24) est relié au commutateur de la DMZ ; c’est le firewall qui le route, sur une nouvelle interface logique (VLAN dédié). Quels ports faut-il taguer (802.1Q) ?',
      choices: ['Le port du commutateur DMZ relié au firewall', 'Les deux ports du lien entre le commutateur DMZ et celui du plateau', 'Les ports des serveurs de la DMZ', 'Les ports des postes du plateau', 'Le port du routeur MPLS'], good: [0, 1],
      hints: ['Seuls les liens qui transportent plusieurs VLAN sont tagués.'],
      explain: 'Le lien vers le firewall porte désormais le VLAN 50 <b>et</b> celui du plateau ; le lien entre les deux commutateurs aussi (pour que le VLAN du plateau rejoigne le firewall). Serveurs, postes et routeur MPLS restent en accès.' },
    /* ---------- Extrême ---------- */
    { id: 'sj30', lvl: 5, type: 'grid', q: '<b>Exercice 2, question 1.</b> Masque 255.255.252.0, serveur DHCP 192.168.4.10, étendue 192.168.4.100 à 192.168.4.200, passerelle 192.168.4.254. Pour chaque adresse candidate à une réservation, réponds par <b>oui</b> ou <b>non</b>.',
      file: 'sujet-2025.xlsx', sheet: 'Réservation DHCP',
      cols: [{ h: 'Adresse', w: 130 }, { h: 'Hôte valide et libre du réseau ?', kind: 'word', w: 230 }, { h: 'Dans l’étendue (100 à 200) ?', kind: 'word', w: 200 }],
      rows: [['192.168.4.0', { a: NON }, { a: NON }], ['192.168.4.10', { a: NON }, { a: NON }], ['192.168.4.100', { a: OUI }, { a: OUI }], ['192.168.4.230', { a: OUI }, { a: NON }],
        ['192.168.4.255', { a: OUI }, { a: NON }], ['192.168.5.0', { a: OUI }, { a: NON }], ['192.168.5.255', { a: OUI }, { a: NON }], ['192.168.8.1', { a: NON }, { a: NON }]],
      hints: ['/22 : le réseau va de 192.168.4.0 à 192.168.7.255.', 'En /22, 192.168.4.255 et 192.168.5.0 sont des adresses d’hôte ordinaires.'],
      explain: 'Seules 192.168.4.0 (réseau), 192.168.4.10 (le serveur DHCP) et 192.168.8.1 (autre réseau) sont exclues. Le piège : 4.255, 5.0 et 5.255 sont valides en /22. Ensuite, réservation dans l’étendue (Windows Server : 192.168.4.100) ou hors du pool (Cisco, ISC : 4.230, 4.255…) selon le serveur : justifie ton choix.' },
    { id: 'sj31', lvl: 5, type: 'grid', q: '<b>Exercice 2, question 2.</b> Plan d’adressage de 172.32.32.0/24. Besoins : Réseau1 = 19, Réseau2 = 30, Réseau3 = 5, Réseau4 = 120, Réseau5 = 12, Réseau6 = 10 adresses. Alloue du plus gros au plus petit, à partir de 172.32.32.0 (masque en /xx ou en décimal pointé).',
      file: 'sujet-2025.xlsx', sheet: 'VLSM',
      cols: [{ h: 'Réseau (besoin)', w: 140 }, { h: 'Adresse du réseau', kind: 'ip', w: 140 }, { h: 'Masque', kind: 'mask', w: 140 }, { h: 'Première adresse', kind: 'ip', w: 140 }, { h: 'Dernière adresse', kind: 'ip', w: 140 }],
      rows: [['Réseau4 (120)', { a: '172.32.32.0' }, { a: '255.255.255.128' }, { a: '172.32.32.1' }, { a: '172.32.32.126' }],
        ['Réseau2 (30)', { a: '172.32.32.128' }, { a: '255.255.255.224' }, { a: '172.32.32.129' }, { a: '172.32.32.158' }],
        ['Réseau1 (19)', { a: '172.32.32.160' }, { a: '255.255.255.224' }, { a: '172.32.32.161' }, { a: '172.32.32.190' }],
        ['Réseau5 (12)', { a: '172.32.32.192' }, { a: '255.255.255.240' }, { a: '172.32.32.193' }, { a: '172.32.32.206' }],
        ['Réseau6 (10)', { a: '172.32.32.208' }, { a: '255.255.255.240' }, { a: '172.32.32.209' }, { a: '172.32.32.222' }],
        ['Réseau3 (5)', { a: '172.32.32.224' }, { a: '255.255.255.248' }, { a: '172.32.32.225' }, { a: '172.32.32.230' }]],
      hints: ['120 → /25 (128) ; 30 et 19 → /27 (32) ; 12 et 10 → /28 (16) ; 5 → /29 (8).', 'Chaque réseau commence juste après la diffusion du précédent.'],
      explain: '.0/25, .128/27, .160/27, .192/28, .208/28, .224/29 : 232 adresses utilisées sur 256. Remarque à faire en copie : <b>172.32.x.x n’est pas une plage privée</b> (172.16 à 172.31 seulement).' },
    { id: 'sj32', lvl: 5, type: 'qcm', q: '<b>Exercice 2, question 4.</b> Que réponds-tu pour la forme étendue de <code>FC80:0B1:0:A1</code> ?',
      choices: ['Elle n’est pas valide (4 groupes sans « :: ») : je le signale, et si l’on suppose FC80:0B1::A1, cela donne FC80:00B1:0000:0000:0000:0000:0000:00A1', 'FC80:00B1:0000:00A1:0000:0000:0000:0000', '0000:0000:0000:0000:FC80:00B1:0000:00A1', 'FC80:0B10:0000:A100'], good: 0,
      hints: ['Une adresse IPv6 complète a 8 groupes. Combien en a celle-ci ? Y a-t-il un « :: » ?'],
      explain: 'Sans « :: », il faut <b>8 groupes</b> : cette adresse est <b>invalide</b>. On ne peut pas deviner où ajouter les zéros. Le bon réflexe : le dire, puis donner l’hypothèse la plus probable. (Et l’autre adresse, 2001:0:0:A01::1, donne 2001:0000:0000:0A01:0000:0000:0000:0001.)' },
    { id: 'sj33', lvl: 5, type: 'multi', q: '<b>Armatis-LC, mission 4.</b> Un 2e routeur Internet, BDN R1-bis, est relié à la liaison de secours. Que faut-il faire pour que la panne de l’un des deux routeurs soit transparente ?',
      choices: ['Un protocole FHRP (HSRP, ou VRRP s’ils sont de marques différentes) entre R1 et R1-bis, avec une IP virtuelle côté firewall', 'Faire pointer la route par défaut du firewall vers l’IP virtuelle', 'Agrandir le réseau firewall-routeurs : un /30 n’a que deux adresses', 'Priorité et préemption pour le routeur principal, et suivi de son lien Internet', 'Ajouter une 2e route par défaut sur chaque serveur web', 'Activer STP sur les routeurs'], good: [0, 1, 2, 3],
      hints: ['Comment le firewall continue-t-il à envoyer vers « le » routeur Internet, quel qu’il soit ?', 'Combien d’adresses faut-il sur le réseau du firewall ?'],
      explain: 'FHRP (<b>VRRP</b> est standard, HSRP propre à Cisco) avec une <b>IP virtuelle</b> utilisée par le firewall. Il faut <b>quatre</b> adresses (R1, R1-bis, l’IP virtuelle, le firewall) : le /30 actuel ne suffit pas, un /29 oui. Priorité et préemption pour R1, suivi (track) du lien Internet pour basculer si la fibre tombe.' },
    { id: 'sj34', lvl: 5, type: 'text', q: '<b>Armatis-LC, mission 5.</b> Configuration DHCP du plateau technique (réseau 192.168.1.0/24, passerelle = dernière adresse possible, DNS internes). Donne :',
      fields: [{ label: 'passerelle', kind: 'ip', answer: '192.168.1.254' }, { label: 'masque', kind: 'maskdot', answer: '255.255.255.0' }, { label: 'DNS primaire', kind: 'ip', answer: '94.125.168.129' }, { label: 'DNS secondaire', kind: 'ip', answer: '94.125.168.130' }],
      hints: ['Dernière adresse utilisable d’un /24 : .254.', 'Les DNS internes sont ns1 et ns2 de la DMZ.'],
      explain: 'Passerelle <b>192.168.1.254</b>, masque <b>255.255.255.0</b>, DNS <b>94.125.168.129</b> et <b>.130</b>, une étendue d’au moins 35 adresses (le texte parle de 35 postes, le schéma de 30). Et un <b>relais DHCP</b> sur l’interface 192.168.1.254 : le serveur DHCP (94.125.168.129) est dans un autre réseau.' },
    /* ---------- Impossible ---------- */
    { id: 'sj-lab-lille', lvl: 6, type: 'pt', file: 'Lille-restructuration.pkt', tag: 'VLAN + relais DHCP',
      q: '<b>Exercice 4, questions 2 et 3, en vrai.</b> Le site de Lille avant la restructuration : un seul réseau 192.168.3.0/24, R4 en 192.168.3.1 sur G0/0, le serveur DHCP <b>SRV-DHCP</b> (192.168.3.3, étendue .100 à .199, passerelle 192.168.3.1, DNS 192.168.3.4). Dans chaque bâtiment, un poste administratif (Fa0/1) et un poste de production (Fa0/2). Tous les postes sont en DHCP.<br>Mets en place la nouvelle organisation : VLAN <b>3</b> administratif (192.168.3.0/24) et VLAN <b>6</b> production (192.168.6.0/24) dans les deux bâtiments, routage inter-VLAN sur R4 (192.168.3.1 et 192.168.6.1), et DHCP pour la production (étendue 192.168.6.100 à .199, passerelle 192.168.6.1, DNS 192.168.3.4).',
      build: function () {
        var n = LAB.make({
          devices: [['R4', '2901', 520, 80], ['SW-ANCIEN', '2960-24TT', 520, 250], ['SW-NOUVEAU', '2960-24TT', 920, 250], ['SRV-DHCP', 'Server-PT', 260, 110],
            ['ADM-A', 'PC-PT', 380, 420], ['PROD-A', 'PC-PT', 640, 420], ['ADM-N', 'PC-PT', 820, 420], ['PROD-N', 'PC-PT', 1040, 420]],
          links: [['R4', 'GigabitEthernet0/0', 'SW-ANCIEN', 'GigabitEthernet0/1', 'straight'], ['SW-ANCIEN', 'GigabitEthernet0/2', 'SW-NOUVEAU', 'GigabitEthernet0/2', 'cross'],
            ['SRV-DHCP', 'FastEthernet0', 'SW-ANCIEN', 'FastEthernet0/10', 'straight'], ['ADM-A', 'FastEthernet0', 'SW-ANCIEN', 'FastEthernet0/1', 'straight'], ['PROD-A', 'FastEthernet0', 'SW-ANCIEN', 'FastEthernet0/2', 'straight'],
            ['ADM-N', 'FastEthernet0', 'SW-NOUVEAU', 'FastEthernet0/1', 'straight'], ['PROD-N', 'FastEthernet0', 'SW-NOUVEAU', 'FastEthernet0/2', 'straight']],
          notes: [[200, 520, 'Ancien bâtiment : SW-ANCIEN (R4 sur G0/1, SRV-DHCP sur Fa0/10) · Nouveau bâtiment : SW-NOUVEAU · liaison entre bâtiments : G0/2 ⟷ G0/2'], [200, 545, 'Fa0/1 = poste administratif · Fa0/2 = poste de production, dans chaque bâtiment']],
          cli: { R4: ['conf t', 'hostname R4', 'interface g0/0', 'ip address 192.168.3.1 255.255.255.0', 'no shutdown', 'end'], 'SW-ANCIEN': ['conf t', 'hostname SW-ANCIEN', 'end'], 'SW-NOUVEAU': ['conf t', 'hostname SW-NOUVEAU', 'end'] },
          hosts: { 'SRV-DHCP': { ip: '192.168.3.3', mask: '255.255.255.0', gw: '192.168.3.1', dns: '192.168.3.4' } }
        });
        n.dev('SRV-DHCP').services.dhcp = { on: true, pools: [{ name: 'serverPool', network: '192.168.3.0', mask: '255.255.255.0', gateway: '192.168.3.1', dns: '192.168.3.4', start: '192.168.3.100', end: '192.168.3.199', max: 100 }] };
        LILLE_PC.forEach(function (p) { LAB.host(n, p, { dhcp: true }); });
        n.events = []; n.touch(); return n;
      },
      tasks: [
        { label: 'VLAN 3 et VLAN 6 existent sur les deux commutateurs', check: function (n) { return ['SW-ANCIEN', 'SW-NOUVEAU'].every(function (s) { return LAB.vlanName(n, s, 3) && LAB.vlanName(n, s, 6); }); } },
        { label: 'Ports d’accès : Fa0/1 en VLAN 3, Fa0/2 en VLAN 6 (deux bâtiments), Fa0/10 (serveur) en VLAN 3', check: function (n) { return LAB.accessVlan(n, 'SW-ANCIEN', ['FastEthernet0/1', 'FastEthernet0/10'], 3) && LAB.accessVlan(n, 'SW-ANCIEN', ['FastEthernet0/2'], 6) && LAB.accessVlan(n, 'SW-NOUVEAU', ['FastEthernet0/1'], 3) && LAB.accessVlan(n, 'SW-NOUVEAU', ['FastEthernet0/2'], 6); } },
        { label: 'Trunks : liaison entre bâtiments (G0/2) et port vers R4 (G0/1 de SW-ANCIEN)', check: function (n) { return LAB.isTrunk(n, 'SW-ANCIEN', 'GigabitEthernet0/2') && LAB.isTrunk(n, 'SW-NOUVEAU', 'GigabitEthernet0/2') && LAB.isTrunk(n, 'SW-ANCIEN', 'GigabitEthernet0/1'); } },
        { label: 'R4 : sous-interfaces 802.1Q 192.168.3.1/24 (VLAN 3) et 192.168.6.1/24 (VLAN 6)', check: function (n) { return !!sub(n, 'R4', 3, '192.168.3.1') && !!sub(n, 'R4', 6, '192.168.6.1'); } },
        { label: 'Relais DHCP vers 192.168.3.3 sur la sous-interface du VLAN 6', check: function (n) { var i = sub(n, 'R4', 6, '192.168.6.1'); return !!i && i.helper.indexOf(NET.ip2int('192.168.3.3')) >= 0; } },
        { label: 'PROD-A et PROD-N obtiennent une adresse entre 192.168.6.100 et .199, passerelle 192.168.6.1', check: function (n) { return ['PROD-A', 'PROD-N'].every(function (p) { return LAB.dhcpGets(n, p, '192.168.6.0/24', '192.168.6.1') && inRange(n, p, '192.168.6.100', '192.168.6.199') && n.dev(p).host.dns === NET.ip2int('192.168.3.4'); }); } },
        { label: 'ADM-N reste en 192.168.3.0/24 et joint PROD-A (routage inter-VLAN)', check: function (n) { return LAB.dhcpGets(n, 'ADM-N', '192.168.3.0/24', '192.168.3.1') && n.canPing('ADM-N', 'PROD-A'); } }
      ],
      hints: ['Sur les deux commutateurs : <code>vlan 3</code> / <code>name ADMINISTRATIF</code>, <code>vlan 6</code> / <code>name PRODUCTION</code>, puis <code>switchport mode access</code> + <code>switchport access vlan …</code> sur Fa0/1, Fa0/2 (et Fa0/10 sur SW-ANCIEN) ; <code>switchport mode trunk</code> sur G0/2 (et G0/1 de SW-ANCIEN).', 'R4 : retire d’abord l’adresse de G0/0 (<code>no ip address</code>), puis <code>interface g0/0.3</code> → <code>encapsulation dot1Q 3</code> → <code>ip address 192.168.3.1 255.255.255.0</code> ; même chose en .6 avec 192.168.6.1, plus <code>ip helper-address 192.168.3.3</code>.', 'SRV-DHCP → Services → DHCP : ajoute un pool (réseau 192.168.6.0, masque 255.255.255.0, passerelle 192.168.6.1, DNS 192.168.3.4, début 192.168.6.100, 100 utilisateurs). Puis sur chaque PC : IP Configuration → DHCP pour renouveler.'],
      solution: [
        { dev: 'SW-ANCIEN', cli: SW_LILLE.concat(['conf t', 'interface fa0/10', 'switchport mode access', 'switchport access vlan 3', 'interface g0/1', 'switchport mode trunk', 'end']) },
        { dev: 'SW-NOUVEAU', cli: SW_LILLE },
        { dev: 'R4', cli: ['conf t', 'interface g0/0', 'no ip address', 'interface g0/0.3', 'encapsulation dot1Q 3', 'ip address 192.168.3.1 255.255.255.0', 'interface g0/0.6', 'encapsulation dot1Q 6', 'ip address 192.168.6.1 255.255.255.0', 'ip helper-address 192.168.3.3', 'end'] },
        { text: 'SRV-DHCP → Services → DHCP : pool PRODUCTION (réseau 192.168.6.0/24, passerelle 192.168.6.1, DNS 192.168.3.4, début 192.168.6.100, 100 utilisateurs).',
          fn: function (n) { n.dev('SRV-DHCP').services.dhcp.pools.push({ name: 'PRODUCTION', network: '192.168.6.0', mask: '255.255.255.0', gateway: '192.168.6.1', dns: '192.168.3.4', start: '192.168.6.100', end: '192.168.6.199', max: 100 }); } }
      ],
      explain: 'C’est la réponse complète aux questions 2 et 3 : VLAN répartis sur les deux bâtiments, trunks, router-on-a-stick, nouvelle étendue et <b>relais</b>. Sans le relais, PROD-A et PROD-N restent en APIPA (169.254.x.x) : le DISCOVER, en diffusion, ne traverse pas R4. Les postes administratifs, eux, sont dans le réseau du serveur : ils n’ont pas besoin du relais.' },
    { id: 'sj35', lvl: 6, type: 'multi', q: '<b>Exercice 4, question 4.</b> Un second routeur (192.168.3.2 / 192.168.6.2) est ajouté pour l’accès Internet de Lille. Que faut-il configurer ou modifier ?',
      choices: ['HSRP (ou VRRP) sur les deux routeurs, un groupe par VLAN, avec une IP virtuelle par réseau', 'L’IP virtuelle comme passerelle : options des deux étendues DHCP et passerelle des serveurs fixes', 'Sur le nouveau routeur : sous-interfaces 802.1Q, relais DHCP sur le VLAN production et protocole de routage', 'Le port de commutateur du nouveau routeur en trunk', 'Rien côté PC : ils trouveront tout seuls le second routeur', 'Laisser les deux routeurs sur la liaison 192.168.10.16/30 en même temps'], good: [0, 1, 2, 3],
      hints: ['Un PC ne connaît qu’une passerelle.', 'Combien d’adresses utilisables dans un /30 ?'],
      explain: 'Redondance de passerelle (<b>HSRP</b>) avec une IP virtuelle par VLAN, qui devient la passerelle partout (ou bien on garde .1 en IP virtuelle et on change l’adresse réelle de R4). Le nouveau routeur reçoit les mêmes fonctions que R4 (sous-interfaces, relais, routage). Et la liaison 192.168.10.16/30 n’a que 2 adresses : le nouveau routeur <b>prend</b> le .18, l’ancien ne le garde pas.' },
    { id: 'sj36', lvl: 6, type: 'multi', q: '<b>Esprit critique.</b> Quelles erreurs du sujet faut-il signaler dans ta copie ?',
      choices: ['L’exercice 4 parle de R6, qui n’existe pas sur le schéma (c’est R5)', 'L’adresse « 192.168.1.22 » du schéma de l’exercice 4 est en fait 192.168.10.22', '172.32.32.0/24 n’est pas une plage d’adresses privées', 'FC80:0B1:0:A1 n’est pas une adresse IPv6 valide', 'En /23, 192.168.0.255 est une adresse de diffusion', 'Le masque 255.255.252.0 rend 192.168.5.0 inutilisable'], good: [0, 1, 2, 3],
      hints: ['Deux affirmations sont elles-mêmes des pièges du QCM et de l’exercice 2.'],
      explain: 'Les quatre premières sont de vraies erreurs de l’énoncé. Les deux dernières sont fausses : en /23 comme en /22, 192.168.0.255 et 192.168.5.0 sont des adresses d’hôte ordinaires.' },
    { id: 'sj37', lvl: 6, type: 'qcm', q: '<b>Exercice 3, pour aller plus loin.</b> Sur le PIX, on remplace les 6 routes internes par une seule : 192.168.0.0/21 via 172.16.0.254. Le commutateur N3 a sa route par défaut vers le PIX. Que devient un paquet venu de la DMZ pour 192.168.6.10 (réseau qui n’existe pas) ?',
      choices: ['Il fait des allers-retours entre le PIX et le commutateur jusqu’à ce que son TTL tombe à 0 (boucle de routage)', 'Le PIX le rejette tout de suite', 'Le commutateur le diffuse dans tous les VLAN', 'Il arrive dans le VLAN 7'], good: 0,
      hints: ['192.168.6.10 est dans 192.168.0.0/21. Et chez le commutateur, quelle route correspond ?'],
      explain: 'Le PIX l’envoie au commutateur (le /21 couvre 192.168.0.0 à 192.168.7.255) ; le commutateur n’a pas 192.168.6.0 et applique sa route par défaut : retour au PIX… <b>Boucle</b> jusqu’au TTL 0 (ICMP Time Exceeded). Remède : routes détaillées, ou route du résumé vers <code>null0</code> sur le commutateur.' }
  ]
  });
})();
