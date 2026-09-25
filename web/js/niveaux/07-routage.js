/* Module 7 — questions supplémentaires des niveaux */
(function () {
  var SITES = ['LILLE', 'LENS', 'ARRAS', 'VALENCIENNES'];
  /* 6 routes statiques au total (le corrigé du prof), et toutes installées dans les tables */
  function propre(n) {
    var tot = 0;
    var actives = SITES.every(function (r) {
      var d = n.dev(r), rt = n.routeTable(d);
      tot += d.cfg.routes.length;
      return d.cfg.routes.every(function (s) { return rt.some(function (x) { return x.net === s.net && x.len === s.len && x.nh === s.nh; }); });
    });
    return actives && tot === 6;
  }
  (window.EXTRAS = window.EXTRAS || {}).routage = [
    /* ---------- Débutant ---------- */
    { id: 'xr1', lvl: 1, type: 'qcm', q: 'À quoi sert la <b>table de routage</b> d’un routeur ?',
      choices: ['À savoir par où envoyer un paquet selon son réseau de destination', 'À stocker les adresses MAC des PC', 'À donner des adresses IP aux PC', 'À traduire les noms en adresses IP'], good: 0,
      hints: ['Le routeur doit choisir une sortie pour chaque paquet…'],
      explain: 'Pour chaque réseau de destination, la table indique l’<b>interface de sortie</b> et le <b>prochain saut</b>. Les MAC sont dans la table ARP (et la table MAC des switchs), les adresses données par DHCP, les noms traduits par DNS.' },
    { id: 'xr2', lvl: 1, type: 'qcm', q: 'Dans la CLI d’un routeur (Packet Tracer), quelle commande affiche sa table de routage ?',
      choices: ['show ip route', 'show vlan', 'ipconfig', 'show mac-address-table'], good: 0,
      hints: ['« Montre la route IP ».'],
      explain: '<code>show ip route</code>, en mode privilégié (<code>Router#</code>). <code>ipconfig</code> se tape sur un PC, <code>show vlan</code> et <code>show mac-address-table</code> sur un switch.' },
    /* ---------- Extrême ---------- */
    { id: 'xr5', lvl: 5, type: 'order', q: 'Remets dans l’ordre ce que fait un routeur quand une trame arrive sur une de ses interfaces.',
      items: ['Il vérifie le FCS et retire l’en-tête Ethernet', 'Il lit l’adresse IP de destination', 'Il cherche la route la plus précise (plus long préfixe)', 'Il trouve la MAC du prochain saut (ARP)', 'Il réencapsule le paquet dans une nouvelle trame et l’envoie'],
      hints: ['On ne peut pas choisir une route sans avoir lu l’adresse de destination…', '… ni fabriquer la nouvelle trame sans connaître la MAC du prochain saut.'],
      explain: 'Désencapsulation → lecture de l’IP destination → recherche du plus long préfixe → ARP pour le next hop → nouvelle trame. Le paquet IP traverse le routeur, la trame, elle, ne dépasse jamais un lien.' },
    /* ---------- Impossible ---------- */
    { id: 'xr3', lvl: 6, type: 'qcm', q: 'Réseau de l’exercice Lille (corrigé du prof) : LILLE a une route par défaut vers LENS (192.168.100.6) et LENS une route par défaut vers LILLE (192.168.100.5). PC-L1 tape <code>ping 10.9.9.9</code>, une adresse qui n’existe nulle part. Qu’affiche-t-il ?',
      choices: ['Request timed out.', 'Reply from 192.168.100.6: TTL expired in transit.', 'Reply from 192.168.1.1: Destination host unreachable.', 'Reply from 192.168.100.5: TTL expired in transit.'], good: 1,
      hints: ['Le paquet fait des allers-retours LILLE ⟷ LENS, et chaque routeur retire 1 au TTL (128 au départ sur un PC).', 'Le 128e routeur traversé détruit le paquet. LILLE est le 1er, LENS le 2e… Qui est le 128e, et par quelle interface le paquet lui est-il arrivé ?'],
      explain: 'LILLE est le 1er, 3e, 5e… routeur traversé, LENS le 2e, 4e… 128 est pair : c’est <b>LENS</b> qui fait tomber le TTL à 0. Il détruit le paquet et renvoie un ICMP « TTL expired in transit » depuis son interface côté LILLE, <b>192.168.100.6</b>. C’est le symptôme typique d’une boucle de routage.' },
    { id: 'xr4', lvl: 6, type: 'text', kind: 'text', ph: 'ip route …',
      q: 'R1 apprend <b>10.20.0.0/16</b> par OSPF grâce au lien principal. Un lien de secours passe par le voisin <b>172.16.0.2</b>. Écris la route statique de <b>secours</b>, qui ne doit servir que si la route OSPF disparaît.',
      accept: ['ip route 10.20.0.0 255.255.0.0 172.16.0.2 200', /^ip\s+route\s+10\.20\.0\.0\s+255\.255\.0\.0\s+172\.16\.0\.2\s+(11[1-9]|1[2-9]\d|2[0-4]\d|25[0-5])$/i],
      answerHtml: '<code>ip route 10.20.0.0 255.255.0.0 172.16.0.2 200</code> (toute distance de 111 à 255 convient)',
      hints: ['Une statique a une distance administrative de 1 : elle écraserait OSPF (110)… sauf si tu lui en donnes une autre.', 'La distance administrative s’ajoute à la fin de la commande, et elle doit dépasser 110.'],
      explain: 'C’est une route <b>flottante</b> : même réseau, mais une distance administrative plus grande que celle d’OSPF. Tant qu’OSPF fournit la route, la statique reste cachée ; si le lien principal tombe, elle apparaît dans <code>show ip route</code>.' },
    { id: 'xr6', lvl: 6, type: 'text', kind: 'text', ph: 'ip route …',
      q: 'Sans route par défaut, LENS doit joindre les deux LAN de Lille (192.168.1.0/24 et 192.168.2.0/24) avec <b>une seule</b> route statique, la plus précise possible, via 192.168.100.5. Écris-la.',
      accept: ['ip route 192.168.0.0 255.255.252.0 192.168.100.5', /^ip\s+route\s+192\.168\.0\.0\s+255\.255\.252\.0\s+192\.168\.100\.5$/i],
      answerHtml: '<code>ip route 192.168.0.0 255.255.252.0 192.168.100.5</code>',
      hints: ['Écris le 3e octet en binaire : 1 = 00000001, 2 = 00000010. Combien de bits communs ?', '16 + 6 = /22 : quel masque, et quelle adresse réseau ?'],
      explain: '1 et 2 n’ont que leurs 6 premiers bits en commun (000000) → /22 = 255.255.252.0, réseau 192.168.0.0. Cette route résumée couvre 192.168.0.0 à 192.168.3.255 : Arras (192.168.3.0) est dedans, ce qui tombe bien puisqu’on le joint aussi par LILLE.' },
    { id: 'xr-lab', lvl: 6, type: 'pt', file: 'EX-ROUTAGE-panne.pkt', tag: 'Dépannage du routage',
      q: '<b>Lille en panne.</b> Le réseau Lille / Lens / Arras / Valenciennes fonctionnait (corrigé du prof, 6 routes statiques). Un stagiaire est passé par là et a enregistré ses modifications : <b>trois erreurs</b>, toutes sur les routeurs. Rappel du plan : LILLE-ARRAS 192.168.100.0/30 (LILLE .1, ARRAS .2), LILLE-LENS 192.168.100.4/30 (LILLE .5, LENS .6), LENS-VALENCIENNES 192.168.100.8/30 (LENS .9, VAL .10), LAN en 192.168.x.0/24 (Lille 1 et 2, Arras 3, Lens 4, Valenciennes 5), routeur en .1. Remets tout en état en gardant un routage minimal.',
      build: function () {
        var n = LAB.topo('EX-ROUTAGE-CORR');
        LAB.cli(n, 'LILLE', ['conf t', 'ip route 192.168.5.0 255.255.255.0 192.168.100.2', 'end']);
        LAB.cli(n, 'ARRAS', ['conf t', 'no ip route 0.0.0.0 0.0.0.0 192.168.100.1', 'ip route 0.0.0.0 0.0.0.0 192.168.100.5', 'end']);
        LAB.cli(n, 'LENS', ['conf t', 'interface g1/0', 'ip address 192.168.100.13 255.255.255.252', 'end']);
        return LAB.save(n);
      },
      tasks: [
        { label: 'PC-ARRAS joint PC-L1', check: function (n) { return n.canPing('PC-ARRAS', 'PC-L1'); } },
        { label: 'PC-LENS joint PC-VAL', check: function (n) { return n.canPing('PC-LENS', 'PC-VAL'); } },
        { label: 'PC-L1 joint PC-VAL', check: function (n) { return n.canPing('PC-L1', 'PC-VAL'); } },
        { label: 'PC-ARRAS joint PC-VAL', check: function (n) { return n.canPing('PC-ARRAS', 'PC-VAL'); } },
        { label: 'Routage propre : 6 routes statiques au total, toutes présentes dans les tables', check: propre }
      ],
      hints: ['Commence par <code>show ip interface brief</code> sur chaque routeur et compare avec le plan.', 'Un <code>tracert</code> qui fait LILLE → ARRAS → LILLE → ARRAS… trahit une boucle. Et une route présente dans <code>show running-config</code> mais absente de <code>show ip route</code> a un next hop injoignable.', 'LENS G1/0 doit être 192.168.100.9. ARRAS : route par défaut via 192.168.100.1 (et plus via .5). LILLE : <code>no ip route 192.168.5.0 255.255.255.0 192.168.100.2</code>.'],
      solution: [
        { dev: 'LENS', cli: ['conf t', 'interface g1/0', 'ip address 192.168.100.9 255.255.255.252', 'end'] },
        { dev: 'ARRAS', cli: ['conf t', 'no ip route 0.0.0.0 0.0.0.0 192.168.100.5', 'ip route 0.0.0.0 0.0.0.0 192.168.100.1', 'end'] },
        { dev: 'LILLE', cli: ['conf t', 'no ip route 192.168.5.0 255.255.255.0 192.168.100.2', 'end'] }
      ],
      explain: 'Trois pannes : (1) LENS G1/0 en 192.168.100.13, hors du /30 de la liaison : LENS et VALENCIENNES ne se voient plus ; (2) ARRAS envoie sa route par défaut vers 192.168.100.5, une adresse qu’il ne peut pas joindre directement : IOS garde la ligne dans la configuration mais ne l’installe pas dans la table ; (3) LILLE envoie Valenciennes vers ARRAS, qui le lui renvoie par défaut : boucle, et le ping répond « TTL expired in transit ». Les pannes se masquent les unes les autres : on corrige une chose à la fois et on reteste après chaque correction.' }
  ];
})();
