(window.MODULES = window.MODULES || []).push({
  id: 'osi', num: 2, icon: '🧅', titre: 'Modèles OSI et TCP/IP',
  sous: '7 couches, encapsulation, PDU, TCP/UDP, en-tête IP',
  source: 'osi-2024.pdf, IMT-2026, PROTOCOLE IP.pdf',
  cours: `
<h3>1. Pourquoi un modèle en couches ?</h3>
<p>Au début de l’informatique, chaque constructeur faisait son réseau dans son coin : impossible de faire parler deux réseaux entre eux. L’<b>ISO</b> (Organisation internationale de normalisation) a donc publié en <b>1984</b> le <b>modèle de référence OSI</b> pour garantir l’<b>interopérabilité</b>.</p>
<div class="nul"><b>🧠 L’analogie de l’oignon (ou des poupées russes) :</b> pour envoyer une lettre, tu écris le texte (données), tu le mets dans une enveloppe avec l’adresse (en-tête), la poste le met dans un sac avec l’étiquette du centre de tri (autre en-tête), puis dans un camion… À l’arrivée, on ouvre chaque emballage dans l’ordre inverse. Chaque couche ne s’occupe que de <b>son</b> emballage.</div>
<p>Les avantages du découpage en couches (d’après ton cours) :</p>
<ul><li>il <b>réduit la complexité</b> : un gros problème → 7 petits problèmes ;</li>
<li>il <b>uniformise</b> les éléments du réseau → développement <b>multiconstructeur</b> et interopérabilité ;</li>
<li>il <b>empêche les changements apportés à une couche d’affecter les autres</b> (développement plus rapide).</li></ul>
<p>Règle d’or : <b>la couche <i>n</i> d’un ordinateur communique avec la couche <i>n</i> d’un autre ordinateur</b> ; les règles de ce dialogue s’appellent le <b>protocole de couche n</b>.</p>

<h3>2. Les 7 couches OSI</h3>
<div class="figure"><svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<g font-weight="700">
<rect x="10" y="10" width="330" height="38" rx="6" fill="#7b3fa0"/><text x="22" y="34" fill="#fff">7 · Application</text>
<rect x="10" y="54" width="330" height="38" rx="6" fill="#8f4fb5"/><text x="22" y="78" fill="#fff">6 · Présentation</text>
<rect x="10" y="98" width="330" height="38" rx="6" fill="#a35fc9"/><text x="22" y="122" fill="#fff">5 · Session</text>
<rect x="10" y="142" width="330" height="38" rx="6" fill="#049fd9"/><text x="22" y="166" fill="#fff">4 · Transport</text>
<rect x="10" y="186" width="330" height="38" rx="6" fill="#2e9e4f"/><text x="22" y="210" fill="#fff">3 · Réseau</text>
<rect x="10" y="230" width="330" height="38" rx="6" fill="#d98b0b"/><text x="22" y="254" fill="#fff">2 · Liaison de données</text>
<rect x="10" y="274" width="330" height="38" rx="6" fill="#c0392b"/><text x="22" y="298" fill="#fff">1 · Physique</text>
</g>
<g fill="#fff" font-size="12"><text x="200" y="34">HTTP, DNS, SMTP…</text><text x="200" y="78">formats, chiffrement</text><text x="200" y="122">ouvre/ferme sessions</text><text x="200" y="166">TCP, UDP · ports</text><text x="200" y="210">IP · routeur</text><text x="200" y="254">MAC · switch</text><text x="200" y="298">bits · câble, hub</text></g>
<g font-weight="700" fill="#6fd6f5"><text x="370" y="78">Données</text><text x="370" y="166">Segment</text><text x="370" y="210">Paquet</text><text x="370" y="254">Trame</text><text x="370" y="298">Bits</text></g>
<path d="M360 20 V120" stroke="#6fd6f5" stroke-width="2"/>
<g transform="translate(470,10)" font-size="12">
<text x="0" y="12" fill="#6fd6f5" font-weight="700">Modèle TCP/IP (4 couches)</text>
<rect x="0" y="20" width="270" height="120" rx="6" fill="#5b2c83"/><text x="12" y="84" fill="#fff" font-weight="700">Application (OSI 5-6-7)</text>
<rect x="0" y="146" width="270" height="34" rx="6" fill="#049fd9"/><text x="12" y="168" fill="#fff" font-weight="700">Transport (OSI 4)</text>
<rect x="0" y="186" width="270" height="34" rx="6" fill="#2e9e4f"/><text x="12" y="208" fill="#fff" font-weight="700">Internet (OSI 3)</text>
<rect x="0" y="226" width="270" height="78" rx="6" fill="#b5651d"/><text x="12" y="262" fill="#fff" font-weight="700">Accès au réseau (OSI 1-2)</text><text x="12" y="280" fill="#fff">« hôte-réseau »</text>
</g></svg><div class="figcap">Les 7 couches OSI, le nom des PDU et la correspondance avec les 4 couches TCP/IP.</div></div>
<div class="memo"><b>📌 Moyen mnémotechnique</b> (de la couche 1 à la 7) : « <b>P</b>our <b>L</b>e <b>R</b>éseau, <b>T</b>out <b>S</b>e <b>P</b>asse <b>A</b>utomatiquement » → Physique, Liaison, Réseau, Transport, Session, Présentation, Application.</div>
<table>
<tr><th>Couche</th><th>Rôle (d’après ton poly)</th><th>Exemples</th></tr>
<tr><td><b>7 Application</b></td><td>La plus proche de l’utilisateur : fournit des services réseau <b>aux applications</b> (pas aux autres couches). Détermine la disponibilité des partenaires.</td><td>HTTP, DNS, SMTP, FTP, DHCP</td></tr>
<tr><td><b>6 Présentation</b></td><td>S’assure que les données sont <b>lisibles</b> par l’autre système : traduit les formats en un format commun.</td><td>encodage, compression, chiffrement</td></tr>
<tr><td><b>5 Session</b></td><td><b>Ouvre, gère et ferme les sessions</b> entre deux hôtes, synchronise le dialogue.</td><td>—</td></tr>
<tr><td><b>4 Transport</b></td><td><b>Segmente</b> les données à l’émission et les rassemble à la réception ; fiabilité, <b>détection/correction d’erreurs</b>, <b>contrôle de flux</b>.</td><td>TCP, UDP (ports)</td></tr>
<tr><td><b>3 Réseau</b></td><td>Connectivité et <b>sélection du chemin</b> entre deux hôtes éloignés : <b>routage et adressage logique</b>.</td><td>IP, ICMP · <b>routeur</b></td></tr>
<tr><td><b>2 Liaison de données</b></td><td>Transit fiable sur une liaison physique : <b>adressage physique (MAC)</b>, accès au réseau, notification d’erreurs, livraison ordonnée des trames.</td><td>Ethernet, 802.1Q · <b>commutateur</b></td></tr>
<tr><td><b>1 Physique</b></td><td>Spécifications <b>électriques, mécaniques, procédurales et fonctionnelles</b> : tensions, débits, distances max, connecteurs.</td><td>câbles, RJ45, fibre · <b>hub</b></td></tr>
</table>
<p>Les couches 5-6-7 se rapportent aux <b>applications</b> ; les <b>4 couches inférieures</b> se rapportent au <b>transport des données</b>.</p>

<h3>3. L’encapsulation</h3>
<p>En descendant les couches, les données reçoivent des <b>en-têtes</b> (et une <b>en-queue</b> en couche 2). Chaque couche échange avec sa jumelle des <b>PDU</b> (<i>Protocol Data Unit</i>). Les <b>5 étapes</b> de ton cours :</p>
<ol>
<li><b>Construction des données</b> (couches hautes) : le mail devient des données.</li>
<li><b>Préparation au transport de bout en bout</b> : découpage en <b>segments</b> (couche 4).</li>
<li><b>Ajout de l’adresse réseau</b> : <b>paquets</b> (datagrammes) avec IP source et destination (couche 3).</li>
<li><b>Ajout de l’adresse locale</b> (en-tête de liaison) : <b>trame</b> avec les adresses MAC vers le prochain équipement (couche 2).</li>
<li><b>Conversion en bits</b> pour la transmission sur le média (couche 1).</li>
</ol>
<div class="figure"><svg viewBox="0 0 700 150" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12" font-weight="700">
<rect x="330" y="8" width="160" height="26" fill="#7b3fa0"/><text x="410" y="26" fill="#fff" text-anchor="middle">Données</text>
<rect x="260" y="40" width="70" height="26" fill="#049fd9"/><text x="295" y="58" fill="#fff" text-anchor="middle">En-tête TCP</text><rect x="330" y="40" width="160" height="26" fill="#7b3fa0"/><text x="410" y="58" fill="#fff" text-anchor="middle">Données</text><text x="520" y="58" fill="#6fd6f5">= Segment</text>
<rect x="190" y="72" width="70" height="26" fill="#2e9e4f"/><text x="225" y="90" fill="#fff" text-anchor="middle">En-tête IP</text><rect x="260" y="72" width="230" height="26" fill="#3a6d8c"/><text x="375" y="90" fill="#fff" text-anchor="middle">segment</text><text x="520" y="90" fill="#6fd6f5">= Paquet</text>
<rect x="120" y="104" width="70" height="26" fill="#d98b0b"/><text x="155" y="122" fill="#fff" text-anchor="middle">En-tête MAC</text><rect x="190" y="104" width="300" height="26" fill="#3a6d8c"/><text x="340" y="122" fill="#fff" text-anchor="middle">paquet</text><rect x="490" y="104" width="50" height="26" fill="#d98b0b"/><text x="515" y="122" fill="#fff" text-anchor="middle">FCS</text><text x="560" y="122" fill="#6fd6f5">= Trame</text>
</svg><div class="figcap">Chaque couche emballe ce que lui donne la couche du dessus. La couche 2 ajoute aussi une en-queue (FCS, contrôle d’erreur).</div></div>

<h3>4. Le modèle TCP/IP</h3>
<p>Créé par le <b>ministère américain de la Défense</b> (DoD), qui voulait un réseau capable de résister à toutes les conditions, même à une guerre nucléaire. C’est la norme <b>ouverte</b> d’Internet. <b>4 couches</b> : <b>Application</b>, <b>Transport</b>, <b>Internet</b>, <b>Accès au réseau</b> (aussi appelée <i>hôte-réseau</i>).</p>
<ul>
<li>La couche <b>Application</b> TCP/IP regroupe les couches OSI 5, 6 et 7.</li>
<li>La couche <b>Accès au réseau</b> regroupe les couches OSI 1 et 2 (technologies LAN/WAN).</li>
<li>Dans TCP/IP, <b>IP est le seul et unique protocole</b> de la couche Internet, quel que soit le transport ou l’application : choix délibéré, IP est universel.</li>
<li>OSI préconise une parfaite indépendance des couches ; dans TCP/IP les frontières sont <b>plus perméables</b>. OSI est jugé « obsolète » face à l’omniprésence d’IP, mais reste <b>LA référence</b> pour décrire le réseau.</li>
</ul>

<h3>5. TCP ou UDP ?</h3>
<table>
<tr><th></th><th>TCP (Transmission Control Protocol)</th><th>UDP (User Datagram Protocol)</th></tr>
<tr><td>Connexion</td><td><b>Orienté connexion</b> (échange de segments pour établir la connexion logique, la « poignée de main »)</td><td><b>Sans connexion</b></td></tr>
<tr><td>Fiabilité</td><td>Fiable : acquittements, retransmission, remise en ordre, contrôle de flux</td><td>Aucune garantie (rapide et léger)</td></tr>
<tr><td>Exemples</td><td>HTTP (80), HTTPS (443), SMTP (25), POP3 (110), IMAP (143), FTP (20/21), SSH (22), Telnet (23)</td><td>DNS (53), DHCP (67 serveur / 68 client), TFTP (69), streaming, VoIP</td></tr>
</table>
<div class="warnbox"><b>⚠ Piège :</b> « orienté connexion » ne veut pas dire qu’il existe un circuit physique (ce serait de la commutation de circuits). TCP reste de la <b>commutation de paquets</b> : il échange juste des segments pour confirmer l’existence logique de la connexion.</div>
<div class="tip"><b>✔ Et DNS ?</b> DNS utilise <b>UDP 53</b> pour les requêtes classiques, et TCP 53 pour les gros transferts (transferts de zone).</div>

<h3>6. Le protocole IP (couche 3)</h3>
<p>IP assure l’acheminement <b>au mieux</b> (<i>best-effort delivery</i>) des <b>datagrammes</b>, traités <b>indépendamment les uns des autres</b>. IP est <b>non fiable</b> : aucune garantie contre la corruption, le désordre, la perte ou l’absence de réémission. Pourquoi ? Pour garder des <b>routeurs simples et rapides</b> : l’intelligence est déportée aux extrémités (TCP).</p>
<p>IP détermine le destinataire grâce à 3 paramètres de l’hôte : <b>adresse IP</b>, <b>masque</b>, <b>passerelle par défaut</b> (à qui remettre le paquet si la destination n’est pas sur le réseau local).</p>
<h4>L’en-tête IPv4 (20 octets sans options)</h4>
<table>
<tr><th>Champ</th><th>Taille</th><th>À retenir</th></tr>
<tr><td>Version</td><td>4 bits</td><td>4 pour IPv4</td></tr>
<tr><td>IHL (longueur d’en-tête)</td><td>4 bits</td><td>en mots de 32 bits : <b>5 par défaut = 20 octets</b> (jusqu’à 15 avec options)</td></tr>
<tr><td>Type de service (ToS)</td><td>8 bits</td><td>qualité de service</td></tr>
<tr><td>Longueur totale</td><td>16 bits</td><td>en-tête + données, max <b>65 535</b> octets</td></tr>
<tr><td>Identification, Flags (DF, MF), Offset</td><td>16 + 3 + 13 bits</td><td><b>fragmentation</b> quand le paquet dépasse le <b>MTU</b> (1500 octets en Ethernet)</td></tr>
<tr><td><b>TTL</b> (durée de vie)</td><td>8 bits</td><td>décrémenté à chaque routeur ; à 0 → paquet détruit + message <b>ICMP</b> à l’émetteur. Évite les paquets « fantômes » qui tournent en rond.</td></tr>
<tr><td><b>Protocole</b></td><td>8 bits</td><td><b>1 = ICMP</b>, 2 = IGMP, <b>6 = TCP</b>, <b>17 = UDP</b></td></tr>
<tr><td>Checksum d’en-tête</td><td>16 bits</td><td>recalculé par chaque routeur (car le TTL change) et par le NAT</td></tr>
<tr><td>Adresses source / destination</td><td>32 bits chacune</td><td>A.B.C.D</td></tr>
</table>
<div class="memo"><b>📌 IPv4 vs IPv6 :</b> IPv4 = <b>32 bits</b> (2<sup>32</sup> ≈ 4,3 milliards d’adresses) ; IPv6 = <b>128 bits</b> (≈ 3,4×10<sup>38</sup>). La pénurie IPv4 a été compensée par les <b>sous-réseaux</b>, le <b>CIDR</b>, les <b>adresses privées + NAT</b>, puis IPv6.</div>

<h3>7. ARP : le lien entre IP et MAC</h3>
<p>Pour envoyer une trame sur le LAN, il faut l’<b>adresse MAC</b> du destinataire. <b>ARP</b> (<i>Address Resolution Protocol</i>) la trouve : le PC diffuse (broadcast) « Qui a l’IP 192.168.1.20 ? », la machine concernée répond avec sa MAC, et la paire IP/MAC est stockée dans la <b>table ARP</b> (en RAM). Si la destination est sur un <b>autre réseau</b>, le PC demande la MAC de sa <b>passerelle par défaut</b>. Les routeurs <b>ne laissent pas passer les broadcasts</b>.</p>
<div class="tip"><b>🖥️ Dans Packet Tracer :</b> c’est pour ça que le <b>premier ping</b> perd souvent un paquet (« Request timed out ») : le temps que la requête ARP obtienne la réponse. Tu peux voir la table avec <code>arp -a</code> sur un PC et <code>show arp</code> sur un routeur.</div>
`,
  questions: [
    { id: 'o1', type: 'order', q: 'Remets les 7 couches du modèle OSI dans l’ordre, de la couche <b>1</b> (en haut de la liste) à la couche <b>7</b>.',
      items: ['Physique', 'Liaison de données', 'Réseau', 'Transport', 'Session', 'Présentation', 'Application'],
      hints: ['« Pour Le Réseau, Tout Se Passe Automatiquement ».', 'On commence par le câble (Physique) et on finit par ce que voit l’utilisateur (Application).'],
      explain: '1 Physique, 2 Liaison, 3 Réseau, 4 Transport, 5 Session, 6 Présentation, 7 Application.' },
    { id: 'o2', type: 'qcm', q: 'Quel organisme a publié le modèle de référence OSI, et en quelle année ?',
      choices: ['L’IETF, en 1974', 'L’ISO, en 1984', 'Le DoD américain, en 1984', 'L’IEEE, en 1990'], good: 1,
      hints: ['OSI = Open Systems Interconnection, publié par l’Organisation internationale de normalisation.'],
      explain: 'L’<b>ISO</b> a publié le modèle OSI en <b>1984</b>. Le modèle TCP/IP, lui, vient du <b>DoD</b> (ministère américain de la Défense).' },
    { id: 'o3', type: 'match', q: 'Associe chaque couche OSI à son rôle.',
      pairs: [['Application (7)', 'Fournit des services réseau aux applications de l’utilisateur'], ['Présentation (6)', 'Traduit les formats de données en un format commun lisible'], ['Session (5)', 'Ouvre, gère et ferme les sessions entre deux hôtes'], ['Transport (4)', 'Segmente les données, fiabilité et contrôle de flux'], ['Réseau (3)', 'Sélection du chemin, routage et adressage logique'], ['Liaison de données (2)', 'Adressage physique (MAC) et transit fiable sur une liaison'], ['Physique (1)', 'Spécifications électriques et mécaniques, tensions, connecteurs']],
      hints: ['Le routage, c’est l’affaire de la couche où travaille le routeur.', 'L’adresse MAC est dite « physique » mais elle est gérée par la couche 2.'],
      explain: 'Retiens les mots-clés : 7 services aux applis, 6 formats, 5 sessions, 4 segments/fiabilité, 3 chemin/IP, 2 MAC/trames, 1 bits/câbles.' },
    { id: 'o4', type: 'match', q: 'Quel est le nom du PDU (unité de données) à chaque couche ?',
      pairs: [['Couche 4 Transport', 'Segment'], ['Couche 3 Réseau', 'Paquet'], ['Couche 2 Liaison', 'Trame'], ['Couche 1 Physique', 'Bits']],
      extra: ['Données'],
      hints: ['Les étapes de l’encapsulation : données → segments → paquets → trames → bits.'],
      explain: 'Transport = <b>segment</b>, Réseau = <b>paquet</b> (datagramme), Liaison = <b>trame</b>, Physique = <b>bits</b>. Les couches 5-6-7 manipulent des <b>données</b>.' },
    { id: 'o5', type: 'order', q: 'Remets dans l’ordre les 5 étapes de l’<b>encapsulation</b> décrites dans ton cours.',
      items: ['Construction des données', 'Préparation des données pour le transport de bout en bout (segments)', 'Ajout de l’adresse réseau à l’en-tête (paquets)', 'Ajout de l’adresse locale à l’en-tête de liaison (trame)', 'Conversion en bits pour la transmission'],
      hints: ['On descend les couches : 7 → 4 → 3 → 2 → 1.'],
      explain: 'Données → segments (transport) → paquets avec IP (réseau) → trames avec MAC (liaison) → bits (physique). À la réception, on fait l’inverse : la <b>désencapsulation</b>.' },
    { id: 'o6', type: 'qcm', q: 'Combien de couches compte le modèle <b>TCP/IP</b> ?', choices: ['4', '5', '7', '3'], good: 0,
      hints: ['Application, Transport, Internet, …'],
      explain: '4 couches : <b>Application</b>, <b>Transport</b>, <b>Internet</b>, <b>Accès au réseau</b>.' },
    { id: 'o7', type: 'match', q: 'À quelle(s) couche(s) OSI correspond chaque couche TCP/IP ?',
      pairs: [['Application (TCP/IP)', 'Couches 5, 6 et 7'], ['Transport (TCP/IP)', 'Couche 4'], ['Internet (TCP/IP)', 'Couche 3'], ['Accès au réseau (TCP/IP)', 'Couches 1 et 2']],
      hints: ['TCP/IP a « fusionné » les 3 couches du haut et les 2 couches du bas.'],
      explain: 'Les concepteurs de TCP/IP ont regroupé Session + Présentation + Application dans une seule couche Application, et Physique + Liaison dans Accès au réseau.' },
    { id: 'o8', type: 'multi', q: 'Parmi ces protocoles applicatifs, lesquels utilisent <b>TCP</b> ?',
      choices: ['HTTP', 'SMTP', 'DHCP', 'SSH', 'TFTP', 'POP3'], good: [0, 1, 3, 5],
      hints: ['DHCP et TFTP privilégient la légèreté (pas de connexion).', 'Les protocoles de messagerie et le web ont besoin de fiabilité.'],
      explain: 'TCP : HTTP (80), SMTP (25), SSH (22), POP3 (110). UDP : DHCP (67/68), TFTP (69), DNS en général (53).' },
    { id: 'o9', type: 'match', q: 'Associe chaque protocole à son numéro de port (bien connu).',
      pairs: [['HTTP', '80'], ['HTTPS', '443'], ['DNS', '53'], ['SMTP', '25'], ['SSH', '22'], ['Telnet', '23'], ['POP3', '110'], ['IMAP', '143']],
      hints: ['Le web : 80 en clair, 443 chiffré.', 'SSH (22) et Telnet (23) se suivent.'],
      explain: 'À connaître par cœur pour le NAT (redirection de ports) et les services : 80, 443, 53, 25, 22, 23, 110, 143 (et DHCP 67/68).' },
    { id: 'o10', type: 'qcm', q: 'Pourquoi dit-on que le protocole IP est <b>non fiable</b> ?',
      choices: ['Parce qu’il est trop vieux', 'Parce qu’il ne garantit ni l’ordre, ni l’arrivée, ni l’intégrité des datagrammes (best-effort)', 'Parce qu’il perd volontairement 1 paquet sur 10', 'Parce qu’il ne connaît pas l’adresse de destination'], good: 1,
      hints: ['Best-effort = « je fais de mon mieux, sans promesse ».'],
      explain: 'IP fait du <b>best-effort</b> : pas de garantie contre la perte, le désordre, la corruption, pas de réémission. Objectif : des routeurs simples et rapides ; la fiabilité est assurée aux extrémités (TCP).' },
    { id: 'o11', type: 'text', q: 'Dans l’en-tête IP, quel champ est <b>décrémenté</b> à chaque traversée de routeur et provoque la destruction du paquet quand il atteint 0 ? (sigle)', kind: 'word', accept: ['TTL', 'Time To Live', 'durée de vie'],
      hints: ['Time To …'], ph: 'Sigle…',
      explain: 'Le <b>TTL</b> (Time To Live). À 0, le paquet est détruit et un message <b>ICMP</b> est renvoyé à l’émetteur. C’est le principe de <code>tracert</code> / <code>traceroute</code>.' },
    { id: 'o12', type: 'text', q: 'Complète les valeurs du champ <b>Protocole</b> de l’en-tête IP.',
      fields: [{ label: 'ICMP =', kind: 'int', answer: 1 }, { label: 'TCP =', kind: 'int', answer: 6 }, { label: 'UDP =', kind: 'int', answer: 17 }],
      hints: ['Tous sont des petits nombres ; UDP est le seul au-dessus de 10.'],
      explain: 'ICMP = 1, IGMP = 2, TCP = 6, UDP = 17.' },
    { id: 'o13', type: 'text', q: 'Le champ IHL d’un en-tête IP sans options vaut 5. Quelle est la taille de l’en-tête en <b>octets</b> ?', kind: 'int', accept: 20,
      hints: ['IHL est exprimé en mots de 32 bits.', '32 bits = 4 octets.'],
      explain: '5 × 32 bits = 160 bits = <b>20 octets</b>. Avec options, IHL peut aller jusqu’à 15 (60 octets).' },
    { id: 'o14', type: 'qcm', q: 'Quelle est la taille du <b>MTU</b> d’une trame Ethernet, au-delà de laquelle IP doit fragmenter ?',
      choices: ['512 octets', '1500 octets', '65 535 octets', '9000 octets'], good: 1,
      hints: ['C’est la valeur par défaut qu’on voit dans <code>show interfaces</code> : « MTU … bytes ».'],
      explain: 'MTU Ethernet = <b>1500 octets</b>. Au-delà, IP fragmente (champs Identification, Flags DF/MF, Offset).' },
    { id: 'o15', type: 'qcm', q: 'Un PC veut envoyer un paquet à un serveur situé sur un <b>autre réseau</b>. De quelle adresse MAC a-t-il besoin pour construire la trame ?',
      choices: ['La MAC du serveur distant', 'La MAC de sa passerelle par défaut (le routeur)', 'La MAC de broadcast FF:FF:FF:FF:FF:FF', 'Aucune, IP suffit'], good: 1,
      hints: ['La trame (couche 2) ne va que jusqu’au <b>prochain</b> équipement.'],
      explain: 'L’IP de destination reste celle du serveur, mais la trame est adressée à la <b>MAC de la passerelle</b> (obtenue par ARP). Chaque routeur refait une nouvelle trame pour le saut suivant.' },
    { id: 'o16', type: 'qcm', q: 'Quel protocole permet de trouver l’adresse MAC correspondant à une adresse IP du réseau local ?',
      choices: ['DNS', 'DHCP', 'ARP', 'ICMP'], good: 2,
      hints: ['Address Resolution Protocol.'],
      explain: '<b>ARP</b> diffuse une requête (broadcast) et la machine concernée répond avec sa MAC. DNS, lui, traduit un <b>nom</b> en IP.' }
  ]
});
