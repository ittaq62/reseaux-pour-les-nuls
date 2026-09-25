(function () {
  /* TP1 Datamax (TP1.pdf) sur la maquette SC1.pkt du prof, en 3 labos enchaînés */
  var VL = [[10, 'DEVELOPPEMENT'], [20, 'ADMINISTRATION'], [30, 'PRODUCTION'], [40, 'WIFI-SALARIES'], [100, 'VISITEURS']];
  function vlanCli(list) { var c = []; list.forEach(function (v) { c.push('vlan ' + v[0], 'name ' + v[1]); }); c.push('exit'); return c; }
  var ETAGE2_CLI = ['conf t', 'hostname ETAGE2'].concat(vlanCli(VL.slice(0, 3))).concat(['interface range fa0/1-4', 'switchport mode access', 'switchport access vlan 10', 'interface range fa0/5-8', 'switchport mode access', 'switchport access vlan 20', 'interface range fa0/9-21', 'switchport mode access', 'switchport access vlan 30', 'interface range g0/1-2', 'switchport mode trunk', 'end']);
  var OPSPC_CLI = ['conf t', 'hostname SW-Opspc'].concat(vlanCli(VL.slice(0, 3))).concat(['interface range fa0/1-15', 'switchport mode access', 'switchport access vlan 30', 'interface fa0/20', 'switchport mode access', 'switchport access vlan 20', 'interface g0/1', 'switchport mode trunk', 'end']);
  var ETAGE1_CLI = ['conf t', 'hostname ETAGE1'].concat(vlanCli([VL[2], VL[3], VL[4]])).concat(['interface range fa0/1-16', 'switchport mode access', 'switchport access vlan 30', 'interface fa0/17', 'switchport mode access', 'switchport access vlan 100', 'interface fa0/18', 'switchport mode access', 'switchport access vlan 40', 'interface g0/1', 'switchport mode trunk', 'end']);
  var BACKBONE_CLI = ['conf t', 'hostname BACKBONE'].concat(vlanCli(VL)).concat(['interface gi4/1', 'switchport mode trunk', 'interface gi5/1', 'switchport mode trunk', 'interface gi6/1', 'switchport mode access', 'switchport access vlan 100', 'end']);
  var R_CLI = ['conf t', 'hostname R_INTERNE', 'interface g0/0', 'ip address 192.168.1.254 255.255.255.0', 'ip nat inside', 'no shutdown'];
  [[10, '192.168.10.254'], [20, '192.168.20.254'], [30, '192.168.30.254'], [40, '192.168.40.254'], [100, '192.168.100.245']].forEach(function (s) {
    R_CLI.push('interface g0/0.' + s[0], 'encapsulation dot1Q ' + s[0], 'ip address ' + s[1] + ' 255.255.255.0', 'ip nat inside');
  });
  R_CLI = R_CLI.concat(['interface g0/1', 'ip nat outside', 'exit', 'access-list 1 permit 192.168.0.0 0.0.255.255', 'ip nat inside source list 1 interface g0/1 overload', 'ip route 0.0.0.0 0.0.0.0 1.1.1.1', 'end']);
  function h(ip) { return { ip: ip, mask: '255.255.255.0', gw: ip.replace(/\.\d+$/, '.254') }; }
  function addHosts(n, list) {
    list.forEach(function (p) {
      if (!n.dev(p[0])) n.addDevice(p[1], p[4], p[5], p[0]);
      n.connect(p[0], 'FastEthernet0', p[2], p[3], 'straight', true);
      if (p[6]) LAB.host(n, p[0], p[6]);
    });
    n.touch();
  }
  function vlansOk(n, sw, list) { return list.every(function (v) { return LAB.vlanName(n, sw, v[0], v[1]); }); }
  function linkedGig(n, a, b) { return n.links.some(function (l) { var ok = (l.a.dev === a && l.b.dev === b) || (l.a.dev === b && l.b.dev === a); return ok && n.cableOk(l) && /^Gigabit/.test(l.a.port) && /^Gigabit/.test(l.b.port); }); }
  function trunkTo(n, a, b) {
    return n.links.some(function (l) {
      var ea = l.a.dev === a ? l.a : l.b.dev === a ? l.b : null, eb = l.a.dev === b ? l.a : l.b.dev === b ? l.b : null;
      if (!ea || !eb || ea === eb || !n.cableOk(l)) return false;
      var da = n.dev(a), db = n.dev(b);
      return n.opMode(da, n.iface(da, ea.port)) === 'trunk' && n.opMode(db, n.iface(db, eb.port)) === 'trunk';
    });
  }
  function owns(n, dev, ip) { var d = n.dev(dev); return d.ifaces.some(function (i) { return (i.ip === NET.ip2int(ip)) && n.l3Up(d, i); }); }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'datamax', num: 18, icon: '🏢', titre: 'Projet : TP Datamax',
  sous: 'Tout le module en situation : VLAN, backbone, DHCP, inter-VLAN, NAT',
  source: 'TP1.pdf (Datamax, missions 1 à 6), SC1.pkt, rapport_cowork (tes relevés de la phase 0 et 1)',
  cours: `
<h3>Le contexte</h3>
<p><b>Datamax</b>, entreprise d’analyse de données, occupe un bâtiment de 2 étages. La salle machines (1er étage) héberge les serveurs (DHCP, DNS, ACTIVEDIR, SGBD en 192.168.1.0/24, passerelle 192.168.1.254) reliés au switch <b>BACKBONE</b>, et le routeur <b>R_INTERNE</b> (G0/0 vers BACKBONE Gi9/1, G0/1 = 1.1.1.2/8 vers le routeur du FAI <b>Router0</b> 1.1.1.1). « Internet » est simulé par Server1 (13.1.1.100) et PC0.</p>
<div class="nul"><b>🧠 C’est ton TP, en entier :</b> chaque labo reprend l’état final du précédent, exactement comme quand tu enregistres ton .pkt entre deux séances. Si tu bloques, tu peux passer un labo (🏳️) : sa solution est appliquée et le labo suivant démarre avec un réseau correct.</div>
<h3>Le plan d’adressage retenu</h3>
<table><tr><th>VLAN</th><th>Nom</th><th>Réseau</th><th>Passerelle (R_INTERNE)</th><th>Où ?</th></tr>
<tr><td>10</td><td>DEVELOPPEMENT</td><td>192.168.10.0/24</td><td>192.168.10.254</td><td>ETAGE2 Fa0/1-4</td></tr>
<tr><td>20</td><td>ADMINISTRATION</td><td>192.168.20.0/24</td><td>192.168.20.254</td><td>ETAGE2 Fa0/5-8, SW-Opspc Fa0/20</td></tr>
<tr><td>30</td><td>PRODUCTION</td><td>192.168.30.0/24</td><td>192.168.30.254</td><td>ETAGE2 Fa0/9-21, SW-Opspc Fa0/1-15, ETAGE1 Fa0/1-16</td></tr>
<tr><td>40</td><td>WIFI-SALARIES</td><td>192.168.40.0/24</td><td>192.168.40.254</td><td>ETAGE1 Fa0/18 (point d’accès salle de réunion)</td></tr>
<tr><td>100</td><td>VISITEURS</td><td>192.168.100.0/24</td><td><b>192.168.100.245</b> (imposée par la mission 3)</td><td>ETAGE1 Fa0/17 (point d’accès cafétéria)</td></tr>
<tr><td>1 (natif)</td><td>serveurs</td><td>192.168.1.0/24</td><td>192.168.1.254</td><td>BACKBONE</td></tr></table>
<div class="tip"><b>✔ Les points d’accès Wi-Fi</b> ne sont pas simulés ici : chaque borne est remplacée par un <b>portable</b> branché sur son port (VISITEUR sur Fa0/17, SALARIE sur Fa0/18). Pour le switch, c’est pareil : le port est un port access dans le VLAN du SSID. (Avec une borne multi-SSID, ce serait un <b>trunk</b>.)</div>
<h3>La démarche (rappel des modules)</h3>
<ol><li><b>Mission 1</b> — VLAN de l’étage 2, puis switch de l’open-space relié en Gigabit et en <b>trunk</b> (modules 3 et 8).</li>
<li><b>Mission 2</b> — switch de l’étage 1, liaisons des étages vers le <b>BACKBONE</b> en trunk ; les VLAN doivent exister sur <b>tous</b> les switchs traversés.</li>
<li><b>Mission 3</b> — serveur DHCP temporaire pour les visiteurs (module 9).</li>
<li><b>Mission 4</b> — routage inter-VLAN sur R_INTERNE : router-on-a-stick (module 8), VLAN 1 natif pour les serveurs.</li>
<li><b>Mission 5</b> — NAT/PAT vers Internet + route par défaut (modules 7 et 13).</li>
<li><b>Mission 6</b> — tolérance aux pannes : liens redondants + STP (module 15), deuxième routeur + HSRP (module 16).</li></ol>
`,
  questions: [
    { id: 'dm-lab1', type: 'pt', file: 'SC1.pkt', tag: 'Missions 1',
      q: '<b>Mission 1 — étage 2 et open-space.</b> Les PC de l’étage 2 sont branchés et adressés (D1 Fa0/1, D4 Fa0/4 : 192.168.10.x ; A1 Fa0/5, A3 Fa0/7 : 192.168.20.x ; P1 Fa0/9, P13 Fa0/21 : 192.168.30.x). Ceux de l’open-space aussi (OP1 Fa0/1, OP2 Fa0/2 en production, ADM-OP Fa0/20 en administration).<br>1) Sur <b>ETAGE2</b> : crée les VLAN 10 DEVELOPPEMENT, 20 ADMINISTRATION, 30 PRODUCTION et affecte les ports (Fa0/1-4, Fa0/5-8, Fa0/9-21).<br>2) Relie <b>SW-Opspc</b> à ETAGE2 par un <b>port Gigabit</b>, configure SW-Opspc (15 premiers ports en production, port 20 en administration) et fais passer les VLAN.',
      build: function () {
        var n = LAB.topo('SC1');
        addHosts(n, [['D1', 'PC-PT', 'ETAGE2', 'FastEthernet0/1', 1160, 40, h('192.168.10.1')], ['D4', 'PC-PT', 'ETAGE2', 'FastEthernet0/4', 1240, 40, h('192.168.10.2')],
          ['A1', 'PC-PT', 'ETAGE2', 'FastEthernet0/5', 1320, 40, h('192.168.20.1')], ['A3', 'PC-PT', 'ETAGE2', 'FastEthernet0/7', 1400, 40, h('192.168.20.2')],
          ['P1', 'PC-PT', 'ETAGE2', 'FastEthernet0/9', 1160, 150, h('192.168.30.1')], ['P13', 'PC-PT', 'ETAGE2', 'FastEthernet0/21', 1240, 150, h('192.168.30.2')],
          ['OP1', 'PC-PT', 'SW-Opspc', 'FastEthernet0/1', 500, 170, h('192.168.30.10')], ['OP2', 'PC-PT', 'SW-Opspc', 'FastEthernet0/2', 610, 185, h('192.168.30.11')], ['ADM-OP', 'PC-PT', 'SW-Opspc', 'FastEthernet0/20', 720, 170, h('192.168.20.10')]]);
        n.events = []; return n;
      },
      tasks: [
        { label: 'ETAGE2 : VLAN 10 DEVELOPPEMENT, 20 ADMINISTRATION, 30 PRODUCTION', check: function (n) { return vlansOk(n, 'ETAGE2', VL.slice(0, 3)); } },
        { label: 'ETAGE2 : Fa0/1-4 en VLAN 10, Fa0/5-8 en VLAN 20, Fa0/9-21 en VLAN 30', check: function (n) { return LAB.accessVlan(n, 'ETAGE2', LAB.range('FastEthernet0/', 1, 4), 10) && LAB.accessVlan(n, 'ETAGE2', LAB.range('FastEthernet0/', 5, 8), 20) && LAB.accessVlan(n, 'ETAGE2', LAB.range('FastEthernet0/', 9, 21), 30); } },
        { label: 'D1 ⟷ D4, A1 ⟷ A3 et P1 ⟷ P13 communiquent', check: function (n) { return n.canPing('D1', 'D4') && n.canPing('A1', 'A3') && n.canPing('P1', 'P13'); } },
        { label: 'SW-Opspc est relié à ETAGE2 par des ports Gigabit', check: function (n) { return linkedGig(n, 'SW-Opspc', 'ETAGE2'); } },
        { label: 'SW-Opspc : Fa0/1-15 en VLAN 30, Fa0/20 en VLAN 20', check: function (n) { return LAB.accessVlan(n, 'SW-Opspc', LAB.range('FastEthernet0/', 1, 15), 30) && LAB.accessVlan(n, 'SW-Opspc', ['FastEthernet0/20'], 20); } },
        { label: 'OP1 (open-space) joint P1 et ADM-OP joint A1', check: function (n) { return n.canPing('OP1', 'P1') && n.canPing('ADM-OP', 'A1'); } }
      ],
      hints: ['ETAGE2 : <code>vlan 10</code> / <code>name DEVELOPPEMENT</code>… puis <code>interface range fa0/1-4</code> → <code>switchport mode access</code> → <code>switchport access vlan 10</code>, etc.', 'Câble <b>croisé</b> entre ETAGE2 G0/1 et SW-Opspc G0/1 (switch ⟷ switch).', 'Les VLAN doivent aussi être créés sur SW-Opspc, et les deux ports G0/1 passés en <code>switchport mode trunk</code>.'],
      solution: [{ link: ['ETAGE2', 'GigabitEthernet0/1', 'SW-Opspc', 'GigabitEthernet0/1', 'cross'] }, { dev: 'ETAGE2', cli: ETAGE2_CLI }, { dev: 'SW-Opspc', cli: OPSPC_CLI }],
      explain: 'Même résultat que ton rapport de la phase 1 (show vlan brief : Fa0/1-4 VLAN 10, Fa0/5-8 VLAN 20, Fa0/9-21 VLAN 30), plus l’open-space. Les deux ports Gigabit d’ETAGE2 sont mis en trunk : G0/1 vers l’open-space, G0/2 prêt pour le backbone.' },
    { id: 'dm1', type: 'qcm', q: 'Pourquoi D1 (VLAN 10) ne peut-il pas encore pinguer A1 (VLAN 20), même sur le même switch ?', choices: ['Parce que le câble est mauvais', 'Parce que ce sont deux VLAN = deux réseaux IP : il faut un routeur (mission 4)', 'Parce que le switch est en panne', 'Parce que D1 n’a pas de masque'], good: 1,
      hints: ['1 VLAN = 1 domaine de diffusion = 1 réseau IP.'], explain: 'Sans routage inter-VLAN, les VLAN sont isolés : c’est l’effet recherché (sécurité, broadcasts).' },
    { id: 'dm-lab2', type: 'pt', file: 'SC1.pkt', tag: 'Missions 2 et 3',
      q: '<b>Missions 2 et 3 — étage 1, backbone, DHCP visiteurs.</b> L’étage 2 et l’open-space sont faits. Sur <b>ETAGE1</b> : Fa0/1-16 en PRODUCTION (PE1 est sur Fa0/1), Fa0/17 = point d’accès <b>cafétéria</b> → VLAN <b>100 VISITEURS</b> (représenté par le portable VISITEUR, en DHCP), Fa0/18 = point d’accès <b>salle de réunion</b> → VLAN <b>40 WIFI-SALARIES</b>. Relie <b>ETAGE1 (G0/1)</b> et <b>ETAGE2 (G0/2)</b> au <b>BACKBONE</b> (ports libres Gi4/1 et Gi5/1). Enfin, le serveur temporaire <b>DHCP-TEMP</b> (192.168.100.250, branché sur BACKBONE Gi6/1) doit distribuer aux visiteurs : plage <b>192.168.100.1 à .50</b>, masque /24, passerelle <b>192.168.100.245</b>, DNS <b>192.168.1.2</b>.',
      build: function () {
        var n = LAB.solved('dm-lab1');
        addHosts(n, [['PE1', 'PC-PT', 'ETAGE1', 'FastEthernet0/1', 1150, 330, h('192.168.30.20')], ['VISITEUR', 'Laptop-PT', 'ETAGE1', 'FastEthernet0/17', 870, 300, { dhcp: true }], ['SALARIE', 'Laptop-PT', 'ETAGE1', 'FastEthernet0/18', 900, 200, h('192.168.40.10')]]);
        n.addDevice('Server-PT', 1450, 470, 'DHCP-TEMP');
        n.connect('DHCP-TEMP', 'FastEthernet0', 'BACKBONE', 'GigabitEthernet6/1', 'straight', true);
        LAB.host(n, 'DHCP-TEMP', { ip: '192.168.100.250', mask: '255.255.255.0', gw: '192.168.100.245', dns: '192.168.1.2' });
        n.dev('DHCP-TEMP').services.dhcp = { on: false, pools: [{ name: 'serverPool', network: '192.168.100.0', mask: '255.255.255.0', gateway: '0.0.0.0', dns: '0.0.0.0', start: '192.168.100.0', end: '192.168.100.255', max: 256 }] };
        LAB.host(n, 'VISITEUR', { dhcp: true });
        n.events = []; n.touch(); return n;
      },
      tasks: [
        { label: 'ETAGE1 : VLAN 30, 40 et 100 créés et nommés', check: function (n) { return vlansOk(n, 'ETAGE1', [VL[2], VL[3], VL[4]]); } },
        { label: 'ETAGE1 : Fa0/1-16 en VLAN 30, Fa0/17 en VLAN 100, Fa0/18 en VLAN 40', check: function (n) { return LAB.accessVlan(n, 'ETAGE1', LAB.range('FastEthernet0/', 1, 16), 30) && LAB.accessVlan(n, 'ETAGE1', ['FastEthernet0/17'], 100) && LAB.accessVlan(n, 'ETAGE1', ['FastEthernet0/18'], 40); } },
        { label: 'ETAGE1 et ETAGE2 sont reliés au BACKBONE en trunk', check: function (n) { return trunkTo(n, 'ETAGE1', 'BACKBONE') && trunkTo(n, 'ETAGE2', 'BACKBONE'); } },
        { label: 'Le BACKBONE connaît les VLAN 10, 20, 30, 40 et 100', check: function (n) { var d = n.dev('BACKBONE'); return [10, 20, 30, 40, 100].every(function (v) { return n.vlanExists(d, v); }); } },
        { label: 'PE1 (étage 1) joint P1 (étage 2) à travers le backbone', check: function (n) { return n.canPing('PE1', 'P1'); } },
        { label: 'DHCP-TEMP : service activé, dans le VLAN 100', check: function (n) { return n.dev('DHCP-TEMP').services.dhcp.on && LAB.accessVlan(n, 'BACKBONE', ['GigabitEthernet6/1'], 100); } },
        { label: 'VISITEUR obtient une adresse de 192.168.100.1 à .50, passerelle .245, DNS 192.168.1.2', check: function (n) { if (!LAB.dhcpGets(n, 'VISITEUR', '192.168.100.0/24', '192.168.100.245')) return false; var x = n.dev('VISITEUR').host; return x.ip >= NET.ip2int('192.168.100.1') && x.ip <= NET.ip2int('192.168.100.50') && x.dns === NET.ip2int('192.168.1.2'); } }
      ],
      hints: ['ETAGE1 : crée les VLAN 30 PRODUCTION, 40 WIFI-SALARIES, 100 VISITEURS, affecte les ports, puis <code>interface g0/1</code> → <code>switchport mode trunk</code>.', 'Câbles croisés ETAGE1 G0/1 ⟷ BACKBONE Gi4/1 et ETAGE2 G0/2 ⟷ BACKBONE Gi5/1. Sur BACKBONE : les 5 VLAN, Gi4/1 et Gi5/1 en trunk, Gi6/1 en access VLAN 100.', 'DHCP-TEMP → Services → DHCP : On ; Default Gateway 192.168.100.245 ; DNS 192.168.1.2 ; Start IP 192.168.100.1 ; Maximum Number of Users 50 → Save. Puis VISITEUR : reclique sur DHCP.'],
      solution: [
        { link: ['ETAGE1', 'GigabitEthernet0/1', 'BACKBONE', 'GigabitEthernet4/1', 'cross'] }, { link: ['ETAGE2', 'GigabitEthernet0/2', 'BACKBONE', 'GigabitEthernet5/1', 'cross'] },
        { dev: 'ETAGE1', cli: ETAGE1_CLI }, { dev: 'BACKBONE', cli: BACKBONE_CLI },
        { text: 'DHCP-TEMP → Services → DHCP : <b>On</b>, passerelle 192.168.100.245, DNS 192.168.1.2, début 192.168.100.1, 50 utilisateurs.', fn: function (n) { n.dev('DHCP-TEMP').services.dhcp = { on: true, pools: [{ name: 'serverPool', network: '192.168.100.0', mask: '255.255.255.0', gateway: '192.168.100.245', dns: '192.168.1.2', start: '192.168.100.1', end: '192.168.100.50', max: 50 }] }; } },
        { dhcp: true, dev: 'VISITEUR' }
      ],
      explain: 'Les VLAN traversent désormais tout le bâtiment : ETAGE1 → BACKBONE → ETAGE2 en trunk. Le visiteur reçoit 192.168.100.1 (première adresse de la plage) ; sa passerelle .245 sera configurée sur R_INTERNE à la mission 4.' },
    { id: 'dm2', type: 'qcm', q: 'Un VLAN est configuré sur ETAGE1 et ETAGE2 mais <b>pas</b> sur le BACKBONE qui les relie (trunks OK). Les machines de ce VLAN se joignent-elles d’un étage à l’autre ?', choices: ['Oui, les trunks suffisent', 'Non : le BACKBONE jette les trames d’un VLAN qu’il ne connaît pas', 'Oui, mais seulement le ping', 'Seulement si STP est désactivé'], good: 1,
      hints: ['Chaque switch traversé doit connaître le VLAN.'], explain: 'Un switch ne transporte que les VLAN qu’il connaît (<code>show vlan brief</code>). Le VLAN doit exister sur <b>tous</b> les switchs du chemin.' },
    { id: 'dm-lab3', type: 'pt', file: 'SC1.pkt', tag: 'Missions 4 et 5',
      q: '<b>Missions 4 et 5 — routage inter-VLAN et NAT.</b> Tous les switchs sont prêts. Configure <b>R_INTERNE</b> : son interface G0/0 est reliée au BACKBONE (Gi9/1). Crée le routage inter-VLAN (router-on-a-stick) avec les passerelles du plan d’adressage (.254, sauf visiteurs = 192.168.100.245) et garde 192.168.1.254 pour les serveurs (VLAN 1, non étiqueté). Puis donne l’accès à Internet : <b>PAT</b> sur l’adresse de G0/1 (1.1.1.2) pour tous les réseaux internes 192.168.x.x, et route par défaut vers le FAI (1.1.1.1).',
      build: function () { return LAB.solved('dm-lab2'); },
      tasks: [
        { label: 'BACKBONE Gi9/1 (vers R_INTERNE) en trunk', check: function (n) { var d = n.dev('BACKBONE'); return n.opMode(d, n.iface(d, 'GigabitEthernet9/1')) === 'trunk'; } },
        { label: 'R_INTERNE répond sur 192.168.1.254, .10.254, .20.254, .30.254, .40.254 et 192.168.100.245', check: function (n) { return ['192.168.1.254', '192.168.10.254', '192.168.20.254', '192.168.30.254', '192.168.40.254', '192.168.100.245'].every(function (ip) { return owns(n, 'R_INTERNE', ip); }); } },
        { label: 'D1 (DEV) joint A1 (ADM) et OP1 joint le serveur DNS 192.168.1.2', check: function (n) { return n.canPing('D1', 'A1') && n.canPing('OP1', 'DNS'); } },
        { label: 'VISITEUR joint sa passerelle 192.168.100.245 et SALARIE joint le serveur SGBD', check: function (n) { n.dhcpRequest(n.dev('VISITEUR')); return n.canPing('VISITEUR', '192.168.100.245') && n.canPing('SALARIE', 'SGBD'); } },
        { label: 'R_INTERNE a une route par défaut vers 1.1.1.1', check: function (n) { return LAB.hasRoute(n, 'R_INTERNE', '0.0.0.0/0', 'S'); } },
        { label: 'D1 joint Server1 (13.1.1.100, « Internet ») grâce au PAT', check: function (n) { var ok = n.canPing('D1', 'Server1'); var r = n.dev('R_INTERNE'); return ok && r.natTable.some(function (e) { return !e.stat && e.lip === NET.ip2int('192.168.10.1') && e.gip === NET.ip2int('1.1.1.2'); }); } }
      ],
      hints: ['BACKBONE : <code>interface gi9/1</code> → <code>switchport mode trunk</code>.', 'R_INTERNE : <code>interface g0/0</code> → <code>ip address 192.168.1.254 255.255.255.0</code> → <code>no shutdown</code> (les trames non étiquetées = VLAN 1 natif). Puis pour chaque VLAN : <code>interface g0/0.10</code> → <code>encapsulation dot1Q 10</code> → <code>ip address 192.168.10.254 255.255.255.0</code>… (VLAN 100 : 192.168.100.245).', 'NAT : <code>ip nat inside</code> sur g0/0 et chaque sous-interface, <code>ip nat outside</code> sur g0/1, <code>access-list 1 permit 192.168.0.0 0.0.255.255</code>, <code>ip nat inside source list 1 interface g0/1 overload</code>, <code>ip route 0.0.0.0 0.0.0.0 1.1.1.1</code>.'],
      solution: [{ dev: 'BACKBONE', cli: ['conf t', 'interface gi9/1', 'switchport mode trunk', 'end'] }, { dev: 'R_INTERNE', cli: R_CLI }],
      explain: 'R_INTERNE route entre tous les VLAN (un seul câble vers le backbone) et traduit tout le 192.168.0.0/16 derrière 1.1.1.2. Le routeur du FAI ne connaît aucun réseau privé : sans NAT, les réponses d’Internet ne reviendraient jamais. Vérifie avec <code>show ip nat translations</code> après un ping vers 13.1.1.100.' },
    { id: 'dm3', type: 'multi', q: '<b>Mission 6 — tolérance aux pannes.</b> Quelles solutions réduisent l’impact d’une panne de commutateur ou de routeur interne ?', choices: ['Doubler les liens étage ⟷ backbone (avec Spanning Tree actif)', 'Ajouter un second routeur interne avec HSRP (IP virtuelle comme passerelle)', 'Doubler le backbone (deux switchs, éventuellement en VSS)', 'Désactiver Spanning Tree pour aller plus vite', 'Mettre tous les PC dans le VLAN 1'], good: [0, 1, 2],
      hints: ['Redondance de liens (module 15) et de passerelle (module 16).'], explain: 'Liens redondants + STP, deuxième routeur + HSRP, backbone doublé (VSS). Désactiver STP avec des boucles provoquerait une tempête !' },
    { id: 'dm4', type: 'qcm', q: 'Dans la configuration de R_INTERNE, pourquoi l’adresse 192.168.1.254 est-elle mise sur l’interface <b>physique</b> G0/0 et pas sur une sous-interface ?', choices: ['Par erreur', 'Parce que les serveurs sont dans le VLAN 1 natif : leurs trames arrivent non étiquetées sur le trunk, elles sont traitées par l’interface physique', 'Parce que le VLAN 1 est interdit', 'Parce que le NAT l’exige'], good: 1,
      hints: ['Sur un trunk, le VLAN natif circule sans étiquette.'], explain: 'Trames non taguées = VLAN natif = interface physique (on pourrait aussi faire <code>interface g0/0.1</code> + <code>encapsulation dot1Q 1 native</code>).' }
  ]
  });
})();
