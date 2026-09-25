/* Module 18 — questions supplémentaires des niveaux */
(function () {
  function traduit(n, lip) { return n.dev('R_INTERNE').natTable.some(function (e) { return !e.stat && e.lip === NET.ip2int(lip) && e.gip === NET.ip2int('1.1.1.2'); }); }
  (window.EXTRAS = window.EXTRAS || {}).datamax = [
    /* ---------- Débutant ---------- */
    { id: 'xdm1', lvl: 1, type: 'match', q: 'Plan d’adressage de Datamax : associe chaque VLAN à son nom.',
      pairs: [['VLAN 10', 'DEVELOPPEMENT'], ['VLAN 20', 'ADMINISTRATION'], ['VLAN 30', 'PRODUCTION'], ['VLAN 40', 'WIFI-SALARIES'], ['VLAN 100', 'VISITEURS']],
      hints: ['Le tableau « Le plan d’adressage retenu » du cours du module.'],
      explain: '10 DEVELOPPEMENT, 20 ADMINISTRATION, 30 PRODUCTION, 40 WIFI-SALARIES, 100 VISITEURS (et le VLAN 1 natif pour les serveurs).' },
    { id: 'xdm2', lvl: 1, type: 'qcm', q: 'Où se trouvent les serveurs de Datamax (DHCP, DNS, ACTIVEDIR, SGBD) ?',
      choices: ['Dans la salle machines, en 192.168.1.0/24, reliés au switch BACKBONE', 'À l’étage 2, dans le VLAN 10', 'Chez le fournisseur d’accès', 'Dans l’open-space'], good: 0,
      hints: ['Relis « Le contexte » : la salle machines est au 1er étage.'],
      explain: 'Salle machines, réseau <b>192.168.1.0/24</b> (VLAN 1 natif), passerelle 192.168.1.254 (R_INTERNE), reliés au BACKBONE.' },
    { id: 'xdm3', lvl: 1, type: 'qcm', q: 'Dans quel VLAN met-on le point d’accès Wi-Fi de la <b>cafétéria</b>, ouvert aux visiteurs ?',
      choices: ['VLAN 100 VISITEURS', 'VLAN 40 WIFI-SALARIES', 'VLAN 1', 'VLAN 30 PRODUCTION'], good: 0,
      hints: ['On ne mélange pas les visiteurs avec les salariés.'],
      explain: 'Cafétéria → <b>VLAN 100 VISITEURS</b> (ETAGE1 Fa0/17). La salle de réunion, elle, est en VLAN 40 WIFI-SALARIES (Fa0/18).' },
    /* ---------- Facile ---------- */
    { id: 'xdm4', lvl: 2, type: 'qcm', q: 'Pourquoi le lien entre ETAGE2 et le switch de l’open-space doit-il être un <b>trunk</b> ?',
      choices: ['Parce qu’il transporte plusieurs VLAN (PRODUCTION et ADMINISTRATION)', 'Parce qu’il est en Gigabit', 'Parce que c’est obligatoire entre deux switchs', 'Pour relier les serveurs'], good: 0,
      hints: ['Un port access ne transporte qu’un seul VLAN.'],
      explain: 'L’open-space a des postes de production (VLAN 30) et un poste d’administration (VLAN 20) : le lien doit transporter les deux, donc <b>trunk</b>.' },
    { id: 'xdm5', lvl: 2, type: 'text', q: 'Quelle est la passerelle des visiteurs (VLAN 100) ?',
      fields: [{ label: 'Passerelle', kind: 'ip', answer: '192.168.100.245' }],
      hints: ['Ce n’est pas .254 : elle est imposée par la mission 3.'],
      explain: '<b>192.168.100.245</b>, imposée par la mission 3 (c’est aussi celle que distribue le serveur DHCP temporaire). Tous les autres VLAN utilisent .254.' },
    /* ---------- Moyen ---------- */
    { id: 'xdm6', lvl: 3, type: 'text', kind: 'int', accept: 5, ph: 'sous-interfaces',
      q: 'Combien de <b>sous-interfaces</b> faut-il créer sur R_INTERNE pour le routage inter-VLAN, sachant que les serveurs (VLAN 1 natif) sont sur l’interface physique G0/0 ?',
      hints: ['Compte les VLAN du plan d’adressage, hors VLAN 1.'],
      explain: '10, 20, 30, 40 et 100 : <b>5</b> sous-interfaces (g0/0.10 … g0/0.100), plus l’adresse 192.168.1.254 sur G0/0 pour le VLAN natif.' },
    { id: 'xdm7', lvl: 3, type: 'qcm', q: 'La borne Wi-Fi de la cafétéria (un seul SSID, visiteurs) est branchée sur ETAGE1 Fa0/17. Quel mode pour ce port ?',
      choices: ['Access, dans le VLAN 100', 'Trunk avec tous les VLAN', 'Access dans le VLAN 1', 'Il faut un routeur entre la borne et le switch'], good: 0,
      hints: ['Une borne à un seul SSID, c’est un seul réseau.'],
      explain: 'Un SSID = un VLAN : port <b>access</b> VLAN 100. Avec une borne multi-SSID (visiteurs + salariés), il faudrait un trunk.' },
    /* ---------- Difficile ---------- */
    { id: 'xdm8', lvl: 4, type: 'qcm', q: 'Pourquoi l’ACL du NAT de R_INTERNE est-elle <code>access-list 1 permit 192.168.0.0 0.0.255.255</code> ?',
      choices: ['Pour autoriser en une seule ligne tous les réseaux internes 192.168.x.0 (serveurs, 10, 20, 30, 40, 100) à sortir sur Internet', 'Pour bloquer les visiteurs', 'Parce que le NAT n’accepte que des /16', 'Pour traduire l’adresse du FAI'], good: 0,
      hints: ['Wildcard 0.0.255.255 : les deux derniers octets sont libres.'],
      explain: '192.168.0.0 avec 0.0.255.255 couvre tout 192.168.0.0 → 192.168.255.255 : tous les VLAN de Datamax sont traduits derrière 1.1.1.2 avec une seule règle.' },
    /* ---------- Impossible ---------- */
    { id: 'xdm9', lvl: 6, type: 'qcm', q: 'Réseau Datamax terminé (missions 1 à 5). Le portable VISITEUR (192.168.100.1) peut-il joindre le serveur <b>SGBD</b> (192.168.1.4) ?',
      choices: ['Non, les VLAN isolent les visiteurs', 'Oui : R_INTERNE route entre tous les VLAN ; pour isoler les visiteurs, il faudrait une ACL (par exemple sur g0/0.100)', 'Non, le NAT l’empêche', 'Seulement s’il connaît le mot de passe du SGBD'], good: 1,
      hints: ['Les VLAN séparent les domaines de diffusion… mais que fait un routeur entre eux ?'],
      explain: 'Un VLAN isole au niveau 2, mais le <b>routage inter-VLAN</b> relie tout le monde. Sans filtrage, un visiteur atteint le SGBD : c’est une faille. Il faudrait une ACL qui ne laisse sortir le VLAN 100 que vers Internet.' },
    { id: 'xdm10', lvl: 6, type: 'text', kind: 'int', accept: 6, ph: 'domaines',
      q: 'Combien de <b>domaines de diffusion</b> compte le réseau interne de Datamax une fois terminé (sans compter le lien vers le FAI) ?',
      hints: ['Un domaine de diffusion par VLAN… sans oublier celui des serveurs.'],
      explain: 'VLAN 1 (serveurs), 10, 20, 30, 40 et 100 : <b>6</b> domaines de diffusion, reliés par R_INTERNE.' },
    { id: 'xdm-lab', lvl: 6, type: 'pt', file: 'Datamax-lundi-matin.pkt', tag: 'Dépannage Datamax',
      q: '<b>Lundi matin chez Datamax.</b> Le réseau des missions 1 à 5 fonctionnait vendredi. Ce matin : le portable de la salle de réunion (SALARIE) ne joint plus les serveurs, la production n’a plus Internet, et le portable de la cafétéria (VISITEUR) n’obtient plus d’adresse. <b>Trois erreurs</b>, sur les switchs et sur R_INTERNE. Remets le réseau conforme au plan d’adressage.',
      build: function () {
        var n = LAB.solved('dm-lab3');
        LAB.cli(n, 'BACKBONE', ['conf t', 'no vlan 40', 'end']);
        LAB.cli(n, 'R_INTERNE', ['conf t', 'interface g0/0.30', 'no ip nat inside', 'end']);
        LAB.cli(n, 'ETAGE1', ['conf t', 'interface fa0/17', 'switchport access vlan 40', 'end']);
        n.devices.forEach(function (d) { if (d.natTable) d.natTable = d.natTable.filter(function (e) { return e.stat; }); });
        LAB.save(n);
        n.dhcpRequest(n.dev('VISITEUR'));
        return n;
      },
      tasks: [
        { label: 'SALARIE (VLAN 40) joint le serveur SGBD', check: function (n) { return n.canPing('SALARIE', 'SGBD'); } },
        { label: 'P1 (PRODUCTION) joint Server1 (« Internet ») grâce au PAT', check: function (n) { return n.canPing('P1', 'Server1') && traduit(n, '192.168.30.1'); } },
        { label: 'Le port de la cafétéria (ETAGE1 Fa0/17) est dans le VLAN VISITEURS', check: function (n) { return LAB.accessVlan(n, 'ETAGE1', ['FastEthernet0/17'], 100); } },
        { label: 'VISITEUR obtient une adresse de 192.168.100.0/24 (passerelle .245) et joint Server1', check: function (n) { return LAB.dhcpGets(n, 'VISITEUR', '192.168.100.0/24', '192.168.100.245') && n.canPing('VISITEUR', 'Server1'); } }
      ],
      hints: ['Un VLAN doit exister sur <b>tous</b> les switchs qu’il traverse : <code>show vlan brief</code> sur ETAGE1 et sur le BACKBONE.', 'Sur R_INTERNE, compare les sous-interfaces dans <code>show running-config</code> : que manque-t-il à g0/0.30 pour que le NAT la traite comme « inside » ?', 'Le port Fa0/17 d’ETAGE1 : dans quel VLAN est-il (<code>show vlan brief</code>) ? Après correction, redemande une adresse sur VISITEUR.'],
      solution: [
        { dev: 'BACKBONE', cli: ['conf t', 'vlan 40', 'name WIFI-SALARIES', 'end'] },
        { dev: 'R_INTERNE', cli: ['conf t', 'interface g0/0.30', 'ip nat inside', 'end'] },
        { dev: 'ETAGE1', cli: ['conf t', 'interface fa0/17', 'switchport access vlan 100', 'end'] },
        { dhcp: true, dev: 'VISITEUR' }
      ],
      explain: 'Trois pannes : (1) le VLAN 40 avait été supprimé du BACKBONE : les trames de SALARIE n’atteignaient plus R_INTERNE ; (2) <code>ip nat inside</code> manquait sur g0/0.30 : la production sortait avec ses adresses privées, que le routeur du FAI ne sait pas renvoyer ; (3) la prise de la cafétéria était passée dans le VLAN 40 : le visiteur se retrouvait sur le Wi-Fi des salariés, sans serveur DHCP (et c’était en plus une faille de sécurité).' }
  ];
})();
