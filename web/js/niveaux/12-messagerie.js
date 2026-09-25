/* Module 12 — questions supplémentaires des niveaux */
(function () {
  function recu(n, pc, from) {
    var c = n.dev(pc).host.mail;
    return !!c && c.inbox.some(function (m) { return String(m.from).toLowerCase() === from; });
  }
  function client(n, pc, name, adr, srv, user, pw) {
    var c = n.mailCfg(n.dev(pc));
    c.name = name; c.addr = adr; c.inSrv = c.outSrv = srv; c.user = user; c.pw = pw;
  }
  (window.EXTRAS = window.EXTRAS || {}).messagerie = [
    /* ---------- Débutant ---------- */
    { id: 'xm1', lvl: 1, type: 'qcm', q: 'Dans l’adresse <code>prof@imt.local</code>, que désigne la partie située <b>après</b> le @ ?',
      choices: ['Le domaine de messagerie (qui gère la boîte)', 'Le nom de l’utilisateur', 'Le mot de passe', 'Le port du serveur'], good: 0,
      hints: ['Avant le @ : qui ; après le @ : chez qui.'],
      explain: 'Avant le @ : la <b>boîte</b> (l’utilisateur). Après : le <b>domaine</b>, dont le serveur de messagerie se trouve grâce au DNS (enregistrement MX).' },
    /* ---------- Difficile ---------- */
    { id: 'xm2', lvl: 4, type: 'qcm', q: 'Dans Packet Tracer, le client Email affiche « <b>Unknown Mail Server.</b> » à l’envoi. Quelle est la cause la plus probable ?',
      choices: ['Le mot de passe est faux', 'Le nom du serveur (par exemple mail.imt.local) n’a pas pu être traduit en adresse : DNS du PC ou enregistrement A manquant', 'La boîte du destinataire est pleine', 'Le service POP3 est éteint'], good: 1,
      hints: ['Avant de parler SMTP, le client doit trouver l’adresse IP du serveur…'],
      explain: 'Le client résout d’abord le nom du serveur sortant. Si le DNS ne répond pas ou ne connaît pas ce nom : « Unknown Mail Server. » Un mauvais mot de passe, lui, n’apparaît qu’à la relève (« Authentication failed »).' },
    /* ---------- Extrême ---------- */
    { id: 'xm3', lvl: 5, type: 'qcm', q: 'Un utilisateur relève sa boîte en <b>POP3</b> sur son PC, puis ouvre le webmail : sa boîte est vide. Pourquoi ?',
      choices: ['Le webmail est en panne', 'Par défaut, POP3 télécharge les messages sur le PC et les supprime du serveur', 'IMAP a effacé les messages', 'Les messages ont expiré'], good: 1,
      hints: ['POP3 = « je rapatrie chez moi ».'],
      explain: 'POP3 <b>rapatrie</b> les messages et (par défaut) les efface du serveur. Pour garder la même boîte sur tous ses appareils, on utilise <b>IMAP</b>, qui laisse les messages et les dossiers sur le serveur.' },
    { id: 'xm4', lvl: 5, type: 'qcm', q: 'La zone imt.local contient <code>MX 10 mx1.imt.local</code> et <code>MX 20 mx2.imt.local</code>. Vers quel serveur un relais extérieur envoie-t-il le courrier en priorité ?',
      choices: ['mx1.imt.local (la plus petite valeur est prioritaire)', 'mx2.imt.local (la plus grande valeur est prioritaire)', 'Les deux à tour de rôle', 'Au hasard'], good: 0,
      hints: ['Le nombre est une « préférence » : plus il est petit, plus le serveur est préféré.'],
      explain: '<b>mx1</b> (préférence 10). mx2 (20) sert de secours si mx1 ne répond pas.' },
    /* ---------- Impossible ---------- */
    { id: 'xm5', lvl: 6, type: 'order', q: 'Remets dans l’ordre le trajet d’un message de <b>etudiant@imt.local</b> vers <b>directeur@ecole.fr</b>.',
      items: ['Le client de l’étudiant remet le message à son serveur (SMTP, TCP 25)', 'Le serveur d’imt.local voit que ecole.fr n’est pas son domaine et demande au DNS le MX de ecole.fr', 'Il transmet le message en SMTP au serveur de ecole.fr', 'Le serveur de ecole.fr le range dans la boîte de directeur', 'Le PC du directeur le relève (POP3, TCP 110)'],
      hints: ['Envoi (SMTP) → relais entre serveurs (DNS MX + SMTP) → relève (POP3).'],
      explain: 'SMTP du client vers son serveur, recherche du <b>MX</b> du domaine de destination, SMTP de serveur à serveur, dépôt dans la boîte, puis <b>POP3</b> (ou IMAP) pour la relève.' },
    { id: 'xm6', lvl: 6, type: 'text', kind: 'int', accept: 4, ph: 'Mo',
      q: 'Tu joins un PDF de <b>3 Mo</b> à un message. Une fois encodé en <b>base64</b> par MIME, quelle taille approximative (en Mo) occupe-t-il dans le message ?',
      hints: ['SMTP transporte du texte : le base64 transforme 3 octets en 4 caractères.'],
      explain: '3 octets → 4 caractères, soit +33 % : 3 × 4 ÷ 3 = <b>4 Mo</b>. C’est pour ça que les serveurs limitent la taille des pièces jointes en dessous de ce que l’on croit envoyer.' },
    { id: 'xm7', lvl: 6, type: 'qcm', q: 'Dans une session SMTP, <code>MAIL FROM:&lt;a@x.fr&gt;</code>, mais l’en-tête du message affiche <code>From: patron@banque.fr</code>. Est-ce possible ?',
      choices: ['Non, le serveur refuse toujours ce message', 'Oui : l’enveloppe (MAIL FROM) et les en-têtes du message sont indépendants, c’est ce qu’exploitent les usurpations d’identité', 'Oui, mais seulement en POP3', 'Non, MIME l’interdit'], good: 1,
      hints: ['Qui lit l’enveloppe ? Qui lit l’en-tête From: ?'],
      explain: 'Les MTA acheminent avec l’<b>enveloppe</b> ; le destinataire voit l’<b>en-tête</b> From:, écrit librement par l’expéditeur. D’où l’hameçonnage, et les protections modernes (SPF, DKIM, DMARC) qui vérifient la cohérence.' },
    { id: 'xm-lab', lvl: 6, type: 'pt', file: 'Messagerie-deux-domaines.pkt', tag: 'Relais SMTP',
      q: '<b>D’un domaine à l’autre.</b> L’IMT (imt.local, SRV-MAIL-IMT) et l’école partenaire (ecole.fr, SRV-MAIL-ECOLE) ont chacune leur serveur de messagerie ; le DNS commun est SRV-DNS (192.168.1.2). Les clients Email des deux PC sont déjà configurés. Un message de etudiant@imt.local vers <b>directeur@ecole.fr</b> doit arriver dans la boîte de PC-DIR, mais PC-ETU obtient « Send Mail Failed. ». <b>Trois erreurs</b> (DNS et serveurs, aucune sur R1 ni sur les clients). Répare, envoie le message depuis PC-ETU, puis relève la boîte de PC-DIR.',
      build: function () {
        var n = LAB.make({
          devices: [['PC-ETU', 'PC-PT', 90, 90], ['SRV-DNS', 'Server-PT', 90, 250], ['SRV-MAIL-IMT', 'Server-PT', 90, 410], ['Switch-IMT', '2960-24TT', 300, 250], ['R1', '1941', 520, 250], ['Switch-ECOLE', '2960-24TT', 740, 250], ['PC-DIR', 'PC-PT', 950, 150], ['SRV-MAIL-ECOLE', 'Server-PT', 950, 350]],
          links: [['PC-ETU', 'FastEthernet0', 'Switch-IMT', 'FastEthernet0/1', 'straight'], ['SRV-DNS', 'FastEthernet0', 'Switch-IMT', 'FastEthernet0/2', 'straight'], ['SRV-MAIL-IMT', 'FastEthernet0', 'Switch-IMT', 'FastEthernet0/3', 'straight'], ['Switch-IMT', 'GigabitEthernet0/1', 'R1', 'GigabitEthernet0/0', 'straight'], ['R1', 'GigabitEthernet0/1', 'Switch-ECOLE', 'GigabitEthernet0/1', 'straight'], ['PC-DIR', 'FastEthernet0', 'Switch-ECOLE', 'FastEthernet0/1', 'straight'], ['SRV-MAIL-ECOLE', 'FastEthernet0', 'Switch-ECOLE', 'FastEthernet0/2', 'straight']],
          cli: { R1: ['conf t', 'hostname R1', 'interface g0/0', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.2.254 255.255.255.0', 'no shutdown', 'end'] },
          hosts: {
            'PC-ETU': { ip: '192.168.1.20', mask: '255.255.255.0', gw: '192.168.1.254', dns: '192.168.1.2' },
            'SRV-DNS': { ip: '192.168.1.2', mask: '255.255.255.0', gw: '192.168.1.254', dns: '192.168.1.2' },
            'SRV-MAIL-IMT': { ip: '192.168.1.3', mask: '255.255.255.0', gw: '192.168.1.254', dns: null },
            'PC-DIR': { ip: '192.168.2.20', mask: '255.255.255.0', gw: '192.168.2.254', dns: '192.168.1.2' },
            'SRV-MAIL-ECOLE': { ip: '192.168.2.3', mask: '255.255.255.0', gw: '192.168.2.254', dns: '192.168.1.2' }
          },
          notes: [[60, 520, 'imt.local : 192.168.1.0/24 (mail.imt.local = .3)   ·   ecole.fr : 192.168.2.0/24 (mail.ecole.fr = .3)   ·   DNS 192.168.1.2']]
        });
        n.dev('SRV-DNS').services.dns = { on: true, records: [{ name: 'mail.imt.local', type: 'A', value: '192.168.1.3' }, { name: 'mail.ecole.fr', type: 'A', value: '192.168.2.3' }, { name: 'imt.local', type: 'MX', value: 'mail.imt.local' }] };
        var a = n.mailSvc(n.dev('SRV-MAIL-IMT')); a.domain = 'imt.local'; a.users = [{ name: 'etudiant', pw: 'etu123' }];
        var b = n.mailSvc(n.dev('SRV-MAIL-ECOLE')); b.domain = 'ecole.fr'; b.users = [{ name: 'direction', pw: 'dir123' }];
        client(n, 'PC-ETU', 'Etudiant', 'etudiant@imt.local', 'mail.imt.local', 'etudiant', 'etu123');
        client(n, 'PC-DIR', 'Directeur', 'directeur@ecole.fr', 'mail.ecole.fr', 'directeur', 'dir123');
        n.touch();
        return n;
      },
      tasks: [
        { label: 'Le DNS indique le serveur de messagerie du domaine ecole.fr (enregistrement MX)', check: function (n) {
          return n.dev('SRV-DNS').services.dns.records.some(function (r) {
            if (r.type !== 'MX' || String(r.name).toLowerCase().replace(/\.$/, '') !== 'ecole.fr') return false;
            var x = n.dnsResolve(n.dev('PC-ETU'), r.value); return x.ok && x.ip === NET.ip2int('192.168.2.3');
          }); } },
        { label: 'SRV-MAIL-IMT peut interroger le DNS de l’entreprise', check: function (n) { return n.dev('SRV-MAIL-IMT').host.dns === NET.ip2int('192.168.1.2'); } },
        { label: 'Le compte directeur (dir123) existe sur SRV-MAIL-ECOLE', check: function (n) { return n.mailSvc(n.dev('SRV-MAIL-ECOLE')).users.some(function (u) { return u.name.toLowerCase() === 'directeur' && u.pw === 'dir123'; }); } },
        { label: 'PC-DIR a reçu le message de etudiant@imt.local', check: function (n) { return recu(n, 'PC-DIR', 'etudiant@imt.local'); } }
      ],
      hints: ['Pour relayer vers ecole.fr, SRV-MAIL-IMT demande au DNS « quel est le serveur de messagerie de ecole.fr ? ». Quel type d’enregistrement répond à cette question ?', 'Ce n’est pas le PC qui cherche le serveur de ecole.fr, c’est SRV-MAIL-IMT lui-même : regarde sa configuration IP.', 'Sur PC-DIR, Receive affiche « Authentication failed » : compare le compte du client avec les comptes de SRV-MAIL-ECOLE.'],
      solution: [
        { text: 'SRV-DNS → Services → DNS : ajoute Name <code>ecole.fr</code>, Type MX Record, Mail Server <code>mail.ecole.fr</code>.',
          fn: function (n) { n.dev('SRV-DNS').services.dns.records.push({ name: 'ecole.fr', type: 'MX', value: 'mail.ecole.fr' }); } },
        { dev: 'SRV-MAIL-IMT', host: { dns: '192.168.1.2' } },
        { text: 'SRV-MAIL-ECOLE → Services → EMAIL : ajoute l’utilisateur directeur / dir123.',
          fn: function (n) { n.mailSvc(n.dev('SRV-MAIL-ECOLE')).users.push({ name: 'directeur', pw: 'dir123' }); } },
        { text: 'PC-ETU : Compose → directeur@ecole.fr → Send. PC-DIR : Receive.',
          fn: function (n) { n.mailSend(n.dev('PC-ETU'), 'directeur@ecole.fr', 'Stage', 'Bonjour, je vous contacte pour un stage.'); n.mailReceive(n.dev('PC-DIR')); } }
      ],
      explain: 'Le client remet le message à SRV-MAIL-IMT (SMTP). Comme ecole.fr n’est pas son domaine, le serveur le <b>relaie</b> : il cherche le <b>MX</b> de ecole.fr (il lui faut donc lui-même un serveur DNS !), puis l’adresse de mail.ecole.fr, et transmet en SMTP à SRV-MAIL-ECOLE. Celui-ci ne dépose le message que si la boîte <b>directeur</b> existe. PC-DIR le relève enfin en POP3.' }
  ];
})();
