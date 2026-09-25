/* Module 14 — questions supplémentaires des niveaux */
(function () {
  function v6(n, pc) { return n.hostV6(n.dev(pc)); }
  function dans(n, pc, pfx) { return v6(n, pc).addrs.some(function (a) { return NET.sameNet6(a.w, NET.parse6(pfx), 64); }); }
  function ping6(n, a, b) { var t = v6(n, b).addrs[0]; return !!t && n.canPing6(a, t.w); }
  (window.EXTRAS = window.EXTRAS || {}).ipv6 = [
    /* ---------- Débutant ---------- */
    { id: 'x61', lvl: 1, type: 'qcm', q: 'Pourquoi a-t-on inventé IPv6 ?',
      choices: ['Parce que les adresses IPv4 (environ 4,3 milliards) sont épuisées', 'Parce qu’IPv4 ne fonctionne pas sur la fibre', 'Pour remplacer Ethernet', 'Pour supprimer les routeurs'], good: 0,
      hints: ['2³² adresses, pour des milliards d’objets connectés…'],
      explain: 'IPv4 n’offre que 2³² adresses : c’est la <b>pénurie</b> (qu’on a retardée avec le NAT et les adresses privées). IPv6 en offre 2¹²⁸.' },
    { id: 'x62', lvl: 1, type: 'qcm', q: 'Comment s’écrit une adresse IPv6 ?',
      choices: ['8 blocs en hexadécimal séparés par des deux-points (:)', '4 nombres décimaux séparés par des points', '6 paires séparées par des tirets', '16 chiffres binaires séparés par des virgules'], good: 0,
      hints: ['Exemple de ton cours : 2001:0db8:…'],
      explain: '8 blocs de 16 bits, en <b>hexadécimal</b>, séparés par <b>:</b> (par exemple <code>2001:db8:1:1::1</code>, en version simplifiée).' },
    /* ---------- Impossible ---------- */
    { id: 'x63', lvl: 6, type: 'qcm', q: 'IPv6 n’a pas de diffusion (broadcast). Comment un PC trouve-t-il alors l’adresse MAC de sa passerelle ?',
      choices: ['Avec ARP, comme en IPv4', 'Avec un Neighbor Solicitation (NDP) envoyé à une adresse multicast « nœud sollicité » dérivée de l’adresse recherchée', 'En la demandant au serveur DHCPv6', 'Il envoie ses paquets à FF:FF:FF:FF:FF:FF'], good: 1,
      hints: ['ARP n’existe plus en IPv6 : ICMPv6 le remplace.'],
      explain: 'NDP envoie un <b>Neighbor Solicitation</b> au groupe multicast <b>ff02::1:ffXX:XXXX</b> (les 24 derniers bits de l’adresse cherchée). Seules les machines concernées l’écoutent : bien moins de dérangement qu’un broadcast ARP.' },
    { id: 'x64', lvl: 6, type: 'text', q: 'Quelle est l’adresse multicast « nœud sollicité » (solicited-node) de <code>2001:db8::a:b:c:12:3456</code> ? (forme la plus simplifiée)',
      fields: [{ label: 'Adresse', kind: 'ip6', answer: 'ff02::1:ff12:3456', ph: 'ff02::…' }],
      hints: ['Préfixe fixe ff02::1:ff00:0/104, complété par les 24 derniers bits de l’adresse.', 'Les 24 derniers bits de …:0012:3456 s’écrivent 12:3456.'],
      explain: 'ff02::1:ff + les 24 derniers bits (<b>12:3456</b>) → <code>ff02::1:ff12:3456</code>.' },
    { id: 'x65', lvl: 6, type: 'qcm', q: 'Avant d’utiliser l’adresse qu’il vient de fabriquer en SLAAC, un PC vérifie que personne d’autre ne l’a. Comment ?',
      choices: ['Il envoie un ping à 127.0.0.1', 'DAD : il envoie un Neighbor Solicitation pour sa propre adresse ; si quelqu’un répond, l’adresse est déjà prise', 'Il demande au serveur DNS', 'Il attend un Router Advertisement'], good: 1,
      hints: ['DAD = Duplicate Address Detection.'],
      explain: '<b>DAD</b> (Duplicate Address Detection) : le PC sollicite sa propre future adresse. Une réponse (Neighbor Advertisement) signale un doublon et l’adresse n’est pas utilisée.' },
    { id: 'x6-lab', lvl: 6, type: 'pt', file: 'Pratique-IPv6-panne.pkt', tag: 'Dépannage IPv6',
      q: '<b>IPv6 en panne.</b> La pratique IPv6 fonctionnait (R1 : fc00::1, 2001:db8:1:1::/64 vers PC1, 2001:db8:1:2::/64 vers PC2, route par défaut vers fc00::2 ; R2 : fc00::2, 2001:db8:2::/64 vers PC0, routes vers les deux réseaux de R1 via fc00::1). Les PC sont en configuration automatique. <b>Trois erreurs</b> se sont glissées dans la configuration des routeurs : PC1 et PC2 n’ont même plus d’adresse globale. Remets tout en ordre.',
      build: function () {
        var n = LAB.solved('v6-lab1');
        LAB.cli(n, 'R1', ['conf t', 'no ipv6 unicast-routing', 'interface fa1/0', 'no ipv6 address 2001:db8:1:2::/64 eui-64', 'ipv6 address 2001:db8:1:3::/64 eui-64', 'end']);
        LAB.cli(n, 'R2', ['conf t', 'no ipv6 route 2001:db8:1:1::/64 fc00::1', 'ipv6 route 2001:db8:1:1::/64 fc00::3', 'end']);
        return LAB.save(n);
      },
      tasks: [
        { label: 'PC1 obtient une adresse dans 2001:db8:1:1::/64', check: function (n) { return dans(n, 'PC1', '2001:db8:1:1::'); } },
        { label: 'PC2 obtient une adresse dans 2001:db8:1:2::/64', check: function (n) { return dans(n, 'PC2', '2001:db8:1:2::'); } },
        { label: 'PC0 joint PC1', check: function (n) { return ping6(n, 'PC0', 'PC1'); } },
        { label: 'PC2 joint PC0', check: function (n) { return ping6(n, 'PC2', 'PC0'); } },
        { label: 'PC1 joint PC2', check: function (n) { return ping6(n, 'PC1', 'PC2'); } }
      ],
      hints: ['Un routeur IPv6 n’envoie d’annonces RA (et ne route) que si le routage IPv6 est activé : <code>show running-config</code> sur R1.', 'Compare les préfixes de <code>show ipv6 interface brief</code> sur R1 avec l’énoncé.', 'Sur R2, <code>show ipv6 route</code> : vers quel next hop partent les paquets pour 2001:db8:1:1::/64 ? Existe-t-il ?'],
      solution: [
        { dev: 'R1', cli: ['conf t', 'ipv6 unicast-routing', 'end'] },
        { dev: 'R1', cli: ['conf t', 'interface fa1/0', 'no ipv6 address 2001:db8:1:3::/64 eui-64', 'ipv6 address 2001:db8:1:2::/64 eui-64', 'end'] },
        { dev: 'R2', cli: ['conf t', 'no ipv6 route 2001:db8:1:1::/64 fc00::3', 'ipv6 route 2001:db8:1:1::/64 fc00::1', 'end'] }
      ],
      explain: 'Trois pannes : (1) <code>ipv6 unicast-routing</code> avait disparu de R1 : plus d’annonces RA, donc plus de SLAAC pour PC1 et PC2, et plus de routage ; (2) Fa1/0 annonçait 2001:db8:1:3::/64 au lieu de 1:2 : PC2 prenait une adresse que R2 ne sait pas joindre ; (3) R2 envoyait 2001:db8:1:1::/64 vers fc00::3, qui n’existe pas. La première masquait les deux autres : après chaque correction, on reteste.' }
  ];
})();
