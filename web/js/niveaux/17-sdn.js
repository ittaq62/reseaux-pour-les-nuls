/* Module 17 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).sdn = [
  /* ---------- Débutant ---------- */
  { id: 'xsd1', lvl: 1, type: 'qcm', q: 'Dans une architecture SDN, qui décide de la façon dont le trafic est acheminé ?',
    choices: ['Un contrôleur central, qui pilote les équipements', 'Chaque switch, seul dans son coin', 'Les PC des utilisateurs', 'Le fournisseur d’accès'], good: 0,
    hints: ['SDN = le réseau défini par le logiciel… d’un seul endroit.'],
    explain: 'Le <b>contrôleur</b> centralise l’intelligence (plan de contrôle) ; les équipements appliquent ses décisions (plan de données).' },
  { id: 'xsd2', lvl: 1, type: 'qcm', q: 'Pourquoi préfère-t-on <b>SSH</b> à Telnet pour administrer un switch ou un routeur ?',
    choices: ['Parce que SSH chiffre toute la session, mots de passe compris ; Telnet envoie tout en clair', 'Parce que SSH est plus ancien', 'Parce que Telnet ne marche pas dans Packet Tracer', 'Parce que SSH n’a pas besoin de mot de passe'], good: 0,
    hints: ['Que verrait quelqu’un qui capture le trafic ?'],
    explain: 'Avec Telnet (TCP 23), un simple analyseur de trafic lit le mot de passe. SSH (TCP 22) <b>chiffre</b> la session.' },
  /* ---------- Difficile ---------- */
  { id: 'xsd3', lvl: 4, type: 'qcm', q: 'Quelle commande génère, sur un équipement Cisco, les clés nécessaires au serveur SSH ?',
    choices: ['crypto key generate rsa', 'ip ssh enable', 'ssh keygen', 'service ssh start'], good: 0,
    hints: ['Les clés sont de type RSA.'],
    explain: '<code>crypto key generate rsa</code> (puis la taille, par exemple 1024). SSH s’active tout seul : « %SSH-5-ENABLED: SSH 1.99 has been enabled ».' },
  /* ---------- Extrême ---------- */
  { id: 'xsd4', lvl: 5, type: 'qcm', q: 'Sur un switch neuf, <code>crypto key generate rsa</code> répond « % Please define a hostname other than Switch. ». Pourquoi ?',
    choices: ['Parce que les clés portent le nom de l’équipement (nom.domaine) : il faut un vrai hostname, puis un ip domain-name', 'Parce que le switch n’a pas de licence SSH', 'Parce qu’il faut d’abord configurer les VLAN', 'Parce que la commande n’existe que sur les routeurs'], good: 0,
    hints: ['Lis la ligne « The name for the keys will be: … » quand la commande réussit.'],
    explain: 'Le nom des clés est <code>hostname.domaine</code> (SW-ACCES.imt.local) : IOS exige un <b>hostname</b> personnalisé, puis un <b>ip domain-name</b> (sinon « % Please define a domain-name first. »).' },
  /* ---------- Impossible ---------- */
  { id: 'xsd5', lvl: 6, type: 'qcm', q: 'Les clés RSA d’un switch font <b>512 bits</b>. Tu tapes <code>ip ssh version 2</code>. Que faut-il savoir ?',
    choices: ['Rien, SSH v2 accepte toutes les tailles', 'SSH v2 exige des clés d’au moins 768 bits : il faut les régénérer (1024 conseillé)', 'SSH v2 exige exactement 2048 bits', 'SSH v2 n’utilise pas de clés RSA'], good: 1,
    hints: ['IOS le dit lui-même : « … RSA keys (of atleast … bits size) to enable SSH v2 ».'],
    explain: 'SSH version 2 refuse les clés de moins de <b>768 bits</b>. On régénère avec <code>crypto key generate rsa</code> et une taille de 1024 (ou plus).' },
  { id: 'xsd6', lvl: 6, type: 'match', q: 'Associe chaque interface d’un contrôleur SDN à ce qui passe dessus.',
    pairs: [['Northbound (vers le haut)', 'Les applications et scripts parlent au contrôleur (API REST, JSON)'], ['Southbound (vers le bas)', 'Le contrôleur pilote les équipements (OpenFlow, SSH/CLI, NETCONF…)']],
    hints: ['Sur un schéma, les applications sont en haut, les équipements en bas.'],
    explain: 'Ton script Python utilise l’API <b>northbound</b> (REST) ; le contrôleur utilise ensuite les protocoles <b>southbound</b> (dans Packet Tracer : SSH/CLI après la découverte CDP) pour agir sur les équipements.' },
  { id: 'xsd-lab', lvl: 6, type: 'pt', file: 'Switch-SSH-panne.pkt', tag: 'Dépannage SSH',
    q: '<b>SSH refusé.</b> Un collègue a préparé SW-ACCES pour l’administration à distance (Vlan1 = 10.0.1.4/24, domaine imt.local, clés RSA 1024 bits, SSH v2, compte <b>admin</b> / <code>cisco123</code>)… mais depuis PC-ADMIN (10.0.2.10), <code>ssh -l admin 10.0.1.4</code> échoue. <b>Trois erreurs</b> sur le switch. Exigence : SSH uniquement, avec les comptes locaux.',
    build: function () {
      return LAB.make({
        devices: [['PC-ADMIN', 'PC-PT', 100, 220], ['Switch-ADM', '2960-24TT', 300, 220], ['R1', '1941', 520, 220], ['SW-ACCES', '2960-24TT', 740, 220], ['PC1', 'PC-PT', 940, 220]],
        links: [['PC-ADMIN', 'FastEthernet0', 'Switch-ADM', 'FastEthernet0/1', 'straight'], ['Switch-ADM', 'GigabitEthernet0/1', 'R1', 'GigabitEthernet0/1', 'straight'], ['R1', 'GigabitEthernet0/0', 'SW-ACCES', 'GigabitEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'SW-ACCES', 'FastEthernet0/1', 'straight']],
        cli: {
          R1: ['conf t', 'hostname R1', 'interface g0/0', 'ip address 10.0.1.1 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 10.0.2.1 255.255.255.0', 'no shutdown', 'end'],
          'SW-ACCES': ['conf t', 'hostname SW-ACCES', 'interface vlan 1', 'ip address 10.0.1.4 255.255.255.0', 'no shutdown', 'exit', 'ip domain-name imt.local', 'crypto key generate rsa', '1024', 'ip ssh version 2', 'username admin password cisco123', 'line vty 0 15', 'password cisco', 'login', 'transport input telnet', 'end']
        },
        hosts: { 'PC-ADMIN': { ip: '10.0.2.10', mask: '255.255.255.0', gw: '10.0.2.1' }, PC1: { ip: '10.0.1.20', mask: '255.255.255.0', gw: '10.0.1.1' } },
        notes: [[80, 330, 'Administration 10.0.2.0/24 (passerelle .1) · Accès 10.0.1.0/24 (passerelle .1) · SW-ACCES = 10.0.1.4']]
      });
    },
    tasks: [
      { label: 'PC-ADMIN joint le switch (ping 10.0.1.4)', check: function (n) { return n.canPing('PC-ADMIN', '10.0.1.4'); } },
      { label: 'PC-ADMIN ouvre une session SSH avec admin / cisco123', check: function (n) { return LAB.sshLogin(n, 'PC-ADMIN', '10.0.1.4', 'admin', 'cisco123'); } },
      { label: 'Telnet vers le switch est refusé', check: function (n) { var o = new PCShell(n, n.dev('PC-ADMIN')).exec('telnet 10.0.1.4'); return o.join(' ').indexOf('refused') >= 0; } }
    ],
    hints: ['« Connection timed out » : le switch ne répond même pas. Il est dans 10.0.1.0/24, PC-ADMIN dans 10.0.2.0/24 : par où le switch renvoie-t-il ses réponses ?', '« Connection refused » : lis la section <code>line vty</code> de <code>show running-config</code>. Quels protocoles sont acceptés ?', 'SSH exige un nom d’utilisateur : un simple mot de passe de ligne (<code>login</code>) ne suffit pas.'],
    solution: [
      { dev: 'SW-ACCES', cli: ['conf t', 'ip default-gateway 10.0.1.1', 'end'] },
      { dev: 'SW-ACCES', cli: ['conf t', 'line vty 0 15', 'transport input ssh', 'end'] },
      { dev: 'SW-ACCES', cli: ['conf t', 'line vty 0 15', 'login local', 'end'] }
    ],
    explain: 'Trois pannes : (1) pas d’<code>ip default-gateway</code> : le switch ne savait pas répondre à un autre réseau (« Connection timed out ») ; (2) <code>transport input telnet</code> fermait la porte à SSH et l’ouvrait à Telnet ; (3) <code>login</code> (mot de passe de ligne) au lieu de <code>login local</code> : SSH a besoin d’un compte utilisateur. Les clés et le compte étaient bons : c’est l’accès qui était mal réglé.' }
];
