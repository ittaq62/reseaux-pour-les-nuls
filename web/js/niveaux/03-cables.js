/* Module 3 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).cables = [
  /* ---------- Débutant ---------- */
  { id: 'xc1', lvl: 1, type: 'qcm', q: 'Quel connecteur termine un câble réseau Ethernet en cuivre ?',
    choices: ['RJ45', 'RJ11 (téléphone)', 'USB', 'HDMI'], good: 0,
    hints: ['Registered Jack n°45, 8 contacts.'], explain: 'Le <b>RJ45</b> (8P8C : 8 positions, 8 contacts).' },
  { id: 'xc2', lvl: 1, type: 'qcm', q: 'Quel support transporte l’information sous forme de <b>lumière</b> ?',
    choices: ['La paire torsadée', 'Le câble coaxial', 'La fibre optique', 'Le câble console'], good: 2,
    hints: ['Cœur en silice, réflexion totale interne…'], explain: 'La <b>fibre optique</b> : la lumière (infrarouge, 850 / 1300 / 1550 nm) est guidée dans le cœur.' },
  { id: 'xc3', lvl: 1, type: 'match', q: 'Dans Packet Tracer, à quoi ressemble chaque câble ?',
    pairs: [['Trait noir plein', 'Câble droit (Copper Straight-Through)'], ['Trait noir en pointillés', 'Câble croisé (Copper Cross-Over)'], ['Trait orange', 'Fibre'], ['Trait rouge en forme d’éclair', 'Liaison série (Serial)']],
    hints: ['« Croisé » = on voit les brins qui se croisent… en pointillés.'],
    explain: 'Droit = plein, croisé = pointillés, fibre = orange, série = éclair rouge. Et le câble console est bleu clair.' },
  /* ---------- Difficile ---------- */
  { id: 'xc4', lvl: 4, type: 'qcm', q: 'Pourquoi le <b>PoE</b> (alimentation par le câble réseau) est-il facile à mettre en place en 10/100 Mbit/s ?',
    choices: ['Parce que le courant passe dans la gaine', 'Parce que 10BaseT et 100BaseTX n’utilisent que 2 paires sur 4 : il en reste 2 libres', 'Parce que le PoE remplace les données', 'Parce qu’il faut un câble croisé'], good: 1,
    hints: ['Combien de paires utilisent 10BaseT / 100BaseTX ? Et combien y en a-t-il dans le câble ?'],
    explain: 'En 10/100, une paire par sens suffit : les <b>deux paires inutilisées</b> peuvent transporter l’alimentation (téléphones IP, bornes Wi-Fi).' },
  { id: 'xc5', lvl: 4, type: 'qcm', q: 'Dans Packet Tracer, un câble <b>droit</b> entre deux switchs 2960 reste rouge. Pourtant, sur de vrais switchs récents, le même câble fonctionne souvent. Grâce à quoi ?',
    choices: ['Au Spanning Tree', 'À l’Auto-MDIX, qui détecte le type de câble et adapte les paires', 'Au PoE', 'Au VLAN natif'], good: 1,
    hints: ['MDI / MDI-X…'],
    explain: 'L’<b>Auto-MDIX</b> inverse électroniquement émission / réception. Mais il se désactive si la vitesse ou le duplex sont fixés : utilise toujours le bon câble (et Packet Tracer applique la règle stricte).' },
  /* ---------- Extrême ---------- */
  { id: 'xc6', lvl: 5, type: 'qcm', q: 'Tu dois relier deux bâtiments distants de <b>20 km</b> en fibre. Quel type de fibre choisis-tu ?',
    choices: ['Multimode, cordon orange', 'Monomode : cœur de 9 µm, laser, faible dispersion', 'N’importe laquelle, la distance ne compte pas en fibre', 'De la paire torsadée STP'], good: 1,
    hints: ['La dispersion limite la distance… laquelle disperse le moins ?'],
    explain: '<b>Monomode</b> (SMF) : faible dispersion, source laser → longues distances. Le multimode (LED, dispersion plus forte) est réservé aux courtes distances (dans un bâtiment).' },
  { id: 'xc-lab2', lvl: 5, type: 'pt', file: 'Cablage-a-verifier.pkt', noAutoCable: true, tag: 'Dépannage physique',
    q: '<b>Dépannage physique.</b> Un collègue a câblé ce réseau… et plus rien ne passe. Les adresses et le routage sont corrects : seuls des <b>câbles</b> sont faux. Repère les liaisons en rouge, supprime-les (outil <b>Delete</b>) et recâble-les avec le bon type, sans changer de ports. Objectif final : PC0 joint PC1.',
    build: function () {
      return LAB.make({
        devices: [['PC0', 'PC-PT', 100, 200], ['Switch0', '2960-24TT', 280, 200], ['Switch1', '2960-24TT', 460, 200], ['Router0', '1941', 640, 200], ['Router1', '1941', 840, 200], ['PC1', 'PC-PT', 1020, 200]],
        links: [['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'cross'], ['Switch0', 'GigabitEthernet0/1', 'Switch1', 'GigabitEthernet0/1', 'straight'], ['Switch1', 'GigabitEthernet0/2', 'Router0', 'GigabitEthernet0/0', 'straight'], ['Router0', 'GigabitEthernet0/1', 'Router1', 'GigabitEthernet0/1', 'straight'], ['Router1', 'GigabitEthernet0/0', 'PC1', 'FastEthernet0', 'straight']],
        cli: {
          Router0: ['conf t', 'hostname Router0', 'interface g0/0', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 10.0.0.1 255.255.255.252', 'no shutdown', 'exit', 'ip route 192.168.2.0 255.255.255.0 10.0.0.2', 'end'],
          Router1: ['conf t', 'hostname Router1', 'interface g0/0', 'ip address 192.168.2.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 10.0.0.2 255.255.255.252', 'no shutdown', 'exit', 'ip route 192.168.1.0 255.255.255.0 10.0.0.1', 'end']
        },
        hosts: { PC0: { ip: '192.168.1.10', mask: '255.255.255.0', gw: '192.168.1.254' }, PC1: { ip: '192.168.2.10', mask: '255.255.255.0', gw: '192.168.2.254' } }
      });
    },
    tasks: [
      { label: 'PC0 ⟷ Switch0 avec le bon câble', check: function (n) { return LAB.linked(n, 'PC0', 'Switch0', 'straight'); } },
      { label: 'Switch0 ⟷ Switch1 avec le bon câble', check: function (n) { return LAB.linked(n, 'Switch0', 'Switch1', 'cross'); } },
      { label: 'Switch1 ⟷ Router0 avec le bon câble', check: function (n) { return LAB.linked(n, 'Switch1', 'Router0', 'straight'); } },
      { label: 'Router0 ⟷ Router1 (G0/1) avec le bon câble', check: function (n) { return LAB.linkedPorts(n, 'Router0', 'GigabitEthernet0/1', 'Router1', 'GigabitEthernet0/1') && n.linkOf('Router0', 'GigabitEthernet0/1').cable === 'cross'; } },
      { label: 'Router1 (G0/0) ⟷ PC1 avec le bon câble', check: function (n) { return LAB.linkedPorts(n, 'Router1', 'GigabitEthernet0/0', 'PC1', 'FastEthernet0') && n.linkOf('Router1', 'GigabitEthernet0/0').cable === 'cross'; } },
      { label: 'PC0 joint PC1', check: function (n) { return n.canPing('PC0', 'PC1'); } }
    ],
    hints: ['Regarde les voyants : un câble du mauvais type laisse les voyants <b>rouges</b> des deux côtés (plein = droit, pointillés = croisé).', 'Quatre câbles sur cinq sont faux ! Seul le lien switch ⟷ routeur est correct.', 'Règle : droit entre familles différentes (PC/routeur ⟷ switch), croisé dans la même famille (switch ⟷ switch, routeur ⟷ routeur, PC ⟷ routeur).'],
    solution: [{ link: ['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'] }, { link: ['Switch0', 'GigabitEthernet0/1', 'Switch1', 'GigabitEthernet0/1', 'cross'] }, { link: ['Router0', 'GigabitEthernet0/1', 'Router1', 'GigabitEthernet0/1', 'cross'] }, { link: ['Router1', 'GigabitEthernet0/0', 'PC1', 'FastEthernet0', 'cross'] }],
    explain: 'PC ⟷ switch : droit. Switch ⟷ switch : croisé. Switch ⟷ routeur : droit (déjà bon). Routeur ⟷ routeur : croisé. Routeur ⟷ PC : croisé. Une fois la couche 1 réparée, tout le reste (adresses, routes) fonctionne : « d’abord la couche 1 », c’est la base de tout dépannage.' },
  /* ---------- Impossible ---------- */
  { id: 'xc7', lvl: 6, type: 'qcm', q: 'Un câble croisé « T568A d’un côté, T568B de l’autre » relie deux switchs en <b>1000BaseT</b>, sans Auto-MDIX. Le lien ne monte pas. Pourquoi ?',
    choices: ['Parce qu’il faut un câble droit en Gigabit', 'Parce que ce câble ne croise que 2 paires, alors que 1000BaseT utilise les 4 paires : il faut les croiser toutes', 'Parce que le Gigabit exige de la fibre', 'Parce que T568A est interdit en Gigabit'], good: 1,
    hints: ['Ton poly : « ce type de câble n’est pas compatible avec tous les standards Ethernet, notamment 1000BaseT ».'],
    explain: 'Le croisé A/B n’inverse que les paires 2 et 3. En 1000BaseT, les <b>4 paires</b> travaillent : un croisé « Gigabit » doit les croiser toutes.' },
  { id: 'xc8', lvl: 6, type: 'text', kind: 'int', accept: 20, ph: 'dB',
    q: 'Une fibre en silice atténue de <b>0,2 dB/km</b> à 1550 nm. Quelle est l’atténuation totale sur <b>100 km</b> (en dB) ?',
    hints: ['Les dB d’atténuation s’additionnent kilomètre après kilomètre.'],
    explain: '0,2 × 100 = <b>20 dB</b>, soit une puissance divisée par 100 : il reste 1 % de la puissance émise, exactement le chiffre de ton cours.' },
  { id: 'xc9', lvl: 6, type: 'qcm', q: 'Sur un connecteur RJ45, quelle particularité dégrade la diaphonie entre deux paires ?',
    choices: ['La paire 1/2 est en bout de connecteur', 'La paire 4/5 est imbriquée dans la paire 3/6', 'La paire 7/8 est marron', 'Les paires ne sont pas torsadées dans le connecteur'], good: 1,
    hints: ['Regarde les numéros de broches de la paire orange (T568B) et de la paire bleue.'],
    explain: 'La paire <b>4/5</b> (bleue) est au milieu de la paire <b>3/6</b> : ce couplage à l’extrémité dégrade la diaphonie entre ces deux paires (un des défauts du RJ45 cités dans ton cours).' }
];
