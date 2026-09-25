/* Module 13 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).nat = [
  /* ---------- Débutant ---------- */
  { id: 'xt1', lvl: 1, type: 'qcm', q: 'Que signifie <b>NAT</b> ?',
    choices: ['Network Address Translation', 'New Access Technology', 'Network Access Table', 'Node Address Transfer'], good: 0,
    hints: ['Translation = traduction.'],
    explain: '<b>Network Address Translation</b> : le routeur <b>traduit</b> les adresses IP (et souvent les ports) des paquets qui le traversent.' },
  { id: 'xt2', lvl: 1, type: 'qcm', q: 'Pourquoi ta box Internet fait-elle du NAT ?',
    choices: ['Pour que tous les appareils de la maison (adresses privées) partagent l’unique adresse publique fournie par le FAI', 'Pour accélérer le Wi-Fi', 'Pour chiffrer les communications', 'Pour attribuer des adresses aux appareils'], good: 0,
    hints: ['Combien d’adresses publiques le FAI te donne-t-il ?'],
    explain: 'Le FAI fournit <b>une</b> adresse publique ; tes appareils ont des adresses privées (192.168.x.x) interdites sur Internet. La box les traduit toutes vers son adresse publique (PAT). Distribuer les adresses privées, c’est le rôle du DHCP.' },
  { id: 'xt3', lvl: 1, type: 'qcm', q: 'Quelle commande affiche la table des traductions d’un routeur Cisco ?',
    choices: ['show ip nat translations', 'show nat table', 'show ip route nat', 'ipconfig /nat'], good: 0,
    hints: ['show ip nat …'],
    explain: '<code>show ip nat translations</code> : une ligne par traduction (inside global, inside local, outside local, outside global). Elle se remplit quand du trafic passe.' },
  /* ---------- Difficile ---------- */
  { id: 'xt4', lvl: 4, type: 'qcm', q: 'Un routeur fait du PAT. Un paquet arrive d’Internet sur son adresse publique, port 5555. Aucune traduction en cours ne correspond et aucune redirection de port n’est configurée. Que devient ce paquet ?',
    choices: ['Il est envoyé à tous les PC internes', 'Il n’est traduit vers aucun PC interne : le routeur ne le transmet pas à l’intérieur', 'Il est envoyé au premier PC du réseau', 'Il crée automatiquement une redirection'], good: 1,
    hints: ['La table ne contient que les flux ouverts depuis l’intérieur.'],
    explain: 'Sans entrée dans la table, le routeur ne sait pas à quel PC le destiner : rien ne rentre. C’est l’effet « pare-feu » du PAT, et la raison pour laquelle il faut une <b>redirection de port</b> pour publier un serveur.' },
  /* ---------- Extrême ---------- */
  { id: 'xt5', lvl: 5, type: 'qcm', q: 'NAT <b>dynamique</b> avec un pool de 5 adresses publiques, <b>sans</b> overload. 5 PC ont déjà une traduction active ; un 6e PC veut sortir. Que se passe-t-il ?',
    choices: ['Il partage l’adresse du 1er PC', 'Il ne peut pas sortir tant qu’aucune adresse du pool n’est libérée', 'Le routeur passe automatiquement en PAT', 'Il sort avec son adresse privée'], good: 1,
    hints: ['Sans overload, c’est une adresse publique par PC.'],
    explain: 'Le pool est épuisé : le paquet n’est pas traduit et le 6e PC reste bloqué jusqu’à l’expiration d’une traduction. Ajouter <code>overload</code> (PAT) règle le problème en partageant les adresses grâce aux ports.' },
  { id: 'xt6', lvl: 5, type: 'text', kind: 'text', ph: 'ip nat inside source …',
    q: 'L’ACL 1 désigne le LAN. Écris la commande qui traduit ces adresses derrière l’adresse de l’interface <b>G0/1</b>, en partageant cette adresse entre tous les PC.',
    accept: ['ip nat inside source list 1 interface g0/1 overload', /^ip\s+nat\s+inside\s+source\s+list\s+1\s+interface\s+(g|gi|gig|gigabitethernet)\s*0\/1\s+overload$/i],
    answerHtml: '<code>ip nat inside source list 1 interface g0/1 overload</code>',
    hints: ['« inside source » : on traduit la source des paquets venant de l’intérieur.', '« Partager » l’adresse, c’est le mot-clé <code>overload</code>.'],
    explain: '<code>ip nat inside source list 1 interface g0/1 overload</code> : les adresses autorisées par l’ACL 1 sortent avec l’adresse de G0/1, les ports servant à distinguer les flux.' },
  /* ---------- Impossible ---------- */
  { id: 'xt7', lvl: 6, type: 'text', q: 'Une ligne de <code>show ip nat translations</code> sur Router0 : <code>tcp 13.1.1.1:1025 192.168.1.2:1025 13.1.1.2:80 13.1.1.2:80</code>. Donne :',
    fields: [{ label: 'L’adresse réelle du PC', kind: 'ip', answer: '192.168.1.2' }, { label: 'L’adresse sous laquelle Internet le voit', kind: 'ip', answer: '13.1.1.1' }, { label: 'Le port de destination (le service)', kind: 'int', answer: 80 }],
    hints: ['Ordre des colonnes : Inside global, Inside local, Outside local, Outside global.'],
    explain: 'Inside global <b>13.1.1.1</b>:1025 (vu d’Internet), inside local <b>192.168.1.2</b>:1025 (le vrai PC), outside 13.1.1.2:<b>80</b> (le serveur web). Le port 1025 a pu être gardé car aucun autre flux ne l’utilisait.' },
  { id: 'xt8', lvl: 6, type: 'qcm', q: 'PAT : deux PC internes ouvrent chacun une connexion vers le même serveur, avec le <b>même</b> port source 1025. Que fait le routeur ?',
    choices: ['Il refuse la seconde connexion', 'Il garde 1025 pour le premier flux et donne un autre port public au second, pour distinguer les réponses', 'Il donne la même adresse et le même port aux deux', 'Il utilise l’adresse MAC pour trier les réponses'], good: 1,
    hints: ['Adresse publique + port public doivent être uniques pour chaque flux.'],
    explain: 'Le couple (adresse publique, port public) doit être unique : le routeur <b>change le port</b> du second flux. C’est la « Port » Address Translation, visible dans <code>show ip nat translations</code>.' },
  { id: 'xt9', lvl: 6, type: 'qcm', q: 'Dans le fichier du TP NAT-PAT, Router0 et Router1 font aussi tourner <b>RIP</b> (<code>network 13.0.0.0</code> et leur LAN). Depuis PC0, tu tapes <code>http://192.168.2.10</code>, l’adresse <b>privée</b> de WEB1. Que se passe-t-il ?',
    choices: ['Échec : une adresse privée n’est jamais routable', 'La page de WEB1 s’affiche : RIP a appris 192.168.2.0 à Router0 ; sur le vrai Internet, personne n’annoncerait ce réseau privé', 'La page de WEB2 s’affiche', 'Router1 traduit automatiquement vers 13.1.1.2'], good: 1,
    hints: ['Regarde <code>show ip route</code> sur Router0 : y a-t-il une ligne R ?'],
    explain: 'Router0 a une route <b>R 192.168.2.0/24 via 13.1.1.2</b> : le paquet atteint WEB1 (si le PAT est en place, seule la source est traduite : la destination reste privée). C’est une simplification du TP : sur Internet, aucun routeur n’annonce les plages RFC 1918 et les FAI les filtrent. Moralité : lis la table de routage avant de conclure.' },
  { id: 'xt-lab', lvl: 6, type: 'pt', file: 'NAT-PAT-panne.pkt', tag: 'Dépannage NAT',
    q: '<b>NAT-PAT en panne.</b> Le TP NAT-PAT fonctionnait (PAT du site 1 derrière 13.1.1.1, redirections de Router1 : port 80 → WEB1, port 8000 → WEB2 port 80). Depuis la dernière intervention, <b>trois erreurs</b> se sont glissées dans la configuration NAT des deux routeurs. Symptômes : PC0 affiche encore les pages de WEB1… mais <code>show ip nat translations</code> reste vide sur Router0, et <code>http://13.1.1.2:8000</code> ne répond plus. Rappel : l’ACL 1 de Router0 doit désigner le LAN 192.168.1.0/24. Remets tout en ordre.',
    build: function () {
      var n = LAB.solved('nt-lab');
      LAB.cli(n, 'Router0', ['conf t', 'interface g0/0/0', 'ip nat outside', 'interface g0/0/1', 'ip nat inside', 'exit', 'no access-list 1', 'access-list 1 permit 192.168.10.0 0.0.0.255', 'end']);
      LAB.cli(n, 'Router1', ['conf t', 'no ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000', 'ip nat inside source static tcp 192.168.2.11 8000 13.1.1.2 8000', 'end']);
      n.devices.forEach(function (d) { if (d.natTable) d.natTable = d.natTable.filter(function (e) { return e.stat; }); });
      return LAB.save(n);
    },
    tasks: [
      { label: 'Le ping de PC0 vers 13.1.1.2 sort avec l’adresse 13.1.1.1 (entrée dans show ip nat translations)', check: function (n) {
        n.canPing('PC0', '13.1.1.2');
        return n.dev('Router0').natTable.some(function (e) { return !e.stat && e.proto === 'icmp' && e.lip === NET.ip2int('192.168.1.1') && e.gip === NET.ip2int('13.1.1.1'); }); } },
      { label: 'PC0 ouvre http://www.imt.local (page de WEB1), requête traduite en 13.1.1.1', check: function (n) {
        var r = n.httpGet(n.dev('PC0'), 'http://www.imt.local');
        return r.ok && r.server.name === 'WEB1' && n.dev('Router0').natTable.some(function (e) { return !e.stat && e.proto === 'tcp' && e.lip === NET.ip2int('192.168.1.1') && e.gip === NET.ip2int('13.1.1.1') && e.oport === 80; }); } },
      { label: 'PC1 ouvre http://13.1.1.2:8000 et obtient la page de WEB2', check: function (n) { var r = n.httpGet(n.dev('PC1'), 'http://13.1.1.2:8000'); return r.ok && r.server.name === 'WEB2'; } }
    ],
    hints: ['Router0 : <code>show running-config</code>. Quelle interface est côté LAN, laquelle côté Internet ? Et que laisse passer l’ACL 1 (<code>show access-lists</code>) ?', 'Router1 : relis les deux <code>ip nat inside source static tcp</code>. Sur quel port WEB2 écoute-t-il vraiment ?', 'Router0 : <code>ip nat inside</code> sur G0/0/0, <code>ip nat outside</code> sur G0/0/1, <code>no access-list 1</code> puis <code>access-list 1 permit 192.168.1.0 0.0.0.255</code>. Router1 : supprime la redirection fausse et remets <code>ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000</code>.'],
    solution: [
      { dev: 'Router0', cli: ['conf t', 'interface g0/0/0', 'ip nat inside', 'interface g0/0/1', 'ip nat outside', 'end'] },
      { dev: 'Router0', cli: ['conf t', 'no access-list 1', 'access-list 1 permit 192.168.1.0 0.0.0.255', 'end'] },
      { dev: 'Router1', cli: ['conf t', 'no ip nat inside source static tcp 192.168.2.11 8000 13.1.1.2 8000', 'ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000', 'end'] }
    ],
    explain: 'Trois pannes : (1) sur Router0, inside et outside étaient inversés : le trafic du LAN arrivait par une interface « outside », donc jamais traduit ; (2) l’ACL 1 autorisait 192.168.10.0/24 au lieu de 192.168.1.0/24 : aucun PC ne correspondait ; (3) sur Router1, la redirection du port 8000 visait le port 8000 de WEB2, qui n’écoute que sur le 80. Pourquoi PC0 affichait-il quand même la page de WEB1 ? Parce que, dans ce TP, RIP annonce les réseaux privés sur 13.0.0.0 : les paquets passaient… sans être traduits. Sur le vrai Internet, ils auraient été rejetés. Seule la table <code>show ip nat translations</code> révélait la panne.' }
];
