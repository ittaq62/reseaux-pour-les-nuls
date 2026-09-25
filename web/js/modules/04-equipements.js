(window.MODULES = window.MODULES || []).push({
  id: 'equipements', num: 4, icon: '🗄️', titre: 'Équipements et segmentation',
  sous: 'Hub, switch, routeur, domaines de collision et de diffusion',
  source: 'IMT-2026, SEGMENTATION (ENI), PROTOCOLE IP',
  cours: `
<h3>1. Qui fait quoi ?</h3>
<table>
<tr><th>Équipement</th><th>Couche OSI</th><th>Ce qu’il regarde</th><th>Ce qu’il fait</th></tr>
<tr><td><b>Concentrateur (hub)</b></td><td>1</td><td>rien (des bits)</td><td>répète le signal sur <b>tous</b> les ports. Un seul domaine de collision.</td></tr>
<tr><td><b>Pont (bridge)</b></td><td>2</td><td>adresses MAC</td><td>sépare deux segments (ancêtre du switch).</td></tr>
<tr><td><b>Commutateur (switch)</b></td><td>2 (N2) ou 3 (N3)</td><td>adresses <b>MAC</b></td><td>envoie la trame <b>uniquement</b> sur le port du destinataire (table MAC). Chaque port = un domaine de collision.</td></tr>
<tr><td><b>Routeur</b></td><td>3</td><td>adresses <b>IP</b></td><td>relie <b>des réseaux différents</b>, choisit le chemin grâce à sa <b>table de routage</b>, <b>bloque les broadcasts</b>.</td></tr>
<tr><td>Point d’accès Wi-Fi / contrôleur WLC</td><td>1-2</td><td>MAC</td><td>relie les clients sans fil au LAN (CSMA/CA).</td></tr>
<tr><td>Pare-feu (firewall)</td><td>3-7</td><td>IP, ports…</td><td>filtre les flux entre zones (LAN, DMZ, invités, Internet).</td></tr>
<tr><td>Passerelle</td><td>jusqu’à 7</td><td>—</td><td>traduit entre protocoles différents.</td></tr>
</table>

<h3>2. Le commutateur en détail</h3>
<ul>
<li>Il <b>apprend</b> : à chaque trame reçue, il note « l’adresse MAC source X est derrière le port Y » dans sa <b>table MAC</b> (table CAM). Commande : <code>show mac-address-table</code>.</li>
<li>Il <b>filtre / transmet</b> : si la MAC destination est connue, la trame part sur ce seul port.</li>
<li>Il <b>inonde</b> (<i>flooding</i>) : si la MAC destination est inconnue, ou si c’est un <b>broadcast</b> (FF:FF:FF:FF:FF:FF), la trame part sur tous les ports sauf celui d’arrivée.</li>
</ul>
<p>Deux façons de commuter (ton cours) :</p>
<ul>
<li><b>À la volée</b> (<i>on the fly / cut-through</i>) : pas de stockage, la trame part dès que l’adresse destination est lue → <b>latence faible</b>, mais laisse passer les <b>mauvaises trames</b> et les collisions.</li>
<li><b>Store and forward</b> : <b>stocke, analyse puis achemine</b> → élimine les mauvaises trames (un peu plus lent).</li>
</ul>
<p>Switch <b>N2</b> : traite jusqu’à la couche liaison (MAC). Switch <b>N3</b> (multilayer, ex. 3650 dans le lab SDN) : sait aussi <b>router</b> (en-têtes de couche 3).</p>

<h3>3. Le routeur</h3>
<p>D’après ton cours : un routeur <b>relie deux réseaux ou plus</b>, travaille en <b>couche 3</b> et fonde ses décisions sur l’<b>adresse IP de destination</b> en consultant sa <b>table de routage</b>. Il peut changer de support (Ethernet ↔ série…). Il <b>ne laisse pas passer les diffusions</b>, crée le plus haut niveau de segmentation, et comme il fait plus de travail, sa <b>latence est supérieure</b> à celle d’un switch. Le routage n’est possible que si le protocole est <b>routable</b> (IP l’est).</p>

<h3>4. Domaines de collision et de diffusion</h3>
<div class="nul"><b>🧠 L’image de la salle de classe :</b> un <b>domaine de collision</b>, c’est un groupe où deux personnes qui parlent en même temps se coupent la parole. Un <b>domaine de diffusion</b> (broadcast), c’est la zone où un « ÉCOUTEZ TOUS ! » crié est entendu. Le <b>hub</b> met tout le monde dans la même salle ; le <b>switch</b> donne un micro individuel à chacun (mais le cri s’entend toujours partout) ; le <b>routeur</b> construit des murs : le cri ne passe plus.</div>
<table>
<tr><th>Équipement</th><th>Sépare les domaines de collision ?</th><th>Sépare les domaines de diffusion ?</th></tr>
<tr><td>Hub</td><td>❌ non (tous ses ports = 1 domaine)</td><td>❌ non</td></tr>
<tr><td>Switch</td><td>✅ oui (1 domaine <b>par port</b>)</td><td>❌ non (sauf VLAN)</td></tr>
<tr><td>Routeur</td><td>✅ oui</td><td>✅ oui (1 domaine <b>par interface</b>)</td></tr>
</table>
<div class="figure"><svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<rect x="10" y="20" width="330" height="200" rx="14" fill="rgba(0,188,235,.07)" stroke="#00bceb" stroke-dasharray="6 4"/><text x="20" y="38" fill="#6fd6f5" font-weight="700">Domaine de diffusion 1</text>
<rect x="400" y="20" width="330" height="200" rx="14" fill="rgba(108,192,74,.07)" stroke="#6cc04a" stroke-dasharray="6 4"/><text x="410" y="38" fill="#6cc04a" font-weight="700">Domaine de diffusion 2</text>
<ellipse cx="370" cy="120" rx="30" ry="18" fill="#1f6fb2"/><text x="370" y="124" fill="#fff" text-anchor="middle" font-weight="700">R</text>
<rect x="150" y="105" width="70" height="28" rx="5" fill="#2b8a3e"/><text x="185" y="124" fill="#fff" text-anchor="middle" font-weight="700">Switch</text>
<line x1="220" y1="119" x2="340" y2="119" stroke="#999" stroke-width="2"/>
<g fill="#556"><rect x="40" y="55" width="36" height="26" rx="4"/><rect x="40" y="105" width="36" height="26" rx="4"/><rect x="40" y="155" width="36" height="26" rx="4"/></g>
<line x1="76" y1="68" x2="150" y2="112" stroke="#999" stroke-width="2"/><line x1="76" y1="118" x2="150" y2="119" stroke="#999" stroke-width="2"/><line x1="76" y1="168" x2="150" y2="126" stroke="#999" stroke-width="2"/>
<rect x="520" y="105" width="70" height="28" rx="5" fill="#b35c00"/><text x="555" y="124" fill="#fff" text-anchor="middle" font-weight="700">Hub</text>
<line x1="400" y1="119" x2="520" y2="119" stroke="#999" stroke-width="2"/>
<g fill="#556"><rect x="660" y="55" width="36" height="26" rx="4"/><rect x="660" y="105" width="36" height="26" rx="4"/><rect x="660" y="155" width="36" height="26" rx="4"/></g>
<line x1="590" y1="112" x2="660" y2="68" stroke="#999" stroke-width="2"/><line x1="590" y1="119" x2="660" y2="118" stroke="#999" stroke-width="2"/><line x1="590" y1="126" x2="660" y2="168" stroke="#999" stroke-width="2"/>
<text x="175" y="205" fill="#8a9bb3" text-anchor="middle">4 domaines de collision (1 par port utilisé)</text><text x="560" y="205" fill="#8a9bb3" text-anchor="middle">1 seul domaine de collision (hub + ses 3 PC + R)</text>
</svg><div class="figcap">Ici : 2 domaines de diffusion (le routeur coupe) et 4 + 1 = 5 domaines de collision.</div></div>
<div class="memo"><b>📌 Méthode pour compter :</b> <b>diffusion</b> = nombre d’interfaces de routeur utilisées (ou de VLAN). <b>Collision</b> = chaque port de switch ou de routeur utilisé compte pour 1 ; un hub et tout ce qui est branché dessus comptent pour 1 au total.</div>

<h3>5. Pourquoi segmenter un réseau ?</h3>
<ul>
<li><b>Géographique</b> : un réseau par étage, bâtiment, site → à la lecture de l’IP on sait où est la machine, et on isole plus facilement une panne.</li>
<li><b>Fonctionnelle et sécuritaire</b> : séparer serveurs / postes, comptabilité / employés, un réseau <b>invité</b> (Wi-Fi visiteurs limité à Internet), une <b>DMZ</b> (zone démilitarisée) pour les serveurs accessibles depuis Internet (web vitrine, messagerie) : si l’un est piraté, l’attaque reste confinée. Les règles sont posées sur un <b>firewall</b> (qui travaille à partir du niveau IP).</li>
<li><b>Performances</b> : trop de machines dans un même domaine de diffusion = trop de broadcasts (ARP, DHCP, NetBIOS…) ; et gestion de la <b>QoS</b> (priorité à la voix sur IP, bande passante réservée aux graphistes, débit limité pour le Wi-Fi invité).</li>
</ul>
<div class="tip"><b>✔ Deux outils pour segmenter :</b> le <b>routeur</b> (un réseau IP par interface) et les <b>VLAN</b> (segmentation logique sur les switchs, module 8).</div>
`,
  questions: [
    { id: 'e1', type: 'match', q: 'À quelle couche OSI travaille principalement chaque équipement ?',
      pairs: [['Concentrateur (hub)', 'Couche 1 - Physique'], ['Commutateur (switch) N2', 'Couche 2 - Liaison'], ['Routeur', 'Couche 3 - Réseau']],
      hints: ['Le switch lit les adresses MAC, le routeur les adresses IP, le hub… rien du tout.'],
      explain: 'Hub = couche 1 (répéteur multiport), switch = couche 2 (MAC), routeur = couche 3 (IP).' },
    { id: 'e2', type: 'qcm', q: 'Un switch reçoit une trame dont l’adresse MAC de destination n’est <b>pas</b> dans sa table MAC. Que fait-il ?',
      choices: ['Il la jette', 'Il l’envoie sur tous les ports sauf celui d’arrivée (inondation)', 'Il l’envoie au routeur', 'Il demande l’adresse au serveur DHCP'], good: 1,
      hints: ['Il ne sait pas où est le destinataire… alors il demande à tout le monde.'],
      explain: 'Destination inconnue (ou broadcast) → <b>flooding</b> sur tous les ports sauf le port d’arrivée. Quand le destinataire répondra, le switch apprendra son port.' },
    { id: 'e3', type: 'qcm', q: 'Comment un switch remplit-il sa table MAC ?',
      choices: ['L’administrateur la saisit à la main', 'Il note l’adresse MAC <b>source</b> de chaque trame reçue et le port d’arrivée', 'Il note l’adresse MAC destination de chaque trame', 'Il interroge le routeur'], good: 1,
      hints: ['Il apprend « qui est derrière quel port » en regardant qui <b>parle</b>.'],
      explain: 'Apprentissage par l’adresse <b>source</b> : « la MAC X vient d’arriver par Fa0/3, donc X est derrière Fa0/3 ».' },
    { id: 'e4', type: 'match', q: 'Associe chaque mode de commutation à sa caractéristique.',
      pairs: [['À la volée (cut-through)', 'Latence faible mais laisse passer les mauvaises trames'], ['Store and forward', 'Stocke, analyse puis achemine : élimine les mauvaises trames']],
      hints: ['« Store » = stocker.'],
      explain: 'Cut-through : rapide, pas de vérification. Store-and-forward : vérifie (FCS) avant de transmettre.' },
    { id: 'e5', type: 'multi', q: 'Parmi ces affirmations sur le <b>routeur</b>, lesquelles sont vraies (d’après ton cours) ?',
      choices: ['Il relie deux réseaux ou plus', 'Il fonde ses décisions sur l’adresse IP de destination', 'Il laisse passer les diffusions (broadcasts)', 'Sa latence est supérieure à celle d’un switch', 'Il travaille en couche 2', 'Il consulte sa table de routage pour choisir la sortie'],
      good: [0, 1, 3, 5], hints: ['Le routeur « casse » les domaines de diffusion.'],
      explain: 'Le routeur (couche 3) relie des réseaux, regarde l’IP destination, consulte sa table de routage, <b>bloque</b> les broadcasts, et a une latence plus élevée qu’un switch.' },
    { id: 'e6', type: 'match', q: 'Complète : cet équipement sépare-t-il les domaines… ?',
      pairs: [['Hub : domaines de collision', 'Non'], ['Switch : domaines de collision', 'Oui, un par port'], ['Switch (sans VLAN) : domaines de diffusion', 'Non'], ['Routeur : domaines de diffusion', 'Oui, un par interface']],
      hints: ['Seul le routeur (ou les VLAN) arrête les broadcasts.'],
      explain: 'Hub : rien. Switch : collision oui, diffusion non. Routeur : les deux.' },
    { id: 'e7', type: 'text', q: 'Reprends le schéma du cours (1 routeur ; à gauche un switch avec 3 PC ; à droite un hub avec 3 PC). Combien y a-t-il de domaines…',
      fields: [{ label: 'de diffusion ?', kind: 'int', answer: 2 }, { label: 'de collision ?', kind: 'int', answer: 5 }],
      hints: ['Diffusion : le routeur utilise 2 interfaces.', 'Collision côté switch : 3 PC + le lien vers le routeur = 4. Côté hub : tout ne fait qu’un.'],
      explain: '2 domaines de diffusion (2 interfaces de routeur). Collision : 4 côté switch (3 PC + lien routeur) + 1 côté hub = <b>5</b>.' },
    { id: 'e8', type: 'text', q: 'Un routeur a 3 interfaces utilisées ; chacune est reliée à un switch avec 10 PC (aucun VLAN). Combien de domaines…',
      fields: [{ label: 'de diffusion ?', kind: 'int', answer: 3 }, { label: 'de collision ?', kind: 'int', answer: 33 }],
      hints: ['Diffusion : une par interface de routeur.', 'Collision : sur chaque switch, 10 PC + 1 lien vers le routeur.'],
      explain: '3 domaines de diffusion ; 3 × (10 + 1) = <b>33</b> domaines de collision.' },
    { id: 'e9', type: 'qcm', q: 'Qu’est-ce qu’une <b>DMZ</b> ?',
      choices: ['Un VLAN réservé aux imprimantes', 'Un réseau isolé qui héberge les serveurs accessibles depuis l’extérieur (web, messagerie), pour confiner une éventuelle attaque', 'Le réseau Wi-Fi des invités', 'Une zone sans aucun pare-feu'], good: 1,
      hints: ['« Zone démilitarisée » : entre le monde extérieur et le LAN.'],
      explain: 'La DMZ accueille les serveurs joignables depuis Internet ; isolée du LAN par un firewall, elle empêche un pirate de « rebondir » vers les autres machines.' },
    { id: 'e10', type: 'match', q: 'Associe chaque besoin à la raison de segmenter.',
      pairs: [['Un réseau par bâtiment pour savoir où est une machine d’après son IP', 'Segmentation géographique'], ['Isoler la comptabilité des postes des employés', 'Segmentation fonctionnelle / sécuritaire'], ['Réduire le nombre de broadcasts et prioriser la voix sur IP', 'Segmentation pour les performances']],
      hints: ['Trois familles dans ton cours : géographique, fonctionnelle et sécuritaire, performances.'],
      explain: 'Géographique (localiser, dépanner), fonctionnelle/sécuritaire (contrôler les flux, DMZ, invités), performances (domaine de diffusion, QoS).' },
    { id: 'e11', type: 'text', q: 'Voici ce qu’affiche le switch après quelques pings :<pre class="demo">Switch#show mac-address-table\n          Mac Address Table\n-------------------------------------------\n\nVlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n\n   1    0001.4287.a3c1    DYNAMIC     Fa0/1\n   1    0060.2f84.1b02    DYNAMIC     Fa0/7\n   1    00d0.97b5.6c23    DYNAMIC     Gig0/1</pre>Derrière quel port se trouve la machine de MAC <code>0060.2F84.1B02</code> ?', kind: 'iface', accept: 'FastEthernet0/7', ph: 'ex. Fa0/3',
      hints: ['Cherche la ligne de cette adresse MAC (la casse ne compte pas).'],
      explain: 'La MAC 0060.2f84.1b02 est apprise sur <b>Fa0/7</b> (FastEthernet0/7). Le type DYNAMIC signifie qu’elle a été apprise automatiquement.' },
    { id: 'e-lab', type: 'pt', file: 'Premier-LAN.pkt', tag: 'LAN',
      q: 'Ton premier réseau local ! Les 3 PC sont câblés au switch. Configure l’adressage IP des PC (clique sur un PC → onglet <b>Desktop</b> → <b>IP Configuration</b>) : réseau <code>192.168.10.0/24</code>, PC0 = <b>.1</b>, PC1 = <b>.2</b>, PC2 = <b>.3</b>. Puis vérifie avec la <b>Command Prompt</b> : <code>ping 192.168.10.3</code> depuis PC0.',
      build: function () {
        return LAB.make({
          devices: [['PC0', 'PC-PT', 150, 120], ['PC1', 'PC-PT', 150, 300], ['PC2', 'PC-PT', 700, 210], ['Switch0', '2960-24TT', 420, 210]],
          links: [['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'], ['PC1', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'], ['PC2', 'FastEthernet0', 'Switch0', 'FastEthernet0/3', 'straight']],
          notes: [[120, 420, 'Réseau 192.168.10.0 /24 (masque 255.255.255.0)']]
        });
      },
      tasks: [
        { label: 'PC0 a l’adresse 192.168.10.1 / 255.255.255.0', check: function (n) { return LAB.hostIs(n, 'PC0', '192.168.10.1', '255.255.255.0'); } },
        { label: 'PC1 a l’adresse 192.168.10.2 / 255.255.255.0', check: function (n) { return LAB.hostIs(n, 'PC1', '192.168.10.2', '255.255.255.0'); } },
        { label: 'PC2 a l’adresse 192.168.10.3 / 255.255.255.0', check: function (n) { return LAB.hostIs(n, 'PC2', '192.168.10.3', '255.255.255.0'); } },
        { label: 'PC0 joint PC2 (ping)', check: function (n) { return n.canPing('PC0', 'PC2'); } },
        { label: 'PC1 joint PC2 (ping)', check: function (n) { return n.canPing('PC1', 'PC2'); } }
      ],
      hints: ['Desktop → IP Configuration → choisis <b>Static</b>, tape l’IPv4 Address puis clique dans Subnet Mask : Packet Tracer propose automatiquement le masque de la classe (ici classe C → 255.255.255.0). Vérifie toujours qu’il correspond à ce qui est demandé !', 'Pas besoin de passerelle ici : tout le monde est dans le même réseau.'],
      solution: [{ dev: 'PC0', host: { ip: '192.168.10.1', mask: '255.255.255.0' } }, { dev: 'PC1', host: { ip: '192.168.10.2', mask: '255.255.255.0' } }, { dev: 'PC2', host: { ip: '192.168.10.3', mask: '255.255.255.0' } }],
      explain: 'Même réseau (192.168.10.0/24) → les PC se joignent directement via le switch, sans routeur ni passerelle. Le premier ping perd souvent une réponse : c’est le temps de la résolution ARP. Essaie ensuite <code>arp -a</code> sur PC0, et <code>show mac-address-table</code> sur le switch (onglet CLI).' }
  ]
});
