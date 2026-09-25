(function () {
  function ifFlag(n, dev, ifn, flag) { var i = n.iface(n.dev(dev), ifn); return !!(i && i[flag]); }
  function fwd(n, lip, lport, gport) {
    return n.dev('Router1').cfg.natStatic.some(function (s) {
      return s.proto === 'tcp' && s.local === NET.ip2int(lip) && s.lport === lport && s.gport === gport && n.natGlobalIP(n.dev('Router1'), s) === NET.ip2int('13.1.1.2');
    });
  }
  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'nat', num: 13, icon: '🎭', titre: 'NAT et PAT',
  sous: 'Traduction d’adresses, surcharge, redirection de ports',
  source: 'Adresse-routage.pdf (slides 35 à 42), IMT-2026, NAT-PAT-depart.pkt, PROTOCOLE IP (adresses privées)',
  cours: `
<h3>1. Pourquoi traduire les adresses ?</h3>
<p>Les adresses <b>privées</b> (10/8, 172.16/12, 192.168/16) sont <b>interdites sur Internet</b>. Pour qu’un réseau privé sorte, un équipement (en général le <b>routeur</b> de sortie) <b>remplace</b> l’adresse source (et/ou destination) des paquets : c’est le <b>NAT</b> (<i>Network Address Translation</i>). Utilisations citées dans ton cours :</p>
<ul><li>n’avoir qu’<b>une</b> (ou quelques) adresse(s) publique(s) pour tout un réseau privé → réponse à la <b>pénurie d’IPv4</b> ;</li>
<li><b>cacher</b> les adresses internes (sécurité) ;</li>
<li>faire communiquer des réseaux qui utilisent les <b>mêmes adresses</b> (fusion d’entreprises) ;</li>
<li>la <b>redirection de ports</b> (<i>port forwarding</i>) : rendre accessible depuis Internet un serveur interne.</li></ul>
<p><b>Inconvénients</b> : consomme des ressources (il faut recalculer les checksums IP et TCP), pose problème à certains protocoles de sécurité (<b>IPsec</b>) et à certaines applications.</p>
<div class="nul"><b>🧠 L’analogie du standard téléphonique :</b> dans une entreprise, tout le monde appelle l’extérieur avec <b>le même numéro</b> (celui du standard). Le standard note « le poste 12 appelle tel numéro » pour savoir à qui renvoyer la réponse. Le routeur NAT fait pareil avec les adresses IP… et les <b>ports</b>.</div>

<h3>2. Les types de NAT</h3>
<table><tr><th>Type</th><th>Principe</th><th>Exemple</th></tr>
<tr><td><b>NAT statique</b></td><td>1 adresse privée ⟷ 1 adresse publique, <b>fixe</b></td><td>10.0.0.1 ⟷ 194.12.10.1</td></tr>
<tr><td><b>NAT dynamique</b></td><td>les adresses privées prennent une adresse libre dans un <b>pool</b> public</td><td>pool 194.12.10.1 à .20</td></tr>
<tr><td><b>PAT / surcharge</b> (<i>overload</i>)</td><td><b>plusieurs</b> machines partagent <b>une seule</b> adresse publique ; on les distingue par le <b>port</b></td><td>10.0.0.1:2035 → 194.12.10.1:3043</td></tr>
<tr><td><b>Redirection de port</b> (NAT statique de port)</td><td>un port de l’adresse publique est renvoyé vers un serveur interne</td><td>13.1.1.2:8000 → 192.168.2.11:80</td></tr></table>
<div class="figure"><svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<defs><marker id="nt" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#00bceb"/></marker></defs>
<rect x="10" y="30" width="110" height="40" rx="6" fill="#556"/><text x="65" y="55" fill="#fff" text-anchor="middle" font-weight="700">PC 10.0.0.1</text>
<rect x="300" y="30" width="110" height="40" rx="20" fill="#1f6fb2"/><text x="355" y="55" fill="#fff" text-anchor="middle" font-weight="700">NAT</text>
<rect x="590" y="30" width="120" height="40" rx="6" fill="#2e9e4f"/><text x="650" y="50" fill="#fff" text-anchor="middle" font-weight="700">Serveur web</text><text x="650" y="64" fill="#fff" text-anchor="middle">131.10.0.10</text>
<path d="M120 42 L296 42" stroke="#00bceb" stroke-width="2" marker-end="url(#nt)"/><text x="130" y="36" fill="currentColor">src 10.0.0.1:2035 → dst 131.10.0.10:80</text>
<path d="M410 42 L586 42" stroke="#00bceb" stroke-width="2" marker-end="url(#nt)"/><text x="418" y="36" fill="currentColor">src <tspan font-weight="700" fill="#fbab18">194.12.10.1:3043</tspan></text>
<path d="M586 64 L414 64" stroke="#6cc04a" stroke-width="2" marker-end="url(#nt)"/><text x="418" y="82" fill="currentColor">dst <tspan font-weight="700" fill="#fbab18">194.12.10.1:3043</tspan></text>
<path d="M296 64 L124 64" stroke="#6cc04a" stroke-width="2" marker-end="url(#nt)"/><text x="130" y="82" fill="currentColor">dst 10.0.0.1:2035</text>
<rect x="210" y="110" width="300" height="80" rx="6" fill="rgba(251,171,24,.12)" stroke="#fbab18"/>
<text x="360" y="130" text-anchor="middle" fill="#fbab18" font-weight="700">Table de translation (PAT)</text>
<text x="230" y="152" fill="currentColor">IP locale interne</text><text x="380" y="152" fill="currentColor">IP globale interne</text>
<text x="230" y="174" fill="currentColor" font-weight="700">10.0.0.1:2035</text><text x="380" y="174" fill="currentColor" font-weight="700">194.12.10.1:3043</text>
</svg><div class="figcap">Le schéma de ton cours : à l’aller le NAT remplace la source, au retour il remet la bonne destination grâce à sa table.</div></div>
<h4>Le vocabulaire Cisco (show ip nat translations)</h4>
<ul><li><b>Inside local</b> : l’adresse privée de la machine interne (10.0.0.1).</li>
<li><b>Inside global</b> : l’adresse publique qui la représente sur Internet (194.12.10.1).</li>
<li><b>Outside global / outside local</b> : l’adresse de la machine externe (131.10.0.10), vue de l’extérieur / de l’intérieur (identiques sans NAT « outside »).</li></ul>

<h3>3. Configuration Cisco</h3>
<div class="demo dark">interface GigabitEthernet0/0/0
 ip address 192.168.1.254 255.255.255.0
 ip nat inside                                     ← côté réseau privé
interface GigabitEthernet0/0/1
 ip address 13.1.1.1 255.0.0.0
 ip nat outside                                    ← côté Internet
!
access-list 1 permit 192.168.1.0 0.0.0.255         ← QUI a le droit d’être traduit
ip nat inside source list 1 interface GigabitEthernet0/0/1 overload    ← PAT sur l’IP publique
!
ip nat inside source static tcp 192.168.1.100 80 13.1.1.1 80    ← redirection de port (web)
ip nat inside source static udp 192.168.1.200 53 13.1.1.1 53    ← redirection de port (DNS)
ip nat inside source static 192.168.1.50 13.1.1.50               ← NAT statique 1:1</div>
<div class="memo"><b>📌 Masque générique (wildcard) des ACL :</b> c’est l’inverse du masque : /24 → <code>0.0.0.255</code>, /16 → <code>0.0.255.255</code>, /26 → <code>0.0.0.63</code>. <code>access-list 1 permit any</code> autorise tout.</div>
<div class="warnbox"><b>⚠ Pièges :</b> oublier <code>ip nat inside</code> / <code>ip nat outside</code> sur les interfaces (rien n’est traduit) ; les inverser ; une ACL qui ne couvre pas le bon réseau ; oublier <code>overload</code> (NAT dynamique avec une seule adresse = une seule machine à la fois). Vérifie avec <code>show ip nat translations</code> juste après un ping ou une page web.</div>
<div class="tip"><b>✔ Et le DNS ?</b> De l’extérieur, on joint le serveur par l’adresse <b>publique</b> du routeur : dans le fichier NAT-PAT du prof, www.imt.local pointe vers <b>13.1.1.2</b> (le routeur du site 2), pas vers 192.168.2.10.</div>
`,
  questions: [
    { id: 'nt1', type: 'multi', q: 'D’après ton cours, à quoi sert le NAT ?', choices: ['Pallier la pénurie d’adresses IPv4 publiques', 'Cacher les adresses internes', 'Faire communiquer des réseaux qui ont les mêmes adresses', 'Rendre un serveur interne accessible (redirection de port)', 'Accélérer le routage', 'Chiffrer les échanges'], good: [0, 1, 2, 3],
      hints: ['Le NAT a un coût en performances (recalcul des checksums) et ne chiffre rien.'], explain: 'Pénurie IPv4, masquage, recouvrement d’adresses, port forwarding. Il <b>ralentit</b> plutôt le routeur et pose problème à IPsec.' },
    { id: 'nt2', type: 'match', q: 'Associe chaque type de NAT à sa définition.', pairs: [['NAT statique', 'Une adresse privée toujours associée à la même adresse publique'], ['NAT dynamique', 'Une adresse publique prise dans un pool, le temps de la communication'], ['PAT (overload)', 'Plusieurs machines partagent une seule adresse publique, distinguées par les ports'], ['Redirection de port', 'Un port de l’adresse publique est renvoyé vers un serveur interne']],
      hints: ['Overload = surcharge : on « surcharge » une seule adresse.'], explain: 'Statique 1:1, dynamique via pool, PAT N:1 avec ports, port forwarding pour publier un service.' },
    { id: 'nt3', type: 'text', q: 'Schéma du cours (NAT statique : 10.0.0.1 ⟷ 194.12.10.1). Le PC 10.0.0.1 envoie un paquet au serveur 131.10.0.10.',
      fields: [{ label: 'Après le NAT (sur Internet), IP source =', kind: 'ip', answer: '194.12.10.1' }, { label: 'IP destination =', kind: 'ip', answer: '131.10.0.10' }, { label: 'Réponse du serveur, IP destination sur Internet =', kind: 'ip', answer: '194.12.10.1' }, { label: 'Après le NAT (retour dans le LAN), IP destination =', kind: 'ip', answer: '10.0.0.1' }],
      hints: ['À l’aller on change la <b>source</b>, au retour on change la <b>destination</b>.'], explain: 'Aller : 10.0.0.1 → 194.12.10.1 (source). Retour : 194.12.10.1 → 10.0.0.1 (destination). La destination 131.10.0.10 ne change jamais.' },
    { id: 'nt4', type: 'match', q: 'Vocabulaire Cisco : dans l’exemple du cours (PC 10.0.0.1, adresse publique 194.12.10.1, serveur 131.10.0.10), qui est qui ?', pairs: [['Inside local', '10.0.0.1'], ['Inside global', '194.12.10.1'], ['Outside global', '131.10.0.10']],
      hints: ['« Inside » = la machine de chez nous. « Local » = vue de chez nous, « global » = vue d’Internet.'], explain: 'Inside local = adresse privée ; inside global = adresse publique qui la représente ; outside global = la machine externe.' },
    { id: 'nt5', type: 'qcm', q: 'Avec du <b>PAT</b>, comment le routeur sait-il à quel PC renvoyer une réponse, alors que tous utilisent la même IP publique ?', choices: ['Grâce à l’adresse MAC', 'Grâce au numéro de port, noté dans la table de translation', 'Il l’envoie à tous les PC', 'Grâce au TTL'], good: 1,
      hints: ['Port Address Translation.'], explain: 'Chaque flux a un port (source) distinct côté public : la table associe 194.12.10.1:3043 ⟷ 10.0.0.1:2035.' },
    { id: 'nt6', type: 'text', q: 'Donne le masque générique (wildcard) pour autoriser le réseau dans l’ACL :', fields: [{ label: '192.168.1.0/24 →', kind: 'ip', answer: '0.0.0.255' }, { label: '172.16.0.0/16 →', kind: 'ip', answer: '0.0.255.255' }, { label: '192.168.59.64/26 →', kind: 'ip', answer: '0.0.0.63' }],
      hints: ['Wildcard = 255.255.255.255 − masque.'], explain: '255 − 255 = 0, 255 − 0 = 255 ; pour /26 : 255 − 192 = 63.' },
    { id: 'nt7', type: 'order', q: 'Remets dans l’ordre la configuration du PAT sur un routeur.', items: ['interface g0/0/0 → ip nat inside', 'interface g0/0/1 → ip nat outside', 'access-list 1 permit 192.168.1.0 0.0.0.255', 'ip nat inside source list 1 interface g0/0/1 overload', 'show ip nat translations (après un ping)'],
      hints: ['On marque les interfaces, on dit qui est traduit, on active, on vérifie.'], explain: 'Interfaces inside/outside → ACL → règle overload → vérification.' },
    { id: 'nt8', type: 'text', q: 'Écris la commande qui redirige le port <b>8000</b> de l’adresse publique <b>13.1.1.2</b> vers le port <b>80</b> du serveur interne <b>192.168.2.11</b>.', kind: 'text',
      accept: ['ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000', /^ip\s+nat\s+inside\s+source\s+static\s+tcp\s+192\.168\.2\.11\s+80\s+13\.1\.1\.2\s+8000$/i], ph: 'ip nat inside source static …',
      hints: ['Ordre : protocole, IP locale, port local, IP globale, port global.'], explain: '<code>ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000</code> : l’ordre est toujours « local » puis « global ».' },
    { id: 'nt9', type: 'multi', q: 'Quels sont les <b>inconvénients</b> du NAT cités dans ton cours ?', choices: ['Consomme des ressources (recalcul des checksums IP et TCP)', 'Pose problème à IPsec (authentification / chiffrement)', 'Problèmes de compatibilité avec certains protocoles', 'Empêche totalement l’accès à Internet', 'Oblige à passer en IPv6'], good: [0, 1, 2],
      hints: ['Le NAT modifie les en-têtes : tout ce qui vérifie leur intégrité en souffre.'], explain: 'Ressources (checksums), IPsec, compatibilité applicative.' },
    { id: 'nt-lab', type: 'pt', topo: 'NAT-PAT-depart', file: 'NAT-PAT-depart.pkt', tag: 'NAT / PAT',
      q: '<b>TP NAT-PAT du prof.</b> Site 1 (192.168.1.0/24) derrière <b>Router0</b>, site 2 (192.168.2.0/24, serveurs WEB1 et WEB2) derrière <b>Router1</b>. « Internet » = 13.0.0.0/8 (Router0 G0/0/1 = 13.1.1.1, Router1 G0/0/0 = 13.1.1.2). Le DNS du site 1 fait pointer www.imt.local vers <b>13.1.1.2</b>.<br><b>Objectif 1</b> : traduire toutes les adresses du site 1 dans l’adresse publique de Router0 (PAT).<br><b>Objectif 2</b> : sur Router1, transférer les paquets destinés à son adresse publique sur le port <b>80</b> vers <b>WEB1</b> (192.168.2.10) et ceux du port <b>8000</b> vers <b>WEB2</b> (192.168.2.11, port 80).',
      tasks: [
        { label: 'Router0 : G0/0/0 en ip nat inside, G0/0/1 en ip nat outside', check: function (n) { return ifFlag(n, 'Router0', 'GigabitEthernet0/0/0', 'natIn') && ifFlag(n, 'Router0', 'GigabitEthernet0/0/1', 'natOut'); } },
        { label: 'Router0 : le trafic de PC0 sort avec l’adresse 13.1.1.1 (entrée PAT dans show ip nat translations)', check: function (n) {
          var r = n.dev('Router0'); if (!r.cfg.natDyn.some(function (x) { return x.overload; })) return false;
          n.canPing('PC0', '13.1.1.2');
          return r.natTable.some(function (e) { return !e.stat && e.lip === NET.ip2int('192.168.1.1') && e.gip === NET.ip2int('13.1.1.1'); }); } },
        { label: 'Router1 : G0/0/0 en outside, G0/0/1 en inside', check: function (n) { return ifFlag(n, 'Router1', 'GigabitEthernet0/0/0', 'natOut') && ifFlag(n, 'Router1', 'GigabitEthernet0/0/1', 'natIn'); } },
        { label: 'Redirections : 13.1.1.2:80 → WEB1:80 et 13.1.1.2:8000 → WEB2:80', check: function (n) { return fwd(n, '192.168.2.10', 80, 80) && fwd(n, '192.168.2.11', 80, 8000); } },
        { label: 'PC0 ouvre http://www.imt.local et obtient la page de WEB1', check: function (n) { var r = n.httpGet(n.dev('PC0'), 'http://www.imt.local'); return r.ok && r.server.name === 'WEB1'; } },
        { label: 'PC1 ouvre http://13.1.1.2:8000 et obtient la page de WEB2', check: function (n) { var r = n.httpGet(n.dev('PC1'), 'http://13.1.1.2:8000'); return r.ok && r.server.name === 'WEB2'; } }
      ],
      hints: ['Router0 : <code>interface g0/0/0</code> → <code>ip nat inside</code> ; <code>interface g0/0/1</code> → <code>ip nat outside</code> ; l’ACL 1 existe déjà (<code>access-list 1 permit any</code>) ; puis <code>ip nat inside source list 1 interface g0/0/1 overload</code>.', 'Router1 : <code>interface g0/0/0</code> → <code>ip nat outside</code> ; <code>interface g0/0/1</code> → <code>ip nat inside</code>.', 'Router1 : <code>ip nat inside source static tcp 192.168.2.10 80 13.1.1.2 80</code> et <code>ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000</code>.'],
      solution: [
        { dev: 'Router0', cli: ['conf t', 'interface g0/0/0', 'ip nat inside', 'interface g0/0/1', 'ip nat outside', 'exit', 'ip nat inside source list 1 interface g0/0/1 overload', 'end'] },
        { dev: 'Router1', cli: ['conf t', 'interface g0/0/0', 'ip nat outside', 'interface g0/0/1', 'ip nat inside', 'exit', 'ip nat inside source static tcp 192.168.2.10 80 13.1.1.2 80', 'ip nat inside source static tcp 192.168.2.11 80 13.1.1.2 8000', 'end'] }
      ],
      explain: 'Après un ping ou une page web, <code>show ip nat translations</code> sur Router0 montre « 13.1.1.1:port ⟷ 192.168.1.x:port » (PAT), et sur Router1 les deux redirections statiques. Le navigateur de PC1 avec <code>http://13.1.1.2:8000</code> tombe bien sur WEB2.' }
  ]
  });
})();
