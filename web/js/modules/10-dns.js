(function () {
  function recs(n) { return n.dev('SRV-DNS').services.dns.records; }
  function hasRec(n, name, type, value) {
    return recs(n).some(function (r) { return r.type === type && r.name.toLowerCase().replace(/\.$/, '') === name && String(r.value).toLowerCase().replace(/\.$/, '') === value; });
  }
  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'dns', num: 10, icon: '📒', titre: 'DNS',
  sous: 'Noms de domaine, zones, enregistrements, résolution',
  source: 'DNS.pdf (ENI), IMT-2026 (processus de résolution), NAT-PAT et HSRP.pkt (serveurs DNS)',
  cours: `
<h3>1. Pourquoi le DNS ?</h3>
<p>Les humains retiennent mal les suites de chiffres (et une adresse IPv6, c’est 32 caractères hexadécimaux !). Le <b>DNS</b> (<i>Domain Name System</i>) fait correspondre des <b>noms symboliques</b> (www.imt.fr) à des <b>adresses IP</b>. C’est « l’annuaire d’Internet ».</p>
<p><b>Historique :</b> au début, un unique fichier <b>HOSTS.txt</b> maintenu par le NIC était copié par FTP sur toutes les machines. Avec la croissance d’Internet (3 100 hôtes en 1986, 4 millions en 1995), impossible à tenir. En <b>1983</b>, Paul Mockapetris (à la demande de Jon Postel) propose le DNS (RFC 882/883), mis à jour en <b>1987</b> dans les <b>RFC 1034 et 1035</b>, toujours en vigueur.</p>
<div class="nul"><b>🧠 L’analogie du répertoire téléphonique :</b> tu connais le nom de ton pote, pas son numéro. Tu ouvres l’annuaire (le serveur DNS) qui te donne le numéro (l’adresse IP). Et comme l’annuaire mondial serait énorme, il est découpé : un annuaire par pays, par ville, par entreprise… c’est la <b>hiérarchie</b> du DNS.</div>

<h3>2. Un espace de noms en arbre</h3>
<div class="figure"><svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13" font-weight="700">
<g stroke="#8a9bb3" stroke-width="2"><line x1="350" y1="35" x2="150" y2="85"/><line x1="350" y1="35" x2="350" y2="85"/><line x1="350" y1="35" x2="550" y2="85"/><line x1="350" y1="100" x2="270" y2="145"/><line x1="350" y1="100" x2="430" y2="145"/><line x1="430" y1="160" x2="380" y2="195"/><line x1="430" y1="160" x2="490" y2="195"/><line x1="150" y1="100" x2="150" y2="145"/></g>
<rect x="315" y="12" width="70" height="26" rx="6" fill="#7b3fa0"/><text x="350" y="30" fill="#fff" text-anchor="middle">« . » racine</text>
<rect x="115" y="80" width="70" height="26" rx="6" fill="#049fd9"/><text x="150" y="98" fill="#fff" text-anchor="middle">com</text>
<rect x="315" y="80" width="70" height="26" rx="6" fill="#049fd9"/><text x="350" y="98" fill="#fff" text-anchor="middle">fr</text>
<rect x="515" y="80" width="70" height="26" rx="6" fill="#049fd9"/><text x="550" y="98" fill="#fff" text-anchor="middle">org</text>
<rect x="110" y="140" width="80" height="26" rx="6" fill="#2e9e4f"/><text x="150" y="158" fill="#fff" text-anchor="middle">cisco</text>
<rect x="230" y="140" width="80" height="26" rx="6" fill="#2e9e4f"/><text x="270" y="158" fill="#fff" text-anchor="middle">gouv</text>
<rect x="390" y="140" width="80" height="26" rx="6" fill="#2e9e4f"/><text x="430" y="158" fill="#fff" text-anchor="middle">imt</text>
<rect x="345" y="182" width="70" height="24" rx="6" fill="#d98b0b"/><text x="380" y="199" fill="#fff" text-anchor="middle">www</text>
<rect x="455" y="182" width="70" height="24" rx="6" fill="#d98b0b"/><text x="490" y="199" fill="#fff" text-anchor="middle">mail</text>
<text x="600" y="98" fill="#6fd6f5" font-size="12">TLD</text><text x="600" y="158" fill="#6fd6f5" font-size="12">2e niveau</text><text x="600" y="198" fill="#6fd6f5" font-size="12">hôtes</text>
</svg><div class="figcap">On lit un nom de la feuille vers la racine : www.imt.fr. (le point final = la racine).</div></div>
<ul>
<li>Chaque nœud a une <b>étiquette</b> (label) de <b>63 octets</b> max ; le nom complet fait au plus <b>255 octets</b> ; la casse ne compte pas.</li>
<li>Un nom <b>pleinement qualifié</b> (<b>FQDN</b>) va jusqu’à la racine et se termine par un point : <code>www.imt.fr.</code> (souvent omis).</li>
<li>Le 1er niveau (<b>TLD</b>) est géré par l’<b>ICANN</b> (depuis 1998) : <b>gTLD</b> génériques / organisationnels (com, org, net…) et <b>ccTLD</b> géographiques de 2 lettres (fr, de, uk… norme ISO 3166, plus de 250).</li>
<li><b>Domaine</b> = une branche logique de l’arbre (les domaines se superposent : impots.gouv.fr est aussi dans gouv.fr et fr). <b>Zone</b> = une « aire de responsabilité » avec une vraie base de données (les zones se juxtaposent). Un <b>hôte</b> est une feuille.</li>
</ul>

<h3>3. Les enregistrements (Resource Records)</h3>
<table><tr><th>Type</th><th>Rôle</th><th>Exemple</th></tr>
<tr><td><b>A</b></td><td>nom → adresse <b>IPv4</b></td><td>www.imt.local → 192.168.1.10</td></tr>
<tr><td><b>AAAA</b></td><td>nom → adresse <b>IPv6</b></td><td>www → 2001:db8::10</td></tr>
<tr><td><b>CNAME</b></td><td><b>alias</b> : un nom qui pointe vers un autre nom</td><td>intranet → www.imt.local</td></tr>
<tr><td><b>MX</b></td><td>serveur de <b>messagerie</b> du domaine</td><td>imt.local → mail.imt.local</td></tr>
<tr><td><b>NS</b></td><td>serveur de noms qui fait autorité sur la zone</td><td>imt.local → dns.imt.local</td></tr>
<tr><td><b>SOA</b></td><td>début d’autorité : serveur primaire, SERIAL, REFRESH, RETRY, EXPIRE…</td><td>—</td></tr>
<tr><td><b>PTR</b></td><td>résolution <b>inverse</b> : adresse → nom</td><td>10.1.168.192.in-addr.arpa → www</td></tr></table>

<h3>4. Qui fait quoi ?</h3>
<ul>
<li><b>Le résolveur</b> (sur le client) interroge les serveurs. Commande manuelle : <code>nslookup</code>.</li>
<li><b>Le serveur cache (récursif)</b> fait tout le travail pour le client et <b>garde les réponses en cache</b> pendant le <b>TTL</b> de l’enregistrement.</li>
<li><b>Le serveur faisant autorité</b> détient la base d’une zone. Le <b>primaire</b> (SOA) est le seul où l’on modifie ; les <b>secondaires</b> en ont une copie mise à jour par <b>transfert de zone</b> (AXFR complet, IXFR incrémental), déclenché par le SERIAL (et la notification NOTIFY, RFC 1996). La RFC recommande <b>au moins 2 serveurs</b> par zone.</li>
<li><b>Les serveurs racine</b> : 13 serveurs <b>logiques</b> nommés A à M (a.root-servers.net… géré par Verisign), dupliqués dans le monde grâce à l’<b>anycast</b> (même IP pour plusieurs machines : la requête va à la plus proche).</li>
</ul>
<table><tr><th>Mode</th><th>Principe</th></tr>
<tr><td><b>Récursif</b></td><td>« Donne-moi la réponse complète » : le serveur interroge lui-même les autres serveurs et renvoie la réponse (ou une erreur). C’est le mode du <b>client</b>.</td></tr>
<tr><td><b>Itératif</b></td><td>Le serveur répond s’il sait, sinon il donne <b>l’adresse d’un autre serveur</b> plus proche de la réponse : on avance pas à pas (racine → fr → imt.fr). C’est le mode entre <b>serveurs</b>.</td></tr></table>
<div class="figure"><svg viewBox="0 0 700 200" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<defs><marker id="dn" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#00bceb"/></marker></defs>
<rect x="10" y="80" width="90" height="36" rx="6" fill="#556"/><text x="55" y="102" fill="#fff" text-anchor="middle" font-weight="700">PC</text>
<rect x="220" y="80" width="130" height="36" rx="6" fill="#1f6fb2"/><text x="285" y="102" fill="#fff" text-anchor="middle" font-weight="700">Serveur cache</text>
<rect x="520" y="10" width="160" height="32" rx="6" fill="#7b3fa0"/><text x="600" y="31" fill="#fff" text-anchor="middle" font-weight="700">Racine « . »</text>
<rect x="520" y="82" width="160" height="32" rx="6" fill="#049fd9"/><text x="600" y="103" fill="#fff" text-anchor="middle" font-weight="700">Serveur de « fr »</text>
<rect x="520" y="154" width="160" height="32" rx="6" fill="#2e9e4f"/><text x="600" y="175" fill="#fff" text-anchor="middle" font-weight="700">Serveur de « imt.fr »</text>
<path d="M100 92 L216 92" stroke="#00bceb" stroke-width="2" marker-end="url(#dn)"/><text x="110" y="85" fill="currentColor">1. www.imt.fr ? (récursif)</text>
<path d="M216 106 L104 106" stroke="#6cc04a" stroke-width="2" marker-end="url(#dn)"/><text x="110" y="126" fill="currentColor">8. réponse + cache</text>
<path d="M350 85 L516 30" stroke="#00bceb" stroke-width="1.8" marker-end="url(#dn)"/><text x="380" y="45" fill="currentColor">2-3. va voir « fr »</text>
<path d="M350 98 L516 98" stroke="#00bceb" stroke-width="1.8" marker-end="url(#dn)"/><text x="390" y="92" fill="currentColor">4-5. va voir « imt.fr »</text>
<path d="M350 110 L516 166" stroke="#00bceb" stroke-width="1.8" marker-end="url(#dn)"/><text x="380" y="160" fill="currentColor">6-7. 193.x.x.x</text>
</svg><div class="figcap">Le PC pose une question récursive ; le serveur cache fait des requêtes itératives de la racine jusqu’au serveur faisant autorité.</div></div>

<h3>5. Transport et résolution inverse</h3>
<ul><li>Requêtes sur <b>UDP port 53</b> (messages de 512 octets max, rapide, pas de connexion) ; <b>TCP 53</b> pour les <b>transferts de zone</b> (fiabilité absolue).</li>
<li>Résolution <b>inverse</b> (IP → nom) : arbre spécial <b>in-addr.arpa</b>, adresse écrite à l’envers : 192.168.2.1 → <code>1.2.168.192.in-addr.arpa</code>, enregistrement <b>PTR</b>.</li></ul>
<div class="tip"><b>🖥️ Dans Packet Tracer</b> : serveur → <b>Services → DNS</b> → DNS Service <b>On</b>, puis Name / Type (A Record, CNAME…) / Address → <b>Add</b>. Côté PC : IP Configuration → champ <b>DNS Server</b>. Teste avec <code>nslookup www.imt.local</code> dans la Command Prompt, ou le <b>Web Browser</b>.</div>
`,
  questions: [
    { id: 'n1', type: 'qcm', q: 'Quel est le rôle principal du DNS ?', choices: ['Attribuer des adresses IP aux PC', 'Traduire des noms de domaine en adresses IP (et inversement)', 'Router les paquets entre réseaux', 'Chiffrer les pages web'], good: 1,
      hints: ['C’est « l’annuaire d’Internet ».'], explain: 'DNS = nom ⟷ adresse. Attribuer des adresses, c’est DHCP.' },
    { id: 'n2', type: 'qcm', q: 'Avant le DNS, comment les machines connaissaient-elles les noms ?', choices: ['Grâce à ARP', 'Grâce à un unique fichier HOSTS.txt maintenu par le NIC et copié sur tous les hôtes', 'Grâce aux routeurs', 'Elles ne connaissaient que des adresses MAC'], good: 1,
      hints: ['Un seul fichier… qui a fini par être beaucoup trop gros.'], explain: 'Le fichier HOSTS.txt (RFC 952/953), distribué par FTP : intenable avec la croissance d’Internet → DNS (RFC 1034/1035).' },
    { id: 'n3', type: 'match', q: 'Associe chaque type d’enregistrement à son rôle.',
      pairs: [['A', 'Nom → adresse IPv4'], ['AAAA', 'Nom → adresse IPv6'], ['CNAME', 'Alias vers un autre nom'], ['MX', 'Serveur de messagerie du domaine'], ['NS', 'Serveur de noms faisant autorité'], ['PTR', 'Adresse → nom (résolution inverse)'], ['SOA', 'Début d’autorité de la zone (serveur primaire, SERIAL…)']],
      hints: ['« AAAA » = 4 fois plus long que « A » : 128 bits contre 32.', 'MX = Mail eXchanger.'], explain: 'A, AAAA, CNAME (alias), MX (mail), NS (serveur de noms), PTR (inverse), SOA (autorité).' },
    { id: 'n4', type: 'match', q: 'gTLD ou ccTLD ?', pairs: [['.fr', 'ccTLD (pays)'], ['.com', 'gTLD (générique)'], ['.de', 'ccTLD (pays)'], ['.org', 'gTLD (générique)']],
      hints: ['cc = country code, 2 lettres.'], explain: 'ccTLD : 2 lettres, géographiques (ISO 3166). gTLD : génériques / organisationnels. Tous gérés par l’ICANN.' },
    { id: 'n5', type: 'text', q: 'Sur quel port et quel protocole de transport passent les requêtes DNS classiques ?', fields: [{ label: 'Protocole', kind: 'word', answer: ['UDP'] }, { label: 'Port', kind: 'int', answer: 53 }],
      hints: ['Des échanges courts, sans ouverture de connexion.'], explain: '<b>UDP 53</b>. Les transferts de zone utilisent <b>TCP 53</b> car ils exigent une fiabilité absolue.' },
    { id: 'n6', type: 'match', q: 'Récursif ou itératif ?', pairs: [['« Donne-moi la réponse complète, débrouille-toi »', 'Récursif'], ['« Je ne sais pas, mais va demander à ce serveur-là »', 'Itératif'], ['Mode utilisé par le résolveur du client', 'Récursif'], ['Mode utilisé entre serveurs (racine → TLD → domaine)', 'Itératif']],
      hints: ['Itératif = pas à pas.'], explain: 'Le client demande en récursif à son serveur ; ce serveur interroge en itératif la racine, puis le TLD, puis le serveur faisant autorité.' },
    { id: 'n7', type: 'qcm', q: 'Combien y a-t-il de serveurs racine <b>logiques</b> ?', choices: ['1', '7', '13 (de A à M)', 'Plusieurs milliers'], good: 2,
      hints: ['Ils portent des lettres…'], explain: '<b>13</b> serveurs logiques (a à m.root-servers.net), dupliqués physiquement dans le monde grâce à l’<b>anycast</b>.' },
    { id: 'n8', type: 'qcm', q: 'Dans une zone DNS, sur quel serveur modifie-t-on les enregistrements ?', choices: ['Sur n’importe quel secondaire', 'Uniquement sur le serveur primaire (SOA) ; les secondaires reçoivent une copie par transfert de zone', 'Sur le serveur racine', 'Sur le serveur cache du client'], good: 1,
      hints: ['SOA = Start Of Authority.'], explain: 'Seul le <b>primaire</b> est modifiable. Les secondaires se synchronisent (AXFR/IXFR) quand le SERIAL change.' },
    { id: 'n9', type: 'text', q: 'Quel nom de domaine faut-il interroger pour la <b>résolution inverse</b> de l’adresse 192.168.2.1 ?', kind: 'text', accept: ['1.2.168.192.in-addr.arpa', '1.2.168.192.in-addr.arpa.'],
      hints: ['On écrit l’adresse à l’envers, suivie de « .in-addr.arpa ».'], explain: '<code>1.2.168.192.in-addr.arpa</code>, qui porte un enregistrement <b>PTR</b>.' },
    { id: 'n10', type: 'qcm', q: 'Pourquoi un serveur DNS « cache » garde-t-il les réponses ?', choices: ['Pour les revendre', 'Pour répondre plus vite aux requêtes suivantes et soulager les autres serveurs, pendant la durée du TTL', 'Pour ne jamais les mettre à jour', 'Parce que c’est obligatoire pour le mode itératif'], good: 1,
      hints: ['Le champ TTL de chaque enregistrement fixe la durée de conservation.'], explain: 'Le cache économise la bande passante et la charge ; le <b>TTL</b> évite de garder des données périmées.' },
    { id: 'n-lab', type: 'pt', file: 'Labo-DNS.pkt', tag: 'DNS',
      q: 'Le serveur <b>SRV-WEB</b> (192.168.1.10) héberge le site de l’IMT. Configure le serveur <b>SRV-DNS</b> (192.168.1.2) pour que <b>www.imt.local</b> pointe vers le serveur web, et ajoute un <b>alias</b> <b>intranet.imt.local</b> vers www.imt.local. Puis configure le DNS sur <b>PC0</b> et vérifie avec le navigateur (<b>Desktop → Web Browser</b> → http://intranet.imt.local).',
      build: function () {
        var n = LAB.make({
          devices: [['Switch0', '2960-24TT', 450, 220], ['PC0', 'PC-PT', 180, 120], ['PC1', 'PC-PT', 180, 330], ['SRV-WEB', 'Server-PT', 720, 120], ['SRV-DNS', 'Server-PT', 720, 330]],
          links: [['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'], ['SRV-WEB', 'FastEthernet0', 'Switch0', 'FastEthernet0/10', 'straight'], ['SRV-DNS', 'FastEthernet0', 'Switch0', 'FastEthernet0/11', 'straight']],
          hosts: { PC0: { ip: '192.168.1.20', mask: '255.255.255.0' }, PC1: { ip: '192.168.1.21', mask: '255.255.255.0', dns: '192.168.1.2' }, 'SRV-WEB': { ip: '192.168.1.10', mask: '255.255.255.0' }, 'SRV-DNS': { ip: '192.168.1.2', mask: '255.255.255.0' } },
          notes: [[120, 450, 'Réseau 192.168.1.0/24 — DNS : 192.168.1.2 — Web : 192.168.1.10']]
        });
        n.dev('SRV-DNS').services.dns = { on: false, records: [] };
        return n;
      },
      tasks: [
        { label: 'Service DNS de SRV-DNS activé', check: function (n) { return n.dev('SRV-DNS').services.dns.on; } },
        { label: 'Enregistrement A : www.imt.local → 192.168.1.10', check: function (n) { return hasRec(n, 'www.imt.local', 'A', '192.168.1.10'); } },
        { label: 'Alias (CNAME) : intranet.imt.local → www.imt.local', check: function (n) { return hasRec(n, 'intranet.imt.local', 'CNAME', 'www.imt.local'); } },
        { label: 'PC0 utilise le serveur DNS 192.168.1.2', check: function (n) { return n.dev('PC0').host.dns === NET.ip2int('192.168.1.2'); } },
        { label: 'PC0 résout www.imt.local', check: function (n) { var r = n.dnsResolve(n.dev('PC0'), 'www.imt.local'); return r.ok && r.ip === NET.ip2int('192.168.1.10'); } },
        { label: 'PC0 ouvre http://intranet.imt.local', check: function (n) { return n.httpGet(n.dev('PC0'), 'http://intranet.imt.local').ok; } }
      ],
      hints: ['SRV-DNS → Services → DNS → DNS Service <b>On</b>.', 'Name : www.imt.local, Type : A Record, Address : 192.168.1.10 → Add. Puis Name : intranet.imt.local, Type : CNAME, Host Name : www.imt.local → Add.', 'PC0 → Desktop → IP Configuration → DNS Server : 192.168.1.2.'],
      solution: [
        { text: 'SRV-DNS → Services → DNS : <b>On</b> ; A Record <code>www.imt.local</code> → 192.168.1.10 ; CNAME <code>intranet.imt.local</code> → www.imt.local.',
          fn: function (n) { n.dev('SRV-DNS').services.dns = { on: true, records: [{ name: 'www.imt.local', type: 'A', value: '192.168.1.10' }, { name: 'intranet.imt.local', type: 'CNAME', value: 'www.imt.local' }] }; } },
        { dev: 'PC0', host: { dns: '192.168.1.2' } }
      ],
      explain: 'Le navigateur de PC0 demande intranet.imt.local → le serveur répond « c’est un alias de www.imt.local » → qui vaut 192.168.1.10 → la page s’affiche. Essaie aussi <code>nslookup intranet.imt.local</code> dans la Command Prompt.' }
  ]
  });
})();
