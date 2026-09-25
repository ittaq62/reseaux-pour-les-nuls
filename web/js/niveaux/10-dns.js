/* Module 10 — questions supplémentaires des niveaux */
(function () {
  function resout(n, pc) { var r = n.dnsResolve(n.dev(pc), 'www.imt.local'); return r.ok && r.ip === NET.ip2int('192.168.1.10'); }
  (window.EXTRAS = window.EXTRAS || {}).dns = [
    /* ---------- Débutant ---------- */
    { id: 'xn1', lvl: 1, type: 'qcm', q: 'Quelle commande tapes-tu dans la Command Prompt d’un PC pour demander au DNS l’adresse de <b>www.imt.local</b> ?',
      choices: ['nslookup www.imt.local', 'ping -dns www.imt.local', 'show dns www.imt.local', 'arp www.imt.local'], good: 0,
      hints: ['« Name Server lookup ».'],
      explain: '<code>nslookup</code> interroge le serveur DNS configuré sur le PC et affiche la réponse. Un simple <code>ping www.imt.local</code> fait aussi une résolution DNS avant de pinguer.' },
    { id: 'xn2', lvl: 1, type: 'qcm', q: 'Dans le nom <code>www.imt-atlantique.fr</code>, quel est le domaine de premier niveau (TLD) ?',
      choices: ['www', 'imt-atlantique', 'fr', 'www.imt-atlantique'], good: 2,
      hints: ['Le DNS se lit de droite à gauche : le plus général est à droite.'],
      explain: '<b>fr</b> est le TLD (un ccTLD), imt-atlantique le domaine de 2e niveau, et www le nom de la machine.' },
    /* ---------- Extrême ---------- */
    { id: 'xn3', lvl: 5, type: 'qcm', q: 'Le serveur DNS de l’entreprise a un cache vide. Un PC lui demande <b>www.exemple.fr</b>. Quel serveur interroge-t-il en premier ?',
      choices: ['Le serveur faisant autorité pour exemple.fr', 'Un serveur de .fr', 'Un serveur racine', 'Le serveur DHCP'], good: 2,
      hints: ['Il ne sait même pas encore qui gère .fr…'],
      explain: 'Sans rien en cache, il part de la <b>racine</b> (dont il connaît les adresses), qui l’envoie vers les serveurs de .fr, qui l’envoient vers le serveur d’exemple.fr.' },
    { id: 'xn4', lvl: 5, type: 'qcm', q: 'L’enregistrement A de www.imt.local a un TTL de 3600. Tu changes l’adresse du serveur web. Pourquoi certains clients arrivent-ils encore sur l’ancienne adresse ?',
      choices: ['Parce que le serveur primaire n’a pas été redémarré', 'Parce que les serveurs cache gardent l’ancienne réponse jusqu’à la fin de son TTL (jusqu’à 1 heure)', 'Parce que le DNS ne peut pas changer une adresse', 'Parce que les clients ont une adresse APIPA'], good: 1,
      hints: ['3600 secondes, c’est combien ?'],
      explain: 'Chaque serveur cache conserve la réponse pendant son <b>TTL</b> (3600 s = 1 h). Astuce d’administrateur : baisser le TTL quelques heures avant un changement d’adresse.' },
    { id: 'xn-lab', lvl: 5, type: 'pt', file: 'DNS-derriere-routeur.pkt', tag: 'Dépannage DNS',
      q: '<b>DNS derrière un routeur.</b> Les PC (192.168.10.0/24) et les serveurs (192.168.1.0/24) sont séparés par R1. Le DNS de l’entreprise est <b>SRV-DNS (192.168.1.2)</b>, le site est sur <b>SRV-WEB (192.168.1.10)</b>. Personne n’arrive à ouvrir <b>http://www.imt.local</b>, alors que <code>ping 192.168.1.10</code> fonctionne. <b>Trois erreurs</b>, aucune sur R1. Trouve-les.',
      build: function () {
        var n = LAB.make({
          devices: [['PC0', 'PC-PT', 100, 110], ['PC1', 'PC-PT', 100, 330], ['Switch-C', '2960-24TT', 300, 220], ['R1', '1941', 520, 220], ['Switch-S', '2960-24TT', 740, 220], ['SRV-DNS', 'Server-PT', 940, 110], ['SRV-WEB', 'Server-PT', 940, 330]],
          links: [['PC0', 'FastEthernet0', 'Switch-C', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch-C', 'FastEthernet0/2', 'straight'], ['Switch-C', 'GigabitEthernet0/1', 'R1', 'GigabitEthernet0/0', 'straight'], ['R1', 'GigabitEthernet0/1', 'Switch-S', 'GigabitEthernet0/1', 'straight'], ['SRV-DNS', 'FastEthernet0', 'Switch-S', 'FastEthernet0/1', 'straight'], ['SRV-WEB', 'FastEthernet0', 'Switch-S', 'FastEthernet0/2', 'straight']],
          cli: { R1: ['conf t', 'hostname R1', 'interface g0/0', 'ip address 192.168.10.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'end'] },
          hosts: { PC0: { ip: '192.168.10.20', mask: '255.255.255.0', gw: '192.168.10.254', dns: '192.168.1.2' }, PC1: { ip: '192.168.10.21', mask: '255.255.255.0', gw: '192.168.10.254', dns: '192.168.10.254' }, 'SRV-DNS': { ip: '192.168.1.2', mask: '255.255.255.0', gw: null }, 'SRV-WEB': { ip: '192.168.1.10', mask: '255.255.255.0', gw: '192.168.1.254' } },
          notes: [[80, 450, 'Clients 192.168.10.0/24 (passerelle .254) · Serveurs 192.168.1.0/24 (passerelle .254) · DNS 192.168.1.2 · Web 192.168.1.10']]
        });
        n.dev('SRV-DNS').services.dns = { on: true, records: [{ name: 'www.imt.lcoal', type: 'A', value: '192.168.1.10' }] };
        n.touch();
        return n;
      },
      tasks: [
        { label: 'PC0 résout www.imt.local en 192.168.1.10', check: function (n) { return resout(n, 'PC0'); } },
        { label: 'PC1 utilise le serveur DNS de l’entreprise', check: function (n) { return n.dev('PC1').host.dns === NET.ip2int('192.168.1.2'); } },
        { label: 'PC1 résout www.imt.local en 192.168.1.10', check: function (n) { return resout(n, 'PC1'); } },
        { label: 'PC0 et PC1 ouvrent http://www.imt.local', check: function (n) { return n.httpGet(n.dev('PC0'), 'http://www.imt.local').ok && n.httpGet(n.dev('PC1'), 'http://www.imt.local').ok; } }
      ],
      hints: ['Depuis PC0, <code>nslookup www.imt.local</code> répond « DNS request timed out ». Le serveur DNS reçoit bien la question… sait-il renvoyer la réponse vers 192.168.10.x ?', '<code>ipconfig /all</code> sur PC1 : quel serveur DNS utilise-t-il ? Un routeur n’est pas un serveur DNS.', 'Quand nslookup répond « Non-existent domain », le serveur fonctionne : relis lettre par lettre le nom de l’enregistrement (SRV-DNS → Services → DNS).'],
      solution: [
        { dev: 'SRV-DNS', host: { gw: '192.168.1.254' } },
        { dev: 'PC1', host: { dns: '192.168.1.2' } },
        { text: 'SRV-DNS → Services → DNS : supprime l’enregistrement <code>www.imt.lcoal</code> et ajoute <code>www.imt.local</code> (A Record) → 192.168.1.10.',
          fn: function (n) { n.dev('SRV-DNS').services.dns.records = [{ name: 'www.imt.local', type: 'A', value: '192.168.1.10' }]; } }
      ],
      explain: 'Trois pannes : (1) SRV-DNS n’avait pas de passerelle : il recevait les questions des clients de 192.168.10.0 mais ne savait pas leur répondre (« DNS request timed out ») ; (2) PC1 avait mis la passerelle comme serveur DNS ; (3) l’enregistrement s’appelait www.imt.<b>lcoal</b> (« Non-existent domain »). Le ping vers l’adresse du serveur web marchait depuis le début : c’était le signe que le réseau allait bien et que le problème venait du DNS.' },
    /* ---------- Impossible ---------- */
    { id: 'xn5', lvl: 6, type: 'order', q: 'Cache vide partout. Remets dans l’ordre la résolution de <b>www.imt.fr</b> demandée par un PC.',
      items: ['Le PC demande www.imt.fr à son serveur DNS (requête récursive)', 'Le serveur DNS interroge un serveur racine, qui l’envoie vers les serveurs de .fr', 'Il interroge un serveur de .fr, qui l’envoie vers le serveur de imt.fr', 'Il interroge le serveur faisant autorité pour imt.fr, qui donne l’adresse', 'Il met la réponse en cache et la renvoie au PC'],
      hints: ['Récursif entre le PC et son serveur, itératif ensuite : de la racine vers le plus précis.'],
      explain: 'PC → serveur local (récursif), puis racine → .fr → imt.fr (itératif), mise en cache pour la durée du TTL, et réponse au PC.' },
    { id: 'xn6', lvl: 6, type: 'qcm', q: 'Tu veux que <code>imt.local</code> tout court (sans www) mène au site. Pourquoi ne peut-on pas créer, dans la zone imt.local, un CNAME <code>imt.local → www.imt.local</code> ?',
      choices: ['Parce qu’un nom qui porte un CNAME ne peut porter aucun autre enregistrement, et le nom de la zone porte obligatoirement le SOA et les NS', 'Parce que les CNAME sont interdits en .local', 'Parce qu’un CNAME ne peut pointer que vers une adresse IP', 'On peut, sans aucun problème'], good: 0,
      hints: ['Qu’y a-t-il forcément au sommet de toute zone ?'],
      explain: 'Règle du DNS : un nom qui a un <b>CNAME</b> n’a <b>rien d’autre</b>. Or le sommet de la zone (imt.local) a forcément un <b>SOA</b> et des <b>NS</b>. On met donc un enregistrement <b>A</b> sur imt.local.' },
    { id: 'xn7', lvl: 6, type: 'text', kind: 'text', ph: '… .in-addr.arpa',
      q: 'Quel est le nom de la <b>zone de recherche inverse</b> qui contient les PTR de tout le réseau <code>192.168.1.0/24</code> ?',
      accept: ['1.168.192.in-addr.arpa', '1.168.192.in-addr.arpa.'],
      hints: ['On garde la partie réseau (3 octets pour un /24), écrite à l’envers.'],
      explain: '<code>1.168.192.in-addr.arpa</code> : chaque machine y a un PTR (par exemple <code>10.1.168.192.in-addr.arpa → www.imt.local</code>).' }
  ];
})();
