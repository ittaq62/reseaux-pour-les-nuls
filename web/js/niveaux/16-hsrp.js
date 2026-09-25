/* Module 16 — questions supplémentaires des niveaux */
(function () {
  function fa(n, r) { return n.iface(n.dev(r), 'FastEthernet0/0'); }
  function renew(n) { ['PC0', 'PC1'].forEach(function (p) { n.dhcpRequest(n.dev(p)); }); }
  function actif(n) { return n.hsrpActive(n.dev('Router1'), fa(n, 'Router1'), 1); }
  (window.EXTRAS = window.EXTRAS || {}).hsrp = [
    /* ---------- Débutant ---------- */
    { id: 'xh1', lvl: 1, type: 'qcm', q: 'Que signifie <b>HSRP</b> ?',
      choices: ['Hot Standby Router Protocol', 'High Speed Routing Protocol', 'Host Security Relay Protocol', 'Hybrid Switch Redundancy Protocol'], good: 0,
      hints: ['« Standby » = en veille, prêt à prendre le relais.'],
      explain: '<b>Hot Standby Router Protocol</b> : un routeur actif, un routeur « en veille à chaud » prêt à le remplacer.' },
    { id: 'xh2', lvl: 1, type: 'qcm', q: 'Avec HSRP, quelle adresse les PC utilisent-ils comme passerelle par défaut ?',
      choices: ['L’adresse IP virtuelle partagée par les routeurs du groupe', 'L’adresse réelle du routeur principal', 'L’adresse réelle du routeur de secours', 'L’adresse du serveur DHCP'], good: 0,
      hints: ['Si les PC utilisaient l’adresse réelle d’un routeur, que se passerait-il quand il tombe ?'],
      explain: 'Les PC visent l’<b>IP virtuelle</b> (et la MAC virtuelle) du groupe. Quel que soit le routeur actif, la passerelle ne change pas pour eux.' },
    /* ---------- Facile ---------- */
    { id: 'xh3', lvl: 2, type: 'qcm', q: 'Quelle commande affiche en une ligne par groupe l’état HSRP d’un routeur (Active / Standby, priorité, IP virtuelle) ?',
      choices: ['show standby brief', 'show hsrp all', 'show ip route standby', 'show running-config hsrp'], good: 0,
      hints: ['Les commandes HSRP commencent toutes par « standby ».'],
      explain: '<code>show standby brief</code> : interface, groupe, priorité, P (préemption), état, routeurs actif et en veille, IP virtuelle. <code>show standby</code> donne le détail.' },
    /* ---------- Moyen ---------- */
    { id: 'xh4', lvl: 3, type: 'qcm', q: 'Deux routeurs HSRP du même groupe ont la <b>même priorité</b> (100). Lequel devient actif ?',
      choices: ['Celui qui a la plus grande adresse IP réelle sur l’interface du groupe', 'Celui qui a la plus petite adresse MAC', 'Le premier allumé, pour toujours', 'Aucun des deux'], good: 0,
      hints: ['C’est le critère de départage de HSRP, à l’inverse de STP qui préfère le plus petit.'],
      explain: 'À priorité égale, la <b>plus grande adresse IP</b> l’emporte. Pour choisir soi-même, on règle <code>standby 1 priority</code>.' },
    { id: 'xh5', lvl: 3, type: 'qcm', q: 'Le routeur actif tombe, le routeur en veille prend le relais. Quelle MAC les PC ont-ils alors dans leur cache ARP pour la passerelle ?',
      choices: ['La même MAC virtuelle qu’avant (0000.0c07.acXX) : rien à changer pour eux', 'La MAC réelle du routeur de secours', 'Aucune : ils doivent redémarrer', 'FFFF.FFFF.FFFF'], good: 0,
      hints: ['La MAC virtuelle appartient au groupe, pas à un routeur.'],
      explain: 'La MAC virtuelle suit le rôle « actif » : le nouveau routeur actif répond avec la <b>même</b> MAC. Les PC ne voient pas la différence, c’est tout l’intérêt.' },
    /* ---------- Extrême ---------- */
    { id: 'xh6', lvl: 5, type: 'qcm', q: 'Le lien vers Internet (Fa0/1) du routeur <b>actif</b> tombe, mais son interface LAN (Fa0/0) reste en marche. Sans configuration supplémentaire, que se passe-t-il ?',
      choices: ['Le routeur en veille devient actif immédiatement', 'Le routeur reste actif : HSRP ne voit que le LAN, les PC continuent de lui envoyer leurs paquets… qui ne sortent plus', 'Les PC changent de passerelle tout seuls', 'Le groupe HSRP est supprimé'], good: 1,
      hints: ['Sur quelle interface circulent les Hello HSRP ?'],
      explain: 'Les Hello passent par le LAN, toujours en marche : l’actif reste actif et le trafic se perd. Sur les vrais routeurs, IOS propose le suivi d’interface (<code>standby track</code>) qui baisse la priorité quand le lien surveillé tombe.' },
    { id: 'xh7', lvl: 5, type: 'text', q: 'Quelle est l’adresse MAC virtuelle HSRP (version 1) du groupe <b>20</b> ?',
      fields: [{ label: 'MAC virtuelle', kind: 'mac', answer: '0000.0c07.ac14', ph: '0000.0c07.ac..' }],
      hints: ['Les deux derniers chiffres = le numéro de groupe en hexadécimal.', '20 = 16 + 4.'],
      explain: '20 = 0x<b>14</b> → <code>0000.0c07.ac14</code>.' },
    /* ---------- Impossible ---------- */
    { id: 'xh8', lvl: 6, type: 'qcm', q: 'R1 est actif (priorité 150, preempt). R2 est en veille (priorité 100). Sur R2, tu tapes <code>standby 1 priority 200</code>, <b>sans</b> preempt. Qui est actif ?',
      choices: ['R2, car il a maintenant la plus grande priorité', 'R1 : sans preempt, R2 ne peut pas prendre la place d’un routeur actif qui fonctionne', 'Les deux', 'Aucun, le groupe se réinitialise'], good: 1,
      hints: ['La préemption est le droit de <b>prendre</b> la place de l’actif ; c’est R2 qui en aurait besoin.'],
      explain: 'Une priorité plus haute ne suffit pas : il faut <b>preempt</b> sur le routeur qui veut prendre la main. R1 reste actif tant qu’il fonctionne. Le preempt de R1 ne sert qu’à R1.' },
    { id: 'xh-lab', lvl: 6, type: 'pt', file: 'HSRP-panne.pkt', tag: 'Dépannage HSRP',
      q: '<b>HSRP mal réglé.</b> Le fichier HSRP du prof a été configuré (IP virtuelle 192.168.2.254, groupe 1, Router1 = 192.168.2.252, Router0 = 192.168.2.253), puis retouché : <b>trois erreurs</b> sur les deux routeurs. Exigences : Router1 est le routeur actif, il reprend la main quand il revient d’une panne, et les PC joignent toujours SRV-EXT1 (193.1.1.10) quand Router1 est en panne.',
      build: function () {
        var n = LAB.solved('hs-lab');
        LAB.cli(n, 'Router1', ['conf t', 'interface fa0/0', 'standby 1 priority 90', 'no standby 1 preempt', 'end']);
        LAB.cli(n, 'Router0', ['conf t', 'no router rip', 'end']);
        /* au démarrage, Router0 (100) l'emporte sur Router1 (90) et devient actif */
        n.hsrp = {};
        actif(n);
        return LAB.save(n);
      },
      tasks: [
        { label: 'Router1 est le routeur actif', check: function (n) { return actif(n) === 'Router1'; } },
        { label: 'Panne de Router1 (Fa0/0 coupée) : PC0 joint toujours SRV-EXT1', check: function (n) {
          var c = n.clone(); renew(c);
          LAB.cli(c, 'Router1', ['conf t', 'interface fa0/0', 'shutdown', 'end']);
          c.hsrpActive(c.dev('Router0'), fa(c, 'Router0'), 1);
          return c.canPing('PC0', 'SRV-EXT1'); } },
        { label: 'Retour de Router1 : il redevient actif', check: function (n) {
          var c = n.clone();
          LAB.cli(c, 'Router1', ['conf t', 'interface fa0/0', 'shutdown', 'end']);
          c.hsrpActive(c.dev('Router0'), fa(c, 'Router0'), 1);
          LAB.cli(c, 'Router1', ['conf t', 'interface fa0/0', 'no shutdown', 'end']);
          return actif(c) === 'Router1'; } }
      ],
      hints: ['<code>show standby brief</code> sur les deux routeurs : priorités et lettre P (preempt).', 'Router0 est actif en ce moment : pour que Router1 lui reprenne la place, une priorité plus haute ne suffit pas.', 'Quand Router1 est en panne, SRV-EXT1 renvoie toujours ses réponses à Router1 (193.1.1.1). Comment Router1 apprend-il qu’il faut passer par Router0 pour joindre 192.168.2.0 ? Compare <code>show running-config</code> des deux routeurs.'],
      solution: [
        { dev: 'Router1', cli: ['conf t', 'interface fa0/0', 'standby 1 priority 150', 'end'] },
        { dev: 'Router1', cli: ['conf t', 'interface fa0/0', 'standby 1 preempt', 'end'] },
        { dev: 'Router0', cli: ['conf t', 'router rip', 'network 192.168.2.0', 'network 193.1.1.0', 'end'] }
      ],
      explain: 'Trois pannes : (1) Router1 avait la priorité 90, plus faible que Router0 (100) ; (2) sans <b>preempt</b>, même avec 150 il ne reprenait pas la place de Router0, déjà actif ; (3) Router0 ne faisait plus de RIP : pendant une panne de Router1, les PC sortaient bien par Router0, mais les réponses de SRV-EXT1 (qui passent par 193.1.1.1) ne trouvaient plus le chemin du LAN. HSRP protège l’aller, le routage doit protéger le retour.' }
  ];
})();
