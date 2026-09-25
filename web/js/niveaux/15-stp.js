/* Module 15 — questions supplémentaires des niveaux */
(function () {
  function liens(n, a, b) { return n.links.filter(function (l) { return ((l.a.dev === a && l.b.dev === b) || (l.a.dev === b && l.b.dev === a)) && n.cableOk(l); }); }
  function racine(n) { var i = n.stpAll().byVlan[1]; return i && i.roots.length ? i.roots[0] : null; }
  function prio(n, sw) { return n.stpPrio(n.dev(sw), 1); }
  function bloques(n) { return ['SW-A', 'SW-B', 'SW-C'].reduce(function (t, s) { var d = n.dev(s); return t + d.ifaces.filter(function (i) { return n.portBlocked(d, i.name, 1); }).length; }, 0); }
  (window.EXTRAS = window.EXTRAS || {}).stp = [
    /* ---------- Débutant ---------- */
    { id: 'xp1', lvl: 1, type: 'qcm', q: 'Pourquoi relier deux switchs par <b>deux</b> câbles plutôt qu’un seul ?',
      choices: ['Pour la redondance : si un câble ou un port tombe, l’autre chemin prend le relais', 'Pour doubler le nombre d’adresses IP', 'Parce qu’un seul câble est interdit', 'Pour créer deux VLAN'], good: 0,
      hints: ['« Une seule voiture = pas de voiture le jour où elle casse. »'],
      explain: 'C’est la <b>redondance</b>. Mais elle crée une boucle de couche 2, et c’est là qu’intervient Spanning Tree.' },
    { id: 'xp2', lvl: 1, type: 'qcm', q: 'Que fait Spanning Tree (STP) ?',
      choices: ['Il bloque certains ports pour supprimer les boucles, tout en gardant les liens de secours prêts', 'Il chiffre les trames', 'Il attribue des adresses IP aux switchs', 'Il accélère les liens'], good: 0,
      hints: ['Spanning tree = arbre couvrant : un arbre n’a pas de boucle.'],
      explain: 'STP construit un <b>arbre</b> sans boucle : des ports passent en <b>blocage</b> et se réactivent automatiquement si un lien actif tombe.' },
    /* ---------- Difficile ---------- */
    { id: 'xp3', lvl: 4, type: 'qcm', q: 'Quelle commande fait d’un switch le pont racine du VLAN 1, sans avoir à calculer une priorité ?',
      choices: ['spanning-tree vlan 1 root primary', 'spanning-tree root', 'switchport root vlan 1', 'stp master'], good: 0,
      hints: ['Il existe aussi une version « secondary » pour la racine de secours.'],
      explain: '<code>spanning-tree vlan 1 root primary</code> abaisse la priorité (24576 si la racine actuelle est à 32768). <code>root secondary</code> met 28672 : le switch devient racine si la principale tombe.' },
    { id: 'xp-lab', lvl: 4, type: 'pt', file: 'Triangle-STP.pkt', tag: 'Pont racine',
      q: '<b>Le triangle du cours.</b> Trois switchs SW-A, SW-B et SW-C : SW-A est relié aux deux autres (Fa0/23 et Fa0/24).<br>1) Ferme le triangle : relie <b>SW-B Fa0/24</b> à <b>SW-C Fa0/24</b>.<br>2) Fais de <b>SW-C</b> le pont racine du VLAN 1.<br>3) Si SW-C tombe en panne, c’est <b>SW-B</b> (et pas SW-A) qui doit devenir racine.<br>Vérifie avec <code>show spanning-tree</code> et un ping.',
      build: function () {
        return LAB.make({
          devices: [['SW-A', '2960-24TT', 520, 170], ['SW-B', '2960-24TT', 300, 390], ['SW-C', '2960-24TT', 740, 390], ['PC-A', 'PC-PT', 520, 30], ['PC-B', 'PC-PT', 120, 500], ['PC-C', 'PC-PT', 920, 500]],
          links: [['SW-A', 'FastEthernet0/23', 'SW-B', 'FastEthernet0/23', 'cross'], ['SW-A', 'FastEthernet0/24', 'SW-C', 'FastEthernet0/23', 'cross'], ['PC-A', 'FastEthernet0', 'SW-A', 'FastEthernet0/1', 'straight'], ['PC-B', 'FastEthernet0', 'SW-B', 'FastEthernet0/1', 'straight'], ['PC-C', 'FastEthernet0', 'SW-C', 'FastEthernet0/1', 'straight']],
          hosts: { 'PC-A': { ip: '192.168.1.1', mask: '255.255.255.0' }, 'PC-B': { ip: '192.168.1.2', mask: '255.255.255.0' }, 'PC-C': { ip: '192.168.1.3', mask: '255.255.255.0' } }
        });
      },
      tasks: [
        { label: 'SW-B Fa0/24 est relié à SW-C Fa0/24 (câble croisé)', check: function (n) { return LAB.linkedPorts(n, 'SW-B', 'FastEthernet0/24', 'SW-C', 'FastEthernet0/24') && liens(n, 'SW-B', 'SW-C')[0].cable === 'cross'; } },
        { label: 'SW-C est le pont racine grâce à sa priorité', check: function (n) { return racine(n) === 'SW-C' && prio(n, 'SW-C') < prio(n, 'SW-A') && prio(n, 'SW-C') < prio(n, 'SW-B'); } },
        { label: 'SW-B est la racine de secours : priorité entre celle de SW-C et celle de SW-A', check: function (n) { return prio(n, 'SW-C') < prio(n, 'SW-B') && prio(n, 'SW-B') < prio(n, 'SW-A'); } },
        { label: 'Un seul port bloqué dans le triangle, et PC-A joint PC-B et PC-C', check: function (n) { return bloques(n) === 1 && n.canPing('PC-A', 'PC-B') && n.canPing('PC-A', 'PC-C'); } }
      ],
      hints: ['Câble <b>croisé</b> (switch ⟷ switch) entre SW-B Fa0/24 et SW-C Fa0/24.', 'SW-C : <code>spanning-tree vlan 1 root primary</code> (ou <code>spanning-tree vlan 1 priority 4096</code>).', 'SW-B : <code>spanning-tree vlan 1 root secondary</code> (28672, entre 24576 et 32768). Vérifie : <code>show spanning-tree</code> sur SW-C affiche « This bridge is the root ».'],
      solution: [
        { link: ['SW-B', 'FastEthernet0/24', 'SW-C', 'FastEthernet0/24', 'cross'] },
        { dev: 'SW-C', cli: ['conf t', 'spanning-tree vlan 1 root primary', 'end'] },
        { dev: 'SW-B', cli: ['conf t', 'spanning-tree vlan 1 root secondary', 'end'] }
      ],
      explain: 'SW-C (24576) est racine : ses deux ports sont désignés. SW-A et SW-B ont chacun leur port racine vers SW-C. Sur le segment SW-A ⟷ SW-B, les deux sont à 19 de la racine : le plus petit BID (SW-B, 28672) garde le port désigné et <b>SW-A bloque</b> son port Fa0/23. Si SW-C tombe, SW-B (28672 &lt; 32768) prend la place de racine.' },
    /* ---------- Extrême ---------- */
    { id: 'xp4', lvl: 5, type: 'text', kind: 'int', accept: 4106, ph: 'priorité',
      q: 'Sur un switch, tu tapes <code>spanning-tree vlan 10 priority 4096</code>. Quelle priorité apparaît dans le Bridge ID du VLAN 10 (<code>show spanning-tree vlan 10</code>) ?',
      hints: ['Cisco ajoute le numéro du VLAN (extended system ID) à la priorité configurée.'],
      explain: '4096 + 10 = <b>4106</b> : « Bridge ID Priority 4106 (priority 4096 sys-id-ext 10) ». Même chose en VLAN 1 par défaut : 32768 + 1 = 32769.' },
    /* ---------- Impossible ---------- */
    { id: 'xp5', lvl: 6, type: 'qcm', q: 'Pourquoi la priorité STP ne se règle-t-elle que par pas de <b>4096</b> ?',
      choices: ['Par convention, sans raison technique', 'Parce que sur les 16 bits de priorité, les 12 bits de poids faible sont réservés au numéro de VLAN (extended system ID) : il ne reste que 4 bits réglables', 'Parce que 4096 est le nombre maximal de switchs', 'Parce que le BID fait 4096 bits'], good: 1,
      hints: ['4096 = 2¹². Et combien de bits faut-il pour coder un numéro de VLAN ?'],
      explain: 'Le champ priorité (16 bits) = 4 bits réglables + 12 bits d’<b>extended system ID</b> (le VLAN, 0 à 4095). Les 4 bits réglables valent 0, 4096, 8192… 61440 : IOS refuse le reste (« % Bridge Priority must be in increments of 4096. »).' },
    { id: 'xp6', lvl: 6, type: 'qcm', q: 'SW1 est racine. SW2 lui est relié par deux câbles FastEthernet : <b>SW1 Fa0/5 ⟷ SW2 Fa0/10</b> et <b>SW1 Fa0/7 ⟷ SW2 Fa0/3</b>. Quel port de SW2 devient port racine ?',
      choices: ['Fa0/3, car c’est le plus petit numéro de port de SW2', 'Fa0/10, car il est relié au plus petit Port ID de SW1 (128.5)', 'Les deux, pour doubler le débit', 'Aucun : les deux sont bloqués'], good: 1,
      hints: ['Même coût (19), même voisin (SW1, même BID)… Le critère suivant est le Port ID de l’<b>émetteur</b> de la BPDU.'],
      explain: 'Départage : coût vers la racine, puis BID du voisin, puis <b>Port ID du voisin</b>. Les BPDU arrivant par Fa0/10 viennent de SW1 Fa0/5 (128.5), plus petit que Fa0/7 (128.7) : <b>Fa0/10</b> est port racine et Fa0/3 est bloqué, même si son numéro est plus petit.' },
    { id: 'xp7', lvl: 6, type: 'text', kind: 'int', accept: 30, ph: 'secondes',
      q: 'STP 802.1D, sans PortFast : tu branches un PC sur un port de switch. Au bout de combien de secondes le port commence-t-il à transmettre ses trames ?',
      hints: ['Un nouveau lien ne passe pas par le délai de blocage (max age) : il n’a pas d’ancienne information à faire vieillir.'],
      explain: 'Écoute (15 s) + apprentissage (15 s) = <b>30 s</b> (d’où les voyants orange dans Packet Tracer). Les 20 s de max age s’ajoutent seulement quand un port bloqué attend l’expiration d’une ancienne BPDU (50 s au total). Sur un port de PC, <code>spanning-tree portfast</code> supprime cette attente.' }
  ];
})();
