(function () {
  /* Contrôleur SDN simulé (PT-Controller0 du LAB SDN, maquette SDN_Version_LAB_1) */
  var DEVICES = [
    ['R1', 'ISR4331', '192.168.101.1', 'Router', '16.6.4'], ['R2', 'ISR4331', '192.168.2.2', 'Router', '16.6.4'], ['R3', 'ISR4331', '192.168.1.1', 'Router', '16.6.4'],
    ['SWL1', '3650-24PS', '192.168.101.2', 'Switches and Hubs', '16.3.2'], ['SWL2', '3650-24PS', '192.168.102.2', 'Switches and Hubs', '16.3.2'],
    ['SWR1', '3650-24PS', '10.0.1.2', 'Switches and Hubs', '16.3.2'], ['SWR2', '3650-24PS', '10.0.1.3', 'Switches and Hubs', '16.3.2'],
    ['SWR3', '3650-24PS', '10.0.1.4', 'Switches and Hubs', '16.3.2'], ['SWR4', '3650-24PS', '10.0.1.5', 'Switches and Hubs', '16.3.2']
  ];
  var HOSTS = [
    ['Admin', '10.0.1.129', '000B.BE16.D6BA', 'GigabitEthernet1/0/21', '10.0.1.4'], ['PC1', '10.0.1.130', '0001.9747.D29B', 'GigabitEthernet1/0/22', '10.0.1.4'],
    ['PC2', '10.0.2.129', '0060.700B.2BC5', 'GigabitEthernet1/0/23', '10.0.1.5'], ['PC3', '10.0.2.130', '0050.0F6E.234D', 'GigabitEthernet1/0/24', '10.0.1.5'],
    ['PC4', '192.168.102.3', '0001.435B.5044', 'GigabitEthernet1/0/24', '192.168.102.2']
  ];
  function hex(seed, n) { var s = seed >>> 0, o = ''; for (var i = 0; i < n; i++) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; o += ((s >>> 24) & 15).toString(16); } return o; }
  function err(code, text, detail, ec, msg) { return { code: code, text: text, body: { response: { detail: detail, errorCode: ec, message: msg }, version: '1.0' } }; }
  function sdnApi(method, url, h, body, st) {
    var m = /^\s*(?:https?:\/\/)?([^\/:\s]+)(?::(\d+))?(\/[^\s?]*)?/i.exec(url || '');
    if (!m) return { code: 400, text: 'Bad Request', body: 'URL invalide' };
    var host = m[1].toLowerCase(), port = m[2] || '80', path = (m[3] || '/').replace(/\/+$/, '');
    if (!/^(localhost|127\.0\.0\.1)$/.test(host) || port !== '58000') return { code: 503, text: 'Could not get response', body: 'Error: connect ECONNREFUSED ' + host + ':' + port + '\n\n(Le contrôleur écoute sur localhost, port 58000 — voir « Access Enabled » dans PT-Controller0 > Config > Controller.)' };
    var res = /^\/api\/v1\/([\w\-\/]+)$/.exec(path);
    if (!res) return err(404, 'Not Found', 'Resource not found', 'NOT_FOUND', 'The URI ' + path + ' does not match any API.');
    var r = res[1];
    if (r === 'ticket') {
      if (method !== 'POST') return err(405, 'Method Not Allowed', 'Method not allowed', 'METHOD_NOT_ALLOWED', 'Use POST to request a service ticket.');
      var j; try { j = JSON.parse(body || ''); } catch (e) { return err(400, 'Bad Request', 'Invalid request body', 'INVALID_JSON', 'The body must be valid JSON: {"username": "...", "password": "..."}'); }
      if (!j || j.username !== 'cisco' || j.password !== 'cisco123!') return err(401, 'Unauthorized', 'Security Authentication Failure', 'INVALID_CREDENTIALS', 'Invalid username or password.');
      st.n = (st.n || 88) + 1;
      st.ticket = 'NC-' + st.n + '-' + hex(st.n * 7919, 20) + '-nbi';
      st.gotTicket = true;
      return { code: 201, text: 'Created', body: { response: { idleTimeout: 900, serviceTicket: st.ticket, sessionTimeout: 3600 }, version: '1.0' } };
    }
    var known = ['network-device', 'network-device/count', 'host', 'host/count'];
    if (known.indexOf(r) < 0) return err(404, 'Not Found', 'Resource not found', 'NOT_FOUND', 'The URI ' + path + ' does not match any API.');
    if (method !== 'GET') return err(405, 'Method Not Allowed', 'Method not allowed', 'METHOD_NOT_ALLOWED', 'Only GET is supported on /' + r + '.');
    var tok = h['x-auth-token'];
    if (!tok) return err(401, 'Unauthorized', 'Security Authentication Failure', 'REST_API_EXTERNAL_ACCESS', 'Ticket-based authorization: empty ticket.');
    if (!/^NC-\d+-[0-9a-f]{20}-nbi$/.test(tok)) return err(401, 'Unauthorized', 'Security Authentication Failure', 'REST_API_EXTERNAL_ACCESS', 'Ticket-based authorization: invalid ticket.');
    st.used = st.used || {}; st.used[r] = true;
    if (r === 'network-device/count') return { code: 200, text: 'OK', body: { response: DEVICES.length, version: '1.0' } };
    if (r === 'host/count') return { code: 200, text: 'OK', body: { response: HOSTS.length, version: '1.0' } };
    if (r === 'network-device') return { code: 200, text: 'OK', body: { response: DEVICES.map(function (d, i) {
      return { collectionStatus: 'Managed', connectedInterfaceName: [], errorDescription: '', globalCredentialId: 'CL-1', hostname: d[0], id: 'CAT' + (1000 + i * 37), interfaceCount: d[3] === 'Router' ? '4' : '28', lastUpdateTime: '1 min ago', macAddress: '', managementIpAddress: d[2], platformId: d[1], productId: d[1], reachabilityStatus: 'Reachable', softwareVersion: d[4], type: d[3], upTime: '2 hours, 14 minutes' };
    }), version: '1.0' } };
    return { code: 200, text: 'OK', body: { response: HOSTS.map(function (x, i) {
      return { connectedAPMacAddress: '', connectedAPName: '', connectedInterfaceName: x[3], connectedNetworkDeviceIpAddress: x[4], connectedNetworkDeviceName: HOSTS[i][4] === '192.168.102.2' ? 'SWL2' : (x[4] === '10.0.1.4' ? 'SWR3' : 'SWR4'), hostIp: x[1], hostMac: x[2], hostName: x[0], hostType: 'Pc', id: 'HOST' + (200 + i), lastUpdated: '1 min ago', pingStatus: 'SUCCESS', vlanId: '1' };
    }), version: '1.0' } };
  }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'sdn', num: 17, icon: '🎛️', titre: 'SDN et API REST',
  sous: 'Contrôleur réseau, API REST, jeton, Postman, JSON',
  source: 'LAB_SDN_v1.0.pdf (reseaucerta, maquette SDN_Version_LAB_1.pkt), annexe A',
  cours: `
<h3>1. CLI ou contrôleur ?</h3>
<p>Traditionnellement, chaque équipement est configuré <b>un par un</b> en <b>CLI</b> ; les équipements convergent entre eux (ARP, STP, OSPF…) mais <b>personne n’a une vue d’ensemble</b>. Récolter une info (ex. la version d’IOS de 9 équipements) = 9 connexions SSH et 9 <code>show version | include RELEASE</code>…</p>
<p>Le <b>SDN</b> (<i>Software Defined Networking</i>, réseau défini par logiciel) place au cœur du réseau un <b>contrôleur central</b> (physique ou VM) qui a une <b>vision globale</b> et configure les équipements de façon <b>centralisée</b>. Le protocole <b>OpenFlow</b> (défini par l’<b>ONF</b>, Open Networking Foundation) permet au contrôleur d’injecter des règles dans les switchs et routeurs.</p>
<div class="nul"><b>🧠 L’analogie du chef d’orchestre :</b> sans SDN, chaque musicien (équipement) lit sa propre partition et écoute ses voisins. Avec SDN, un chef d’orchestre (le contrôleur) voit toute la scène et donne les consignes à tout le monde d’un seul geste (<b>PUSH CONFIG</b>).</div>
<table><tr><th>CLI « à l’ancienne »</th><th>Contrôleur SDN</th></tr>
<tr><td>équipement par équipement, long et répétitif</td><td>centralisé, un clic pour tous les équipements</td></tr>
<tr><td>risque d’erreurs de frappe, d’oublis, d’incohérences</td><td>configuration homogène, moins d’erreurs</td></tr>
<tr><td>pas de vue globale</td><td>topologie découverte automatiquement (<b>CDP</b>), inventaire, path trace</td></tr>
<tr><td>scripts maison (bash, SNMP)</td><td><b>API REST</b> exploitable par programme (Python, Postman)</td></tr></table>
<p>Dans le LAB : le contrôleur <b>PT-Controller0</b> (192.168.101.254, accès externe sur <b>http://localhost:58000</b>) découvre les <b>9 équipements</b> (R1-R3, SWL1-2, SWR1-4) par CDP à partir de SWL1 (192.168.101.2), puis pousse une stratégie globale : <b>DNS</b> (example.com, 192.168.101.100), <b>NTP</b> et <b>Syslog</b> (192.168.101.100). Vérification en CLI : <code>show run | begin ip domain</code>, <code>show ntp associations</code>, <code>show run | include logging</code>.</p>

<h3>2. L’API REST</h3>
<p>Une <b>API REST</b> utilise les messages <b>HTTP</b> pour demander ou modifier des <b>objets</b> du contrôleur (pas des pages web). Les réponses sont au format <b>JSON</b> (ou XML).</p>
<table><tr><th>HTTP</th><th>Équivalent SQL</th><th>Action</th></tr>
<tr><td><b>GET</b></td><td>SELECT</td><td>lire une information</td></tr><tr><td><b>POST</b></td><td>INSERT</td><td>écrire / créer</td></tr>
<tr><td><b>PUT</b></td><td>UPDATE</td><td>mettre à jour</td></tr><tr><td><b>DELETE</b></td><td>DELETE</td><td>supprimer</td></tr></table>
<table><tr><th>Code</th><th>Sens</th></tr>
<tr><td><b>200 OK</b></td><td>requête traitée avec succès</td></tr><tr><td><b>201 Created</b></td><td>une ressource a été <b>créée</b> (ex. le ticket)</td></tr>
<tr><td>204 No Content</td><td>succès sans contenu (après un DELETE)</td></tr><tr><td>400 Bad Request</td><td>requête invalide (JSON mal formé…)</td></tr>
<tr><td><b>401 Unauthorized</b></td><td>il faut s’identifier (ticket manquant ou invalide)</td></tr><tr><td>403 Forbidden</td><td>identifié mais pas autorisé</td></tr>
<tr><td>404 Not Found</td><td>la ressource n’existe pas</td></tr><tr><td>500 Internal Server Error</td><td>erreur du serveur</td></tr></table>
<h4>Le jeton (ticket)</h4>
<ol><li><b>POST</b> <code>http://localhost:58000/api/v1/ticket</code> avec le corps JSON <code>{"username": "cisco", "password": "cisco123!"}</code> → réponse <b>201</b> contenant un <code>serviceTicket</code> (valable 900 s d’inactivité, 3600 s au total).</li>
<li>Chaque requête suivante ajoute l’en-tête <b><code>X-Auth-Token: &lt;ticket&gt;</code></b>.</li>
<li><b>GET</b> <code>/api/v1/network-device</code> (les équipements) ou <code>/api/v1/host</code> (les hôtes) → <b>200</b> + JSON.</li></ol>
<p>Avantages du jeton : on ne renvoie pas le mot de passe à chaque requête, il est <b>limité dans le temps</b> et peut être révoqué.</p>
<div class="demo">import json, requests
api_url = "http://localhost:58000/api/v1/network-device"
headers = {"X-Auth-Token": "NC-99-3808c9f9875e41529ff0-nbi"}      # ton ticket
resp = requests.get(api_url, headers=headers, verify=False)
print("Request status: ", resp.status_code)
for d in resp.json()["response"]:
    print(d["hostname"], "\\t", d["platformId"], "\\t", d["managementIpAddress"])</div>
<div class="tip"><b>✔ Dans le LAB</b>, Postman sert à <b>tester</b> l’API, Python à l’<b>exploiter</b> (n’afficher que les clés utiles, faire un inventaire, un tableau, une supervision…). Depuis l’onglet Programming d’un PC de Packet Tracer, on remplace localhost:58000 par l’IP du contrôleur (192.168.101.254).</div>
`,
  questions: [
    { id: 'sd1', type: 'qcm', q: 'Que signifie SDN ?', choices: ['Secure Domain Name', 'Software Defined Networking : un contrôleur central pilote le réseau', 'Switched Data Network', 'Standard DNS'], good: 1,
      hints: ['« Réseau défini par logiciel ».'], explain: 'SDN = Software Defined Networking : configuration centralisée par un contrôleur, accessible par API.' },
    { id: 'sd2', type: 'multi', q: 'Quels sont les avantages d’un contrôleur SDN par rapport à la CLI équipement par équipement ?', choices: ['Vision globale et centralisée du réseau', 'Configuration poussée d’un coup sur tous les équipements', 'Moins d’erreurs de saisie et de configurations incohérentes', 'Automatisation par API (Python, Postman)', 'Plus besoin d’adresses IP', 'Supprime le besoin de câbles'], good: [0, 1, 2, 3],
      hints: ['Le contrôleur a besoin d’un réseau IP… et de câbles !'], explain: 'Vue globale, déploiement centralisé (PUSH CONFIG), homogénéité (moins d’erreurs), automatisation via API REST.' },
    { id: 'sd3', type: 'qcm', q: 'Quel protocole le contrôleur de Packet Tracer utilise-t-il pour <b>découvrir</b> automatiquement les équipements à partir de SWL1 ?', choices: ['DHCP', 'CDP (Cisco Discovery Protocol)', 'STP', 'HSRP'], good: 1,
      hints: ['Il découvre les voisins directement connectés, de proche en proche.'], explain: '<b>CDP</b> (avec SNMP) : découverte de proche en proche (profondeur 16 sauts) → 9 équipements réseau et 5 hôtes.' },
    { id: 'sd4', type: 'qcm', q: 'Quel protocole, défini par l’ONF, permet à un contrôleur SDN d’injecter des règles dans les commutateurs ?', choices: ['OpenFlow', 'OSPF', 'SNMP', 'SMTP'], good: 0,
      hints: ['Open…'], explain: '<b>OpenFlow</b>, normalisé par l’Open Networking Foundation.' },
    { id: 'sd5', type: 'match', q: 'Associe chaque méthode HTTP de l’API REST à son équivalent SQL.', pairs: [['GET', 'SELECT (lire)'], ['POST', 'INSERT (écrire)'], ['PUT', 'UPDATE (mettre à jour)'], ['DELETE', 'DELETE (supprimer)']],
      hints: ['POST crée, PUT modifie.'], explain: 'GET = SELECT, POST = INSERT, PUT = UPDATE, DELETE = DELETE.' },
    { id: 'sd6', type: 'match', q: 'Codes de retour de l’API (annexe A du LAB) :', pairs: [['200', 'Requête traitée avec succès'], ['201', 'Une nouvelle ressource a été créée'], ['401', 'Le client doit s’identifier (ticket manquant)'], ['404', 'La ressource demandée n’existe pas']],
      hints: ['Quand on obtient le ticket, une ressource est… créée.'], explain: 'La demande de ticket renvoie 201 (créé) ; les GET renvoient 200 ; sans ticket : 401.' },
    { id: 'sd7', type: 'text', q: 'Quel en-tête HTTP faut-il ajouter aux requêtes pour présenter le ticket ?', kind: 'word', accept: ['X-Auth-Token'], ph: 'Nom de l’en-tête',
      hints: ['X-…-Token.'], explain: '<code>X-Auth-Token: NC-…-nbi</code>.' },
    { id: 'sd-rest1', type: 'rest', tag: 'Postman',
      q: '<b>LAB SDN, partie 2 — Postman.</b> Voici un client façon Postman relié au contrôleur <b>PT-Controller0</b> (http://localhost:58000). 1) Essaie d’abord <code>GET http://localhost:58000/api/v1/host</code> sans rien : lis l’erreur. 2) Puis <b>demande un ticket</b> : méthode <b>POST</b> sur <code>/api/v1/ticket</code>, onglet <b>Body (raw JSON)</b> avec l’utilisateur <b>cisco</b> / <b>cisco123!</b>.',
      api: sdnApi,
      goal: function (st) { return !!st.gotTicket; },
      goalMsg: function () { return 'Tu n’as pas encore obtenu de ticket (réponse 201 Created avec un serviceTicket).'; },
      hints: ['Choisis POST dans la liste à gauche de l’URL, URL : <code>http://localhost:58000/api/v1/ticket</code>.', 'Dans Body : <code>{"username": "cisco", "password": "cisco123!"}</code> (guillemets doubles, c’est du JSON).'],
      answerHtml: 'POST <code>http://localhost:58000/api/v1/ticket</code><br>Body : <code>{"username": "cisco", "password": "cisco123!"}</code> → <b>201 Created</b> + serviceTicket.',
      explain: 'Sans ticket, le contrôleur répond 401 « Ticket-based authorization: empty ticket. ». Le POST sur /ticket crée une ressource (le ticket) : code <b>201</b>.' },
    { id: 'sd-rest2', type: 'rest', tag: 'Postman',
      q: '<b>LAB SDN, partie 2 — requêtes GET.</b> Obtiens un ticket (POST /ticket), puis interroge <code>/api/v1/network-device</code> et <code>/api/v1/host</code> en ajoutant l’en-tête <b>X-Auth-Token</b> (onglet Headers). Réponds ensuite grâce aux réponses JSON :',
      api: sdnApi,
      fieldsIntro: 'Réponds grâce aux réponses JSON du contrôleur :',
      fields: [{ label: 'Nombre de périphériques réseau gérés', kind: 'int', answer: 9 }, { label: 'managementIpAddress de SWR3', kind: 'ip', answer: '10.0.1.4' }, { label: 'softwareVersion de SWR3', kind: 'text', answer: ['16.3.2'] }, { label: 'hostIp de PC4', kind: 'ip', answer: '192.168.102.3' }, { label: 'Interface du switch à laquelle Admin est connecté', kind: 'iface', answer: 'GigabitEthernet1/0/21' }],
      hints: ['Headers : KEY = <code>X-Auth-Token</code>, VALUE = ton ticket (sans guillemets).', 'Dans la réponse de /network-device, cherche l’objet dont "hostname" vaut "SWR3".', 'Dans /host, regarde "connectedInterfaceName" pour Admin.'],
      explain: 'Le contrôleur connaît les 9 équipements et les 5 hôtes. SWR3 : 10.0.1.4, IOS 16.3.2 (la même info que <code>show version | include RELEASE</code> en SSH, mais pour tout le réseau d’un coup !).' },
    { id: 'sd8', type: 'qcm', q: 'Dans le script Python <code>02_get-network-device.py</code>, à quoi sert la boucle <code>for networkDevice in networkDevices:</code> ?', choices: ['À envoyer 9 requêtes au contrôleur', 'À parcourir la liste JSON reçue et n’afficher que les clés utiles (hostname, platformId, managementIpAddress)', 'À demander un nouveau ticket', 'À configurer les équipements'], good: 1,
      hints: ['Une seule requête GET renvoie toute la liste dans "response".'], explain: 'Une seule requête ; Python parcourt ensuite la liste pour extraire ce qui intéresse le programmeur. C’est ce qui rend les résultats <b>exploitables</b> (inventaire, export, supervision…).' },
    { id: 'sd9', type: 'text', q: 'Commande pour se connecter en SSH depuis le PC Admin au switch SWR3 (10.0.1.4) avec l’utilisateur cisco :', kind: 'text',
      accept: ['ssh -l cisco 10.0.1.4', /^ssh\s+-l\s+cisco\s+10\.0\.1\.4$/i], ph: 'ssh …',
      hints: ['L’option est « -l » (la lettre L minuscule), suivie de l’utilisateur, puis l’adresse.'], explain: '<code>ssh -l cisco 10.0.1.4</code>, mot de passe <code>cisco123!</code>, puis <code>show version | include RELEASE</code>.' }
  ]
  });
})();
