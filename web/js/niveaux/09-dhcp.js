/* Module 9 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).dhcp = [
  /* ---------- Débutant ---------- */
  { id: 'xd1', lvl: 1, type: 'qcm', q: 'Que signifie <b>DHCP</b> ?',
    choices: ['Dynamic Host Configuration Protocol', 'Domain Host Control Protocol', 'Direct HTTP Connection Protocol', 'Dynamic Hub Configuration Port'], good: 0,
    hints: ['Il configure dynamiquement les hôtes…'],
    explain: '<b>Dynamic Host Configuration Protocol</b> : il configure automatiquement les postes (adresse, masque, passerelle, DNS).' },
  { id: 'xd2', lvl: 1, type: 'qcm', q: 'Dans Packet Tracer, comment un PC demande-t-il une adresse à un serveur DHCP ?',
    choices: ['Desktop → IP Configuration → choisir DHCP', 'Onglet Physical → brancher un câble DHCP', 'Onglet Config → Settings → Gateway', 'Il faut redémarrer Packet Tracer'], good: 0,
    hints: ['C’est au même endroit que pour une adresse fixe (Static).'],
    explain: 'Desktop → <b>IP Configuration</b> → bouton <b>DHCP</b>. Le PC affiche « DHCP request successful. » ou, si personne ne répond, « DHCP failed. APIPA is being used. »' },
  /* ---------- Difficile ---------- */
  { id: 'xd3', lvl: 4, type: 'qcm', q: 'Sur un routeur qui sert de serveur DHCP, quelle commande montre les adresses déjà distribuées ?',
    choices: ['show ip dhcp binding', 'show dhcp clients', 'show ip interface brief', 'show arp dhcp'], good: 0,
    hints: ['« binding » = l’association adresse IP ⟷ adresse MAC du client.'],
    explain: '<code>show ip dhcp binding</code> : chaque adresse louée, l’identifiant (MAC) du client et le type. Pour la configuration du pool : <code>show running-config</code>.' },
  { id: 'xd5', lvl: 4, type: 'text', q: 'Routeur IOS : <code>ip dhcp excluded-address 192.168.5.1 192.168.5.20</code>, puis un pool <code>network 192.168.5.0 255.255.255.0</code>. Trois PC demandent une adresse l’un après l’autre.',
    fields: [{ label: 'Adresse du 1er PC', kind: 'ip', answer: '192.168.5.21' }, { label: 'Adresse du 3e PC', kind: 'ip', answer: '192.168.5.23' }],
    hints: ['Le serveur donne la première adresse libre du réseau qui n’est pas exclue.'],
    explain: '.1 à .20 sont exclues : le 1er PC reçoit <b>192.168.5.21</b>, le 2e .22, le 3e <b>.23</b>.' },
  /* ---------- Extrême ---------- */
  { id: 'xd4', lvl: 5, type: 'qcm', q: 'Deux serveurs DHCP du même réseau répondent tous les deux au Discover d’un PC. Que se passe-t-il ?',
    choices: ['Le PC prend les deux adresses', 'Le PC accepte une offre (en général la première) et l’annonce dans son Request, envoyé en broadcast : l’autre serveur retire son offre', 'Les deux serveurs se bloquent', 'Le PC passe en APIPA'], good: 1,
    hints: ['Pourquoi le Request est-il lui aussi envoyé en broadcast ?'],
    explain: 'Le client choisit une offre et envoie un <b>Request en broadcast</b> qui nomme le serveur retenu : tous les serveurs l’entendent, et ceux qui n’ont pas été choisis libèrent l’adresse proposée.' },
  { id: 'xd6', lvl: 5, type: 'qcm', q: 'Les PC du VLAN ADM obtiennent leur adresse auprès du serveur DHCP (dans le VLAN ADM). Les PC du VLAN DEV restent en APIPA, alors que <code>ip helper-address</code> est bien configuré sur la sous-interface .10. Cause la plus probable ?',
    choices: ['Il manque une étendue (pool) pour le réseau 192.168.10.0 sur le serveur', 'Il faut un deuxième serveur DHCP dans le VLAN DEV', 'Le relais doit être sur la sous-interface .20', 'Les PC DEV doivent être en adresse fixe'], good: 0,
    hints: ['Le relais fait bien son travail… mais que cherche le serveur quand il reçoit une demande relayée ?'],
    explain: 'Le serveur choisit l’étendue qui correspond au réseau du <b>relais</b> (192.168.10.254). S’il n’a pas de pool pour 192.168.10.0, il ne répond pas : c’est pour ça que le corrigé du TP1 a trois pools (ADM, DEV, COM).' },
  /* ---------- Impossible ---------- */
  { id: 'xd7', lvl: 6, type: 'qcm', q: 'Un seul serveur DHCP a des étendues pour 10 réseaux. Quand une demande arrive par un relais, comment sait-il dans quelle étendue piocher ?',
    choices: ['Au hasard', 'Grâce au champ <b>giaddr</b> : l’adresse de l’interface du relais qui a reçu la demande', 'Grâce à l’adresse IP source du client', 'Grâce à l’adresse MAC du client'], good: 1,
    hints: ['Le client n’a pas encore d’adresse IP : ce n’est donc pas lui qui peut l’indiquer.'],
    explain: 'Le relais écrit dans le champ <b>giaddr</b> (gateway IP address) l’adresse de son interface côté clients. Le serveur prend l’étendue qui contient giaddr et renvoie sa réponse à cette adresse (il lui faut donc une route vers ce réseau).' },
  { id: 'xd8', lvl: 6, type: 'qcm', q: 'Un PC en DHCP a reçu une adresse du VLAN DEV. L’administrateur fait passer son port de switch dans le VLAN ADM, sans toucher au PC. Que se passe-t-il ?',
    choices: ['Le PC reçoit tout de suite une adresse ADM', 'Le PC garde son adresse DEV : il ne joint plus rien tant qu’il n’a pas redemandé une adresse (ipconfig /renew, ou DHCP recliqué dans Packet Tracer)', 'Le switch refuse de changer le VLAN d’un PC en DHCP', 'Le PC passe immédiatement en APIPA'], good: 1,
    hints: ['Le câble n’a pas été débranché : le PC a-t-il une raison de refaire un Discover ?'],
    explain: 'Le lien reste actif, le PC ne sait pas qu’il a changé de réseau : il garde son bail DEV et ses paquets ne trouvent plus leur passerelle. Il faut renouveler le bail (ou attendre T1, ou débrancher / rebrancher).' },
  { id: 'xd9', lvl: 6, type: 'order', q: 'Remets dans l’ordre l’obtention d’une adresse <b>à travers un relais DHCP</b>.',
    items: ['Le PC diffuse un DHCP Discover', 'Le relais le renvoie en unicast au serveur, en y écrivant son adresse (giaddr)', 'Le serveur choisit l’étendue qui contient giaddr et répond au relais (Offer)', 'Le relais transmet l’Offer au PC', 'Le PC envoie son DHCP Request, relayé lui aussi', 'Le serveur confirme par un ACK et le PC configure son adresse'],
    hints: ['C’est toujours D.O.R.A., le relais s’intercale juste à chaque passage.'],
    explain: 'Discover (broadcast) → relais (unicast + giaddr) → Offer via le relais → Request → ACK. Le broadcast ne franchit jamais le routeur : c’est le relais qui fait le pont.' },
  { id: 'xd-lab', lvl: 6, type: 'pt', file: 'DHCP-distance-panne.pkt', tag: 'Dépannage DHCP',
    q: '<b>DHCP à distance.</b> R-CENTRAL distribue les adresses des deux sites avec le service DHCP d’IOS (pools CENTRAL et SITE). Le site distant, derrière R-SITE, passe par un relais. Problème : les PC du site distant restent en APIPA. <b>Trois erreurs</b> sur les routeurs les empêchent d’obtenir une configuration utilisable. Plan : LAN central 192.168.1.0/24 (R-CENTRAL .254), LAN du site 192.168.2.0/24 (R-SITE .254), liaison 10.0.0.0/30 (R-CENTRAL .1, R-SITE .2).',
    build: function () {
      var n = LAB.make({
        devices: [['PC-C1', 'PC-PT', 100, 220], ['Switch-C', '2960-24TT', 280, 220], ['R-CENTRAL', '1941', 480, 220], ['R-SITE', '1941', 700, 220], ['Switch-S', '2960-24TT', 900, 220], ['PC-S1', 'PC-PT', 1080, 120], ['PC-S2', 'PC-PT', 1080, 320]],
        links: [['PC-C1', 'FastEthernet0', 'Switch-C', 'FastEthernet0/1', 'straight'], ['Switch-C', 'GigabitEthernet0/1', 'R-CENTRAL', 'GigabitEthernet0/0', 'straight'], ['R-CENTRAL', 'GigabitEthernet0/1', 'R-SITE', 'GigabitEthernet0/1', 'cross'], ['R-SITE', 'GigabitEthernet0/0', 'Switch-S', 'GigabitEthernet0/1', 'straight'], ['PC-S1', 'FastEthernet0', 'Switch-S', 'FastEthernet0/1', 'straight'], ['PC-S2', 'FastEthernet0', 'Switch-S', 'FastEthernet0/2', 'straight']],
        cli: {
          'R-CENTRAL': ['conf t', 'hostname R-CENTRAL', 'interface g0/0', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 10.0.0.1 255.255.255.252', 'no shutdown', 'exit', 'ip dhcp excluded-address 192.168.1.1 192.168.1.9', 'ip dhcp excluded-address 192.168.2.1 192.168.2.9', 'ip dhcp pool CENTRAL', 'network 192.168.1.0 255.255.255.0', 'default-router 192.168.1.254', 'dns-server 8.8.8.8', 'ip dhcp pool SITE', 'network 192.168.2.0 255.255.255.0', 'default-router 192.168.2.1', 'dns-server 8.8.8.8', 'end'],
          'R-SITE': ['conf t', 'hostname R-SITE', 'interface g0/0', 'ip address 192.168.2.254 255.255.255.0', 'ip helper-address 10.0.0.5', 'no shutdown', 'interface g0/1', 'ip address 10.0.0.2 255.255.255.252', 'no shutdown', 'exit', 'ip route 0.0.0.0 0.0.0.0 10.0.0.1', 'end']
        }
      });
      ['PC-C1', 'PC-S1', 'PC-S2'].forEach(function (p) { LAB.host(n, p, { dhcp: true }); });
      n.events = []; n.touch(); return n;
    },
    tasks: [
      { label: 'Le relais de R-SITE envoie les demandes à R-CENTRAL', check: function (n) { var c = n.allIPs(n.dev('R-CENTRAL')); return n.iface(n.dev('R-SITE'), 'GigabitEthernet0/0').helper.some(function (h) { return c.indexOf(h) >= 0; }); } },
      { label: 'PC-S1 et PC-S2 obtiennent une adresse de 192.168.2.0/24', check: function (n) { return LAB.dhcpGets(n, 'PC-S1', '192.168.2.0/24') && LAB.dhcpGets(n, 'PC-S2', '192.168.2.0/24'); } },
      { label: 'Ils reçoivent la bonne passerelle (192.168.2.254)', check: function (n) { return LAB.dhcpGets(n, 'PC-S1', '192.168.2.0/24', '192.168.2.254') && LAB.dhcpGets(n, 'PC-S2', '192.168.2.0/24', '192.168.2.254'); } },
      { label: 'PC-S1 joint PC-C1', check: function (n) { return n.canPing('PC-S1', 'PC-C1'); } }
    ],
    hints: ['Sur R-SITE : <code>show running-config</code>, ligne <code>ip helper-address</code> de G0/0. Cette adresse appartient-elle à R-CENTRAL ?', 'La réponse du serveur repart vers l’adresse du relais, 192.168.2.254 : R-CENTRAL sait-il joindre ce réseau ? (<code>show ip route</code>)', 'Une fois l’adresse obtenue, <code>ipconfig</code> sur PC-S1 : la passerelle reçue est-elle la bonne ? Sur R-CENTRAL, regarde le pool SITE.'],
    solution: [
      { dev: 'R-SITE', cli: ['conf t', 'interface g0/0', 'no ip helper-address 10.0.0.5', 'ip helper-address 10.0.0.1', 'end'] },
      { dev: 'R-CENTRAL', cli: ['conf t', 'ip route 192.168.2.0 255.255.255.0 10.0.0.2', 'end'] },
      { dev: 'R-CENTRAL', cli: ['conf t', 'ip dhcp pool SITE', 'default-router 192.168.2.254', 'end'] }
    ],
    explain: 'Trois pannes : (1) le relais visait 10.0.0.5, une adresse qui n’existe pas ; (2) R-CENTRAL n’avait aucune route vers 192.168.2.0 : il recevait la demande mais ne pouvait pas renvoyer l’Offer au relais (192.168.2.254) ; (3) le pool SITE annonçait la passerelle 192.168.2.1 : les PC avaient une adresse mais ne sortaient pas de leur réseau. Pense à reclicker sur DHCP (ou <code>ipconfig /renew</code>) après chaque correction.' }
];
