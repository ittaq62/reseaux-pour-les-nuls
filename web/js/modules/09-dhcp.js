(function () {
  function inRange(n, dev, a, b) { var h = n.dev(dev).host; return h.ip != null && h.ip >= NET.ip2int(a) && h.ip <= NET.ip2int(b); }
  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'dhcp', num: 9, icon: '📮', titre: 'DHCP et relais DHCP',
  sous: 'DORA, bail, étendues, ip helper-address, APIPA',
  source: 'Dhcp-Role (ENI), PROTOCOLE IP (BOOTP, RARP, DHCP), IMT-2026, TP1 (slides 8-9), TP1 Datamax mission 3',
  cours: `
<h3>1. À quoi sert DHCP ?</h3>
<p><b>DHCP</b> (<i>Dynamic Host Configuration Protocol</i>) configure <b>automatiquement</b> les interfaces réseau : <b>adresse IP</b>, <b>masque</b>, mais aussi <b>passerelle</b>, <b>serveurs DNS</b> et d’autres options (serveur WINS…). Avantages : plus de saisie manuelle sur chaque poste, <b>pas de conflit d’adresses</b> (jamais deux fois la même IP), administration simplifiée, et les utilisateurs peuvent être <b>mobiles</b>.</p>
<p>Historique (ton poly « Protocole IP ») : <b>RARP</b> (retrouve son IP à partir de sa MAC) → <b>BOOTP</b> (un profil fixe par machine) → <b>DHCP</b> (une simple <b>plage</b> d’adresses, relation « un à plusieurs »).</p>
<div class="nul"><b>🧠 L’analogie de l’hôtel :</b> le serveur DHCP, c’est la réception. Tu arrives (le PC démarre), tu demandes une chambre à voix haute dans le hall (broadcast), la réception te propose la 212, tu dis « je la prends », elle te donne la clé… pour une durée limitée (le <b>bail</b>). Avant la fin du séjour, tu prolonges.</div>

<h3>2. Les 4 étapes : D.O.R.A.</h3>
<div class="figure"><svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<defs><marker id="dh" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#00bceb"/></marker></defs>
<rect x="20" y="10" width="120" height="34" rx="6" fill="#556"/><text x="80" y="32" fill="#fff" text-anchor="middle" font-weight="700">Client</text>
<rect x="500" y="10" width="120" height="34" rx="6" fill="#1f6fb2"/><text x="560" y="32" fill="#fff" text-anchor="middle" font-weight="700">Serveur DHCP</text>
<line x1="80" y1="44" x2="80" y2="220" stroke="#8a9bb3" stroke-dasharray="4 4"/><line x1="560" y1="44" x2="560" y2="220" stroke="#8a9bb3" stroke-dasharray="4 4"/>
<path d="M80 70 L556 70" stroke="#00bceb" stroke-width="2.5" marker-end="url(#dh)"/><text x="320" y="63" text-anchor="middle" fill="currentColor"><tspan font-weight="700">1. DISCOVER</tspan> (broadcast) « Y a-t-il un serveur DHCP ? »</text>
<path d="M560 110 L84 110" stroke="#6cc04a" stroke-width="2.5" marker-end="url(#dh)"/><text x="320" y="103" text-anchor="middle" fill="currentColor"><tspan font-weight="700">2. OFFER</tspan> « Je te propose 192.168.20.200 »</text>
<path d="M80 150 L556 150" stroke="#00bceb" stroke-width="2.5" marker-end="url(#dh)"/><text x="320" y="143" text-anchor="middle" fill="currentColor"><tspan font-weight="700">3. REQUEST</tspan> (broadcast) « Je prends celle de ce serveur »</text>
<path d="M560 190 L84 190" stroke="#6cc04a" stroke-width="2.5" marker-end="url(#dh)"/><text x="320" y="183" text-anchor="middle" fill="currentColor"><tspan font-weight="700">4. ACK</tspan> « C’est à toi : IP, masque, bail, passerelle, DNS »</text>
</svg><div class="figcap">Discover → Offer → Request → Acknowledgement. UDP : le serveur écoute sur le port 67, le client sur le port 68.</div></div>
<ul>
<li><b>Discover</b> : le client (qui n’a pas encore d’adresse) envoie un <b>broadcast</b>.</li>
<li><b>Offer</b> : chaque serveur qui l’entend fait une offre (le client peut en recevoir plusieurs).</li>
<li><b>Request</b> : le client retient la <b>première</b> offre et le dit à tout le monde (broadcast), ce qui informe aussi les serveurs non retenus.</li>
<li><b>ACK</b> : le serveur confirme et attribue l’adresse, le masque, la <b>durée du bail</b> et les autres paramètres.</li>
</ul>
<div class="memo"><b>📌 Le bail :</b> à <b>50 %</b> de sa durée, le client demande le renouvellement au serveur qui le lui a donné ; en cas d’échec, nouvel essai à <b>87,5 %</b>. À la fin du bail sans renouvellement, l’adresse est désactivée. Sous Windows : <code>ipconfig /release</code> puis <code>ipconfig /renew</code>.</div>
<div class="warnbox"><b>⚠ APIPA :</b> si aucun serveur ne répond, Windows (et Packet Tracer) s’attribue une adresse <b>169.254.x.x/16</b> (« DHCP failed. APIPA is being used »). Si tu vois 169.254, c’est que <b>DHCP ne marche pas</b> : câble, VLAN, serveur arrêté, relais manquant…</div>

<h3>3. Le relais DHCP</h3>
<p>Le Discover est un <b>broadcast</b> : il <b>ne traverse pas les routeurs</b>. Sans rien faire, il faudrait un serveur DHCP par réseau (coûteux). Solution : le <b>relais DHCP</b>. Le routeur récupère les demandes du réseau A et les transmet (en unicast) au serveur situé sur le réseau B.</p>
<div class="demo dark">Router(config)#interface g0/0/0.10                     ← l’interface du réseau des CLIENTS (DEV)
Router(config-subif)#ip helper-address 192.168.20.100   ← l’adresse du SERVEUR DHCP</div>
<p>Le serveur sait choisir la bonne étendue grâce à l’adresse de l’interface du relais (ici 192.168.10.254 → étendue DEV) : il lui faut donc <b>une étendue par réseau</b> desservi.</p>
<div class="tip"><b>✔ Où mettre le helper ?</b> Sur l’interface (ou sous-interface) du routeur <b>côté clients</b>, jamais côté serveur. Dans le TP1 : sur G0/0/0.10 (DEV) et G0/0/0.30 (COM) ; pas besoin sur .20 car le serveur est déjà dans le réseau ADM.</div>

<h3>4. Configurer un serveur DHCP</h3>
<h4>Sur un serveur Packet Tracer (Services → DHCP)</h4>
<table><tr><th>Champ</th><th>Exemple TP1 (étendue ADM)</th></tr>
<tr><td>Service</td><td><b>On</b></td></tr><tr><td>Pool Name</td><td>ADM (le pool par défaut s’appelle serverPool)</td></tr>
<tr><td>Default Gateway</td><td>192.168.20.254</td></tr><tr><td>DNS Server</td><td>192.168.20.100</td></tr>
<tr><td>Start IP Address</td><td>192.168.20.200</td></tr><tr><td>Subnet Mask</td><td>255.255.255.0</td></tr>
<tr><td>Maximum Number of Users</td><td>50 (→ de .200 à .249)</td></tr></table>
<p>Puis <b>Add</b> (nouveau pool) ou <b>Save</b> (modifier le pool sélectionné).</p>
<h4>Sur un routeur Cisco</h4>
<div class="demo dark">Router(config)#ip dhcp excluded-address 192.168.1.1 192.168.1.10   ← adresses à NE PAS distribuer
Router(config)#ip dhcp pool LAN
Router(dhcp-config)#network 192.168.1.0 255.255.255.0
Router(dhcp-config)#default-router 192.168.1.254
Router(dhcp-config)#dns-server 8.8.8.8
Router#show ip dhcp binding                              ← qui a reçu quoi</div>
<div class="tip"><b>✔ Côté PC :</b> Desktop → IP Configuration → cocher <b>DHCP</b>. Le message « DHCP request successful. » confirme. Dans la Command Prompt : <code>ipconfig /all</code>.</div>
`,
  questions: [
    { id: 'd1', type: 'multi', q: 'Quels paramètres un serveur DHCP peut-il fournir à un poste ?', choices: ['L’adresse IP', 'Le masque de sous-réseau', 'La passerelle par défaut', 'Les serveurs DNS', 'L’adresse MAC de la carte réseau', 'La durée du bail'], good: [0, 1, 2, 3, 5],
      hints: ['L’adresse MAC est gravée dans la carte : personne ne la « distribue ».'], explain: 'IP, masque, passerelle, DNS (et WINS…), durée du bail. La MAC appartient à la carte réseau.' },
    { id: 'd2', type: 'order', q: 'Remets les messages DHCP dans l’ordre.', items: ['DHCP Discover', 'DHCP Offer', 'DHCP Request', 'DHCP ACK'],
      hints: ['Moyen mnémotechnique : D.O.R.A.'], explain: 'Discover → Offer → Request → ACK.' },
    { id: 'd3', type: 'qcm', q: 'Pourquoi le <b>Discover</b> est-il envoyé en <b>broadcast</b> ?', choices: ['Pour aller plus vite', 'Parce que le client n’a pas encore d’adresse IP et ne connaît pas l’adresse du serveur', 'Pour prévenir les routeurs', 'Parce que DHCP utilise TCP'], good: 1,
      hints: ['Le client part de zéro…'], explain: 'Le client n’a ni adresse, ni connaissance du serveur : il crie à tout le réseau local (255.255.255.255).' },
    { id: 'd4', type: 'text', q: 'Ports UDP de DHCP :', fields: [{ label: 'côté serveur', kind: 'int', answer: 67 }, { label: 'côté client', kind: 'int', answer: 68 }],
      hints: ['Ce sont deux nombres qui se suivent, dans les 60.'], explain: 'Serveur : UDP <b>67</b>, client : UDP <b>68</b> (hérités de BOOTP).' },
    { id: 'd5', type: 'text', q: 'Un bail DHCP dure 8 jours. Au bout de combien de <b>jours</b> le client tente-t-il un premier renouvellement ? Et le deuxième essai (en jours, décimal accepté) ?',
      fields: [{ label: '1er essai (50 %)', kind: 'num', answer: 4 }, { label: '2e essai (87,5 %)', kind: 'num', answer: 7 }],
      hints: ['50 % de 8, puis 87,5 % de 8.'], explain: '4 jours (50 %), puis 7 jours (87,5 %). Sans réponse à la fin du bail, l’adresse est désactivée.' },
    { id: 'd6', type: 'qcm', q: 'Un PC en DHCP affiche l’adresse <code>169.254.23.7</code>. Qu’en conclus-tu ?', choices: ['Tout va bien, c’est une adresse privée normale', 'Le PC n’a reçu aucune réponse DHCP : il s’est attribué une adresse APIPA', 'Le serveur DHCP distribue la plage 169.254', 'Le PC est en IPv6'], good: 1,
      hints: ['169.254 = « je me débrouille tout seul ».'], explain: 'APIPA : aucun serveur n’a répondu. Vérifie le câble, le VLAN, le service DHCP et le relais.' },
    { id: 'd7', type: 'qcm', q: 'Pourquoi a-t-on besoin d’un <b>relais DHCP</b> ?', choices: ['Pour chiffrer les échanges DHCP', 'Parce que les broadcasts DHCP ne traversent pas les routeurs : sans relais il faudrait un serveur par réseau', 'Pour doubler la durée des baux', 'Pour attribuer des adresses publiques'], good: 1,
      hints: ['Un routeur ne transmet jamais les diffusions.'], explain: 'Le relais (ip helper-address) transforme la demande en unicast vers le serveur d’un autre réseau.' },
    { id: 'd8', type: 'text', q: 'Le serveur DHCP est en 192.168.20.100. Quelle commande tapes-tu sur la sous-interface du réseau DEV du routeur ?', kind: 'text',
      accept: ['ip helper-address 192.168.20.100', /^ip\s+helper-address\s+192\.168\.20\.100$/i], ph: 'ip …',
      hints: ['Le mot-clé est « helper-address ».'], explain: '<code>ip helper-address 192.168.20.100</code>, sur l’interface <b>côté clients</b>.' },
    { id: 'd9', type: 'text', q: '<b>TP1 Datamax, mission 3</b> — plage 192.168.100.1 à 192.168.100.50, masque 255.255.255.0, passerelle 192.168.100.245, DNS 192.168.1.2. Que saisis-tu dans le formulaire DHCP du serveur Packet Tracer ?',
      fields: [{ label: 'Default Gateway', kind: 'ip', answer: '192.168.100.245' }, { label: 'DNS Server', kind: 'ip', answer: '192.168.1.2' }, { label: 'Start IP Address', kind: 'ip', answer: '192.168.100.1' }, { label: 'Subnet Mask', kind: 'maskdot', answer: '255.255.255.0' }, { label: 'Maximum Number of Users', kind: 'int', answer: 50 }],
      hints: ['Packet Tracer ne demande pas l’adresse de fin mais le <b>nombre</b> d’adresses : de .1 à .50, ça fait combien ?'], explain: 'Start 192.168.100.1 + 50 utilisateurs = .1 à .50.' },
    { id: 'd10', type: 'match', q: 'Associe chaque ancêtre / protocole à sa description.', pairs: [['RARP', 'Retrouve son adresse IP à partir de sa MAC (serveur RARP)'], ['BOOTP', 'Un profil fixe par machine, défini par l’administrateur'], ['DHCP', 'Attribution dynamique depuis une plage, relation « un à plusieurs »']],
      hints: ['BOOTP a été conçu pour les stations sans disque, avec une base de profils.'], explain: 'RARP → BOOTP → DHCP : de plus en plus automatique et souple.' },
    { id: 'd-lab1', type: 'pt', file: 'DHCP-routeur.pkt', tag: 'DHCP IOS',
      q: 'Le routeur <b>R-DHCP</b> (G0/0 = 192.168.1.254/24) doit distribuer les adresses du LAN : pool <b>LAN</b>, réseau 192.168.1.0/24, passerelle 192.168.1.254, DNS <b>8.8.8.8</b>. Les adresses <b>192.168.1.1 à 192.168.1.10</b> sont réservées (imprimantes) et ne doivent pas être distribuées. Les 3 PC sont déjà en mode DHCP (ils ont pour l’instant une adresse APIPA).',
      build: function () {
        var n = LAB.make({
          devices: [['R-DHCP', '1941', 500, 80], ['Switch0', '2960-24TT', 500, 230], ['PC0', 'PC-PT', 250, 380], ['PC1', 'PC-PT', 500, 400], ['PC2', 'PC-PT', 750, 380]],
          links: [['R-DHCP', 'GigabitEthernet0/0', 'Switch0', 'GigabitEthernet0/1', 'straight'], ['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'], ['PC2', 'FastEthernet0', 'Switch0', 'FastEthernet0/3', 'straight']],
          cli: { 'R-DHCP': ['conf t', 'hostname R-DHCP', 'interface g0/0', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'end'] }
        });
        ['PC0', 'PC1', 'PC2'].forEach(function (p) { LAB.host(n, p, { dhcp: true }); });
        n.events = []; return n;
      },
      tasks: [
        { label: 'PC0 obtient une adresse 192.168.1.x avec la passerelle 192.168.1.254', check: function (n) { return LAB.dhcpGets(n, 'PC0', '192.168.1.0/24', '192.168.1.254'); } },
        { label: 'PC1 et PC2 obtiennent aussi une adresse du réseau', check: function (n) { return LAB.dhcpGets(n, 'PC1', '192.168.1.0/24') && LAB.dhcpGets(n, 'PC2', '192.168.1.0/24'); } },
        { label: 'Aucun PC ne reçoit une adresse réservée (.1 à .10)', check: function (n) { return ['PC0', 'PC1', 'PC2'].every(function (p) { var h = n.dev(p).host; return h.ip != null && h.ip > NET.ip2int('192.168.1.10') && h.ip < NET.ip2int('192.168.1.254'); }); } },
        { label: 'Les PC reçoivent le DNS 8.8.8.8', check: function (n) { return ['PC0', 'PC1', 'PC2'].every(function (p) { return n.dev(p).host.dns === NET.ip2int('8.8.8.8'); }); } },
        { label: 'PC0 joint PC2', check: function (n) { return n.canPing('PC0', 'PC2'); } }
      ],
      hints: ['D’abord les exclusions (en mode config globale) : <code>ip dhcp excluded-address 192.168.1.1 192.168.1.10</code>.', 'Puis <code>ip dhcp pool LAN</code> → <code>network 192.168.1.0 255.255.255.0</code> → <code>default-router 192.168.1.254</code> → <code>dns-server 8.8.8.8</code>.', 'Sur chaque PC, reclique sur DHCP (ou <code>ipconfig /renew</code>) pour redemander une adresse.'],
      solution: [{ dev: 'R-DHCP', cli: ['conf t', 'ip dhcp excluded-address 192.168.1.1 192.168.1.10', 'ip dhcp pool LAN', 'network 192.168.1.0 255.255.255.0', 'default-router 192.168.1.254', 'dns-server 8.8.8.8', 'end'] }],
      explain: 'Les PC reçoivent 192.168.1.11, .12, .13 (première adresse libre après les exclusions ; le routeur ne distribue jamais sa propre adresse .254). Vérifie avec <code>show ip dhcp binding</code>.' },
    { id: 'd-lab2', type: 'pt', file: 'TP1-DHCP-relais.pkt', tag: 'DHCP + relais',
      q: '<b>TP1 — serveur DHCP et relais.</b> Le réseau du TP1 est routé (router-on-a-stick fait). Un serveur <b>SERV-INFRA</b> a été installé dans le bureau B04 (Fa0/7, VLAN ADM) avec l’adresse fixe <b>192.168.20.100</b>. Configure sur ce serveur <b>2 étendues</b> : ADM (début 192.168.20.200, 50 adresses, passerelle 192.168.20.254, DNS 192.168.20.100) et DEV (début 192.168.10.200, 50 adresses, passerelle 192.168.10.254, même DNS), active le service, puis configure le <b>relais DHCP</b> sur le routeur pour le réseau DEV. Les PC B01 (ADM) et B11 (DEV) sont passés en DHCP.',
      build: function () {
        var n = LAB.solved('v-lab2');
        var s = n.addDevice('Server-PT', 250, 420, 'SERV-INFRA');
        n.connect('SERV-INFRA', 'FastEthernet0', 'Sw-Bat-1', 'FastEthernet0/7', 'straight', true);
        LAB.host(n, 'SERV-INFRA', { ip: '192.168.20.100', mask: '255.255.255.0', gw: '192.168.20.254', dns: '192.168.20.100' });
        s.services.dhcp = { on: false, pools: [{ name: 'serverPool', network: '192.168.20.0', mask: '255.255.255.0', gateway: '0.0.0.0', dns: '0.0.0.0', start: '192.168.20.0', end: '192.168.20.255', max: 256 }] };
        ['B01', 'B11'].forEach(function (p) { LAB.host(n, p, { dhcp: true }); });
        n.events = []; n.touch(); return n;
      },
      tasks: [
        { label: 'Le service DHCP de SERV-INFRA est activé', check: function (n) { return n.dev('SERV-INFRA').services.dhcp.on; } },
        { label: 'B01 (ADM) obtient une adresse entre 192.168.20.200 et 192.168.20.249, passerelle 192.168.20.254', check: function (n) { return LAB.dhcpGets(n, 'B01', '192.168.20.0/24', '192.168.20.254') && inRange(n, 'B01', '192.168.20.200', '192.168.20.249'); } },
        { label: 'B01 reçoit le DNS 192.168.20.100', check: function (n) { return n.dev('B01').host.dns === NET.ip2int('192.168.20.100'); } },
        { label: 'Relais configuré sur la sous-interface du réseau DEV', check: function (n) { return n.dev('Router-INTERVLAN').ifaces.some(function (i) { return i.encap && i.encap.vlan === 10 && i.helper.indexOf(NET.ip2int('192.168.20.100')) >= 0; }); } },
        { label: 'B11 (DEV) obtient une adresse entre 192.168.10.200 et 192.168.10.249, passerelle 192.168.10.254', check: function (n) { return LAB.dhcpGets(n, 'B11', '192.168.10.0/24', '192.168.10.254') && inRange(n, 'B11', '192.168.10.200', '192.168.10.249'); } },
        { label: 'B11 joint le serveur SERV-INFRA', check: function (n) { return n.canPing('B11', 'SERV-INFRA'); } }
      ],
      hints: ['Serveur → onglet <b>Services</b> → <b>DHCP</b>. Modifie serverPool (ou ajoute un pool ADM) : Default Gateway 192.168.20.254, DNS 192.168.20.100, Start IP 192.168.20.200, Maximum Number of Users 50 → Save/Add. Puis ajoute le pool DEV (réseau 192.168.10.0, début 192.168.10.200). N’oublie pas <b>Service : On</b>.', 'Routeur : <code>interface g0/0/0.10</code> → <code>ip helper-address 192.168.20.100</code>.', 'Sur B01 et B11 : Desktop → IP Configuration → reclique sur DHCP.'],
      solution: [
        { text: 'SERV-INFRA → Services → DHCP : Service <b>On</b>, pool ADM (passerelle 192.168.20.254, DNS 192.168.20.100, début 192.168.20.200, 50 utilisateurs) et pool DEV (passerelle 192.168.10.254, DNS 192.168.20.100, début 192.168.10.200, 50 utilisateurs).',
          fn: function (n) { n.dev('SERV-INFRA').services.dhcp = { on: true, pools: [
            { name: 'serverPool', network: '192.168.20.0', mask: '255.255.255.0', gateway: '192.168.20.254', dns: '192.168.20.100', start: '192.168.20.200', end: '192.168.20.249', max: 50 },
            { name: 'DEV', network: '192.168.10.0', mask: '255.255.255.0', gateway: '192.168.10.254', dns: '192.168.20.100', start: '192.168.10.200', end: '192.168.10.249', max: 50 }] }; } },
        { dev: 'Router-INTERVLAN', cli: ['conf t', 'interface g0/0/0.10', 'ip helper-address 192.168.20.100', 'end'] },
        { dhcp: true, dev: 'B01' }, { dhcp: true, dev: 'B11' }
      ],
      explain: 'C’est exactement le corrigé CORR-TP1 du prof : pools serverPool (ADM), DEV et COM sur le serveur, <code>ip helper-address 192.168.20.100</code> sur les sous-interfaces .10 et .30. B01 reçoit 192.168.20.200 directement (même réseau que le serveur) ; B11 reçoit 192.168.10.200 grâce au relais.' }
  ]
  });
})();
