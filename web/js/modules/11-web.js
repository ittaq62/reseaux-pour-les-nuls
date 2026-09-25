(function () {
  /* Terminal : requête HTTP « à la main » par telnet sur le port 80 */
  var PAGE = ['<html><head><title>IMT</title></head>', '<body><h1>Bienvenue sur le serveur web de l’IMT</h1></body>', '</html>'];
  function httpScript(st, line) {
    var l = line.replace(/\s+$/, '');
    if (st.phase === 'shell') {
      var m = /^telnet\s+(\S+)\s+(\d+)$/i.exec(l.trim());
      if (!l.trim()) return { out: [] };
      if (/^telnet\s+\S+$/i.test(l.trim())) return { out: ['Trying 192.168.1.10 ...', '% Connection refused by remote host (port 23 : Telnet n’est pas actif sur ce serveur)', '(Astuce : précise le port du service web après le nom.)', ''] };
      if (!m) return { out: ['« ' + l.trim().split(/\s+/)[0] + ' » n’est pas reconnu comme commande interne. Tape : telnet www.imt.local 80', ''] };
      if (!/^(www\.imt\.local|192\.168\.1\.10)$/i.test(m[1])) return { out: ['Trying ...', '% Unknown host ' + m[1], ''] };
      if (m[2] !== '80') return { out: ['Trying 192.168.1.10 ...', '% Connection timed out; remote host not responding (rien n’écoute sur le port ' + m[2] + ')', ''] };
      st.phase = 'req'; st.lines = [];
      return { out: ['Trying 192.168.1.10 ...Open', '(Connexion TCP ouverte sur le port 80. Tape ta requête HTTP, puis une ligne VIDE pour l’envoyer.)'], state: st };
    }
    if (st.phase === 'req') {
      if (l === '') {
        if (!st.lines.length) return { out: [] };
        var first = st.lines[0].trim();
        var rq = /^(GET|HEAD|POST|PUT|DELETE|OPTIONS|TRACE|CONNECT)\s+(\S+)\s+HTTP\/(1\.[01])$/i.exec(first);
        var out = [];
        st.phase = 'shell';
        if (!rq) { out.push('HTTP/1.1 400 Bad Request', 'Connection: close', '', '[Connexion fermée par l’hôte distant]'); st.last = 400; return { out: out.concat(['']), state: st }; }
        var method = rq[1].toUpperCase(), path = rq[2];
        var hostHdr = st.lines.slice(1).some(function (h) { return /^host\s*:\s*\S+/i.test(h.trim()); });
        if (rq[3] === '1.1' && !hostHdr) { out.push('HTTP/1.1 400 Bad Request', 'Connection: close', '', '(En HTTP/1.1, l’en-tête « Host: » est obligatoire.)', '[Connexion fermée par l’hôte distant]', ''); st.last = 400; return { out: out, state: st }; }
        if (method !== 'GET' && method !== 'HEAD') { out.push('HTTP/1.1 405 Method Not Allowed', 'Allow: GET, HEAD', 'Connection: close', '', '[Connexion fermée par l’hôte distant]', ''); st.last = 405; return { out: out, state: st }; }
        if (path !== '/' && path !== '/index.html') { out.push('HTTP/1.1 404 Not Found', 'Server: PT-Server', 'Content-Type: text/html', 'Connection: close', '', '<html><body>404 - Not Found</body></html>', '[Connexion fermée par l’hôte distant]', ''); st.last = 404; return { out: out, state: st }; }
        out.push('HTTP/1.1 200 OK', 'Server: PT-Server', 'Content-Type: text/html', 'Content-Length: 118', 'Connection: close', '');
        if (method === 'GET') out = out.concat(PAGE);
        out.push('[Connexion fermée par l’hôte distant]', '');
        st.last = 200; st.method = method;
        return { out: out, state: st };
      }
      st.lines.push(l);
      return { out: [], state: st };
    }
    return { out: [] };
  }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'web', num: 11, icon: '🌍', titre: 'Le Web : HTTP et HTTPS',
  sous: 'Hypertexte, HTML, méthodes, codes de statut, URL',
  source: 'web.pdf (ENI : HTTP et WWW)',
  cours: `
<h3>1. Hypertexte et World Wide Web</h3>
<p>Un texte « hyper » contient des <b>liens</b> vers d’autres documents : on navigue de fragment en fragment au lieu de lire du début à la fin. Avec les images, sons et vidéos, on parle d’<b>hypermédia</b>. Le <b>World Wide Web</b> (la « toile ») est l’ensemble des serveurs qui fournissent ces documents à la demande des clients (les <b>navigateurs</b>).</p>
<ul><li>Le <b>W3C</b> (World Wide Web Consortium, fondé en 1995) fait évoluer les langages et protocoles du Web.</li>
<li><b>HTML</b> (<i>HyperText Markup Language</i>) décrit la structure d’une page avec des <b>balises</b> : une ligne de version, une section <code>&lt;HEAD&gt;</code> (déclarations, titre) et le corps <code>&lt;BODY&gt;</code>.</li>
<li><b>HTTP</b> (<i>HyperText Transfer Protocol</i>) transporte ces documents entre client et serveur. Couche <b>Application</b>, au-dessus de <b>TCP port 80</b>.</li></ul>
<div class="nul"><b>🧠 L’analogie du restaurant :</b> le navigateur est le client qui passe commande (<b>requête</b> : « GET /menu.html »), le serveur web est… le serveur, qui revient avec le plat et un petit mot (<b>code de statut</b> : 200 « voilà », 404 « on n’a pas ça », 500 « la cuisine a pris feu »).</div>

<h3>2. Une requête et une réponse HTTP</h3>
<div class="demo dark">GET /index.html HTTP/1.1          ← méthode, ressource, version
Host: www.imt.local               ← en-tête obligatoire en HTTP/1.1
                                  ← ligne vide = fin de la requête

HTTP/1.1 200 OK                   ← version, code de statut, message
Content-Type: text/html
Content-Length: 118

&lt;html&gt;…&lt;/html&gt;                     ← le corps : la page</div>
<h4>Les méthodes</h4>
<table><tr><th>Méthode</th><th>Rôle</th></tr>
<tr><td><b>GET</b></td><td>obtenir une ressource (la plus courante, ne la modifie pas)</td></tr>
<tr><td><b>HEAD</b></td><td>obtenir seulement les informations (en-têtes) sur la ressource</td></tr>
<tr><td><b>POST</b></td><td>envoyer des données (message de forum, formulaire…)</td></tr>
<tr><td><b>PUT</b></td><td>remplacer ou ajouter une ressource sur le serveur</td></tr>
<tr><td><b>DELETE</b></td><td>supprimer une ressource (PUT et DELETE demandent un accès privilégié)</td></tr>
<tr><td>OPTIONS / TRACE / CONNECT</td><td>options du serveur / écho de test / tunnel via un proxy</td></tr></table>
<h4>Les codes de statut</h4>
<table><tr><th>Famille</th><th>Sens</th><th>Codes à connaître</th></tr>
<tr><td><b>1xx</b></td><td>Information</td><td>—</td></tr>
<tr><td><b>2xx</b></td><td>Succès</td><td><b>200 OK</b></td></tr>
<tr><td><b>3xx</b></td><td>Redirection</td><td><b>301</b> déplacé définitivement, <b>302</b> temporairement, <b>304</b> non modifié (utilise ton cache)</td></tr>
<tr><td><b>4xx</b></td><td>Erreur du <b>client</b></td><td><b>404 Not Found</b> (et 400 requête mal formée, 403 interdit)</td></tr>
<tr><td><b>5xx</b></td><td>Erreur du <b>serveur</b></td><td><b>500 Internal Server Error</b></td></tr></table>

<h3>3. Les versions de HTTP</h3>
<table><tr><th>Version</th><th>Nouveautés</th></tr>
<tr><td><b>0.9</b> (Tim Berners-Lee)</td><td>une seule méthode : <b>GET</b> ; le serveur ferme la connexion TCP après chaque réponse</td></tr>
<tr><td><b>1.0</b> (RFC 1945)</td><td>GET, HEAD, POST ; typage des documents (inspiré de MIME) ; toujours une connexion par requête</td></tr>
<tr><td><b>1.1</b> (RFC 2616)</td><td><b>connexions persistantes</b> (<i>keep-alive</i>) et <b>pipelining</b> (plusieurs requêtes sans attendre les réponses) ; en-tête Host obligatoire</td></tr></table>

<h3>4. HTTPS</h3>
<p>En HTTP, tout circule <b>en clair</b>. <b>HTTPS</b> = HTTP au-dessus de <b>SSL/TLS</b> (SSL créé par Netscape, renommé <b>TLS</b> par l’IETF). Port <b>443</b>. SSL/TLS apporte :</p>
<ul><li>l’<b>authentification du serveur</b> (certificat délivré par une <b>autorité de certification</b>, CA) ;</li><li>la <b>confidentialité</b> (chiffrement) ;</li><li>l’<b>intégrité</b> des données ;</li><li>optionnellement, l’authentification du client.</li></ul>
<p>Dans le modèle OSI, SSL/TLS joue le rôle des couches <b>Session et Présentation</b>, entre HTTP et TCP.</p>

<h3>5. URL, URN, URI</h3>
<p>L’<b>URI</b> englobe les <b>URL</b> (qui <b>localisent</b> une ressource) et les <b>URN</b> (qui la <b>nomment</b>, ex. <code>urn:isbn:2-7460-2140-4</code>, sans dire où la trouver). Une URL se lit de gauche à droite :</p>
<div class="demo">  http    ://   www.eni.fr   :80   /index.htm
protocole       localisation  port  ressource</div>
<div class="tip"><b>🖥️ Dans Packet Tracer</b> : serveur → Services → <b>HTTP</b> (On/Off, édition des pages comme index.html) ; PC → Desktop → <b>Web Browser</b>. Dans le TP NAT/PAT, on accède même à un serveur par <code>http://adresse:8000</code> (port non standard).</div>
`,
  questions: [
    { id: 'w1', type: 'match', q: 'Associe chaque sigle à sa définition.', pairs: [['HTML', 'Langage de description de pages à balises'], ['HTTP', 'Protocole de transfert des documents web'], ['W3C', 'Consortium qui fait évoluer le Web'], ['URL', 'Adresse qui localise une ressource']],
      hints: ['« Markup » = balisage ; « Transfer » = transfert.'], explain: 'HTML décrit, HTTP transporte, le W3C normalise, l’URL localise.' },
    { id: 'w2', type: 'text', q: 'Ports bien connus :', fields: [{ label: 'HTTP', kind: 'int', answer: 80 }, { label: 'HTTPS', kind: 'int', answer: 443 }],
      hints: ['L’IANA a attribué 443 au serveur SSL.'], explain: 'HTTP : TCP <b>80</b> ; HTTPS : TCP <b>443</b>.' },
    { id: 'w3', type: 'match', q: 'Associe chaque méthode HTTP à son rôle.', pairs: [['GET', 'Obtenir une ressource sans la modifier'], ['HEAD', 'Obtenir seulement les informations sur la ressource'], ['POST', 'Envoyer des données (formulaire, message)'], ['PUT', 'Remplacer ou ajouter une ressource sur le serveur'], ['DELETE', 'Supprimer une ressource du serveur']],
      hints: ['HEAD = « la tête » (les en-têtes) sans le corps.'], explain: 'GET lit, HEAD lit les en-têtes, POST envoie, PUT dépose, DELETE supprime.' },
    { id: 'w4', type: 'match', q: 'Que signifie chaque code de statut ?', pairs: [['200', 'OK : requête traitée avec succès'], ['301', 'Document déplacé définitivement'], ['304', 'Non modifié depuis la dernière requête'], ['404', 'Document non trouvé'], ['500', 'Erreur interne du serveur']],
      hints: ['2xx succès, 3xx redirection, 4xx erreur client, 5xx erreur serveur.'], explain: 'À connaître pour le DS : 200, 301, 302, 304, 404, 500.' },
    { id: 'w5', type: 'qcm', q: 'Un code de statut qui commence par <b>4</b> indique…', choices: ['Une information', 'Un succès', 'Une redirection', 'Une erreur du client', 'Une erreur du serveur'], good: 3,
      hints: ['404 : c’est le client qui a demandé une page qui n’existe pas.'], explain: '4xx = erreur du <b>client</b> (mauvaise URL, accès interdit…). 5xx = le serveur a un problème.' },
    { id: 'w6', type: 'qcm', q: 'Quelle est la grande nouveauté de HTTP/1.1 par rapport à 1.0 ?', choices: ['Le passage à UDP', 'Les connexions persistantes (keep-alive) et le pipelining', 'La méthode GET', 'Le chiffrement obligatoire'], good: 1,
      hints: ['Avant, on ouvrait et fermait une connexion TCP pour chaque image de la page…'], explain: 'HTTP/1.1 garde la connexion TCP ouverte (keep-alive) et permet d’envoyer plusieurs requêtes à la suite (pipelining).' },
    { id: 'w7', type: 'multi', q: 'Quelles garanties apporte SSL/TLS (HTTPS) ?', choices: ['Authentification du serveur', 'Confidentialité (chiffrement)', 'Intégrité des données', 'Accélération du chargement', 'Adresse IP publique gratuite'], good: [0, 1, 2],
      hints: ['On voit un cadenas dans le navigateur…'], explain: 'Authentification du serveur (certificat d’une CA), confidentialité, intégrité (+ authentification du client en option).' },
    { id: 'w8', type: 'qcm', q: 'À quelles couches OSI correspond le travail de SSL/TLS d’après ton cours ?', choices: ['Physique et Liaison', 'Réseau', 'Session et Présentation', 'Transport uniquement'], good: 2,
      hints: ['Il se place entre HTTP (application) et TCP (transport).'], explain: 'Couches <b>Session et Présentation</b> : HTTPS = HTTP au-dessus de SSL, lui-même au-dessus de TCP (port 443).' },
    { id: 'w9', type: 'text', q: 'Dans l’URL <code>ftp://ftp.eni.fr/ccna.pdf</code>, quel est…', fields: [{ label: 'le protocole ?', kind: 'word', answer: ['ftp'] }, { label: 'la localisation (le serveur) ?', kind: 'text', answer: ['ftp.eni.fr'] }, { label: 'la ressource ?', kind: 'text', answer: ['ccna.pdf', '/ccna.pdf'] }],
      hints: ['De gauche à droite : comment, où, quoi.'], explain: 'Protocole <b>ftp</b>, localisation <b>ftp.eni.fr</b> (le 2e « ftp » est juste le nom du serveur), ressource <b>ccna.pdf</b>.' },
    { id: 'w10', type: 'qcm', q: '<code>urn:isbn:2-7460-2140-4</code> est…', choices: ['Une URL', 'Un URN : il nomme une ressource (un livre) sans dire où la trouver', 'Une adresse IPv6', 'Un nom de domaine'], good: 1,
      hints: ['« N » comme Name.'], explain: 'URN = nom dans un espace de noms (ici ISBN). URL = localisation. Les deux sont des URI.' },
    { id: 'w-term', type: 'term', termTitle: 'Invite de commandes — PC0', tag: 'HTTP à la main',
      q: 'Parle HTTP « à la main » ! Depuis PC0, ouvre une connexion TCP vers le serveur web <b>www.imt.local</b> sur le <b>port 80</b> avec <code>telnet</code>, puis tape une requête <b>GET</b> pour <code>/index.html</code> en <b>HTTP/1.1</b> (n’oublie pas l’en-tête obligatoire), et termine par une <b>ligne vide</b>. Objectif : obtenir un <b>200 OK</b>.',
      init: { phase: 'shell', lines: [], last: null },
      banner: ['Packet Tracer PC Command Line 1.0'],
      prompt: function (st) { return st.phase === 'req' ? '' : 'C:\\>'; },
      script: httpScript,
      goal: function (st) { return st.last === 200 && st.method === 'GET'; },
      goalMsg: function (st) { return st.last ? 'Le serveur a répondu ' + st.last + ' : ce n’est pas encore un 200 OK avec la page.' : 'Pas encore de réponse 200 OK.'; },
      autoCheck: true,
      testLines: ['telnet www.imt.local', 'telnet www.imt.local 80', 'GET /index.html HTTP/1.1', '', 'telnet www.imt.local 80', 'GET /index.html HTTP/1.1', 'Host: www.imt.local', ''],
      hints: ['1re commande : <code>telnet www.imt.local 80</code>.', 'Puis tape : <code>GET /index.html HTTP/1.1</code> (Entrée), <code>Host: www.imt.local</code> (Entrée), et appuie encore sur Entrée (ligne vide).', 'En HTTP/1.1 sans « Host: », le serveur répond 400 Bad Request.'],
      answerHtml: '<pre>C:\\&gt;telnet www.imt.local 80\nGET /index.html HTTP/1.1\nHost: www.imt.local\n(ligne vide)</pre>',
      explain: 'C’est exactement ce que fait ton navigateur à chaque clic : ouvrir une connexion TCP sur le port 80, envoyer la requête, recevoir le code de statut, les en-têtes puis la page.' },
    { id: 'w-lab', lvl: 4, type: 'pt', file: 'Site-en-panne.pkt', tag: 'Dépannage web',
      q: '<b>Le site de l’IMT ne répond plus.</b> Le site <b>www.imt.local</b> est hébergé sur <b>SRV-WEB (192.168.1.10)</b> et doit être accessible en <code>http://</code> <b>et</b> en <code>https://</code>. Le DNS de l’entreprise est SRV-DNS (192.168.1.2). Le réseau et le routage fonctionnent : <code>ping 192.168.1.10</code> répond depuis les PC. <b>Trois erreurs</b> se cachent dans les <b>services</b> des serveurs. Répare-les, puis vérifie avec le navigateur de PC0 (Desktop → Web Browser).',
      build: function () {
        var n = LAB.make({
          devices: [['PC0', 'PC-PT', 100, 110], ['PC1', 'PC-PT', 100, 330], ['Switch-C', '2960-24TT', 300, 220], ['R1', '1941', 520, 220], ['Switch-S', '2960-24TT', 740, 220], ['SRV-DNS', 'Server-PT', 940, 110], ['SRV-WEB', 'Server-PT', 940, 330]],
          links: [['PC0', 'FastEthernet0', 'Switch-C', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch-C', 'FastEthernet0/2', 'straight'], ['Switch-C', 'GigabitEthernet0/1', 'R1', 'GigabitEthernet0/0', 'straight'], ['R1', 'GigabitEthernet0/1', 'Switch-S', 'GigabitEthernet0/1', 'straight'], ['SRV-DNS', 'FastEthernet0', 'Switch-S', 'FastEthernet0/1', 'straight'], ['SRV-WEB', 'FastEthernet0', 'Switch-S', 'FastEthernet0/2', 'straight']],
          cli: { R1: ['conf t', 'hostname R1', 'interface g0/0', 'ip address 192.168.10.254 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.1.254 255.255.255.0', 'no shutdown', 'end'] },
          hosts: { PC0: { ip: '192.168.10.20', mask: '255.255.255.0', gw: '192.168.10.254', dns: '192.168.1.2' }, PC1: { ip: '192.168.10.21', mask: '255.255.255.0', gw: '192.168.10.254', dns: '192.168.1.2' }, 'SRV-DNS': { ip: '192.168.1.2', mask: '255.255.255.0', gw: '192.168.1.254' }, 'SRV-WEB': { ip: '192.168.1.10', mask: '255.255.255.0', gw: '192.168.1.254' } },
          notes: [[80, 450, 'Clients 192.168.10.0/24 · Serveurs 192.168.1.0/24 · DNS 192.168.1.2 · Web 192.168.1.10']]
        });
        n.dev('SRV-DNS').services.dns = { on: true, records: [{ name: 'www.imt.local', type: 'A', value: '192.168.1.100' }] };
        n.dev('SRV-WEB').services.http.on = false;
        n.dev('SRV-WEB').services.http.https = false;
        n.touch();
        return n;
      },
      tasks: [
        { label: 'www.imt.local est résolu vers le serveur web (192.168.1.10)', check: function (n) { var r = n.dnsResolve(n.dev('PC0'), 'www.imt.local'); return r.ok && r.ip === NET.ip2int('192.168.1.10'); } },
        { label: 'PC0 ouvre http://www.imt.local', check: function (n) { return n.httpGet(n.dev('PC0'), 'http://www.imt.local').ok; } },
        { label: 'PC0 ouvre https://www.imt.local', check: function (n) { return n.httpGet(n.dev('PC0'), 'https://www.imt.local').ok; } },
        { label: 'PC1 ouvre aussi le site en http et en https', check: function (n) { return n.httpGet(n.dev('PC1'), 'http://www.imt.local').ok && n.httpGet(n.dev('PC1'), 'https://www.imt.local').ok; } }
      ],
      hints: ['Commence par <code>nslookup www.imt.local</code> sur PC0 : l’adresse obtenue est-elle celle du serveur web ?', 'Le navigateur affiche « Request Timeout » alors que le nom est bien résolu : le serveur ne répond pas sur le port 80. Regarde SRV-WEB → Services → HTTP.', 'Sur SRV-WEB → Services → HTTP, il y a deux interrupteurs : HTTP <b>et</b> HTTPS. Sur SRV-DNS → Services → DNS, corrige l’adresse de www.imt.local (192.168.1.10).'],
      solution: [
        { text: 'SRV-DNS → Services → DNS : l’enregistrement A de <code>www.imt.local</code> doit pointer vers 192.168.1.10 (et non 192.168.1.100).',
          fn: function (n) { n.dev('SRV-DNS').services.dns.records = [{ name: 'www.imt.local', type: 'A', value: '192.168.1.10' }]; } },
        { text: 'SRV-WEB → Services → HTTP : HTTP <b>On</b>.', fn: function (n) { n.dev('SRV-WEB').services.http.on = true; } },
        { text: 'SRV-WEB → Services → HTTP : HTTPS <b>On</b>.', fn: function (n) { n.dev('SRV-WEB').services.http.https = true; } }
      ],
      explain: 'Trois pannes de services : (1) le DNS donnait 192.168.1.100 au lieu de 192.168.1.10 : le nom se résout, mais vers une machine qui n’existe pas ; (2) le service HTTP était éteint (port 80 fermé) ; (3) le service HTTPS aussi (port 443). Dans les deux derniers cas, le navigateur affiche « Request Timeout » : un nom résolu et un ping qui répond ne garantissent pas que le <b>service</b> tourne.' }
  ]
  });
})();
