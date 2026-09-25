(function () {
  function fa(n, r) { return n.iface(n.dev(r), 'FastEthernet0/0'); }
  /* groupe HSRP commun aux deux routeurs d'accès : {g, vip} ou null */
  function grp(n) {
    var a = fa(n, 'Router1'), b = fa(n, 'Router0'), res = null;
    Object.keys(a.standby).forEach(function (g) {
      var sa = a.standby[g], sb = b.standby[g];
      if (!res && sa && sb && sa.ip != null && (sb.ip == null || sb.ip === sa.ip)) res = { g: +g, vip: sa.ip };
    });
    return res;
  }
  function realIPs(n) { return n.allIPs(n.dev('Router1')).concat(n.allIPs(n.dev('Router0'))); }
  function renew(n) { ['PC0', 'PC1'].forEach(function (p) { n.dhcpRequest(n.dev(p)); }); }
  var WIN_COLS = [{ h: 'Réseau', kind: 'ip', w: 130 }, { h: 'Masque', kind: 'maskdot', w: 140 }, { h: 'Passerelle', kind: 'ip', w: 140 }, { h: 'Interface', kind: 'ip', w: 140 }];

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'hsrp', num: 16, icon: '🛟', titre: 'Redondance de passerelle : HSRP',
  sous: 'FHRP, routeur actif / en veille, IP et MAC virtuelles, préemption',
  source: 'Les concepts FHRP.pdf, SUPPORT HSRP.pdf, HSRP.pkt, TP1 Datamax (mission 6 : tolérance aux pannes)',
  cours: `
<h3>1. Le problème : une seule passerelle</h3>
<p>STP protège les <b>liens</b>. Mais un PC n’a qu’<b>une</b> passerelle par défaut : si ce routeur tombe, plus aucune communication vers les autres réseaux. Les protocoles <b>FHRP</b> (<i>First Hop Redundancy Protocol</i>) assurent la redondance de ce « premier saut ».</p>
<div class="nul"><b>🧠 L’analogie du numéro d’accueil :</b> les clients appellent toujours le même numéro (l’IP virtuelle). Derrière, deux standardistes : un <b>actif</b> qui décroche, un <b>en veille</b> qui écoute s’il entend encore son collègue (les messages <b>Hello</b>). Si l’actif ne répond plus, le second décroche <b>au même numéro</b> : les clients ne voient rien.</div>
<p>Principe : plusieurs routeurs partagent une <b>interface logique</b> — une <b>adresse IP virtuelle</b> et une <b>adresse MAC virtuelle</b>. Les PC ont l’IP virtuelle comme passerelle. Comme l’IP et la MAC ne changent pas lors d’une bascule, c’est <b>transparent</b> pour les clients.</p>
<table><tr><th>Protocole</th><th>Caractéristiques</th></tr>
<tr><td><b>HSRP</b> (Hot Standby Router Protocol)</td><td>propriétaire <b>Cisco</b> (RFC 2281), IPv4 (et IPv6), un actif + un en veille</td></tr>
<tr><td><b>VRRP</b> v2 / v3</td><td><b>standard</b> (non propriétaire) ; v3 pour IPv4 et IPv6, réseaux multi-constructeurs</td></tr>
<tr><td><b>GLBP</b> (Gateway Load Balancing Protocol)</td><td>Cisco, avec <b>répartition de charge</b> : AVG (distribue les MAC virtuelles) + jusqu’à 4 AVF (transfèrent) ; multicast 224.0.0.102 (ton poly écrit .112, c’est une coquille), UDP 3222 ; MAC 0007.b4xx.xxyy</td></tr>
<tr><td>IRDP (RFC 1256)</td><td>les hôtes découvrent eux-mêmes les routeurs</td></tr></table>

<h3>2. HSRP en détail</h3>
<ul><li>Le routeur de <b>plus haute priorité</b> devient <b>actif</b> (priorité 0 à 255, <b>100 par défaut</b> ; à égalité, la plus haute IP).</li>
<li><b>Hello</b> toutes les <b>3 s</b> ; si le routeur en veille n’en reçoit plus pendant <b>10 s</b> (hold time), il devient actif.</li>
<li><b>Sans préemption</b>, un routeur qui revient (même plus prioritaire) <b>ne reprend pas</b> la main. Avec <code>standby 1 preempt</code>, le plus prioritaire redevient actif dès son retour.</li>
<li><b>MAC virtuelle</b> : <code>0000.0c07.acXX</code>, où XX = numéro du groupe en hexa (groupe 2 → 0000.0c07.ac02).</li>
<li>États : Initial → Apprentissage (learn) → Écoute (listen) → Parlant (speak) → <b>En veille (standby)</b> / <b>Actif (active)</b>.</li></ul>
<div class="demo dark">Router1(config)#interface fa0/0
Router1(config-if)#ip address 192.168.2.252 255.255.255.0     ← son adresse RÉELLE
Router1(config-if)#standby 1 ip 192.168.2.254                 ← l’IP VIRTUELLE (la passerelle des PC)
Router1(config-if)#standby 1 priority 150                     ← il sera actif
Router1(config-if)#standby 1 preempt                          ← et reprendra la main à son retour
Router0(config-if)#standby 1 ip 192.168.2.254                 ← même groupe, même IP virtuelle (priorité 100)
Router1#show standby brief
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Fa0/0       1    150 P Active   local           192.168.2.253   192.168.2.254</div>
<div class="warnbox"><b>⚠ Pièges :</b> l’IP virtuelle doit être <b>différente</b> des IP réelles des routeurs ; les deux routeurs doivent avoir le <b>même numéro de groupe</b> et la <b>même IP virtuelle</b> ; et le <b>DHCP</b> doit distribuer l’IP <b>virtuelle</b> comme passerelle. Pense aussi au <b>retour</b> : les routeurs de l’extérieur doivent pouvoir joindre le LAN par l’un ou l’autre (routage dynamique, RIP dans le TP).</div>
<div class="tip"><b>✔ Vérifier la bascule dans Packet Tracer :</b> <code>ping -t</code> depuis un PC vers l’extérieur, puis <code>shutdown</code> sur l’interface LAN du routeur actif : quelques paquets perdus, puis ça repart via l’autre routeur. Sur le PC, <code>arp -a</code> montre la passerelle avec la MAC <b>0000.0c07.ac01</b>.</div>
`,
  questions: [
    { id: 'hs1', type: 'qcm', q: 'Quel problème résolvent les protocoles FHRP ?', choices: ['Les boucles de couche 2', 'La panne de la passerelle par défaut (un PC n’en connaît qu’une)', 'La pénurie d’adresses IPv4', 'La lenteur du DNS'], good: 1,
      hints: ['First Hop = le premier saut = la passerelle.'], explain: 'FHRP rend la passerelle redondante grâce à une IP/MAC virtuelle partagée par plusieurs routeurs.' },
    { id: 'hs2', type: 'match', q: 'Associe chaque protocole à sa description.', pairs: [['HSRP', 'Propriétaire Cisco, un routeur actif et un en veille (RFC 2281)'], ['VRRP', 'Standard ouvert, multi-constructeurs'], ['GLBP', 'Propriétaire Cisco avec répartition de charge (AVG / AVF)']],
      hints: ['« Load Balancing » = répartition de charge.'], explain: 'HSRP (Cisco), VRRP (standard), GLBP (Cisco + load balancing).' },
    { id: 'hs3', type: 'text', q: 'Valeurs par défaut de HSRP :', fields: [{ label: 'Priorité', kind: 'int', answer: 100 }, { label: 'Intervalle des Hello (s)', kind: 'int', answer: 3 }, { label: 'Hold time (s)', kind: 'int', answer: 10 }],
      hints: ['Priorité de 0 à 255 ; Hello 3 s ; bascule après 10 s sans Hello.'], explain: 'Priorité 100, Hello 3 s, hold 10 s (minimums : 1 s et 4 s).' },
    { id: 'hs4', type: 'qcm', q: 'R1 (priorité 150) est actif, R2 (priorité 100) en veille, <b>sans préemption</b>. R1 tombe en panne puis redémarre. Qui est actif ensuite ?', choices: ['R1, car il est plus prioritaire', 'R2 : sans préemption, il garde la main', 'Aucun des deux', 'Les deux en même temps'], good: 1,
      hints: ['C’est justement le rôle de la commande « preempt ».'], explain: 'Sans <code>preempt</code>, R2 reste actif. Avec <code>standby 1 preempt</code> sur R1, R1 reprendrait la main dès son retour.' },
    { id: 'hs5', type: 'text', q: 'Quelle est l’adresse MAC virtuelle HSRP du groupe…', fields: [{ label: '1 ?', kind: 'mac', answer: '0000.0c07.ac01' }, { label: '2 ?', kind: 'mac', answer: '0000.0c07.ac02' }, { label: '10 ?', kind: 'mac', answer: '0000.0c07.ac0a' }],
      hints: ['0000.0c07.acXX, XX = numéro du groupe en <b>hexadécimal</b> (10 = 0A).'], explain: 'Groupe 1 → …ac01, groupe 2 → …ac02, groupe 10 → …ac0a.' },
    { id: 'hs6', type: 'qcm', q: '<b>SUPPORT HSRP, annexe 3</b> — après la mise en place de HSRP, le cache ARP du poste 192.168.200.20 contient <code>00-00-0c-07-ac-02 ⟷ 192.168.200.1</code>. Qu’en déduis-tu ?', choices: ['192.168.200.1 est l’adresse réelle du routeur principal', '192.168.200.1 est l’IP virtuelle du groupe HSRP n°2, devenue la passerelle du poste', 'Le poste est en panne', 'C’est l’adresse du serveur de fichiers'], good: 1,
      hints: ['0000.0c07.ac… : c’est une MAC virtuelle HSRP. Les 2 derniers chiffres = le groupe.'], explain: 'La passerelle du poste est désormais l’<b>IP virtuelle</b> 192.168.200.1 (groupe HSRP <b>2</b>) ; le poste ne voit plus les MAC réelles des routeurs.' },
    { id: 'hs7', type: 'grid', q: '<b>SUPPORT HSRP, annexe 2</b> — Routeur de secours : LAN 192.168.200.254/24, liaison vers le siège 200.100.20.253/30 (siège = 200.100.20.254). Le réseau du siège est 192.168.10.0/24. Complète sa table de routage (format DS : passerelle = IP de l’interface pour un réseau connecté).',
      file: 'SUPPORT-HSRP.xlsx', sheet: 'Secours', cols: WIN_COLS, unordered: true, routeColors: true,
      rows: [[{ a: '192.168.200.0' }, { a: '255.255.255.0' }, { a: '192.168.200.254' }, { a: '192.168.200.254' }], [{ a: '200.100.20.252' }, { a: '255.255.255.252' }, { a: '200.100.20.253' }, { a: '200.100.20.253' }], [{ a: '192.168.10.0' }, { a: '255.255.255.0' }, { a: '200.100.20.254' }, { a: '200.100.20.253' }]],
      rowTypes: ['c', 'c', 's'],
      hints: ['Deux réseaux connectés : le LAN (192.168.200.0/24) et la liaison /30 (200.100.20.252).', 'Pour le siège : passerelle = le siège sur la liaison (200.100.20.254), interface = l’IP du secours sur cette liaison.'],
      explain: 'C’est la table du document du prof : 2 connectés + 1 route statique vers 192.168.10.0/24 via 200.100.20.254.' },
    { id: 'hs8', type: 'qcm', q: 'Dans ce même support, le routeur du <b>siège</b> joint 192.168.200.0/24 uniquement via 200.100.10.253 (le routeur principal). Si le principal tombe, que se passe-t-il pour le trafic retour ?', choices: ['Rien, HSRP gère tout', 'Le siège continue d’envoyer vers le principal en panne : il faut une route de secours (route flottante avec une distance administrative plus grande, ou un routage dynamique)', 'Le siège passe automatiquement par Internet', 'Les PC changent de masque'], good: 1,
      hints: ['HSRP ne concerne que la passerelle des PC du LAN, pas les routes des autres routeurs.'], explain: 'HSRP protège l’aller (la passerelle des PC). Pour le retour, le siège doit connaître un 2e chemin : <code>ip route 192.168.200.0 255.255.255.0 200.100.20.253 5</code> (route flottante, AD 5) ou un protocole dynamique.' },
    { id: 'hs-lab', type: 'pt', topo: 'HSRP', file: 'HSRP.pkt', tag: 'HSRP',
      q: '<b>Fichier HSRP du prof.</b> Deux routeurs d’accès relient le site principal (192.168.2.0/24, PC en DHCP) au réseau externe (193.1.1.0/24) : <b>Router1</b> (Fa0/0 = 192.168.2.254, Fa0/1 = 193.1.1.1, RIP déjà configuré) et <b>Router0</b> (Fa0/0 = 192.168.2.253, Fa0/1 = 193.1.1.2). Consigne : « Configurer la tolérance aux pannes sur le routeur principal (Router1) et le routeur de secours (Router0) ; mettre à jour la configuration du serveur DHCP si besoin ». Router1 doit être actif et reprendre la main après une panne.',
      tasks: [
        { label: 'Les deux routeurs sont dans le même groupe HSRP avec la même IP virtuelle (différente de leurs IP réelles)', check: function (n) { var g = grp(n); return !!g && realIPs(n).indexOf(g.vip) < 0 && NET.sameNet(g.vip, NET.ip2int('192.168.2.0'), 24); } },
        { label: 'Router1 est le routeur actif', check: function (n) { var g = grp(n); return !!g && n.hsrpActive(n.dev('Router1'), fa(n, 'Router1'), g.g) === 'Router1'; } },
        { label: 'Les PC reçoivent l’IP virtuelle comme passerelle (DHCP)', check: function (n) { var g = grp(n); if (!g) return false; renew(n); return ['PC0', 'PC1'].every(function (p) { return n.dev(p).host.gw === g.vip; }); } },
        { label: 'PC0 joint SRV-EXT1 (193.1.1.10)', check: function (n) { renew(n); return n.canPing('PC0', 'SRV-EXT1'); } },
        { label: 'Panne de Router1 (Fa0/0 coupée) : PC0 joint toujours SRV-EXT1', check: function (n) {
          var g = grp(n); if (!g) return false;
          var c = n.clone(); renew(c);
          LAB.cli(c, 'Router1', ['conf t', 'interface fa0/0', 'shutdown', 'end']);
          c.hsrpActive(c.dev('Router0'), fa(c, 'Router0'), g.g);
          return c.canPing('PC0', 'SRV-EXT1'); } },
        { label: 'Retour de Router1 : il redevient actif (préemption)', check: function (n) {
          var g = grp(n); if (!g) return false;
          var c = n.clone();
          LAB.cli(c, 'Router1', ['conf t', 'interface fa0/0', 'shutdown', 'end']);
          c.hsrpActive(c.dev('Router0'), fa(c, 'Router0'), g.g);
          LAB.cli(c, 'Router1', ['conf t', 'interface fa0/0', 'no shutdown', 'end']);
          return c.hsrpActive(c.dev('Router1'), fa(c, 'Router1'), g.g) === 'Router1'; } }
      ],
      hints: ['Solution la plus simple : garder <b>192.168.2.254</b> comme IP virtuelle (ainsi le DHCP n’a pas à changer) et donner à Router1 une autre IP réelle, par exemple 192.168.2.252.', 'Router1 : <code>interface fa0/0</code> → <code>ip address 192.168.2.252 255.255.255.0</code> → <code>standby 1 ip 192.168.2.254</code> → <code>standby 1 priority 150</code> → <code>standby 1 preempt</code>. Router0 : <code>interface fa0/0</code> → <code>standby 1 ip 192.168.2.254</code>.', 'Pour la panne : le serveur externe renvoie ses réponses à Router1 (sa passerelle 193.1.1.1). Router1 doit alors apprendre le LAN via Router0 : active RIP sur Router0 (<code>router rip</code>, <code>network 192.168.2.0</code>, <code>network 193.1.1.0</code>).'],
      solution: [
        { dev: 'Router1', cli: ['conf t', 'interface fa0/0', 'ip address 192.168.2.252 255.255.255.0', 'standby 1 ip 192.168.2.254', 'standby 1 priority 150', 'standby 1 preempt', 'end'] },
        { dev: 'Router0', cli: ['conf t', 'interface fa0/0', 'standby 1 ip 192.168.2.254', 'exit', 'router rip', 'network 192.168.2.0', 'network 193.1.1.0', 'end'] },
        { dhcp: true, dev: 'PC0' }, { dhcp: true, dev: 'PC1' }
      ],
      explain: 'En gardant 192.168.2.254 comme IP virtuelle, aucun PC ni le DHCP n’ont à changer : c’est la configuration la plus propre. <code>show standby brief</code> : Router1 Active (150, P), Router0 Standby. Si tu préfères une nouvelle IP virtuelle (ex. 192.168.2.1), il faut alors modifier la passerelle du pool DHCP.' }
  ]
  });
})();
