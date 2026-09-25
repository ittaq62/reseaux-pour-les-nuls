(function () {
  var USERS = ['prof@imt.local', 'quentin@imt.local', 'admin@imt.local'];
  function addr(s) { var m = /^\s*<?\s*([^<>\s]+@[^<>\s]+)\s*>?\s*$/.exec(s || ''); return m ? m[1].toLowerCase() : null; }
  /* labo Email : client configuré (adresse, compte, serveurs entrant et sortant qui mènent à srvIp) */
  function clientOk(n, pc, adr, user, pw, srvIp) {
    var d = n.dev(pc), c = d.host.mail;
    if (!c || String(c.addr).toLowerCase() !== adr || String(c.user).toLowerCase() !== user || c.pw !== pw) return false;
    return [c.inSrv, c.outSrv].every(function (s) { var r = s ? n.dnsResolve(d, s) : null; return !!r && r.ok && r.ip === NET.ip2int(srvIp); });
  }
  function recu(n, pc, from) {
    var c = n.dev(pc).host.mail;
    return !!c && c.inbox.some(function (m) { return String(m.from).toLowerCase() === from; });
  }
  /* Session SMTP par telnet (RFC 5321) */
  function smtpScript(st, line) {
    var l = line.replace(/\s+$/, '');
    if (st.phase === 'shell') {
      if (!l.trim()) return { out: [] };
      var m = /^telnet\s+(\S+)\s+(\d+)$/i.exec(l.trim());
      if (!m) return { out: ['Commande inconnue. Pour parler au serveur de messagerie : telnet smtp.imt.local 25', ''] };
      if (!/^(smtp\.imt\.local|mail\.imt\.local|192\.168\.1\.25)$/i.test(m[1])) return { out: ['Trying ...', '% Unknown host ' + m[1], ''] };
      if (m[2] !== '25') return { out: ['Trying 192.168.1.25 ...', '% Connection refused by remote host (le service SMTP écoute sur un autre port)', ''] };
      st.phase = 'cmd'; st.helo = false; st.from = null; st.rcpt = []; st.body = [];
      return { out: ['Trying 192.168.1.25 ...Open', '220 smtp.imt.local ESMTP Service ready'], state: st };
    }
    if (st.phase === 'data') {
      if (l === '.') {
        st.phase = 'cmd'; st.sent = (st.sent || 0) + 1;
        st.lastMail = { from: st.from, rcpt: st.rcpt.slice(), body: st.body.slice() };
        st.from = null; st.rcpt = []; st.body = [];
        return { out: ['250 OK : message accepted for delivery (queued as ' + (1000 + st.sent) + ')'], state: st };
      }
      st.body.push(l);
      return { out: [], state: st };
    }
    var t = l.trim(), up = t.toUpperCase();
    if (!t) return { out: [] };
    if (/^(HELO|EHLO)(\s|$)/.test(up)) {
      var dom = t.split(/\s+/)[1];
      if (!dom) return { out: ['501 Syntax: ' + up.slice(0, 4) + ' hostname'] };
      st.helo = true;
      if (up.indexOf('EHLO') === 0) return { out: ['250-smtp.imt.local Hello ' + dom, '250-SIZE 10240000', '250-AUTH LOGIN PLAIN', '250 HELP'], state: st };
      return { out: ['250 smtp.imt.local Hello ' + dom + ', pleased to meet you'], state: st };
    }
    if (/^MAIL\s+FROM\s*:/.test(up)) {
      if (!st.helo) return { out: ['503 Bad sequence of commands : send HELO/EHLO first'] };
      var f = addr(t.replace(/^mail\s+from\s*:/i, ''));
      if (!f) return { out: ['501 Syntax error in parameters or arguments'] };
      st.from = f; st.rcpt = [];
      return { out: ['250 OK : sender <' + f + '> ok'], state: st };
    }
    if (/^RCPT\s+TO\s*:/.test(up)) {
      if (!st.from) return { out: ['503 Bad sequence of commands : need MAIL FROM first'] };
      var r = addr(t.replace(/^rcpt\s+to\s*:/i, ''));
      if (!r) return { out: ['501 Syntax error in parameters or arguments'] };
      if (USERS.indexOf(r) < 0) return { out: ['550 Requested action not taken : mailbox <' + r + '> unavailable'] };
      st.rcpt.push(r);
      return { out: ['250 OK : recipient <' + r + '> ok'], state: st };
    }
    if (up === 'DATA') {
      if (!st.rcpt.length) return { out: ['503 Bad sequence of commands : need RCPT TO first'] };
      st.phase = 'data';
      return { out: ['354 Start mail input; end with <CRLF>.<CRLF>'], state: st };
    }
    if (up === 'RSET') { st.from = null; st.rcpt = []; st.body = []; return { out: ['250 OK : reset state'], state: st }; }
    if (up === 'NOOP') return { out: ['250 OK'] };
    if (/^VRFY/.test(up)) { var v = addr(t.slice(4)); return { out: [v && USERS.indexOf(v) >= 0 ? '250 <' + v + '>' : '252 Cannot VRFY user, but will accept message and attempt delivery'] }; }
    if (/^HELP/.test(up)) return { out: ['214-Commands supported:', '214 HELO EHLO MAIL RCPT DATA RSET NOOP QUIT VRFY HELP'] };
    if (up === 'QUIT') { st.phase = 'shell'; st.helo = false; return { out: ['221 smtp.imt.local Service closing transmission channel', '', '[Connection to smtp.imt.local closed by foreign host]', ''], state: st }; }
    return { out: ['500 Syntax error, command unrecognized'] };
  }
  /* Session POP3 (RFC 1939) */
  function popScript(st, line) {
    var t = line.trim(), up = t.toUpperCase();
    if (st.phase === 'shell') {
      if (!t) return { out: [] };
      var m = /^telnet\s+(\S+)\s+(\d+)$/i.exec(t);
      if (!m) return { out: ['Commande inconnue. Pour relever ta boîte : telnet pop.imt.local 110', ''] };
      if (!/^(pop\.imt\.local|mail\.imt\.local|192\.168\.1\.25)$/i.test(m[1])) return { out: ['Trying ...', '% Unknown host ' + m[1], ''] };
      if (m[2] !== '110') return { out: ['Trying 192.168.1.25 ...', '% Connection refused by remote host (POP3 n’écoute pas sur ce port)', ''] };
      st.phase = 'auth'; st.user = null;
      return { out: ['Trying 192.168.1.25 ...Open', '+OK POP3 server ready <imt.local>'], state: st };
    }
    if (!t) return { out: [] };
    if (up === 'QUIT') { st.phase = 'shell'; return { out: ['+OK POP3 server signing off', '', '[Connection closed by foreign host]', ''], state: st }; }
    if (st.phase === 'auth') {
      if (/^USER\s+\S+/.test(up)) { st.user = t.split(/\s+/)[1].toLowerCase(); return { out: [st.user === 'quentin' ? '+OK quentin est connu ici' : '-ERR utilisateur inconnu'], state: st }; }
      if (/^PASS\s+/.test(up)) {
        if (st.user !== 'quentin') return { out: ['-ERR USER d’abord'] };
        if (t.split(/\s+/)[1] !== 'imt2026') return { out: ['-ERR mot de passe invalide'] };
        st.phase = 'trans'; return { out: ['+OK boîte de quentin prête, 2 messages (1320 octets)'], state: st };
      }
      return { out: ['-ERR commande invalide dans cet état (USER / PASS)'] };
    }
    if (up === 'STAT') return { out: ['+OK 2 1320'] };
    if (up === 'LIST') return { out: ['+OK 2 messages (1320 octets)', '1 580', '2 740', '.'] };
    var rm = /^RETR\s+(\d+)$/.exec(up);
    if (rm) {
      if (rm[1] === '1') { st.read1 = true; return { out: ['+OK 580 octets', 'From: prof@imt.local', 'To: quentin@imt.local', 'Subject: DS de reseaux', 'Date: Thu, 24 Sep 2026 09:00:00 +0200', '', 'Bonjour, le DS aura lieu jeudi. Revise le routage et le VLSM !', '.'], state: st }; }
      if (rm[1] === '2') return { out: ['+OK 740 octets', 'From: admin@imt.local', 'To: quentin@imt.local', 'Subject: Mot de passe', '', 'Pense a changer ton mot de passe.', '.'] };
      return { out: ['-ERR no such message'] };
    }
    if (/^DELE\s+\d+$/.test(up)) return { out: ['+OK message marqué pour suppression (effective au QUIT)'] };
    return { out: ['-ERR commande inconnue'] };
  }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'messagerie', num: 12, icon: '✉️', titre: 'La messagerie : SMTP, POP, IMAP',
  sous: 'MUA / MTA / MDA, commandes SMTP, codes de réponse, MIME',
  source: 'Les protocoles de messagerie (ENI)',
  cours: `
<h3>1. Comment voyage un e-mail ?</h3>
<p>Comme une lettre : l’expéditeur et le destinataire n’ont pas besoin d’être connectés en même temps, et le message passe par des <b>stockages intermédiaires</b>. Trois protocoles :</p>
<ul><li><b>SMTP</b> (<i>Simple Mail Transfer Protocol</i>) : <b>envoyer</b> le message, du client à son serveur, puis de serveur en serveur. <b>TCP 25</b>.</li>
<li><b>POP3</b> (<i>Post Office Protocol</i>) : le destinataire <b>rapatrie</b> ses messages sur son poste. <b>TCP 110</b>.</li>
<li><b>IMAP4</b> (<i>Internet Message Access Protocol</i>) : le destinataire <b>consulte</b> ses messages <b>en restant sur le serveur</b> (dossiers, webmail, plusieurs appareils). <b>TCP 143</b>.</li></ul>
<div class="figure"><svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<defs><marker id="ml" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#00bceb"/></marker></defs>
<rect x="10" y="60" width="100" height="44" rx="8" fill="#556"/><text x="60" y="80" fill="#fff" text-anchor="middle" font-weight="700">MUA</text><text x="60" y="96" fill="#fff" text-anchor="middle">expéditeur</text>
<rect x="170" y="60" width="110" height="44" rx="8" fill="#1f6fb2"/><text x="225" y="80" fill="#fff" text-anchor="middle" font-weight="700">MTA</text><text x="225" y="96" fill="#fff" text-anchor="middle">serveur du FAI</text>
<rect x="340" y="60" width="110" height="44" rx="8" fill="#1f6fb2"/><text x="395" y="80" fill="#fff" text-anchor="middle" font-weight="700">MTA</text><text x="395" y="96" fill="#fff" text-anchor="middle">du destinataire</text>
<rect x="500" y="60" width="90" height="44" rx="8" fill="#2e9e4f"/><text x="545" y="80" fill="#fff" text-anchor="middle" font-weight="700">MDA</text><text x="545" y="96" fill="#fff" text-anchor="middle">boîte aux lettres</text>
<rect x="630" y="60" width="80" height="44" rx="8" fill="#556"/><text x="670" y="80" fill="#fff" text-anchor="middle" font-weight="700">MUA</text><text x="670" y="96" fill="#fff" text-anchor="middle">destinataire</text>
<path d="M110 82 L166 82" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ml)"/><text x="138" y="52" fill="#6fd6f5" text-anchor="middle" font-weight="700">SMTP</text>
<path d="M280 82 L336 82" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ml)"/><text x="308" y="52" fill="#6fd6f5" text-anchor="middle" font-weight="700">SMTP</text>
<path d="M450 82 L496 82" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ml)"/>
<path d="M626 82 L594 82" stroke="#6cc04a" stroke-width="2.5" marker-end="url(#ml)"/><text x="610" y="52" fill="#6cc04a" text-anchor="middle" font-weight="700">POP / IMAP</text>
<text x="360" y="140" fill="#8a9bb3" text-anchor="middle">SMTP « pousse » le message jusqu’à la boîte ; POP/IMAP servent au destinataire à le « tirer ».</text>
</svg></div>
<table><tr><th>Sigle</th><th>Rôle</th></tr>
<tr><td><b>MUA</b> (Mail User Agent)</td><td>le <b>client</b> de messagerie (Outlook, Thunderbird…), source et cible du courrier</td></tr>
<tr><td><b>MTA</b> (Mail Transfer Agent)</td><td>le serveur qui <b>transfère</b> le courrier de proche en proche (SMTP)</td></tr>
<tr><td><b>MDA</b> (Mail Delivery Agent)</td><td>celui qui <b>délivre</b> dans la boîte du destinataire ; c’est la « poste restante »</td></tr></table>

<h3>2. SMTP : simple… et bavard</h3>
<p>SMTP privilégie la simplicité : on donne l’<b>expéditeur</b>, le(s) <b>destinataire(s)</b>, puis le <b>corps</b>. On peut le tester à la main avec <code>telnet smtp.imt.local 25</code> :</p>
<div class="demo dark">220 smtp.imt.local ESMTP Service ready
HELO pc0.imt.local                        ← je me présente (EHLO = SMTP étendu)
250 smtp.imt.local Hello pc0.imt.local
MAIL FROM:&lt;quentin@imt.local&gt;            ← l’expéditeur (enveloppe)
250 OK
RCPT TO:&lt;prof@imt.local&gt;                 ← un destinataire (répétable)
250 OK
DATA                                      ← le contenu arrive
354 Start mail input; end with &lt;CRLF&gt;.&lt;CRLF&gt;
Subject: Question sur le TP
                                          ← ligne vide entre en-têtes et corps
Bonjour, voici ma question...
.                                         ← un point SEUL sur sa ligne = fin
250 OK : message accepted for delivery
QUIT
221 smtp.imt.local Service closing transmission channel</div>
<p>Les 11 commandes : <b>HELO, EHLO, MAIL, RCPT, DATA</b>, RSET (annuler), VRFY (vérifier un usager), EXPN (développer une liste), NOOP (le serveur est vivant ?), <b>QUIT</b>, HELP.</p>
<h4>Les codes de réponse (3 chiffres)</h4>
<table><tr><th>1er chiffre</th><th>Signification</th><th>Exemples</th></tr>
<tr><td><b>2yz</b></td><td>positive <b>définitive</b> (c’est fait)</td><td>220 service prêt · 221 fermeture · 250 action OK</td></tr>
<tr><td><b>3yz</b></td><td>positive <b>intermédiaire</b> (j’attends la suite)</td><td><b>354</b> « envoie le message, termine par un point »</td></tr>
<tr><td><b>4yz</b></td><td>négative <b>transitoire</b> (réessaie plus tard)</td><td>421 service indisponible · 450 boîte occupée</td></tr>
<tr><td><b>5yz</b></td><td>négative <b>définitive</b> (inutile de réessayer)</td><td>500 commande inconnue · 503 mauvaise séquence · <b>550</b> boîte inexistante</td></tr></table>
<p>Le 2e chiffre donne la catégorie : x0z syntaxe, x1z information, x2z connexion, x5z état du serveur.</p>

<h3>3. Enveloppe, en-têtes, corps</h3>
<ul><li><b>L’enveloppe</b> (RFC 5321) : <code>MAIL FROM</code> et <code>RCPT TO</code>, utilisée par les MTA pour acheminer.</li>
<li><b>Les en-têtes</b> (RFC 5322), gérés par les MUA : <code>From:</code>, <code>To:</code>, <code>Cc:</code>, <code>Subject:</code>, <code>Date:</code>, <code>Message-ID:</code>… Seuls <b>Date</b> et l’origine (<b>From</b>) sont obligatoires.</li>
<li><b>Le corps</b> : des lignes de texte ASCII (998 caractères max, 78 conseillés).</li></ul>
<p><b>Cc</b> (copie carbone) : destinataires visibles de tous. <b>Cci</b> (copie cachée) : destinataires invisibles des autres. Le MUA n’envoie qu’<b>une</b> copie : c’est le MTA qui duplique.</p>

<h3>4. MIME et ESMTP</h3>
<ul><li><b>ESMTP</b> (SMTP étendu, 1993) : le client dit <code>EHLO</code> au lieu de HELO, le serveur liste ses extensions (SIZE, AUTH…).</li>
<li><b>MIME</b> (<i>Multipurpose Internet Mail Extensions</i>) permet d’envoyer autre chose que du texte (images, PDF…) en les <b>codant en ASCII</b>, typiquement en <b>base64</b>. En-têtes : <code>MIME-Version: 1.0</code>, <code>Content-Type: image/jpeg</code> (type/sous-type), <code>Content-Transfer-Encoding: base64</code>.</li>
<li>7 types de contenu : text, image, audio, video, application, <b>multipart</b> (mixed, alternative, parallel, digest — séparés par un <code>boundary</code>), message.</li></ul>

<h3>5. POP ou IMAP ?</h3>
<table><tr><th></th><th>POP3 (port 110)</th><th>IMAP4 (port 143)</th></tr>
<tr><td>Principe</td><td>on <b>télécharge</b> les messages sur le poste (« hors ligne »)</td><td>les messages <b>restent sur le serveur</b> (« en ligne »)</td></tr>
<tr><td>Dossiers</td><td>non</td><td>boîtes multiples, sous-dossiers, tri sur le serveur</td></tr>
<tr><td>Plusieurs appareils / webmail</td><td>peu adapté</td><td>idéal</td></tr>
<tr><td>Commandes</td><td>USER, PASS, STAT, LIST, RETR, DELE, QUIT (réponses <code>+OK</code> / <code>-ERR</code>)</td><td>—</td></tr></table>
<div class="tip"><b>✔ Vocabulaire :</b> courriel = e-mail (terme officiel en France depuis 2003) ; pourriel = spam.</div>
`,
  questions: [
    { id: 'm1', type: 'match', q: 'Associe chaque protocole à son rôle.', pairs: [['SMTP', 'Envoyer / transférer les messages'], ['POP3', 'Rapatrier les messages sur son poste'], ['IMAP4', 'Consulter les messages en les laissant sur le serveur']],
      hints: ['« Transfer » dans SMTP ; « Access » dans IMAP.'], explain: 'SMTP pousse, POP et IMAP tirent. POP télécharge, IMAP laisse sur le serveur.' },
    { id: 'm2', type: 'text', q: 'Ports TCP :', fields: [{ label: 'SMTP', kind: 'int', answer: 25 }, { label: 'POP3', kind: 'int', answer: 110 }, { label: 'IMAP', kind: 'int', answer: 143 }],
      hints: ['25, 110, 143 : à connaître par cœur.'], explain: 'SMTP 25, POP3 110, IMAP 143 (et leurs versions sécurisées : 465/587, 995, 993).' },
    { id: 'm3', type: 'match', q: 'Associe chaque agent à son rôle.', pairs: [['MUA', 'Le client de messagerie de l’utilisateur'], ['MTA', 'Le serveur qui transfère le courrier de proche en proche'], ['MDA', 'Celui qui délivre dans la boîte aux lettres du destinataire']],
      hints: ['User, Transfer, Delivery.'], explain: 'MUA = client, MTA = transfert (SMTP), MDA = livraison dans la boîte (la poste restante).' },
    { id: 'm4', type: 'order', q: 'Remets les commandes SMTP dans l’ordre pour envoyer un message.', items: ['HELO pc0.imt.local', 'MAIL FROM:<quentin@imt.local>', 'RCPT TO:<prof@imt.local>', 'DATA', '(le message, puis un point seul)', 'QUIT'],
      hints: ['On se présente, on dit qui envoie, à qui, puis quoi.'], explain: 'HELO → MAIL FROM → RCPT TO → DATA → « . » → QUIT.' },
    { id: 'm5', type: 'match', q: 'Que signifie chaque code de réponse SMTP ?', pairs: [['220', 'Service prêt'], ['250', 'Action demandée correcte et terminée'], ['354', 'Envoie le message, termine par <CRLF>.<CRLF>'], ['221', 'Le service ferme la connexion'], ['550', 'Boîte aux lettres indisponible (action non effectuée)'], ['503', 'Mauvaise séquence de commandes']],
      hints: ['3yz = « j’attends la suite » (il n’y en a qu’un ici).', '5yz = échec définitif.'], explain: '220 prêt, 250 OK, 354 go pour DATA, 221 au revoir, 550 boîte inconnue, 503 commandes dans le désordre.' },
    { id: 'm6', type: 'match', q: 'Que signifie le 1er chiffre d’une réponse SMTP ?', pairs: [['2yz', 'Positive définitive'], ['3yz', 'Positive intermédiaire'], ['4yz', 'Négative transitoire (réessayer plus tard)'], ['5yz', 'Négative définitive']],
      hints: ['4 = « pas maintenant », 5 = « jamais ».'], explain: 'Le client (automate) n’a besoin que des chiffres pour savoir où il en est.' },
    { id: 'm7', type: 'qcm', q: 'Comment indique-t-on la <b>fin</b> du contenu après la commande DATA ?', choices: ['Avec la commande END', 'Par une ligne contenant uniquement un point « . »', 'En fermant la connexion', 'Avec Ctrl+C'], good: 1,
      hints: ['C’est écrit dans la réponse 354.'], explain: 'La séquence <code>&lt;CRLF&gt;.&lt;CRLF&gt;</code> : un point seul sur une ligne.' },
    { id: 'm8', type: 'multi', q: 'Quels éléments font partie de l’<b>enveloppe</b> SMTP (utilisée par les MTA pour acheminer) ?', choices: ['MAIL FROM', 'RCPT TO', 'Subject:', 'Le corps du message', 'Date:'], good: [0, 1],
      hints: ['Les en-têtes (Subject, Date…) sont gérés par les MUA.'], explain: 'Enveloppe = MAIL FROM + RCPT TO (RFC 5321). Subject, Date… sont des <b>en-têtes</b> (RFC 5322), puis vient le corps.' },
    { id: 'm9', type: 'qcm', q: 'À quoi sert MIME ?', choices: ['À chiffrer les e-mails', 'À transporter des contenus non textuels (images, pièces jointes) en les codant en ASCII (ex. base64)', 'À remplacer SMTP', 'À trier les messages en dossiers'], good: 1,
      hints: ['Multipurpose Internet Mail Extensions.'], explain: 'MIME ne remplace pas SMTP : il code les données (base64…) et les décrit (Content-Type type/sous-type).' },
    { id: 'm10', type: 'qcm', q: 'Tu envoies un message à A, avec B en <b>Cci</b>. Que voit A ?', choices: ['Qu’il y a un destinataire en copie cachée, avec son adresse', 'Rien : A ne sait pas que B a reçu le message', 'L’adresse de B dans le champ Cc', 'Un message d’erreur'], good: 1,
      hints: ['Cci = copie carbone invisible.'], explain: 'Les destinataires en Cci restent anonymes : les autres ne savent même pas qu’ils ont reçu le message.' },
    { id: 'm11', type: 'qcm', q: 'Tu veux lire tes mails sur ton PC, ton téléphone et en webmail, avec les mêmes dossiers partout. Quel protocole ?', choices: ['POP3', 'IMAP4', 'SMTP', 'DHCP'], good: 1,
      hints: ['Il faut laisser les messages sur le serveur.'], explain: '<b>IMAP</b> : les messages et dossiers restent sur le serveur, tous les appareils voient la même chose.' },
    { id: 'm-term1', type: 'term', termTitle: 'Invite de commandes — PC0', tag: 'SMTP à la main',
      q: 'Envoie un e-mail « à la main » ! Ouvre une session <b>telnet</b> vers le serveur <b>smtp.imt.local</b> sur le port SMTP, présente-toi, puis envoie un message de <b>quentin@imt.local</b> à <b>prof@imt.local</b> avec l’objet de ton choix. Termine proprement la session.',
      init: { phase: 'shell' }, banner: ['Packet Tracer PC Command Line 1.0'],
      prompt: function (st) { return st.phase === 'shell' ? 'C:\\>' : ''; },
      script: smtpScript,
      goal: function (st) { return !!(st.lastMail && st.lastMail.from === 'quentin@imt.local' && st.lastMail.rcpt.indexOf('prof@imt.local') >= 0 && st.phase === 'shell'); },
      goalMsg: function (st) { if (st.lastMail && st.phase !== 'shell') return 'Message accepté ! Il reste à fermer proprement la session (QUIT).'; return 'Le message de quentin@imt.local à prof@imt.local n’a pas encore été accepté (code 250 après le point).'; },
      autoCheck: true,
      testLines: ['telnet smtp.imt.local 25', 'MAIL FROM:<quentin@imt.local>', 'HELO pc0.imt.local', 'MAIL FROM:<quentin@imt.local>', 'RCPT TO:<inconnu@imt.local>', 'RCPT TO:<prof@imt.local>', 'DATA', 'Subject: TP reseaux', '', 'Bonjour !', '.', 'QUIT'],
      hints: ['<code>telnet smtp.imt.local 25</code>, puis <code>HELO pc0.imt.local</code>.', '<code>MAIL FROM:&lt;quentin@imt.local&gt;</code>, <code>RCPT TO:&lt;prof@imt.local&gt;</code>, <code>DATA</code>.', 'Tape <code>Subject: …</code>, une ligne vide, ton texte, puis une ligne avec un point seul <code>.</code>, et enfin <code>QUIT</code>.'],
      answerHtml: '<pre>telnet smtp.imt.local 25\nHELO pc0.imt.local\nMAIL FROM:&lt;quentin@imt.local&gt;\nRCPT TO:&lt;prof@imt.local&gt;\nDATA\nSubject: TP reseaux\n\nBonjour !\n.\nQUIT</pre>',
      explain: 'Ton client de messagerie (MUA) fait exactement ça à chaque envoi. Remarque les codes : 220 (prêt), 250 (OK), 354 (vas-y), 250 (accepté), 221 (au revoir).' },
    { id: 'm-term2', type: 'term', termTitle: 'Invite de commandes — PC1', tag: 'POP3 à la main',
      q: 'Maintenant, relève la boîte de <b>quentin</b> en <b>POP3</b> (mot de passe <code>imt2026</code>) et <b>lis le message n°1</b> (celui du prof). Termine la session.',
      init: { phase: 'shell' }, banner: ['Packet Tracer PC Command Line 1.0'],
      prompt: function (st) { return st.phase === 'shell' ? 'C:\\>' : ''; },
      script: popScript,
      goal: function (st) { return !!st.read1 && st.phase === 'shell'; },
      goalMsg: function (st) { return st.read1 ? 'Message lu ! Ferme la session avec QUIT.' : 'Le message n°1 n’a pas encore été récupéré.'; },
      autoCheck: true,
      testLines: ['telnet pop.imt.local 110', 'USER quentin', 'PASS imt2026', 'LIST', 'RETR 1', 'QUIT'],
      hints: ['<code>telnet pop.imt.local 110</code>.', '<code>USER quentin</code> puis <code>PASS imt2026</code>.', '<code>LIST</code> pour voir les messages, <code>RETR 1</code> pour lire le premier, <code>QUIT</code>.'],
      answerHtml: '<pre>telnet pop.imt.local 110\nUSER quentin\nPASS imt2026\nLIST\nRETR 1\nQUIT</pre>',
      explain: 'POP3 répond par <code>+OK</code> ou <code>-ERR</code>. Les messages marqués par DELE ne sont supprimés qu’au QUIT.' },
    { id: 'm-lab', lvl: 4, type: 'pt', file: 'Messagerie-IMT.pkt', tag: 'Email',
      q: '<b>La messagerie de l’IMT dans Packet Tracer.</b> Le réseau et le DNS sont prêts : <code>mail.imt.local</code> pointe déjà vers <b>SRV-MAIL (192.168.1.3)</b>.<br>1) Sur SRV-MAIL (Services → EMAIL), fixe le domaine <b>imt.local</b> et crée deux comptes : <b>etudiant</b> (mot de passe <code>etu123</code>) et <b>prof</b> (<code>prof123</code>).<br>2) Configure le client Email de <b>PC-ETU</b> (etudiant@imt.local) et de <b>PC-PROF</b> (prof@imt.local), avec <code>mail.imt.local</code> comme serveur entrant et sortant.<br>3) Depuis PC-ETU, envoie un message à prof@imt.local, puis relève la boîte de PC-PROF.',
      build: function () {
        var n = LAB.make({
          devices: [['PC-ETU', 'PC-PT', 150, 110], ['PC-PROF', 'PC-PT', 150, 330], ['Switch0', '2960-24TT', 450, 220], ['SRV-DNS', 'Server-PT', 750, 110], ['SRV-MAIL', 'Server-PT', 750, 330]],
          links: [['PC-ETU', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'], ['PC-PROF', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'], ['SRV-DNS', 'FastEthernet0', 'Switch0', 'FastEthernet0/10', 'straight'], ['SRV-MAIL', 'FastEthernet0', 'Switch0', 'FastEthernet0/11', 'straight']],
          hosts: { 'PC-ETU': { ip: '192.168.1.20', mask: '255.255.255.0', dns: '192.168.1.2' }, 'PC-PROF': { ip: '192.168.1.21', mask: '255.255.255.0', dns: '192.168.1.2' }, 'SRV-DNS': { ip: '192.168.1.2', mask: '255.255.255.0', dns: '192.168.1.2' }, 'SRV-MAIL': { ip: '192.168.1.3', mask: '255.255.255.0', dns: '192.168.1.2' } },
          notes: [[120, 450, 'Réseau 192.168.1.0/24 — DNS 192.168.1.2 — mail.imt.local = 192.168.1.3']]
        });
        n.dev('SRV-DNS').services.dns = { on: true, records: [{ name: 'mail.imt.local', type: 'A', value: '192.168.1.3' }] };
        n.touch();
        return n;
      },
      tasks: [
        { label: 'SRV-MAIL gère le domaine imt.local', check: function (n) { return String(n.mailSvc(n.dev('SRV-MAIL')).domain).toLowerCase() === 'imt.local'; } },
        { label: 'Comptes etudiant (etu123) et prof (prof123) créés sur SRV-MAIL', check: function (n) { var u = n.mailSvc(n.dev('SRV-MAIL')).users; return [['etudiant', 'etu123'], ['prof', 'prof123']].every(function (x) { return u.some(function (y) { return y.name.toLowerCase() === x[0] && y.pw === x[1]; }); }); } },
        { label: 'Client Email de PC-ETU configuré (etudiant@imt.local, serveurs mail.imt.local)', check: function (n) { return clientOk(n, 'PC-ETU', 'etudiant@imt.local', 'etudiant', 'etu123', '192.168.1.3'); } },
        { label: 'Client Email de PC-PROF configuré (prof@imt.local, serveurs mail.imt.local)', check: function (n) { return clientOk(n, 'PC-PROF', 'prof@imt.local', 'prof', 'prof123', '192.168.1.3'); } },
        { label: 'PC-PROF a reçu le message de etudiant@imt.local', check: function (n) { return recu(n, 'PC-PROF', 'etudiant@imt.local'); } }
      ],
      hints: ['SRV-MAIL → Services → <b>EMAIL</b> : Domain Name <code>imt.local</code> → <b>Set</b>. Puis User <code>etudiant</code>, Password <code>etu123</code> → <b>+</b> ; même chose pour prof.', 'PC → Desktop → <b>Email</b> → Configure Mail : Your Name, Email Address, Incoming Mail Server et Outgoing Mail Server = <code>mail.imt.local</code>, User Name et Password du compte → Save.', 'PC-ETU : <b>Compose</b> → To : prof@imt.local → Send (« Send Success. »). PC-PROF : <b>Receive</b>.'],
      solution: [
        { text: 'SRV-MAIL → Services → EMAIL : Domain Name imt.local (Set), utilisateurs etudiant / etu123 et prof / prof123.',
          fn: function (n) { var es = n.mailSvc(n.dev('SRV-MAIL')); es.domain = 'imt.local'; es.users = [{ name: 'etudiant', pw: 'etu123' }, { name: 'prof', pw: 'prof123' }]; } },
        { text: 'PC-ETU → Email → Configure Mail : etudiant@imt.local, serveurs mail.imt.local, compte etudiant / etu123.',
          fn: function (n) { var c = n.mailCfg(n.dev('PC-ETU')); c.name = 'Etudiant'; c.addr = 'etudiant@imt.local'; c.inSrv = c.outSrv = 'mail.imt.local'; c.user = 'etudiant'; c.pw = 'etu123'; } },
        { text: 'PC-PROF → Email → Configure Mail : prof@imt.local, serveurs mail.imt.local, compte prof / prof123.',
          fn: function (n) { var c = n.mailCfg(n.dev('PC-PROF')); c.name = 'Prof'; c.addr = 'prof@imt.local'; c.inSrv = c.outSrv = 'mail.imt.local'; c.user = 'prof'; c.pw = 'prof123'; } },
        { text: 'PC-ETU : Compose → prof@imt.local → Send. PC-PROF : Receive.',
          fn: function (n) { n.mailSend(n.dev('PC-ETU'), 'prof@imt.local', 'Compte rendu du TP', 'Bonjour, voici mon compte rendu.'); n.mailReceive(n.dev('PC-PROF')); } }
      ],
      explain: 'Le message part de PC-ETU en <b>SMTP</b> (TCP 25) vers mail.imt.local, qui le dépose dans la boîte de prof car le domaine imt.local est le sien. PC-PROF le relève en <b>POP3</b> (TCP 110) avec son compte. Le DNS sert à trouver mail.imt.local : sans lui, le client affiche « Unknown Mail Server. »' }
  ]
  });
})();
