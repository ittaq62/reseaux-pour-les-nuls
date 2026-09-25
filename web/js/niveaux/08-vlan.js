/* Module 8 — questions supplémentaires des niveaux */
(function () {
  var COM = ['FastEthernet0/13', 'FastEthernet0/14', 'FastEthernet0/23', 'FastEthernet0/24'];
  (window.EXTRAS = window.EXTRAS || {}).vlan = [
    /* ---------- Débutant ---------- */
    { id: 'xv1', lvl: 1, type: 'qcm', q: 'Que signifie <b>VLAN</b> ?',
      choices: ['Virtual Local Area Network : un réseau local virtuel', 'Very Large Area Network', 'Virtual Link Access Node', 'Voice LAN'], good: 0,
      hints: ['LAN = Local Area Network.'],
      explain: '<b>Virtual LAN</b> : on découpe un (ou plusieurs) switch(s) en réseaux logiques isolés, sans changer le câblage.' },
    { id: 'xv2', lvl: 1, type: 'qcm', q: 'Sur un switch Cisco, quelle commande affiche la liste des VLAN et les ports de chacun ?',
      choices: ['show vlan brief', 'show ip route', 'show running-config vlan-ports', 'ipconfig /vlan'], good: 0,
      hints: ['« brief » = résumé.'],
      explain: '<code>show vlan brief</code> (mode privilégié) : numéro, nom, état et ports d’accès de chaque VLAN. Les ports trunk n’y apparaissent pas : pour eux, <code>show interfaces trunk</code>.' },
    /* ---------- Difficile ---------- */
    { id: 'xv3', lvl: 4, type: 'qcm', q: 'Un PC a l’adresse 192.168.10.5/24 (réseau du VLAN 10), mais son port de switch est dans le <b>VLAN 20</b>. Peut-il joindre les autres PC du VLAN 10, branchés sur le même switch ?',
      choices: ['Oui, puisqu’ils sont dans le même réseau IP', 'Non : ses trames restent dans le VLAN 20, son ARP n’atteint jamais le VLAN 10', 'Oui, le switch corrige tout seul', 'Seulement s’il a une passerelle'], good: 1,
      hints: ['Qui décide du domaine de diffusion : l’adresse IP du PC ou le port du switch ?'],
      explain: 'C’est le <b>port</b> qui fixe le VLAN. Le PC est dans le domaine de diffusion du VLAN 20 : sa requête ARP ne sort pas de ce VLAN. Une adresse IP « juste » ne suffit pas.' },
    { id: 'xv4', lvl: 4, type: 'qcm', q: 'Sur un 2960, tu tapes <code>switchport access vlan 50</code> sur un port alors que le VLAN 50 n’existe pas encore. Que se passe-t-il ?',
      choices: ['La commande est refusée', 'Le switch crée le VLAN 50 : « % Access VLAN does not exist. Creating vlan 50 »', 'Le port passe en VLAN 1', 'Le port se met en shutdown'], good: 1,
      hints: ['Le switch est plutôt conciliant…'],
      explain: 'Le 2960 crée le VLAN à la volée (nom par défaut VLAN0050). Pratique, mais le VLAN n’a pas de nom : mieux vaut le créer proprement avec <code>vlan 50</code> / <code>name …</code>.' },
    /* ---------- Impossible ---------- */
    { id: 'xv5', lvl: 6, type: 'qcm', q: 'Router-on-a-stick : un PC du VLAN 10 pingue un PC du VLAN 20. Sur le câble trunk entre le switch et le routeur, combien de fois passe la <b>requête</b> d’écho, et avec quelle(s) étiquette(s) ?',
      choices: ['Une fois, taguée 10', 'Deux fois : taguée 10 vers le routeur, puis taguée 20 vers le switch', 'Deux fois, taguée 10 à chaque fois', 'Une fois, sans étiquette'], good: 1,
      hints: ['Le routeur reçoit sur la sous-interface .10 et renvoie par la sous-interface .20… qui utilise le même câble.'],
      explain: 'Aller vers le routeur dans le VLAN 10 (tag 10), retour vers le switch dans le VLAN 20 (tag 20) : <b>2 passages</b> par requête (et 2 de plus pour la réponse). C’est la limite du router-on-a-stick : tout le trafic inter-VLAN passe deux fois sur le même lien.' },
    { id: 'xv6', lvl: 6, type: 'qcm', q: 'Router-on-a-stick : les sous-interfaces G0/0/0.10, .20 et .30 répondent aux ARP de trois VLAN. Avec quelle(s) adresse(s) MAC ?',
      choices: ['Une seule : celle de G0/0/0, partagée par les sous-interfaces', 'Trois MAC différentes, une par sous-interface', 'La MAC du switch', 'La MAC du PC qui a posé la question'], good: 0,
      hints: ['Une sous-interface est logique : combien de cartes réseau y a-t-il vraiment ?'],
      explain: 'Les sous-interfaces héritent de la MAC de l’interface physique. Aucun conflit : chaque VLAN est un domaine de diffusion distinct, et le switch tient sa table MAC VLAN par VLAN.' },
    { id: 'xv7', lvl: 6, type: 'qcm', q: 'Un trunk relie deux switchs. D’un côté le VLAN natif est 1, de l’autre 99 (<code>switchport trunk native vlan 99</code>). Que se passe-t-il ?',
      choices: ['Rien : le VLAN natif n’a pas besoin d’être identique', 'Le trunk refuse de monter', 'Les trames non taguées changent de VLAN en traversant le lien (1 d’un côté, 99 de l’autre), et CDP signale un « native VLAN mismatch »', 'Toutes les trames taguées sont jetées'], good: 2,
      hints: ['Les trames du VLAN natif circulent sans étiquette : comment l’autre switch sait-il à quel VLAN elles appartiennent ?'],
      explain: 'Sans étiquette, chaque switch range la trame dans <b>son</b> VLAN natif : le VLAN 1 d’un côté « fuit » dans le VLAN 99 de l’autre. Le lien reste en trunk, CDP affiche <code>%CDP-4-NATIVE_VLAN_MISMATCH</code>. Règle : même VLAN natif des deux côtés.' },
    { id: 'xv-lab', lvl: 6, type: 'pt', file: 'TP1-Situation2-panne.pkt', tag: 'Dépannage inter-VLAN',
      q: '<b>Inter-VLAN en panne.</b> Le TP1 (VLAN 10 DEV, 20 ADM, 30 COM et router-on-a-stick avec les passerelles en .254) fonctionnait. Depuis la dernière intervention, <b>trois erreurs</b> se sont glissées sur Sw-Bat-1 et Router-INTERVLAN (aucune sur les PC). Rappel : COM = Fa0/13-14 et Fa0/23-24. Remets tout en ordre.',
      build: function () {
        var n = LAB.solved('v-lab2');
        LAB.cli(n, 'Sw-Bat-1', ['conf t', 'interface g0/1', 'switchport trunk allowed vlan 10,20', 'interface fa0/13', 'switchport access vlan 10', 'end']);
        LAB.cli(n, 'Router-INTERVLAN', ['conf t', 'interface g0/0/0.20', 'encapsulation dot1Q 2', 'end']);
        return LAB.save(n);
      },
      tasks: [
        { label: 'Les ports COM (Fa0/13-14, Fa0/23-24) sont tous dans le VLAN 30', check: function (n) { return LAB.accessVlan(n, 'Sw-Bat-1', COM, 30); } },
        { label: 'Le trunk vers le routeur transporte les VLAN 10, 20 et 30', check: function (n) { var d = n.dev('Sw-Bat-1'), i = n.iface(d, 'GigabitEthernet0/1'); return n.opMode(d, i) === 'trunk' && [10, 20, 30].every(function (v) { return !i.sw.allowed || i.sw.allowed.indexOf(v) >= 0; }); } },
        { label: 'B01 (ADM) joint B11 (DEV)', check: function (n) { return n.canPing('B01', 'B11'); } },
        { label: 'B22 (DEV) joint B13 (COM)', check: function (n) { return n.canPing('B22', 'B13'); } },
        { label: 'B13 (COM) joint B14 (ADM)', check: function (n) { return n.canPing('B13', 'B14'); } }
      ],
      hints: ['Sur le switch : <code>show vlan brief</code> (un port COM n’est pas à sa place) et <code>show interfaces trunk</code> (regarde la ligne « Vlans allowed on trunk »).', 'Sur le routeur : <code>show running-config</code> et regarde l’<code>encapsulation dot1Q</code> de chaque sous-interface.', 'Switch : <code>interface fa0/13</code> → <code>switchport access vlan 30</code> ; <code>interface g0/1</code> → <code>switchport trunk allowed vlan all</code>. Routeur : <code>interface g0/0/0.20</code> → <code>encapsulation dot1Q 20</code> (puis vérifie l’adresse 192.168.20.254).'],
      solution: [
        { dev: 'Sw-Bat-1', cli: ['conf t', 'interface fa0/13', 'switchport access vlan 30', 'interface g0/1', 'switchport trunk allowed vlan all', 'end'] },
        { dev: 'Router-INTERVLAN', cli: ['conf t', 'interface g0/0/0.20', 'encapsulation dot1Q 20', 'ip address 192.168.20.254 255.255.255.0', 'end'] }
      ],
      explain: 'Trois pannes : Fa0/13 (le PC B13) était dans le VLAN 10 ; le trunk ne laissait passer que les VLAN 10 et 20 ; la sous-interface .20 étiquetait en VLAN 2, donc le VLAN ADM n’avait plus de passerelle. Les outils : <code>show vlan brief</code>, <code>show interfaces trunk</code>, et côté routeur <code>show running-config</code>.' }
  ];
})();
