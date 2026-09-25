(window.MODULES = window.MODULES || []).push({
  id: 'bases', num: 1, icon: '🌐', titre: 'Les bases des réseaux',
  sous: 'Réseau, protocole, communications, commutation',
  source: 'IMT-2026 (présentation du module), osi-2024 (définition d’un protocole)',
  cours: `
<h3>1. Trois mots à connaître par cœur</h3>
<p>Le titre du module tient en trois mots. Ton prof les définit ainsi (slide « Concepts du titre ») :</p>
<table>
<tr><th>Mot</th><th>Définition du cours</th><th>En clair</th></tr>
<tr><td><b>Réseau</b></td><td>Ensemble de périphériques / services / équipements interconnectés afin d’<b>échanger des données</b>.</td><td>Des machines reliées qui se parlent.</td></tr>
<tr><td><b>Architecture</b></td><td><b>Organiser / structurer</b> l’interconnexion des divers composants pour répondre aux besoins en respectant les contraintes de <b>performances, disponibilité, évolutivité, coûts</b>…</td><td>Le plan de la maison avant de poser les câbles.</td></tr>
<tr><td><b>Protocole</b></td><td>Ensemble de <b>règles</b> permettant d’assurer une <b>compatibilité / interopérabilité</b> entre les divers composants du réseau.</td><td>La langue commune + le code de politesse.</td></tr>
</table>
<div class="nul"><b>🧠 L’analogie du cours :</b> quand tu demandes l’heure à quelqu’un, tu suis un protocole humain sans t’en rendre compte : « Bonjour » → « Bonjour » → « Quelle heure est-il ? » → « 14 h ». Si l’autre répond « je n’ai pas le temps », la communication s’arrête. Un protocole réseau, c’est exactement ça, mais entre des cartes réseau, des routeurs, des commutateurs… La couche <i>n</i> d’un ordinateur dialogue avec la couche <i>n</i> de l’autre : on parle de <b>protocole de couche n</b>.</div>

<h3>2. Que définit un modèle de communication ?</h3>
<p>Un modèle (OSI, TCP/IP… module suivant) répond à <b>4 questions</b>, dans cet ordre :</p>
<ol><li><b>Qu’est-ce qui circule ?</b> (les données)</li><li><b>Sous quelles formes ?</b> (segments, paquets, trames, bits…)</li><li><b>Quelles règles régissent le flux ?</b> (les protocoles)</li><li><b>Où cette circulation se fait-elle ?</b> (le support : câble, fibre, radio)</li></ol>
<p>Et pour communiquer, il faut maîtriser quelques <b>éléments de base</b> :</p>
<ul>
<li><b>L’encodage</b> du message : lui donner une forme compréhensible par les deux parties.</li>
<li><b>Le formatage et l’encapsulation</b> : structurer le message et ajouter les informations nécessaires à sa livraison (adresses, contrôles…).</li>
<li><b>La taille du message</b> : tenir compte des délais, des capacités des équipements, des pertes.</li>
<li><b>Le contrôle de flux</b> (<i>flow control</i>) : définir la quantité d’informations envoyées et la vitesse.</li>
<li><b>Le temps de réponse acceptable</b> : combien de temps attendre avant de considérer que c’est perdu.</li>
</ul>

<h3>3. Les 4 types de communication</h3>
<div class="figure"><svg viewBox="0 0 760 170" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<defs><marker id="ar1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#00bceb"/></marker></defs>
<g transform="translate(10,10)"><text x="80" y="12" text-anchor="middle" fill="#6fd6f5" font-weight="700">Unicast (1 → 1)</text>
<circle cx="25" cy="80" r="14" fill="#fbab18"/><circle cx="140" cy="45" r="12" fill="#6cc04a"/><circle cx="140" cy="80" r="12" fill="#556"/><circle cx="140" cy="115" r="12" fill="#556"/>
<path d="M40 76 L124 48" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ar1)"/></g>
<g transform="translate(200,10)"><text x="80" y="12" text-anchor="middle" fill="#6fd6f5" font-weight="700">Broadcast (1 → tous)</text>
<circle cx="25" cy="80" r="14" fill="#fbab18"/><circle cx="140" cy="45" r="12" fill="#6cc04a"/><circle cx="140" cy="80" r="12" fill="#6cc04a"/><circle cx="140" cy="115" r="12" fill="#6cc04a"/>
<path d="M40 76 L124 48 M40 80 L124 80 M40 84 L124 112" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ar1)"/></g>
<g transform="translate(390,10)"><text x="80" y="12" text-anchor="middle" fill="#6fd6f5" font-weight="700">Multicast (1 → groupe)</text>
<circle cx="25" cy="80" r="14" fill="#fbab18"/><circle cx="140" cy="45" r="12" fill="#6cc04a"/><circle cx="140" cy="80" r="12" fill="#556"/><circle cx="140" cy="115" r="12" fill="#6cc04a"/>
<path d="M40 76 L124 48 M40 84 L124 112" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ar1)"/></g>
<g transform="translate(580,10)"><text x="80" y="12" text-anchor="middle" fill="#6fd6f5" font-weight="700">Anycast (1 → le + proche)</text>
<circle cx="25" cy="80" r="14" fill="#fbab18"/><circle cx="140" cy="45" r="12" fill="#8a9bb3"/><circle cx="110" cy="80" r="12" fill="#6cc04a"/><circle cx="140" cy="115" r="12" fill="#8a9bb3"/>
<path d="M40 80 L94 80" stroke="#00bceb" stroke-width="2.5" marker-end="url(#ar1)"/></g>
</svg><div class="figcap">En vert : ceux qui reçoivent le message.</div></div>
<ul>
<li><b>Unicast</b> : un seul émetteur → un seul récepteur (le face-à-face).</li>
<li><b>Broadcast</b> (diffusion) : un émetteur → <b>tous</b> les récepteurs présents.</li>
<li><b>Multicast</b> (diffusion partielle) : un ou plusieurs émetteurs → un <b>groupe</b> de récepteurs.</li>
<li><b>Anycast</b> : le message est envoyé à <b>un seul</b> destinataire parmi un ensemble de cibles potentielles (en pratique, le plus proche). Tu le recroiseras en IPv6 et avec les serveurs DNS racine.</li>
</ul>

<h3>4. Topologies</h3>
<p>Une <b>topologie</b> caractérise la façon dont les équipements sont positionnés :</p>
<ul><li><b>Topologie physique</b> : relative au plan du réseau (où sont les câbles et les équipements : étoile, bus, anneau, maillée, arbre/étoile étendue).</li>
<li><b>Topologie logique</b> : la façon dont les <b>informations circulent</b> (ex. : avec un concentrateur, le câblage est en étoile mais le signal est diffusé comme sur un bus).</li></ul>
<div class="tip"><b>✔ Aujourd’hui</b>, un LAN d’entreprise est presque toujours en <b>étoile / étoile étendue (arbre)</b> : des PC reliés à un commutateur d’étage, lui-même relié à un commutateur central (le « backbone » de ton TP Datamax).</div>

<h3>5. La commutation : comment les données traversent le réseau</h3>
<p>La commutation, c’est acheminer les données sur des liaisons <b>partagées</b>. Quatre familles :</p>
<table>
<tr><th>Type</th><th>Principe</th><th>À retenir</th></tr>
<tr><td><b>De circuits</b></td><td>Établit une liaison physique temporaire pendant toute la durée de la communication (multiplexage FDM, TDM).</td><td><b>Capacité garantie</b> dès l’établissement de la connexion (le téléphone « à l’ancienne »).</td></tr>
<tr><td><b>De messages</b></td><td>Le message entier est transmis en un bloc, de nœud en nœud.</td><td>Gros blocs → délais importants.</td></tr>
<tr><td><b>De paquets</b></td><td>Le message est découpé en <b>paquets</b>, chacun contenant les adresses source et destination (datagramme).</td><td><b>Meilleure utilisation des ressources</b> : c’est Internet (IP).</td></tr>
<tr><td><b>Circuit virtuel</b></td><td>Connexion <b>logique</b> établie au début de l’échange entre émetteur et récepteur.</td><td>Bande passante allouée <b>à la demande</b>.</td></tr>
</table>

<h3>6. Méthodes d’accès au support</h3>
<p>Quand plusieurs machines partagent un même canal, il faut des règles pour savoir qui parle :</p>
<ul>
<li><b>La contention</b> (sans arbitrage) : chaque station émet quand elle en a besoin, après avoir <b>écouté la porteuse</b>. Les collisions éventuelles doivent être détectées / gérées : <b>CSMA/CD</b> (Ethernet filaire : <i>Collision Detection</i>) et <b>CSMA/CA</b> (Wi-Fi : <i>Collision Avoidance</i>, une seule machine émet à un instant t).</li>
<li><b>L’interrogation (polling)</b> : un équipement « chef » donne la parole à tour de rôle.</li>
<li><b>Le jeton</b> : une petite trame (le jeton) circule de poste en poste ; seul celui qui l’a peut émettre.</li>
</ul>

<h3>7. Ce qui joue sur les performances</h3>
<ul>
<li>le <b>débit</b> du réseau ;</li><li>la vitesse de traversée des équipements (<b>temps de latence</b>) ;</li>
<li>l’<b>architecture</b> (nombre moyen d’équipements traversés) ;</li><li>la <b>surcharge du réseau</b> (volume moyen de trames) ;</li>
<li>le <b>temps de propagation</b> des signaux ;</li><li>la <b>surcharge du protocole</b> (en-têtes, trames d’acquittement) et l’<b>encapsulation</b> ;</li>
<li>la <b>perte de paquets</b> (collisions, erreurs de transmission).</li>
</ul>

<h3>8. Qui fixe les règles ? L’IETF et les RFC</h3>
<p>L’<b>IETF</b> (<i>Internet Engineering Task Force</i>) standardise les protocoles d’Internet. C’est un groupe <b>informel de volontaires</b> qui fonctionne au <b>consensus approximatif</b> (<i>rough consensus</i>) ; l’<b>IESG</b> décide si un travail fait consensus. Chaque résultat est publié sous forme de <b>RFC</b> (<i>Request For Comments</i>) ; avant d’être une RFC, le document est un <b>ID</b> (<i>Internet Draft</i>, document de travail).</p>
<div class="memo"><b>📌 Exemples de RFC que tu croiseras :</b> RFC 1918 (adresses IPv4 privées), RFC 2281 (HSRP), RFC 1034/1035 (DNS), RFC 2616 (HTTP/1.1), RFC 5321 (SMTP), RFC 4193 (adresses IPv6 ULA).</div>
<div class="tip"><b>🖥️ Packet Tracer</b> : dans ce cours, tu vas manipuler un <b>Packet Tracer intégré</b> qui reproduit l’interface du vrai (menus, palette d’équipements en bas à gauche, fenêtres Physical / Config / CLI / Desktop…). Les premiers labos arrivent dès le module 3.</div>
`,
  questions: [
    { id: 'b1', type: 'qcm', q: 'D’après ton cours, qu’est-ce qu’un <b>protocole</b> ?',
      choices: ['Un câble qui relie deux équipements', 'Un ensemble de règles permettant d’assurer la compatibilité / l’interopérabilité entre les composants du réseau', 'Un logiciel qui accélère Internet', 'Une adresse unique attribuée à chaque machine'],
      good: 1, hints: ['Pense à l’exemple « Bonjour / Quelle heure est-il ? » du cours.', 'C’est un ensemble de <b>règles</b>…'],
      explain: 'Un protocole = des <b>règles / conventions</b> qui déterminent le format et la transmission des données. La couche n d’un ordinateur dialogue avec la couche n d’un autre grâce au « protocole de couche n ».' },
    { id: 'b2', type: 'qcm', q: 'L’<b>architecture</b> d’un réseau, c’est…',
      choices: ['Le nombre de câbles utilisés', 'Organiser / structurer l’interconnexion des composants pour répondre aux besoins en respectant des contraintes (performances, disponibilité, évolutivité, coûts…)', 'La marque des équipements', 'La vitesse maximale du réseau'],
      good: 1, hints: ['C’est « le plan de la maison avant de poser les câbles ».'],
      explain: 'Architecture = <b>organiser, structurer</b> l’interconnexion pour répondre aux besoins sous contraintes (performances, disponibilité, évolutivité, coûts).' },
    { id: 'b3', type: 'order', q: 'Un modèle de communication répond à 4 questions. Remets-les dans l’ordre du cours.',
      items: ['Qu’est-ce qui circule ?', 'Sous quelles formes ?', 'Quelles règles régissent le flux ?', 'Où cette circulation se fait-elle ?'],
      hints: ['On part des <b>données</b>, puis leur <b>forme</b>, puis les <b>règles</b>, et enfin le <b>support</b>.'],
      explain: 'Données → formes (segments, paquets, trames, bits) → règles (protocoles) → support (câble, fibre, radio).' },
    { id: 'b4', type: 'match', q: 'Associe chaque type de communication à sa définition.',
      pairs: [['Unicast', 'Un émetteur vers un seul récepteur'], ['Broadcast', 'Un émetteur vers tous les récepteurs présents'], ['Multicast', 'Un ou plusieurs émetteurs vers un groupe de récepteurs'], ['Anycast', 'Vers un destinataire parmi un ensemble de cibles potentielles']],
      hints: ['« Broad » = large : tout le monde reçoit.', '« Any » = n’importe lequel : un seul destinataire parmi plusieurs possibles.'],
      explain: 'Retiens : <b>uni</b> = un, <b>broad</b> = tous, <b>multi</b> = un groupe, <b>any</b> = n’importe lequel (le plus proche).' },
    { id: 'b5', type: 'qcm', q: 'Un PC envoie une requête « Qui a l’adresse IP 192.168.1.254 ? » que <b>toutes</b> les machines du réseau local reçoivent. De quel type de communication s’agit-il ?',
      choices: ['Unicast', 'Broadcast', 'Multicast', 'Anycast'], good: 1,
      hints: ['Tout le monde reçoit le message…'],
      explain: 'C’est un <b>broadcast</b> (diffusion). Tu verras que c’est exactement ce que fait <b>ARP</b> pour trouver une adresse MAC.' },
    { id: 'b6', type: 'match', q: 'Associe chaque type de commutation à sa caractéristique.',
      pairs: [['Commutation de circuits', 'Capacité de transfert garantie dès l’établissement de la connexion'], ['Commutation de messages', 'Le message est transmis en un seul bloc, de nœud en nœud'], ['Commutation de paquets', 'Message découpé en datagrammes contenant adresses source et destination'], ['Circuit virtuel', 'Connexion logique établie au début de l’échange, bande passante à la demande']],
      hints: ['Le téléphone « à l’ancienne » réservait une ligne : capacité garantie.', 'Internet (IP) fonctionne en paquets.'],
      explain: 'Circuits = liaison physique réservée (FDM/TDM) ; messages = gros blocs ; paquets = datagrammes (IP) ; circuit virtuel = connexion logique, bande passante allouée à la demande.' },
    { id: 'b7', type: 'qcm', q: 'Quelle méthode d’accès au support est utilisée par le <b>Wi-Fi</b> ?',
      choices: ['CSMA/CD (détection de collision)', 'CSMA/CA (évitement de collision)', 'Le jeton', 'L’interrogation (polling)'], good: 1,
      hints: ['En Wi-Fi, une seule machine émet à un instant t pour <b>éviter</b> les collisions.'],
      explain: 'Wi-Fi = <b>CSMA/CA</b> (<i>Collision Avoidance</i>). L’Ethernet filaire historique utilisait <b>CSMA/CD</b> (<i>Collision Detection</i>).' },
    { id: 'b8', type: 'qcm', q: 'Quelle est la différence entre topologie physique et topologie logique ?',
      choices: ['Il n’y en a aucune', 'La physique décrit le plan (câbles, équipements), la logique décrit la façon dont les informations circulent', 'La logique décrit le plan, la physique décrit les logiciels', 'La physique concerne le Wi-Fi, la logique le filaire'], good: 1,
      hints: ['« Physique » = ce que tu vois ; « logique » = ce que font les données.'],
      explain: 'Exemple : avec un concentrateur (hub), le câblage est en <b>étoile</b> (physique) mais le signal est répété partout comme sur un <b>bus</b> (logique).' },
    { id: 'b9', type: 'multi', q: 'Parmi ces éléments, lesquels influencent les <b>performances</b> d’une communication réseau (d’après ton cours) ? Coche tout ce qui convient.',
      choices: ['Le débit du réseau', 'Le temps de latence des équipements traversés', 'La surcharge du protocole (en-têtes, acquittements)', 'La couleur des câbles', 'La perte de paquets', 'Le temps de propagation des signaux'],
      good: [0, 1, 2, 4, 5], hints: ['Un seul intrus dans la liste…'],
      explain: 'Débit, latence, architecture (nb d’équipements traversés), surcharge réseau, propagation, surcharge protocolaire / encapsulation, pertes. La couleur des câbles n’y est pour rien (elle sert juste à les repérer !).' },
    { id: 'b10', type: 'text', q: 'Quel organisme <b>standardise les protocoles d’Internet</b> (sigle anglais de 4 lettres) ?', kind: 'word', accept: ['IETF'],
      ph: 'Sigle…', hints: ['Internet Engineering Task Force.'],
      explain: 'L’<b>IETF</b> (Internet Engineering Task Force), groupe informel de volontaires fonctionnant au « rough consensus ».' },
    { id: 'b11', type: 'text', q: 'Comment s’appellent les documents publiés par l’IETF (sigle de 3 lettres) ?', kind: 'word', accept: ['RFC'],
      hints: ['Request For …'], ph: 'Sigle…',
      explain: '<b>RFC</b> = Request For Comments. Avant d’être une RFC, le document est un Internet Draft (ID).' },
    { id: 'b12', type: 'qcm', q: 'Avec la <b>commutation de paquets</b>, que contient chaque paquet pour pouvoir être acheminé indépendamment ?',
      choices: ['Uniquement les données', 'Les adresses source et destination', 'Un jeton', 'Le numéro de circuit physique réservé'], good: 1,
      hints: ['Chaque paquet doit pouvoir trouver seul son chemin.'],
      explain: 'Chaque paquet (datagramme) porte les <b>adresses source et destination</b> : c’est le principe d’IP, qui traite chaque datagramme indépendamment.' }
  ]
});
