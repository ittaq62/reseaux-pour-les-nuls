/* Module 4 — questions supplémentaires des niveaux */
(function () {
  function domaine(n, pc) { var d = n.dev(pc); return n.l2Domain(d, d.ifaces[0]).endpoints.map(function (e) { return e.dev.name; }); }
  (window.EXTRAS = window.EXTRAS || {}).equipements = [
    /* ---------- Débutant ---------- */
    { id: 'xe1', lvl: 1, type: 'qcm', q: 'Quel équipement relie des <b>réseaux IP différents</b> entre eux ?',
      choices: ['Le concentrateur (hub)', 'Le commutateur (switch)', 'Le routeur', 'Le câble croisé'], good: 2,
      hints: ['Il travaille avec les adresses IP et une table de routage.'], explain: 'Le <b>routeur</b> (couche 3) relie des réseaux différents ; le switch relie des machines d’un même réseau.' },
    { id: 'xe2', lvl: 1, type: 'qcm', q: 'Dans la palette de Packet Tracer (en bas à gauche), dans quelle catégorie trouves-tu les routeurs et les switchs ?',
      choices: ['End Devices', 'Network Devices', 'Connections', 'Components'], good: 1,
      hints: ['Les PC et serveurs sont des « équipements terminaux ».'], explain: '<b>Network Devices</b> (routeurs, switchs, hubs, sans-fil…). Les PC et serveurs sont dans <b>End Devices</b>, les câbles dans <b>Connections</b>.' },
    { id: 'xe3', lvl: 1, type: 'match', q: 'Dans Packet Tracer, que signifie la couleur des voyants sur un lien ?',
      pairs: [['Vert', 'Le lien est actif'], ['Orange', 'Le port du switch négocie Spanning Tree (patiente quelques secondes)'], ['Rouge', 'Le lien est inactif (mauvais câble, port éteint…)']],
      hints: ['Comme un feu tricolore : vert = ça passe.'], explain: 'Vert = actif, orange = en cours de négociation STP (≈ 30 s, ou ⏩ Fast Forward Time), rouge = inactif.' },
    /* ---------- Difficile ---------- */
    { id: 'xe-lab', lvl: 4, type: 'pt', file: 'Couper-la-diffusion.pkt', tag: 'Routeur',
      q: '<b>Casser un domaine de diffusion.</b> Deux switchs reliés entre eux forment un seul grand réseau 192.168.1.0/24 (PC0, PC1 sur Switch0 ; PC2, PC3 sur Switch1). On veut deux réseaux séparés par le routeur <b>R1</b> (déjà posé) :<br>1) Supprime le câble entre les deux switchs.<br>2) Relie R1 <b>G0/0</b> à Switch0 et R1 <b>G0/1</b> à Switch1.<br>3) R1 : G0/0 = <code>192.168.1.254/24</code>, G0/1 = <code>192.168.2.254/24</code>.<br>4) Passe PC2 et PC3 dans <code>192.168.2.0/24</code> et donne à chaque PC la bonne passerelle.',
      build: function () {
        return LAB.make({
          devices: [['PC0', 'PC-PT', 100, 110], ['PC1', 'PC-PT', 100, 310], ['Switch0', '2960-24TT', 320, 210], ['R1', '1941', 540, 90], ['Switch1', '2960-24TT', 760, 210], ['PC2', 'PC-PT', 980, 110], ['PC3', 'PC-PT', 980, 310]],
          links: [['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'], ['PC2', 'FastEthernet0', 'Switch1', 'FastEthernet0/1', 'straight'], ['PC3', 'FastEthernet0', 'Switch1', 'FastEthernet0/2', 'straight'], ['Switch0', 'GigabitEthernet0/1', 'Switch1', 'GigabitEthernet0/1', 'cross']],
          hosts: { PC0: { ip: '192.168.1.1', mask: '255.255.255.0' }, PC1: { ip: '192.168.1.2', mask: '255.255.255.0' }, PC2: { ip: '192.168.1.3', mask: '255.255.255.0' }, PC3: { ip: '192.168.1.4', mask: '255.255.255.0' } }
        });
      },
      tasks: [
        { label: 'Les deux switchs ne sont plus reliés directement', check: function (n) { return !n.links.some(function (l) { return (l.a.dev === 'Switch0' && l.b.dev === 'Switch1') || (l.a.dev === 'Switch1' && l.b.dev === 'Switch0'); }); } },
        { label: 'R1 G0/0 est relié à Switch0 et R1 G0/1 à Switch1 (bons câbles)', check: function (n) { return LAB.linkedPorts(n, 'R1', 'GigabitEthernet0/0', 'Switch0') && LAB.linkedPorts(n, 'R1', 'GigabitEthernet0/1', 'Switch1'); } },
        { label: 'R1 : 192.168.1.254/24 sur G0/0 et 192.168.2.254/24 sur G0/1, interfaces actives', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/0', '192.168.1.254', '255.255.255.0') && LAB.ifIp(n, 'R1', 'GigabitEthernet0/1', '192.168.2.254', '255.255.255.0') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/0') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/1'); } },
        { label: 'PC2 et PC3 sont dans 192.168.2.0/24 avec la passerelle 192.168.2.254', check: function (n) { return ['PC2', 'PC3'].every(function (p) { return LAB.hostInNet(n, p, '192.168.2.0/24') && n.dev(p).host.gw === NET.ip2int('192.168.2.254'); }); } },
        { label: 'PC0 et PC1 ont la passerelle 192.168.1.254', check: function (n) { return ['PC0', 'PC1'].every(function (p) { return n.dev(p).host.gw === NET.ip2int('192.168.1.254'); }); } },
        { label: 'PC0 joint PC3 à travers le routeur', check: function (n) { return n.canPing('PC0', 'PC3'); } },
        { label: 'Un broadcast de PC0 n’atteint plus PC2 (deux domaines de diffusion)', check: function (n) { var d = domaine(n, 'PC0'); return d.indexOf('PC1') >= 0 && d.indexOf('PC2') < 0; } }
      ],
      hints: ['Outil <b>Delete</b> (ou touche Suppr) puis clic sur le câble entre les switchs.', 'Switch ⟷ routeur = câble <b>droit</b>. R1 : <code>interface g0/0</code> → <code>ip address 192.168.1.254 255.255.255.0</code> → <code>no shutdown</code> (idem G0/1).', 'PC2 : 192.168.2.3, PC3 : 192.168.2.4, masque 255.255.255.0, passerelle 192.168.2.254. PC0/PC1 : passerelle 192.168.1.254.'],
      solution: [
        { text: 'Supprimer le câble Switch0 G0/1 ⟷ Switch1 G0/1.', fn: function (n) { var l = n.linkOf('Switch0', 'GigabitEthernet0/1'); if (l) n.disconnect(l); } },
        { link: ['R1', 'GigabitEthernet0/0', 'Switch0', 'GigabitEthernet0/2', 'straight'] }, { link: ['R1', 'GigabitEthernet0/1', 'Switch1', 'GigabitEthernet0/2', 'straight'] },
        { dev: 'R1', cli: ['conf t', 'hostname R1', 'interface g0/0', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.2.254 255.255.255.0', 'no shutdown', 'end'] },
        { dev: 'PC0', host: { gw: '192.168.1.254' } }, { dev: 'PC1', host: { gw: '192.168.1.254' } },
        { dev: 'PC2', host: { ip: '192.168.2.3', mask: '255.255.255.0', gw: '192.168.2.254' } }, { dev: 'PC3', host: { ip: '192.168.2.4', mask: '255.255.255.0', gw: '192.168.2.254' } }
      ],
      explain: 'Le routeur ne relaie pas les diffusions : chaque interface délimite un domaine de diffusion. Les ARP de PC0 ne dérangent plus PC2 et PC3, mais les deux réseaux communiquent toujours via la passerelle.' },
    /* ---------- Extrême ---------- */
    { id: 'xe4', lvl: 5, type: 'text',
      q: 'Un routeur a 2 interfaces. À gauche : un switch S1 avec 4 PC. À droite : un switch S2 relié au routeur, avec 2 PC et un <b>hub</b> ; sur le hub, 3 PC. Combien de domaines…',
      fields: [{ label: 'de diffusion ?', kind: 'int', answer: 2 }, { label: 'de collision ?', kind: 'int', answer: 9 }],
      hints: ['Diffusion : une par interface de routeur utilisée.', 'Collision : chaque port de switch utilisé = 1 domaine ; le hub et tout ce qui est branché dessus = 1 seul domaine.', 'S1 : 4 PC + le lien vers le routeur = 5. S2 : routeur + 2 PC + le hub = 4.'],
      explain: '2 domaines de diffusion ; collision : 5 (S1) + 4 (S2, dont 1 pour le hub et ses 3 PC) = <b>9</b>.' },
    { id: 'xe5', lvl: 5, type: 'qcm', q: 'Une trame dont le <b>FCS est faux</b> (corrompue) arrive sur un switch. Que se passe-t-il selon le mode de commutation ?',
      choices: ['Les deux modes la détruisent', 'Store and forward la détruit ; cut-through a déjà commencé à la retransmettre', 'Cut-through la détruit ; store and forward la retransmet', 'Les deux la retransmettent'], good: 1,
      hints: ['Le FCS est à la fin de la trame : qui attend la fin avant d’envoyer ?'],
      explain: '<b>Store and forward</b> stocke toute la trame, vérifie le FCS et élimine les mauvaises trames. <b>Cut-through</b> part dès l’adresse destination lue : rapide, mais laisse passer les erreurs.' },
    { id: 'xe6', lvl: 5, type: 'qcm', q: 'Le serveur web de la <b>DMZ</b> est piraté. Qu’est-ce qui empêche le pirate de rebondir vers les PC du LAN ?',
      choices: ['Le switch de la DMZ', 'Les règles du pare-feu qui interdisent les flux de la DMZ vers le LAN', 'Le DNS', 'Rien, la DMZ est reliée directement au LAN'], good: 1,
      hints: ['Qui applique les règles entre les zones ?'],
      explain: 'La DMZ est un réseau <b>isolé</b> : c’est le <b>firewall</b> (règles DMZ → LAN interdites) qui confine l’attaque. Segmenter sans filtrer ne sert à rien.' },
    /* ---------- Impossible ---------- */
    { id: 'xe7', lvl: 6, type: 'qcm', q: 'Un switch voit arriver sur <b>Fa0/3</b> une trame dont la MAC source figure déjà dans sa table… sur <b>Fa0/7</b>. Que fait-il ?',
      choices: ['Il jette la trame', 'Il met à jour sa table : la MAC est maintenant associée à Fa0/3', 'Il garde Fa0/7 et ajoute une 2e entrée', 'Il désactive Fa0/3'], good: 1,
      hints: ['La table MAC s’apprend en permanence à partir de la source.'],
      explain: 'Il <b>met à jour</b> l’entrée (la machine a « bougé »). Si ça arrive sans arrêt, c’est le signe d’une <b>boucle</b> : l’instabilité de la table MAC du module Spanning Tree.' },
    { id: 'xe8', lvl: 6, type: 'qcm', q: 'Deux PC branchés sur le même <b>hub</b> émettent exactement en même temps (Ethernet, CSMA/CD). Que se passe-t-il ?',
      choices: ['Le hub met une trame en attente', 'La collision est détectée : chacun arrête, attend un délai aléatoire, puis réémet', 'Les deux trames arrivent mélangées au destinataire', 'Le hub envoie une trame à gauche, l’autre à droite'], good: 1,
      hints: ['CD = Collision Detection.'],
      explain: 'Avec <b>CSMA/CD</b>, les stations détectent la collision, cessent d’émettre et retentent après un temps d’attente aléatoire. Un switch supprime ce problème (un domaine de collision par port).' },
    { id: 'xe9', lvl: 6, type: 'text', kind: 'int', accept: 10, ph: 'domaines',
      q: 'Un switch 24 ports n’a que <b>10 ports branchés</b>. L’un d’eux est relié à un hub qui porte 5 PC. Combien de domaines de collision au total ?',
      hints: ['Chaque port de switch <b>utilisé</b> = 1 domaine. Le hub et ses PC ne font qu’un.'],
      explain: '<b>10</b> : un par port utilisé. Les 5 PC du hub partagent le domaine du port qui relie le hub (les ports libres ne comptent pas).' }
  ];
})();
