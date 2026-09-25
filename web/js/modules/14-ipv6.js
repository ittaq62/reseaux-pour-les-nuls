(function () {
  var V6_R1 = ['conf t', 'ipv6 unicast-routing', 'interface fa0/0', 'ipv6 address fc00::1/64', 'no shutdown', 'interface fa0/1', 'ipv6 address 2001:db8:1:1::/64 eui-64', 'no shutdown', 'interface fa1/0', 'ipv6 address 2001:db8:1:2::/64 eui-64', 'no shutdown', 'exit', 'ipv6 route ::/0 fc00::2', 'end'];
  var V6_R2 = ['conf t', 'ipv6 unicast-routing', 'interface fa0/0', 'ipv6 address fc00::2/64', 'no shutdown', 'interface fa0/1', 'ipv6 address 2001:db8:2::/64 eui-64', 'ipv6 address fe80::1 link-local', 'no shutdown', 'exit', 'ipv6 route 2001:db8:1:1::/64 fc00::1', 'ipv6 route 2001:db8:1:2::/64 fc00::1', 'end'];
  function autoAll(n) { ['PC0', 'PC1', 'PC2'].forEach(function (p) { n.dev(p).host.v6auto = true; }); n.touch(); }
  function v6(n, pc) { return n.hostV6(n.dev(pc)); }
  function hasAddr(n, pc, a) { return v6(n, pc).addrs.some(function (x) { return NET.eq6(NET.fmt6(x.w), a); }); }
  function ping6(n, a, b) { var t = v6(n, b).addrs[0]; return !!t && n.canPing6(a, t.w); }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'ipv6', num: 14, icon: '6️⃣', titre: 'IPv6',
  sous: 'Notation, types d’adresses, EUI-64, SLAAC, DHCPv6, routage',
  source: 'IPv6.pdf (ENI), Exercice-ipv6.pdf, Pratique-IPv6-DHCPv6-01 (+ .pkt)',
  cours: `
<h3>1. Pourquoi IPv6 ?</h3>
<p>Il y a plus d’équipements connectés que d’humains : les 2<sup>32</sup> adresses d’IPv4 ne suffisent plus. IPv6 utilise <b>128 bits</b> : 2<sup>128</sup> ≈ 3,4×10<sup>38</sup> adresses. L’attribution est organisée par grands blocs (par continent) pour limiter la taille des tables de routage.</p>
<h3>2. La notation</h3>
<p>8 blocs (<b>hextets</b>) de <b>16 bits</b>, écrits en <b>hexadécimal</b> (4 caractères, chaque caractère = 4 bits), séparés par « : ». Exemple : <code>2001:0123:0000:0000:A1B2:C3D4:0000:F1AA</code>.</p>
<div class="memo"><b>📌 Les 2 règles de simplification :</b><br>1. On supprime les <b>0 en début de bloc</b> : <code>0123</code> → <code>123</code>, <code>0000</code> → <code>0</code>.<br>2. On remplace <b>une</b> suite de blocs à 0 par <code>::</code> — <b>une seule fois</b> par adresse (sinon on ne saurait plus combien de blocs chaque « :: » remplace).<br>→ <code>2001:123::A1B2:C3D4:0:F1AA</code> (on prend en général la plus longue suite de 0).</div>
<div class="warnbox"><b>⚠ Adresses invalides (pièges de l’exercice) :</b> <code>fe80::a1::1</code> (deux « :: ») ; <code>2001:f:4c18:0:e0</code> (seulement 5 blocs et pas de « :: ») ; une adresse de 9 blocs.</div>
<p>Préfixes en notation CIDR, par pas de <b>4 bits</b> (un caractère hexa) : /48, /52, /56, /60, /64… Un réseau « final » est en <b>/64</b> (64 bits réseau, 64 bits hôte). Un FAI donne souvent un <b>/48</b> à une entreprise : il reste 16 bits → <b>2<sup>16</sup> = 65 536 sous-réseaux /64</b>.</p>
<div data-tool="ipv6"></div>

<h3>3. Les types d’adresses</h3>
<p>Il n’y a <b>plus de broadcast</b> en IPv6 : il est remplacé par du <b>multicast</b>. Trois modes : <b>unicast</b>, <b>multicast</b>, <b>anycast</b> (le plus proche d’un groupe, nouveauté IPv6).</p>
<table><tr><th>Type</th><th>Préfixe</th><th>Routable sur Internet ?</th><th>Équivalent IPv4</th></tr>
<tr><td><b>Link-local</b> (lien local)</td><td><b>FE80::/10</b></td><td>non, valable sur le lien seulement</td><td>169.254.x.x (APIPA)</td></tr>
<tr><td><b>ULA</b> (Unique Local Address, RFC 4193)</td><td><b>FC00::/7</b> (FD00::/8 en pratique)</td><td>non</td><td>adresses privées RFC 1918</td></tr>
<tr><td><b>Global Unicast</b></td><td><b>2000::/3</b> (2000 → 3FFF)</td><td><b>oui</b></td><td>adresses publiques</td></tr>
<tr><td>Loopback</td><td><b>::1</b></td><td>—</td><td>127.0.0.1</td></tr>
<tr><td>Non spécifiée</td><td><b>::</b></td><td>—</td><td>0.0.0.0</td></tr>
<tr><td><b>Multicast</b></td><td><b>FF00::/8</b></td><td>selon la portée</td><td>224.0.0.0/4 (classe D)</td></tr></table>
<ul><li>Toute interface IPv6 a <b>obligatoirement</b> une adresse <b>link-local</b> (une seule), utilisée notamment comme <b>passerelle</b> et next hop. Configurable : <code>ipv6 address FE80::1 link-local</code>.</li>
<li>Une interface peut avoir <b>plusieurs</b> adresses ULA / globales ; une nouvelle adresse s’<b>ajoute</b> (il faut <code>no ipv6 address …</code> pour en retirer une).</li>
<li>Multicasts à connaître : <b>FF02::1</b> = tous les nœuds (le « pseudo-broadcast »), <b>FF02::2</b> = tous les routeurs, <b>FF02::1:2</b> = tous les serveurs DHCPv6, <b>FF02::1:FFxx:xxxx</b> = <i>solicited-node</i> (les 24 derniers bits de l’adresse).</li></ul>

<h3>4. ICMPv6 et NDP</h3>
<p>En IPv6, ICMP devient <b>vital</b> (bloquer ICMPv6 = casser IPv6). Le protocole <b>NDP</b> (Neighbor Discovery) utilise 4 messages :</p>
<table><tr><th>Message</th><th>Rôle</th></tr>
<tr><td><b>RS</b> (Router Solicitation)</td><td>l’hôte demande aux routeurs (vers FF02::2) : « quel préfixe ? »</td></tr>
<tr><td><b>RA</b> (Router Advertisement)</td><td>le routeur annonce sa présence et ses préfixes (en réponse, et toutes les 200 s)</td></tr>
<tr><td><b>NS</b> (Neighbor Solicitation)</td><td>« qui a cette adresse ? » → remplace <b>ARP</b> ; sert aussi à la détection d’adresse dupliquée (<b>DAD</b>)</td></tr>
<tr><td><b>NA</b> (Neighbor Advertisement)</td><td>la réponse, avec l’adresse MAC</td></tr></table>

<h3>5. EUI-64 : fabriquer la partie hôte à partir de la MAC</h3>
<div class="demo">MAC               00-60-5C-47-44-EC
1. couper en deux  00-60-5C  |  47-44-EC
2. insérer FFFE    0060:5CFF:FE47:44EC
3. inverser le 7e bit (bit U/L) du 1er octet : 00 = 0000 0000 → 0000 0010 = 02
   Identifiant     0260:5CFF:FE47:44EC   → s’écrit 260:5CFF:FE47:44EC
Link-local :  FE80::260:5CFF:FE47:44EC
Globale (préfixe 2001:DB8:1:1::/64) : 2001:DB8:1:1:260:5CFF:FE47:44EC</div>
<div class="tip"><b>✔ L’astuce du 7e bit :</b> sur le 1er octet de la MAC, on ajoute ou retire <b>2</b> au 2e caractère hexa : 00 → 02, 02 → 00, CA → C8, 0C → 0E.</div>

<h3>6. Obtenir une adresse automatiquement</h3>
<table><tr><th>Méthode</th><th>Adresse</th><th>Autres infos (DNS…)</th><th>Indicateurs du RA</th></tr>
<tr><td><b>SLAAC</b> seul (<i>stateless</i>)</td><td>préfixe du RA + EUI-64 (ou aléatoire)</td><td>—</td><td>M = 0, O = 0</td></tr>
<tr><td><b>SLAAC + DHCPv6 sans état</b></td><td>préfixe du RA + EUI-64</td><td>par DHCPv6 (le serveur ne garde pas de table)</td><td>M = 0, <b>O = 1</b></td></tr>
<tr><td><b>DHCPv6 avec état</b> (<i>stateful</i>)</td><td>donnée par le serveur DHCPv6</td><td>par DHCPv6</td><td><b>M = 1</b></td></tr></table>
<p>DHCPv6 utilise <b>UDP 546</b> (client) / <b>547</b> (serveur), avec les messages Solicit → Advertise → Request → Reply. La <b>passerelle</b> d’un PC IPv6 est l’adresse <b>link-local</b> du routeur.</p>
<div class="demo dark">R1(config)#ipv6 unicast-routing                       ← indispensable pour router et envoyer les RA
R1(config)#interface fa0/1
R1(config-if)#ipv6 address 2001:db8:1:1::/64 eui-64
R1(config)#ipv6 route ::/0 fc00::2                     ← route par défaut IPv6
R2(config)#ipv6 dhcp pool sansetat
R2(config-dhcpv6)#dns-server 2001:db8:2::53
R2(config)#interface fa0/1
R2(config-if)#ipv6 dhcp server sansetat
R2(config-if)#ipv6 nd other-config-flag               ← met l’indicateur O à 1
R1#show ipv6 interface brief    /    show ipv6 route</div>
<h3>7. Faire cohabiter IPv4 et IPv6</h3>
<ul><li><b>Dual stack</b> (« ships in the night ») : les deux protocoles côte à côte ;</li><li><b>Tunnels</b> : IPv6 encapsulé dans IPv4 (ou l’inverse) ;</li><li><b>Translation NAT64</b>.</li></ul>
<h4>Route récapitulative (étape 4 du TP)</h4>
<p>2001:db8:1:<b>1</b>::/64 et 2001:db8:1:<b>2</b>::/64 ne diffèrent que dans le 4e bloc (0001 / 0002) : les 48 premiers bits sont communs → une seule route <b>2001:db8:1::/48</b> vers fc00::1 (on pourrait être plus précis avec /62 : 0000 0000 0000 00|01 et 00|10 partagent 14 bits → 48 + 14 = /62).</p>
`,
  questions: [
    { id: 'v6-1', type: 'text', q: 'Combien de bits dans une adresse IPv6 ? Et dans chaque bloc (hextet) ?', fields: [{ label: 'Adresse', kind: 'int', answer: 128 }, { label: 'Bloc', kind: 'int', answer: 16 }],
      hints: ['8 blocs de 4 caractères hexadécimaux, chacun valant 4 bits.'], explain: '128 bits = 8 blocs × 16 bits (4 caractères hexa × 4 bits).' },
    { id: 'v6-2', type: 'text', q: '<b>Exercice 1</b> — simplifie au maximum :', fields: [
        { label: 'fe80:0000:0000:0000:0000:0000:0000:4f50', kind: 'ip6s', answer: 'fe80::4f50' },
        { label: '2001:0688:1f80:2000:0203:ffff:0018:ef1e', kind: 'ip6s', answer: '2001:688:1f80:2000:203:ffff:18:ef1e' },
        { label: '0000:0000:0000:0000:0000:0000:0000:0000', kind: 'ip6s', answer: '::' },
        { label: '0000:0000:0000:0000:0000:0000:0000:0001', kind: 'ip6s', answer: '::1' }],
      hints: ['Enlève d’abord les 0 en tête de chaque bloc, puis remplace la plus longue suite de blocs nuls par « :: ».', 'Pour la 2e adresse, il n’y a aucun bloc entièrement nul : pas de « :: » possible !'],
      explain: 'fe80::4f50 ; 2001:688:1f80:2000:203:ffff:18:ef1e ; :: (adresse non spécifiée) ; ::1 (loopback).' },
    { id: 'v6-3', type: 'multi', q: '<b>Exercices 1 et 2</b> — lesquelles de ces écritures sont <b>invalides</b> ?', choices: ['fe80::a1::1', '2001:f:4c18:0:e0', 'Fe8:0000:0000:0000:1f80:0000:0000:0000:000f', 'fec0:0:0:ffff::1', '2001::1'], good: [0, 1, 2],
      hints: ['Compte les blocs et les « :: ».'], explain: 'fe80::a1::1 : deux « :: » (ambigu). 2001:f:4c18:0:e0 : 5 blocs sans « :: ». La 3e a 9 blocs. Les deux dernières sont correctes.' },
    { id: 'v6-4', type: 'text', q: '<b>Exercice 2</b> — donne la forme développée (8 blocs de 4 caractères) :', fields: [
        { label: 'fec0:0:0:ffff::1', kind: 'ip6full', answer: 'fec0:0000:0000:ffff:0000:0000:0000:0001' },
        { label: '2001::1', kind: 'ip6full', answer: '2001:0000:0000:0000:0000:0000:0000:0001' }],
      hints: ['Compte les blocs présents : le « :: » remplace tous ceux qui manquent pour arriver à 8.'], explain: 'fec0:0:0:ffff::1 a 5 blocs écrits → « :: » = 3 blocs nuls. 2001::1 → 6 blocs nuls.' },
    { id: 'v6-5', type: 'text', q: '<b>Exercice 3</b> — réseau d’appartenance :', fields: [
        { label: '2001:88:EE80::203:FBF:4C18:FFE1/64', kind: 'pfx6', answer: '2001:88:ee80::/64' },
        { label: '2001:AB76:7B78:B2C::/56', kind: 'pfx6', answer: '2001:ab76:7b78:b00::/56' },
        { label: '2001:AB76:B8:2::/48', kind: 'pfx6', answer: '2001:ab76:b8::/48' }],
      hints: ['/64 = les 4 premiers blocs ; /48 = les 3 premiers ; /56 = 3 blocs + les 2 premiers caractères du 4e.', 'B2C s’écrit 0B2C : on garde « 0B » et on met « 00 » → 0B00 = B00.'],
      explain: '2001:88:ee80::/64 (le « :: » cachait un bloc 0) ; 2001:ab76:7b78:b00::/56 ; 2001:ab76:b8::/48.' },
    { id: 'v6-6', type: 'text', q: '<b>Exercice 3</b> — Une entreprise reçoit <code>2001:0688:1f80::/48</code>. Combien de sous-réseaux /64 peut-elle créer ?', kind: 'int', accept: 65536,
      hints: ['64 − 48 = 16 bits de sous-réseau.'], explain: '2<sup>16</sup> = <b>65 536</b> sous-réseaux /64 (ton poly écrit 65 535 : c’est 65 536 valeurs, de 0 à FFFF).' },
    { id: 'v6-7', type: 'match', q: 'Associe chaque type d’adresse à son préfixe.', pairs: [['Link-local', 'FE80::/10'], ['ULA (privée)', 'FC00::/7'], ['Global unicast', '2000::/3'], ['Multicast', 'FF00::/8'], ['Loopback', '::1']],
      hints: ['« FE80 » est l’adresse qu’on voit partout dans ipconfig.'], explain: 'FE80::/10 lien local, FC00::/7 ULA, 2000::/3 globale, FF00::/8 multicast, ::1 loopback.' },
    { id: 'v6-8', type: 'match', q: 'Équivalent IPv4 de chaque type d’adresse IPv6 (travail préalable du TP) :', pairs: [['Link-local FE80::', '169.254.x.x (APIPA)'], ['ULA FC00::/7', 'Adresses privées (RFC 1918)'], ['Global unicast 2000::/3', 'Adresses publiques'], ['::1', '127.0.0.1']],
      hints: ['Seule la globale est routable sur Internet.'], explain: 'Lien local ≈ APIPA, ULA ≈ privé, globale ≈ public, ::1 ≈ loopback.' },
    { id: 'v6-9', type: 'match', q: 'Associe chaque message NDP (ICMPv6) à son rôle.', pairs: [['RS', 'L’hôte demande les infos des routeurs (vers FF02::2)'], ['RA', 'Le routeur annonce sa présence et ses préfixes'], ['NS', 'Demande l’adresse MAC d’un voisin (remplace ARP), sert aussi à la DAD'], ['NA', 'Réponse avec l’adresse MAC']],
      hints: ['R = Router, N = Neighbor ; S = Solicitation (demande), A = Advertisement (annonce).'], explain: 'RS/RA pour l’autoconfiguration, NS/NA pour la résolution d’adresse et la détection de doublons.' },
    { id: 'v6-10', type: 'text', q: '<b>Exercice 4</b> — adresses lien local EUI-64 :', fields: [
        { label: 'MAC 02-00-4D-AB-CD-50 →', kind: 'ip6', answer: 'fe80::4dff:feab:cd50' },
        { label: 'MAC 00-03-FF-18-12-EE →', kind: 'ip6', answer: 'fe80::203:ffff:fe18:12ee' }],
      hints: ['On insère FFFE au milieu, puis on inverse le 7e bit : 02 → 00 et 00 → 02.', '02-00-4D | AB-CD-50 → 0000:4DFF:FEAB:CD50 → FE80::4DFF:FEAB:CD50.'],
      explain: 'fe80::4dff:feab:cd50 (le 02 devient 00, d’où le « :: » plus long) et fe80::203:ffff:fe18:12ee.' },
    { id: 'v6-11', type: 'text', q: '<b>Exercice 4 (suite)</b> — adresses globales avec le préfixe <code>2B01:D41:C0:4::/64</code> :', fields: [
        { label: 'MAC 02-00-4D-AB-CD-50 →', kind: 'ip6', answer: '2b01:d41:c0:4:0:4dff:feab:cd50' },
        { label: 'MAC 00-03-FF-18-12-EE →', kind: 'ip6', answer: '2b01:d41:c0:4:203:ffff:fe18:12ee' }],
      hints: ['Même identifiant d’interface, mais on remplace FE80:0:0:0 par le préfixe.'], explain: '2b01:d41:c0:4:0:4dff:feab:cd50 et 2b01:d41:c0:4:203:ffff:fe18:12ee.' },
    { id: 'v6-12', type: 'match', q: 'Indicateurs M et O des annonces RA : quelle méthode ?', pairs: [['M = 0, O = 0', 'SLAAC seul'], ['M = 0, O = 1', 'SLAAC + DHCPv6 sans état'], ['M = 1', 'DHCPv6 avec état']],
      hints: ['O = « Other » : les autres infos (DNS) viennent de DHCPv6. M = « Managed » : l’adresse aussi.'], explain: '<code>ipv6 nd other-config-flag</code> met O à 1 : l’adresse vient du RA, le DNS de DHCPv6.' },
    { id: 'v6-13', type: 'qcm', q: 'Dans la configuration automatique IPv6 de ton TP, quelle est la <b>passerelle par défaut</b> affichée par le PC ?', choices: ['L’adresse globale du routeur', 'L’adresse link-local (FE80::…) du routeur', 'FF02::2', 'Il n’y a pas de passerelle en IPv6'], good: 1,
      hints: ['C’est l’adresse source des annonces RA.'], explain: 'La passerelle IPv6 est l’adresse <b>link-local</b> du routeur (d’où l’intérêt de la fixer à FE80::1 sur R2).' },
    { id: 'v6-14', type: 'text', q: 'Ports UDP de DHCPv6 :', fields: [{ label: 'client', kind: 'int', answer: 546 }, { label: 'serveur', kind: 'int', answer: 547 }],
      hints: ['Ils se suivent, autour de 546.'], explain: 'Client 546, serveur 547 (en IPv4 : 68 et 67).' },
    { id: 'v6-lab1', type: 'pt', topo: 'IPv6-Depart', file: 'Pratique-IPv6-DHCPv6-01-Depart.pkt', tag: 'IPv6',
      q: '<b>Pratique IPv6 — parties 1 (étapes 1 à 3).</b> R1 : Fa0/0 = <code>fc00::1/64</code>, Fa0/1 = <code>2001:db8:1:1::/64 eui-64</code> (PC1), Fa1/0 = <code>2001:db8:1:2::/64 eui-64</code> (PC2). R2 : Fa0/0 = <code>fc00::2/64</code>, Fa0/1 = <code>2001:db8:2::/64 eui-64</code> + lien local <code>fe80::1</code> (PC0). Active le routage IPv6, passe les 3 PC en <b>configuration automatique</b> IPv6, puis route : R1 → route par défaut <code>::/0</code> vers fc00::2 ; R2 → deux routes statiques vers les réseaux 1 et 2.',
      tasks: [
        { label: 'PC1 obtient 2001:DB8:1:1:260:5CFF:FE47:44EC (SLAAC + EUI-64)', check: function (n) { return hasAddr(n, 'PC1', '2001:db8:1:1:260:5cff:fe47:44ec'); } },
        { label: 'PC2 obtient une adresse dans 2001:db8:1:2::/64', check: function (n) { return v6(n, 'PC2').addrs.some(function (a) { return NET.sameNet6(a.w, NET.parse6('2001:db8:1:2::'), 64); }); } },
        { label: 'PC0 obtient une adresse dans 2001:db8:2::/64 avec la passerelle FE80::1', check: function (n) { var c = v6(n, 'PC0'); return c.addrs.some(function (a) { return NET.sameNet6(a.w, NET.parse6('2001:db8:2::'), 64); }) && !!c.gw && NET.eq6(NET.fmt6(c.gw), 'fe80::1'); } },
        { label: 'PC1 joint PC2 (via R1)', check: function (n) { return ping6(n, 'PC1', 'PC2'); } },
        { label: 'PC0 joint PC1 (d’un routeur à l’autre)', check: function (n) { return ping6(n, 'PC0', 'PC1'); } },
        { label: 'PC2 joint PC0', check: function (n) { return ping6(n, 'PC2', 'PC0'); } }
      ],
      hints: ['Sur chaque routeur : <code>ipv6 unicast-routing</code> (sinon pas d’annonces RA !), puis les adresses, puis <code>no shutdown</code>.', 'PC : Desktop → IP Configuration → partie IPv6 → <b>Automatic</b>.', 'R1 : <code>ipv6 route ::/0 fc00::2</code>. R2 : <code>ipv6 route 2001:db8:1:1::/64 fc00::1</code> et <code>ipv6 route 2001:db8:1:2::/64 fc00::1</code>.'],
      solution: [{ dev: 'R1', cli: V6_R1 }, { dev: 'R2', cli: V6_R2 }, { text: 'PC0, PC1, PC2 : IP Configuration → IPv6 → <b>Automatic</b>.', fn: autoAll }],
      explain: 'Chaque PC récupère le préfixe par RA et fabrique sa partie hôte en EUI-64 (PC1 : MAC 0060.5C47.44EC → 260:5CFF:FE47:44EC). Leur passerelle est l’adresse link-local du routeur. <code>show ipv6 route</code> montre les routes C, L et S.' },
    { id: 'v6-lab2', type: 'pt', file: 'Pratique-IPv6-DHCPv6-02.pkt', tag: 'DHCPv6',
      q: '<b>Pratique IPv6 — étape 4 et partie 2.</b> Le réseau de l’exercice précédent fonctionne. 1) Sur R2, <b>remplace</b> les deux routes statiques vers 2001:db8:1:1::/64 et 2001:db8:1:2::/64 par <b>une route récapitulative /48</b>. 2) Installe sur R2 un <b>serveur DHCPv6 sans état</b> (pool <code>sansetat</code>) qui distribue le DNS <code>2001:db8:2::53</code> aux clients du réseau 2001:db8:2::/64 (PC0).',
      build: function () { return LAB.solved('v6-lab1'); },
      tasks: [
        { label: 'R2 n’a plus de route vers les /64 du réseau 1 et 2', check: function (n) { return !n.dev('R2').cfg.routes6.some(function (r) { return r.len === 64; }); } },
        { label: 'R2 a la route récapitulative 2001:db8:1::/48 vers fc00::1', check: function (n) { return n.dev('R2').cfg.routes6.some(function (r) { return r.len === 48 && NET.eq6(NET.fmt6(r.w), '2001:db8:1::') && r.nh && NET.eq6(NET.fmt6(r.nh), 'fc00::1'); }); } },
        { label: 'PC0 joint toujours PC1 et PC2', check: function (n) { return ping6(n, 'PC0', 'PC1') && ping6(n, 'PC0', 'PC2'); } },
        { label: 'Fa0/1 de R2 : serveur DHCPv6 « sansetat » et indicateur O', check: function (n) { var i = n.iface(n.dev('R2'), 'FastEthernet0/1'); return i.v6.dhcp === 'sansetat' && i.v6.ndO; } },
        { label: 'PC0 reçoit le DNS 2001:db8:2::53', check: function (n) { var c = v6(n, 'PC0'); return !!c.dns && NET.eq6(NET.fmt6(c.dns), '2001:db8:2::53'); } }
      ],
      hints: ['R2 : <code>no ipv6 route 2001:db8:1:1::/64 fc00::1</code>, idem pour 1:2, puis <code>ipv6 route 2001:db8:1::/48 fc00::1</code>.', '<code>ipv6 dhcp pool sansetat</code> → <code>dns-server 2001:db8:2::53</code>.', '<code>interface fa0/1</code> → <code>ipv6 dhcp server sansetat</code> → <code>ipv6 nd other-config-flag</code>.'],
      solution: [{ dev: 'R2', cli: ['conf t', 'no ipv6 route 2001:db8:1:1::/64 fc00::1', 'no ipv6 route 2001:db8:1:2::/64 fc00::1', 'ipv6 route 2001:db8:1::/48 fc00::1', 'ipv6 dhcp pool sansetat', 'dns-server 2001:db8:2::53', 'exit', 'interface fa0/1', 'ipv6 dhcp server sansetat', 'ipv6 nd other-config-flag', 'end'] }],
      explain: 'Une seule route couvre les deux réseaux (même début sur 48 bits). Avec l’indicateur O, PC0 garde son adresse SLAAC mais demande le DNS au serveur DHCPv6 : c’est le « DHCPv6 sans état ». Vérifie avec <code>show ipv6 dhcp interface</code>.' }
  ]
  });
})();
