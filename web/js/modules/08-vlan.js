(function () {
  /* TP1 « Situation 2 » : bâtiment DEV / ADM / COM, 3 étages × 4 bureaux × 2 prises.
     Logique de câblage du corrigé : B01 → Fa0/1-2, B02 → 3-4, B03 → 5-6, B04 → 7-8,
     B11 → 9-10, B12 → 11-12, B13 → 13-14, B14 → 15-16, B21 → 17-18, B22 → 19-20, B23 → 21-22, B24 → 23-24 */
  var ADM_PORTS = LAB.range('FastEthernet0/', 1, 8).concat(['FastEthernet0/15', 'FastEthernet0/16']);
  var DEV_PORTS = LAB.range('FastEthernet0/', 9, 12).concat(LAB.range('FastEthernet0/', 17, 22));
  var COM_PORTS = ['FastEthernet0/13', 'FastEthernet0/14', 'FastEthernet0/23', 'FastEthernet0/24'];
  var SW_VLAN_CLI = ['conf t', 'hostname Sw-Bat-1', 'vlan 10', 'name DEV', 'vlan 20', 'name ADM', 'exit',
    'interface range fa0/1-8, fa0/15-16', 'switchport mode access', 'switchport access vlan 20',
    'interface range fa0/9-12, fa0/17-22', 'switchport mode access', 'switchport access vlan 10', 'end'];
  var PCS = [['B01', 'FastEthernet0/1', 120, 90], ['B02', 'FastEthernet0/3', 120, 190], ['B14', 'FastEthernet0/15', 120, 290], ['B11', 'FastEthernet0/9', 760, 120], ['B22', 'FastEthernet0/19', 760, 260]];
  function baseTP1(withRouter) {
    var devs = [['Sw-Bat-1', '2960-24TT', 440, 200]];
    var links = [];
    PCS.forEach(function (p) { devs.push([p[0], 'PC-PT', p[2], p[3]]); links.push([p[0], 'FastEthernet0', 'Sw-Bat-1', p[1], 'straight']); });
    if (withRouter) {
      devs.push(['B13', 'PC-PT', 440, 400]); links.push(['B13', 'FastEthernet0', 'Sw-Bat-1', 'FastEthernet0/13', 'straight']);
      devs.push(['Router-INTERVLAN', 'ISR4331', 440, 60]); links.push(['Sw-Bat-1', 'GigabitEthernet0/1', 'Router-INTERVLAN', 'GigabitEthernet0/0/0', 'straight']);
    }
    return { devices: devs, links: links };
  }
  var HOSTS = { B01: '192.168.20.1', B02: '192.168.20.2', B14: '192.168.20.3', B11: '192.168.10.1', B22: '192.168.10.2', B13: '192.168.30.1' };
  function hostsSol(withGw) {
    return Object.keys(HOSTS).map(function (k) {
      var h = { ip: HOSTS[k], mask: '255.255.255.0' };
      if (withGw) h.gw = HOSTS[k].replace(/\.\d+$/, '.254');
      return { dev: k, host: h };
    });
  }
  function trunkUp(n, a, ap, b, bp) { var da = n.dev(a), db = n.dev(b); return n.opMode(da, n.iface(da, ap)) === 'trunk' && n.opMode(db, n.iface(db, bp)) === 'trunk' && LAB.linkedPorts(n, a, ap, b, bp); }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'vlan', num: 8, icon: '🏷️', titre: 'VLAN et routage inter-VLAN',
  sous: 'VLAN par port, 802.1Q, trunk, router-on-a-stick',
  source: 'SEGMENTATION (ENI) §2, IMT-2026 (VLAN), TP1-CONCEPTION ET CONFIGURATION RESEAU, CORR-TP1.pkt, TP1 Datamax',
  cours: `
<h3>1. Un VLAN, c’est quoi ?</h3>
<p>Un <b>VLAN</b> (<i>Virtual LAN</i>) permet de créer <b>plusieurs domaines de diffusion sur un même switch physique</b>. C’est une <b>segmentation logique</b> (logicielle), configurée sur les commutateurs. Deux machines ne peuvent se parler directement que si elles sont <b>dans le même VLAN</b>.</p>
<div class="nul"><b>🧠 L’analogie de l’open-space :</b> un switch sans VLAN, c’est un grand open-space où tout le monde entend tout le monde. Les VLAN, ce sont des <b>cloisons invisibles</b> : les développeurs, l’administration et la production travaillent dans la même pièce (le même switch) mais ne s’entendent plus. Pour passer d’une « pièce » à l’autre, il faut passer par la porte : <b>le routeur</b>.</div>
<p>Règle d’or : <b>1 VLAN = 1 domaine de diffusion = 1 réseau IP</b>. Dans ton TP1 : DEV = VLAN 10 = 192.168.10.0/24, ADM = VLAN 20 = 192.168.20.0/24, COM = VLAN 30 = 192.168.30.0/24.</p>
<h4>Comment une machine est-elle placée dans un VLAN ?</h4>
<ul><li><b>Par port</b> (90 % des cas) : on configure le port du switch dans un VLAN ; tout ce qui s’y branche en fait partie.</li>
<li><b>Par adresse MAC</b> : le switch reconnaît la MAC (ou juste l’OUI du constructeur, pratique pour les téléphones IP).</li>
<li><b>Par identification de l’utilisateur</b> : login/mot de passe via <b>802.1X</b> + serveur <b>Radius</b> (assignation dynamique).</li></ul>

<h3>2. La norme 802.1Q (dot1q)</h3>
<p>Quand plusieurs VLAN doivent passer sur <b>un seul câble</b> (entre deux switchs, ou vers un routeur), on <b>étiquette</b> les trames : la norme <b>IEEE 802.1Q</b> (1999, successeur du protocole Cisco propriétaire <b>ISL</b>) insère dans la trame Ethernet un <b>tag de 4 octets</b> contenant le <b>VID</b> (VLAN ID) codé sur <b>12 bits</b> → 4096 valeurs, le 0 et le 4095 étant réservés : <b>4094 VLAN</b> utilisables. Pour aller au-delà (opérateurs), on empile deux tags : <b>QinQ (802.1ad)</b>.</p>
<div class="figure"><svg viewBox="0 0 720 90" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12" font-weight="700">
<rect x="10" y="30" width="110" height="34" fill="#3a6d8c"/><text x="65" y="52" fill="#fff" text-anchor="middle">MAC dest.</text>
<rect x="120" y="30" width="110" height="34" fill="#3a6d8c"/><text x="175" y="52" fill="#fff" text-anchor="middle">MAC source</text>
<rect x="230" y="30" width="120" height="34" fill="#fbab18"/><text x="290" y="52" fill="#000" text-anchor="middle">TAG 802.1Q</text>
<rect x="350" y="30" width="70" height="34" fill="#3a6d8c"/><text x="385" y="52" fill="#fff" text-anchor="middle">Type</text>
<rect x="420" y="30" width="220" height="34" fill="#5b7fa0"/><text x="530" y="52" fill="#fff" text-anchor="middle">Données</text>
<rect x="640" y="30" width="70" height="34" fill="#3a6d8c"/><text x="675" y="52" fill="#fff" text-anchor="middle">FCS</text>
<text x="290" y="20" fill="#fbab18" text-anchor="middle">4 octets dont le VID (12 bits)</text>
</svg><div class="figcap">La trame étiquetée : le tag est inséré après les adresses MAC.</div></div>
<table><tr><th>Type de port</th><th>Cisco</th><th>Ce qui y passe</th></tr>
<tr><td><b>Access</b> (non tagué / <i>untagged</i>)</td><td><code>switchport mode access</code><br><code>switchport access vlan 20</code></td><td>un <b>seul</b> VLAN, trames <b>sans</b> étiquette (vers un PC, une imprimante…)</td></tr>
<tr><td><b>Trunk</b> (tagué / <i>tagged</i>)</td><td><code>switchport mode trunk</code></td><td><b>plusieurs</b> VLAN, trames étiquetées (entre switchs, vers un routeur, une borne Wi-Fi, un hyperviseur)</td></tr>
<tr><td>Voice</td><td><code>switchport voice vlan 20</code></td><td>un VLAN data non tagué (le PC) + un VLAN voix tagué (le téléphone IP)</td></tr></table>
<div class="memo"><b>📌 Le VLAN natif :</b> sur un trunk, les trames <b>non étiquetées</b> sont placées dans le <b>VLAN natif</b> (VLAN 1 par défaut). Il doit être <b>le même</b> des deux côtés du trunk.</div>
<div class="warnbox"><b>⚠ Le piège du trunk qui ne monte pas (DTP) :</b> par défaut, un port de 2960 est en <code>dynamic auto</code> : il devient trunk seulement si l’autre côté le <b>demande</b> (<code>trunk</code> ou <code>dynamic desirable</code>). Deux ports <code>dynamic auto</code> face à face restent en <b>access VLAN 1</b> → seul le VLAN 1 passe ! Mets au moins un côté (idéalement les deux) en <code>switchport mode trunk</code>. Et face à un routeur (qui ne négocie pas), le port du switch doit être forcé en trunk.</div>

<h3>3. Configurer les VLAN sur un switch Cisco</h3>
<div class="demo dark">Switch(config)#vlan 20                         ← crée le VLAN 20
Switch(config-vlan)#name ADM                    ← lui donne un nom
Switch(config-vlan)#exit
Switch(config)#interface range fa0/1-8, fa0/15-16
Switch(config-if-range)#switchport mode access
Switch(config-if-range)#switchport access vlan 20
Switch(config-if-range)#exit
Switch(config)#interface g0/1
Switch(config-if)#switchport mode trunk
Switch#show vlan brief                          ← vérifie : quels ports dans quel VLAN
Switch#show interfaces trunk                    ← vérifie les trunks</div>
<ul><li>Tous les ports sont par défaut dans le <b>VLAN 1</b> (« default », impossible à supprimer).</li>
<li>Si tu mets un port dans un VLAN qui n’existe pas encore, Cisco le crée tout seul (« % Access VLAN does not exist. Creating vlan 30 ») — mais sans nom.</li>
<li>Dans Packet Tracer, l’onglet <b>Config → VLAN Database</b> (numéro + nom + Add) et la liste déroulante <b>VLAN</b> de chaque interface font la même chose.</li></ul>

<h3>4. Faire communiquer les VLAN : le routage inter-VLAN</h3>
<p>Deux VLAN = deux réseaux IP : il faut un <b>routeur</b> (ou un switch de niveau 3). Trois solutions :</p>
<table><tr><th>Solution</th><th>Principe</th><th>Limite</th></tr>
<tr><td><b>Une interface par VLAN</b> (TP1, slide 7)</td><td>chaque interface physique du routeur est branchée sur un port access d’un VLAN, avec la <b>dernière adresse</b> du réseau</td><td>5 VLAN = 5 interfaces et 5 câbles…</td></tr>
<tr><td><b>Router-on-a-stick</b> (TP1, slide 10)</td><td><b>un seul câble</b> en trunk ; le routeur crée des <b>sous-interfaces</b> virtuelles, une par VLAN</td><td>tout le trafic inter-VLAN partage un lien</td></tr>
<tr><td><b>Switch de niveau 3</b></td><td>interfaces virtuelles <code>interface vlan 10</code> (SVI) + <code>ip routing</code></td><td>matériel plus cher</td></tr></table>
<div class="demo dark">Router(config)#interface g0/0/0
Router(config-if)#no shutdown                         ← l’interface physique doit être active
Router(config-if)#interface g0/0/0.10                 ← sous-interface n°10
Router(config-subif)#encapsulation dot1Q 10           ← elle traite les trames taguées 10
Router(config-subif)#ip address 192.168.10.254 255.255.255.0
Router(config-subif)#interface g0/0/0.20
Router(config-subif)#encapsulation dot1Q 20
Router(config-subif)#ip address 192.168.20.254 255.255.255.0</div>
<div class="tip"><b>✔ Côté PC :</b> la <b>passerelle par défaut</b> de chaque PC = l’adresse du routeur <b>dans son VLAN</b> (192.168.10.254 pour DEV, 192.168.20.254 pour ADM…). Sans elle, le PC ne sait pas sortir de son réseau.</div>
<div class="warnbox"><b>⚠ Erreurs classiques :</b> oublier <code>no shutdown</code> sur l’interface physique ; oublier <code>encapsulation dot1Q</code> <b>avant</b> l’adresse IP (IOS refuse l’adresse) ; port du switch vers le routeur pas en trunk ; VLAN non créé sur le switch.</div>
`,
  questions: [
    { id: 'v1', type: 'qcm', q: 'Qu’apporte un VLAN ?', choices: ['Plus de débit sur le switch', 'Plusieurs domaines de diffusion sur un même switch physique (segmentation logique)', 'Une connexion Wi-Fi', 'La traduction d’adresses privées en publiques'], good: 1,
      hints: ['« Virtual LAN » : plusieurs réseaux locaux virtuels sur le même matériel.'], explain: 'Un VLAN = un domaine de diffusion (et un réseau IP). Les machines de VLAN différents ne se parlent pas sans routeur.' },
    { id: 'v2', type: 'match', q: 'Associe chaque méthode d’affectation à un VLAN à sa description.',
      pairs: [['VLAN par port', 'Le port du switch est configuré dans un VLAN (90 % des cas)'], ['VLAN par adresse MAC', 'Le switch associe l’adresse MAC (ou l’OUI) de la machine à un VLAN'], ['VLAN par utilisateur (802.1X)', 'Login / mot de passe vérifiés par un serveur Radius, VLAN attribué dynamiquement']],
      hints: ['Radius et 802.1X servent à l’authentification.'], explain: 'Par port (le plus courant), par MAC (téléphonie IP), par utilisateur (802.1X + Radius).' },
    { id: 'v3', type: 'text', q: 'Quelle norme IEEE définit l’étiquetage (tagging) des trames VLAN ?', kind: 'word', accept: ['802.1Q', '8021q', 'dot1q'], ph: '802.…',
      hints: ['« dot1q » chez Cisco.'], explain: '<b>IEEE 802.1Q</b> (1999), successeur de ISL (Cisco). QinQ = 802.1ad.' },
    { id: 'v4', type: 'text', q: 'Complète sur le tag 802.1Q.', fields: [{ label: 'Taille du tag (octets)', kind: 'int', answer: 4 }, { label: 'Taille du VID (bits)', kind: 'int', answer: 12 }, { label: 'Nombre de VLAN utilisables', kind: 'int', answer: 4094 }],
      hints: ['2<sup>12</sup> = 4096, moins le VLAN 0 et le 4095 réservés.'], explain: 'Tag de 4 octets, VID sur 12 bits, 4094 VLAN utilisables (1 à 4094).' },
    { id: 'v5', type: 'match', q: 'Access ou trunk ?',
      pairs: [['Port relié à un PC du service ADM', 'Access'], ['Liaison entre deux switchs transportant 3 VLAN', 'Trunk'], ['Port du switch relié au routeur « router-on-a-stick »', 'Trunk'], ['Port relié à une imprimante', 'Access'], ['Port relié à une borne Wi-Fi avec 2 SSID (clients / personnel)', 'Trunk']],
      hints: ['Un seul VLAN → access ; plusieurs VLAN sur le même câble → trunk.'], explain: 'Access = un VLAN non tagué (terminal). Trunk = plusieurs VLAN tagués (switch, routeur, borne multi-SSID, hyperviseur).' },
    { id: 'v6', type: 'qcm', q: 'Sur un trunk, que devient une trame qui arrive <b>sans étiquette</b> ?', choices: ['Elle est jetée', 'Elle est placée dans le VLAN natif (VLAN 1 par défaut)', 'Elle est envoyée dans tous les VLAN', 'Elle est renvoyée à l’émetteur'], good: 1,
      hints: ['PVID / VLAN natif.'], explain: 'Les trames non taguées d’un trunk vont dans le <b>VLAN natif</b> (VLAN 1 par défaut ; à changer avec <code>switchport trunk native vlan</code>, identique des deux côtés).' },
    { id: 'v7', type: 'qcm', q: 'Deux 2960 sont reliés G0/1 ⟷ G0/1. Aucune configuration sur ces ports. Les PC du VLAN 30 de chaque switch arrivent-ils à se pinguer ?', choices: ['Oui, les VLAN passent automatiquement', 'Non : les deux ports sont en dynamic auto, le lien reste en access VLAN 1', 'Oui, mais seulement en IPv6', 'Non, il faut un câble droit'], good: 1,
      hints: ['DTP : « auto » attend qu’on lui demande d’être trunk…'], explain: '<code>dynamic auto</code> + <code>dynamic auto</code> = access. Il faut <code>switchport mode trunk</code> d’au moins un côté (de préférence les deux).' },
    { id: 'v8', type: 'order', q: 'Remets dans l’ordre la configuration d’un VLAN par port sur un switch Cisco.',
      items: ['configure terminal', 'vlan 20', 'name ADM', 'exit', 'interface range fa0/1-8', 'switchport mode access', 'switchport access vlan 20', 'end', 'show vlan brief'],
      hints: ['On crée et nomme le VLAN, puis on y met les ports, puis on vérifie.'], explain: 'Créer (vlan 20), nommer (name), affecter les ports (interface range + switchport), vérifier (show vlan brief).' },
    { id: 'v-lab1', type: 'pt', file: 'TP1-Situation2.pkt', tag: 'VLAN',
      q: '<b>TP1 — Situation 2.</b> Un bâtiment de 3 étages, 4 bureaux par étage, 2 prises par bureau, câblées dans l’ordre sur le switch <b>Sw-Bat-1</b> : B01 → Fa0/1-2, B02 → Fa0/3-4, B03 → Fa0/5-6, B04 → Fa0/7-8, B11 → Fa0/9-10, B12 → Fa0/11-12, B13 → Fa0/13-14, B14 → Fa0/15-16, B21 → Fa0/17-18, B22 → Fa0/19-20, B23 → Fa0/21-22, B24 → Fa0/23-24.<br>1) Crée le VLAN <b>20 nommé ADM</b> (bureaux B14, B01, B02, B03, B04) et le VLAN <b>10 nommé DEV</b> (bureaux B11, B12, B21, B22, B23), et affecte <b>tous</b> les ports de ces bureaux.<br>2) Adresse les PC déjà branchés : ADM = 192.168.20.0/24 (B01, B02, B14), DEV = 192.168.10.0/24 (B11, B22).',
      build: function () { return LAB.make(baseTP1(false)); },
      tasks: [
        { label: 'VLAN 20 nommé ADM', check: function (n) { return LAB.vlanName(n, 'Sw-Bat-1', 20, 'ADM'); } },
        { label: 'VLAN 10 nommé DEV', check: function (n) { return LAB.vlanName(n, 'Sw-Bat-1', 10, 'DEV'); } },
        { label: 'Les 10 ports des bureaux ADM (Fa0/1-8, Fa0/15-16) sont dans le VLAN 20', check: function (n) { return LAB.accessVlan(n, 'Sw-Bat-1', ADM_PORTS, 20); } },
        { label: 'Les 10 ports des bureaux DEV (Fa0/9-12, Fa0/17-22) sont dans le VLAN 10', check: function (n) { return LAB.accessVlan(n, 'Sw-Bat-1', DEV_PORTS, 10); } },
        { label: 'B01, B02 et B14 sont adressés dans 192.168.20.0/24', check: function (n) { return ['B01', 'B02', 'B14'].every(function (p) { return LAB.hostInNet(n, p, '192.168.20.0/24'); }); } },
        { label: 'B11 et B22 sont adressés dans 192.168.10.0/24', check: function (n) { return ['B11', 'B22'].every(function (p) { return LAB.hostInNet(n, p, '192.168.10.0/24'); }); } },
        { label: 'B01 joint B14 (même VLAN)', check: function (n) { return n.canPing('B01', 'B14'); } },
        { label: 'B11 joint B22 (même VLAN)', check: function (n) { return n.canPing('B11', 'B22'); } }
      ],
      hints: ['Onglet CLI du switch : <code>enable</code>, <code>conf t</code>, <code>vlan 20</code>, <code>name ADM</code>, <code>vlan 10</code>, <code>name DEV</code>.', '<code>interface range fa0/1-8, fa0/15-16</code> puis <code>switchport mode access</code> et <code>switchport access vlan 20</code>. Même chose avec <code>fa0/9-12, fa0/17-22</code> pour le VLAN 10.', 'PC : Desktop → IP Configuration. Par exemple B01 = 192.168.20.1, B02 = .2, B14 = .3 ; B11 = 192.168.10.1, B22 = .2 (masque 255.255.255.0).'],
      solution: [{ dev: 'Sw-Bat-1', cli: SW_VLAN_CLI }].concat(hostsSol(false).filter(function (s) { return s.dev !== 'B13'; })),
      explain: 'C’est la configuration du corrigé CORR-TP1 (ports 1-8 et 15-16 en VLAN 20, 9-12 et 17-22 en VLAN 10). Vérifie avec <code>show vlan brief</code>. Remarque : dans le fichier corrigé du prof, les noms de VLAN sont inversés (20 = « DEV ») : fie-toi à l’énoncé.' },
    { id: 'v-lab2', type: 'pt', file: 'TP1-Situation2-routage.pkt', tag: 'Router-on-a-stick',
      q: '<b>TP1 — routage avec sous-interfaces.</b> Les VLAN ADM et DEV sont en place. On ajoute le département <b>COM</b> (VLAN <b>30</b>, bureaux B13 et B24 = Fa0/13-14 et Fa0/23-24, réseau 192.168.30.0/24 ; le PC B13 est branché). Un routeur <b>Router-INTERVLAN</b> (ISR4331) est relié par un <b>seul câble</b> : G0/0/0 ⟷ Sw-Bat-1 G0/1. Configure le <b>router-on-a-stick</b> (le routeur prend la <b>dernière adresse</b> de chaque réseau, .254) et complète les PC pour que tous les départements communiquent.',
      build: function () {
        var n = LAB.make(baseTP1(true));
        LAB.cli(n, 'Sw-Bat-1', SW_VLAN_CLI);
        hostsSol(false).forEach(function (s) { LAB.host(n, s.dev, s.host); });
        n.dev('Sw-Bat-1').startup = JSON.parse(JSON.stringify({ hostname: 'Sw-Bat-1', cfg: n.dev('Sw-Bat-1').cfg, ifaces: n.dev('Sw-Bat-1').ifaces }));
        n.events = []; n.touch(); return n;
      },
      tasks: [
        { label: 'VLAN 30 nommé COM, ports Fa0/13-14 et Fa0/23-24 dedans', check: function (n) { return LAB.vlanName(n, 'Sw-Bat-1', 30, 'COM') && LAB.accessVlan(n, 'Sw-Bat-1', COM_PORTS, 30); } },
        { label: 'Le lien Sw-Bat-1 G0/1 ⟷ routeur est un trunk', check: function (n) { var d = n.dev('Sw-Bat-1'); return n.opMode(d, n.iface(d, 'GigabitEthernet0/1')) === 'trunk'; } },
        { label: 'Sous-interfaces du routeur : 192.168.10.254, 192.168.20.254, 192.168.30.254', check: function (n) {
          var d = n.dev('Router-INTERVLAN');
          return [[10, '192.168.10.254'], [20, '192.168.20.254'], [30, '192.168.30.254']].every(function (x) {
            return d.ifaces.some(function (i) { return i.parent && i.encap && i.encap.vlan === x[0] && i.ip === NET.ip2int(x[1]) && n.l3Up(d, i); });
          }); } },
        { label: 'Chaque PC a pour passerelle le .254 de son réseau', check: function (n) { return Object.keys(HOSTS).every(function (k) { return n.dev(k).host.gw === NET.ip2int(HOSTS[k].replace(/\.\d+$/, '.254')); }); } },
        { label: 'B01 (ADM) joint B11 (DEV)', check: function (n) { return n.canPing('B01', 'B11'); } },
        { label: 'B22 (DEV) joint B13 (COM)', check: function (n) { return n.canPing('B22', 'B13'); } },
        { label: 'B13 (COM) joint B14 (ADM)', check: function (n) { return n.canPing('B13', 'B14'); } }
      ],
      hints: ['Switch : <code>vlan 30</code> / <code>name COM</code>, <code>interface range fa0/13-14, fa0/23-24</code> → <code>switchport access vlan 30</code> ; puis <code>interface g0/1</code> → <code>switchport mode trunk</code>.', 'Routeur : <code>interface g0/0/0</code> → <code>no shutdown</code>, puis <code>interface g0/0/0.10</code> → <code>encapsulation dot1Q 10</code> → <code>ip address 192.168.10.254 255.255.255.0</code>. Idem pour .20 et .30.', 'PC : ajoute la passerelle (Default Gateway) : 192.168.20.254 pour ADM, 192.168.10.254 pour DEV, 192.168.30.254 pour COM.'],
      solution: [
        { dev: 'Sw-Bat-1', cli: ['conf t', 'vlan 30', 'name COM', 'exit', 'interface range fa0/13-14, fa0/23-24', 'switchport mode access', 'switchport access vlan 30', 'interface g0/1', 'switchport mode trunk', 'end'] },
        { dev: 'Router-INTERVLAN', cli: ['conf t', 'hostname Router-INTERVLAN', 'interface g0/0/0', 'no shutdown', 'interface g0/0/0.10', 'encapsulation dot1Q 10', 'ip address 192.168.10.254 255.255.255.0', 'interface g0/0/0.20', 'encapsulation dot1Q 20', 'ip address 192.168.20.254 255.255.255.0', 'interface g0/0/0.30', 'encapsulation dot1Q 30', 'ip address 192.168.30.254 255.255.255.0', 'end'] }
      ].concat(hostsSol(true)),
      explain: 'Un seul câble, trois réseaux : le trunk transporte les trames taguées 10, 20, 30 et chaque sous-interface répond pour son VLAN. Observe <code>show ip interface brief</code> sur le routeur et <code>tracert</code> depuis un PC : le 1er saut est la passerelle .254.' },
    { id: 'v9', type: 'qcm', q: 'Tu tapes <code>ip address 192.168.10.254 255.255.255.0</code> sur la sous-interface G0/0/0.10 d’un routeur, avant toute autre commande. IOS répond :',
      choices: ['Rien, c’est bon', '% Configuring IP routing on a LAN subinterface is only allowed if that subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q, or ISL vLAN.', '% Invalid input detected', 'La sous-interface passe en VLAN 1'], good: 1,
      hints: ['Il manque une commande qui dit à quel VLAN appartient la sous-interface…'], explain: 'Il faut d’abord <code>encapsulation dot1Q 10</code>, <b>puis</b> l’adresse IP.' },
    { id: 'v-lab3', type: 'pt', file: 'Datamax-open-space.pkt', tag: 'Trunk',
      q: '<b>TP1 Datamax — évolution du réseau.</b> Le switch d’étage <b>ETAGE2</b> est configuré (VLAN 10 DEVELOPPEMENT : Fa0/1-4, 20 ADMINISTRATION : Fa0/5-8, 30 PRODUCTION : Fa0/9-21). On ajoute le switch de l’open-space <b>SW-Opspc</b>, relié par les ports Gigabit (G0/1 ⟷ G0/1). Configure SW-Opspc : les <b>15 premiers ports</b> dans le VLAN production, le port <b>20</b> dans le VLAN administration (nouveau poste administrateur ADMIN-OP), et fais passer les VLAN entre les deux switchs.',
      build: function () {
        return LAB.make({
          devices: [['ETAGE2', '2960-24TT', 300, 220], ['SW-Opspc', '2960-24TT', 760, 220], ['P1', 'PC-PT', 120, 120], ['A1', 'PC-PT', 120, 320], ['P-OP1', 'PC-PT', 960, 100], ['P-OP2', 'PC-PT', 980, 220], ['ADMIN-OP', 'PC-PT', 960, 340]],
          links: [['ETAGE2', 'GigabitEthernet0/1', 'SW-Opspc', 'GigabitEthernet0/1', 'cross'], ['P1', 'FastEthernet0', 'ETAGE2', 'FastEthernet0/9', 'straight'], ['A1', 'FastEthernet0', 'ETAGE2', 'FastEthernet0/5', 'straight'],
            ['P-OP1', 'FastEthernet0', 'SW-Opspc', 'FastEthernet0/1', 'straight'], ['P-OP2', 'FastEthernet0', 'SW-Opspc', 'FastEthernet0/2', 'straight'], ['ADMIN-OP', 'FastEthernet0', 'SW-Opspc', 'FastEthernet0/20', 'straight']],
          cli: { ETAGE2: ['conf t', 'hostname ETAGE2', 'vlan 10', 'name DEVELOPPEMENT', 'vlan 20', 'name ADMINISTRATION', 'vlan 30', 'name PRODUCTION', 'exit', 'interface range fa0/1-4', 'switchport mode access', 'switchport access vlan 10', 'interface range fa0/5-8', 'switchport mode access', 'switchport access vlan 20', 'interface range fa0/9-21', 'switchport mode access', 'switchport access vlan 30', 'end'] },
          hosts: { P1: { ip: '192.168.30.1', mask: '255.255.255.0', gw: '192.168.30.254' }, A1: { ip: '192.168.20.1', mask: '255.255.255.0', gw: '192.168.20.254' }, 'P-OP1': { ip: '192.168.30.10', mask: '255.255.255.0', gw: '192.168.30.254' }, 'P-OP2': { ip: '192.168.30.11', mask: '255.255.255.0', gw: '192.168.30.254' }, 'ADMIN-OP': { ip: '192.168.20.10', mask: '255.255.255.0', gw: '192.168.20.254' } }
        });
      },
      tasks: [
        { label: 'SW-Opspc : ports Fa0/1 à Fa0/15 dans le VLAN 30', check: function (n) { return n.vlanExists(n.dev('SW-Opspc'), 30) && LAB.accessVlan(n, 'SW-Opspc', LAB.range('FastEthernet0/', 1, 15), 30); } },
        { label: 'SW-Opspc : port Fa0/20 dans le VLAN 20', check: function (n) { return LAB.accessVlan(n, 'SW-Opspc', ['FastEthernet0/20'], 20); } },
        { label: 'Le lien ETAGE2 ⟷ SW-Opspc est un trunk des deux côtés', check: function (n) { return trunkUp(n, 'ETAGE2', 'GigabitEthernet0/1', 'SW-Opspc', 'GigabitEthernet0/1'); } },
        { label: 'P-OP1 (open-space) joint P1 (étage 2) — production', check: function (n) { return n.canPing('P-OP1', 'P1'); } },
        { label: 'ADMIN-OP joint A1 — administration', check: function (n) { return n.canPing('ADMIN-OP', 'A1'); } },
        { label: 'P-OP2 ne joint pas A1 (VLAN différents, pas de routeur)', check: function (n) { return !n.canPing('P-OP2', 'A1'); } }
      ],
      hints: ['Sur SW-Opspc, crée d’abord les VLAN 20 et 30 (avec les mêmes noms qu’ETAGE2, c’est plus propre).', '<code>interface range fa0/1-15</code> → <code>switchport mode access</code> → <code>switchport access vlan 30</code> ; <code>interface fa0/20</code> → <code>switchport access vlan 20</code>.', 'Les deux ports G0/1 sont en <code>dynamic auto</code> : le lien reste en access VLAN 1. Passe-les en <code>switchport mode trunk</code> (sur les deux switchs).'],
      solution: [
        { dev: 'SW-Opspc', cli: ['conf t', 'hostname SW-Opspc', 'vlan 10', 'name DEVELOPPEMENT', 'vlan 20', 'name ADMINISTRATION', 'vlan 30', 'name PRODUCTION', 'exit', 'interface range fa0/1-15', 'switchport mode access', 'switchport access vlan 30', 'interface fa0/20', 'switchport mode access', 'switchport access vlan 20', 'interface g0/1', 'switchport mode trunk', 'end'] },
        { dev: 'ETAGE2', cli: ['conf t', 'interface g0/1', 'switchport mode trunk', 'end'] }
      ],
      explain: 'Les VLAN doivent exister sur <b>chaque</b> switch, et le lien entre eux doit être un <b>trunk</b> pour transporter les trames étiquetées 10, 20, 30. Sans routeur, production et administration restent isolés : c’est voulu.' }
  ]
  });
})();
