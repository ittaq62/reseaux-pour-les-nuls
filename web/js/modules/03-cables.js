(window.MODULES = window.MODULES || []).push({
  id: 'cables', num: 3, icon: '🔌', titre: 'Câbles et supports',
  sous: 'Paires torsadées, RJ45, droit / croisé, fibre optique',
  source: 'lecture - les câbles (ENI), TP Packet Tracer',
  cours: `
<h3>1. Le média cuivre : la paire torsadée</h3>
<p>Le câble Ethernet classique est fait de <b>paires de fils de cuivre torsadées</b>, terminées par un connecteur <b>RJ45</b> (<i>Registered Jack</i> n°45, aussi appelé <b>8P8C</b> : 8 positions, 8 contacts). Le cuivre est peu cher, facile à trouver et conduit bien le courant.</p>
<p>Trois ennemis du signal électrique :</p>
<ul>
<li><b>L’atténuation</b> : le signal se dégrade avec la <b>distance</b> → les normes fixent une longueur maximale (100 m pour l’Ethernet cuivre).</li>
<li><b>Les interférences électromagnétiques (EMI)</b> : ligne haute tension, micro-ondes… → solution : le <b>blindage</b>.</li>
<li><b>La diaphonie</b> (<i>crosstalk</i>) : un fil perturbe son voisin → solution : la <b>torsade</b> (garder les deux fils d’une paire à distance constante).</li>
</ul>
<table>
<tr><th>Sigle</th><th>Nom</th><th>Protection</th></tr>
<tr><td><b>UTP</b></td><td>Unshielded Twisted Pair</td><td>aucun blindage : souple, pour environnement peu perturbé (le plus courant)</td></tr>
<tr><td><b>FTP</b></td><td>Foiled Twisted Pair (≠ le protocole FTP !)</td><td>un écran aluminium <b>global</b> autour des paires</td></tr>
<tr><td><b>STP</b></td><td>Shielded Twisted Pair</td><td>chaque <b>paire</b> a son propre blindage</td></tr>
<tr><td>FFTP</td><td>Foiled Foiled TP</td><td>écran global + écran par paire</td></tr>
<tr><td>SFTP</td><td>Shielded Foiled TP</td><td>feuille alu + tresse métallique globales</td></tr>
<tr><td>SSTP</td><td>Shielded Shielded TP</td><td>blindage par paire + tresse globale en cuivre étamé</td></tr>
</table>
<p>Plus la protection est élevée, plus le câble est cher. Un câble réseau a <b>4 paires</b> : 10BaseT et 100BaseTX n’en utilisent que <b>2</b> (une par sens), <b>1000BaseT utilise les 4</b>. Le <b>PoE</b> (<i>Power over Ethernet</i>) alimente téléphones IP et bornes Wi-Fi par le câble réseau.</p>

<h3>2. Normes T568A / T568B</h3>
<div class="cols2"><div>
<table><tr><th colspan="2">T568A</th></tr><tr><td>1</td><td>blanc-vert</td></tr><tr><td>2</td><td>vert</td></tr><tr><td>3</td><td>blanc-orange</td></tr><tr><td>4</td><td>bleu</td></tr><tr><td>5</td><td>blanc-bleu</td></tr><tr><td>6</td><td>orange</td></tr><tr><td>7</td><td>blanc-marron</td></tr><tr><td>8</td><td>marron</td></tr></table></div><div>
<table><tr><th colspan="2">T568B</th></tr><tr><td>1</td><td>blanc-orange</td></tr><tr><td>2</td><td>orange</td></tr><tr><td>3</td><td>blanc-vert</td></tr><tr><td>4</td><td>bleu</td></tr><tr><td>5</td><td>blanc-bleu</td></tr><tr><td>6</td><td>vert</td></tr><tr><td>7</td><td>blanc-marron</td></tr><tr><td>8</td><td>marron</td></tr></table></div></div>
<p>La seule différence : les paires <b>verte et orange sont inversées</b>.</p>

<h3>3. Droit, croisé, console : LE point clé pour Packet Tracer</h3>
<div class="figure"><svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<rect x="10" y="10" width="330" height="180" rx="10" fill="rgba(0,188,235,.08)" stroke="#00bceb"/>
<text x="175" y="34" text-anchor="middle" font-weight="700" fill="#6fd6f5">Câble DROIT (même norme aux 2 bouts)</text>
<text x="175" y="54" text-anchor="middle" fill="#8a9bb3" font-size="12">équipements de couches DIFFÉRENTES</text>
<text x="30" y="90" fill="currentColor">PC ⟷ Switch</text><text x="30" y="118" fill="currentColor">Switch ⟷ Routeur</text><text x="30" y="146" fill="currentColor">Serveur ⟷ Switch</text><text x="30" y="174" fill="currentColor">(Hub ⟷ PC)</text>
<line x1="200" y1="85" x2="320" y2="85" stroke="#111" stroke-width="3"/><line x1="200" y1="113" x2="320" y2="113" stroke="#111" stroke-width="3"/><line x1="200" y1="141" x2="320" y2="141" stroke="#111" stroke-width="3"/>
<rect x="380" y="10" width="330" height="180" rx="10" fill="rgba(251,171,24,.08)" stroke="#fbab18"/>
<text x="545" y="34" text-anchor="middle" font-weight="700" fill="#fbab18">Câble CROISÉ (T568A d’un côté, B de l’autre)</text>
<text x="545" y="54" text-anchor="middle" fill="#8a9bb3" font-size="12">équipements de la MÊME couche</text>
<text x="400" y="90" fill="currentColor">Switch ⟷ Switch</text><text x="400" y="118" fill="currentColor">Routeur ⟷ Routeur</text><text x="400" y="146" fill="currentColor">PC ⟷ PC</text><text x="400" y="174" fill="currentColor">PC ⟷ Routeur</text>
<line x1="570" y1="85" x2="690" y2="85" stroke="#111" stroke-width="3" stroke-dasharray="6 4"/><line x1="570" y1="113" x2="690" y2="113" stroke="#111" stroke-width="3" stroke-dasharray="6 4"/><line x1="570" y1="141" x2="690" y2="141" stroke="#111" stroke-width="3" stroke-dasharray="6 4"/><line x1="570" y1="169" x2="690" y2="169" stroke="#111" stroke-width="3" stroke-dasharray="6 4"/>
</svg><div class="figcap">Dans Packet Tracer, le câble droit est un trait plein noir et le croisé un trait noir en pointillés.</div></div>
<div class="nul"><b>🧠 L’astuce pour ne jamais te tromper :</b> classe les équipements en deux familles. <b>Famille « terminaux »</b> : PC, serveur, <b>routeur</b>. <b>Famille « concentrateurs »</b> : switch, hub. Entre deux familles différentes → <b>droit</b>. Dans la même famille → <b>croisé</b>. C’est pour ça que <b>PC ⟷ Routeur</b> est en <b>croisé</b> (piège classique !).</div>
<ul>
<li><b>Câble renversé (rollover)</b> = le câble <b>console</b> Cisco (bleu clair) : il relie le port série (RS 232 / DB-9) d’un PC au port <b>Console</b> RJ45 d’un routeur ou switch pour le configurer.</li>
<li><b>Auto-MDIX</b> : les équipements récents détectent le type de câble et s’adaptent (<code>speed auto</code>, <code>duplex auto</code>, <code>mdix auto</code>). Mais si tu fixes la vitesse ou le duplex à la main, Auto-MDIX se désactive : utilise toujours le <b>bon</b> câble.</li>
<li><b>Câble série</b> (Serial DCE/DTE) : relie deux routeurs par leurs interfaces <b>Serial</b> (liaisons WAN dans les exercices de routage). Le côté <b>DCE</b> fournit l’horloge (<code>clock rate</code>).</li>
</ul>
<div class="warnbox"><b>⚠ Dans Packet Tracer</b> : un mauvais câble = <b>voyants rouges</b> aux deux bouts, et le ping ne passe pas. Un voyant <b>orange</b> sur un switch = le port est en cours de négociation Spanning Tree (attends ~30 s ou clique sur ⏩ <i>Fast Forward Time</i>).</div>

<h3>4. La fibre optique</h3>
<p>La lumière est guidée par <b>réflexion totale interne</b> : un <b>cœur</b> (indice de réfraction un peu plus élevé) entouré d’une <b>gaine</b> (125 µm). Longueurs d’onde utilisées (infrarouge) : <b>850, 1300 et 1550 nm</b>. En silice, l’affaiblissement descend à <b>0,2 dB/km</b> à 1550 nm.</p>
<table>
<tr><th></th><th>Monomode (SMF)</th><th>Multimode (MMF)</th></tr>
<tr><td>Cœur</td><td><b>9 µm</b></td><td><b>50 ou 62,5 µm</b></td></tr>
<tr><td>Source</td><td><b>Laser</b></td><td><b>LED</b></td></tr>
<tr><td>Dispersion</td><td>faible → longues distances</td><td>plus importante → courtes distances</td></tr>
<tr><td>Couleur du cordon (convention)</td><td><b>jaune</b></td><td><b>orange</b></td></tr>
</table>
<p><b>Avantages de la fibre</b> : faible atténuation (longues distances sans répéteur), très grande bande passante (multiplexage en longueur d’onde <b>WDM</b> : plusieurs « couleurs » par fibre), <b>insensible aux perturbations électromagnétiques</b>, pas de rayonnement, légère, fine, isolation électrique totale, matière première (silice) bon marché.</p>
<table>
<tr><th>Connecteur</th><th>Signe distinctif</th></tr>
<tr><td><b>ST</b> (Straight Tip)</td><td>à <b>baïonnette</b>, plutôt multimode, sur les panneaux de brassage</td></tr>
<tr><td><b>SC</b> (Subscriber Connector)</td><td><b>carré</b>, système <b>push-pull</b>, mono et multimode</td></tr>
<tr><td><b>LC</b> (Lucent Connector)</td><td>le plus <b>petit</b> → forte <b>densité de ports</b>, souvent en « duplex »</td></tr>
</table>
<p><b>Pannes typiques</b> d’une fibre : erreur d’<b>alignement</b>, écart de <b>connexion</b> (la fibre ne touche pas le connecteur), écart de <b>finition</b> (mauvais polissage). On les localise par <b>réflectométrie</b> : on mesure le temps de retour de l’onde réfléchie et on le convertit en distance.</p>
<div class="tip"><b>🖥️ Dans Packet Tracer</b>, la fibre est un trait <b>orange</b> et ne se branche que sur des ports fibre (ex. GigabitEthernet avec module fibre, ports « FastEthernet…/1 » fibre des Switch-PT). Dans le TP Datamax, le <b>BACKBONE</b> est relié aux étages en fibre.</div>
`,
  questions: [
    { id: 'c1', type: 'match', q: 'Associe chaque problème du cuivre à sa définition.',
      pairs: [['Atténuation', 'Le signal se dégrade avec la distance parcourue'], ['Interférences électromagnétiques (EMI)', 'Distorsion causée par une source extérieure (ligne haute tension, micro-ondes…)'], ['Diaphonie (crosstalk)', 'Perturbation d’un fil par le signal du fil voisin']],
      hints: ['« Diaphonie » : « dia » = à travers, « phonie » = son : ça « parle » d’un fil à l’autre.'],
      explain: 'Atténuation → longueur max ; EMI → blindage ; diaphonie → torsade des paires.' },
    { id: 'c2', type: 'qcm', q: 'À quoi sert la <b>torsade</b> des paires dans un câble Ethernet ?',
      choices: ['À rendre le câble plus solide', 'À réduire la diaphonie en gardant les deux fils à distance constante', 'À augmenter le débit', 'À protéger contre la foudre'], good: 1,
      hints: ['C’est la réponse au dernier problème d’interférence cité dans le cours.'],
      explain: 'La torsade maintient les deux fils à une distance la plus constante possible : elle réduit la <b>diaphonie</b>. Contre les EMI, on utilise le <b>blindage</b>.' },
    { id: 'c3', type: 'match', q: 'Associe chaque type de câble à paires torsadées à sa protection.',
      pairs: [['UTP', 'Aucun blindage'], ['FTP', 'Un écran aluminium global autour de toutes les paires'], ['STP', 'Un blindage individuel pour chaque paire'], ['SSTP', 'Blindage par paire + tresse globale en cuivre étamé']],
      hints: ['U = Unshielded (non blindé), F = Foiled (écranté), S = Shielded (blindé).'],
      explain: 'UTP : rien. FTP : écran global. STP : blindage par paire. SSTP : double blindage (par paire + tresse).' },
    { id: 'c4', type: 'qcm', q: 'Combien de paires un câble 1000BaseT (Gigabit Ethernet) utilise-t-il ?', choices: ['1', '2', '4', '8'], good: 2,
      hints: ['10BaseT et 100BaseTX se contentaient de 2 paires.'],
      explain: '1000BaseT utilise les <b>4 paires</b>. 10/100 n’en utilisent que 2 (une par sens), ce qui laisse 2 paires pour le PoE.' },
    { id: 'c5', type: 'order', q: 'Remets les couleurs du connecteur RJ45 dans l’ordre de la norme <b>T568B</b> (broche 1 en haut).',
      items: ['blanc-orange', 'orange', 'blanc-vert', 'bleu', 'blanc-bleu', 'vert', 'blanc-marron', 'marron'],
      hints: ['En T568B, on commence par la paire orange.', 'Le bleu est au milieu (4 et 5) dans les deux normes, et le marron toujours à la fin (7 et 8).'],
      explain: 'T568B : blanc-orange, orange, blanc-vert, bleu, blanc-bleu, vert, blanc-marron, marron. En T568A, on échange orange et vert.' },
    { id: 'c6', type: 'match', q: 'Quel câble cuivre faut-il pour relier ces équipements (règle de ton cours) ?',
      pairs: [['PC ⟷ Switch', 'Câble droit'], ['Switch ⟷ Routeur', 'Câble droit'], ['Switch ⟷ Switch', 'Câble croisé'], ['Routeur ⟷ Routeur (Ethernet)', 'Câble croisé'], ['PC ⟷ PC', 'Câble croisé'], ['PC ⟷ Routeur', 'Câble croisé'], ['PC (port série) ⟷ port Console du routeur', 'Câble console (renversé)']],
      hints: ['Droit entre équipements de couches différentes, croisé entre équipements de même couche.', 'PC et routeur sont dans la même « famille » (terminaux).'],
      explain: 'Famille terminaux (PC, serveur, routeur) / famille concentrateurs (switch, hub) : familles différentes → droit ; même famille → croisé. Le câble console (rollover) sert à la configuration.' },
    { id: 'c7', type: 'qcm', q: 'Comment obtient-on un câble <b>croisé</b> (100 Mb/s) ?',
      choices: ['T568A aux deux extrémités', 'T568B aux deux extrémités', 'T568A à une extrémité et T568B à l’autre', 'En inversant complètement les 8 fils'], good: 2,
      hints: ['Si les deux bouts suivent la même norme, le câble est droit.'],
      explain: 'Croisé = <b>A d’un côté, B de l’autre</b> (paires 2 et 3 inversées). Inverser complètement les 8 fils, c’est le câble <b>renversé</b> (console). Pour 1000BaseT, il faut croiser toutes les paires.' },
    { id: 'c8', type: 'qcm', q: 'Tu relies deux switchs avec un câble <b>droit</b>, les ports ont <code>speed 100</code> et <code>duplex full</code> configurés à la main. Que se passe-t-il ?',
      choices: ['Ça marche grâce à Auto-MDIX', 'Le lien ne monte pas : Auto-MDIX est désactivé quand la vitesse/duplex sont fixés manuellement', 'Le switch passe automatiquement en câble croisé', 'Le débit est divisé par deux'], good: 1,
      hints: ['Chez Cisco, Auto-MDIX a besoin de l’autonégociation.'],
      explain: 'Auto-MDIX (mdix auto) ne fonctionne que si <code>speed auto</code> et <code>duplex auto</code> sont actifs. Morale : utilise toujours le câble adéquat.' },
    { id: 'c9', type: 'match', q: 'Monomode ou multimode ?',
      pairs: [['Cœur de 9 µm', 'Monomode'], ['Source laser', 'Monomode'], ['Cordon jaune', 'Monomode'], ['Cœur de 50 ou 62,5 µm', 'Multimode'], ['Source LED', 'Multimode'], ['Cordon orange', 'Multimode']],
      hints: ['« Mono » = un seul mode de propagation : cœur très fin et laser très précis.'],
      explain: 'Monomode (SMF) : 9 µm, laser, faible dispersion, longues distances, jaune. Multimode (MMF) : 50/62,5 µm, LED, dispersion plus forte, orange.' },
    { id: 'c10', type: 'multi', q: 'Quels sont les avantages de la fibre optique sur le cuivre ? (plusieurs réponses)',
      choices: ['Insensible aux perturbations électromagnétiques', 'Très faible atténuation : grandes distances', 'Très grande bande passante (WDM)', 'Réparation très simple sur le terrain', 'Isolation électrique totale', 'Se sertit avec une pince RJ45'], good: [0, 1, 2, 4],
      hints: ['La réparation d’une fibre demande une précision bien supérieure à celle du cuivre…'],
      explain: 'Fibre : pas d’EMI, faible atténuation, grosse bande passante, pas de rayonnement, légère, isolation électrique. Mais la réparation est <b>délicate</b> et elle ne se sertit évidemment pas en RJ45.' },
    { id: 'c11', type: 'match', q: 'Associe chaque connecteur optique à sa description.',
      pairs: [['ST', 'Connecteur à baïonnette, plutôt sur les panneaux de brassage'], ['SC', 'Connecteur carré avec système push-pull'], ['LC', 'Le plus petit : forte densité de ports, souvent en duplex']],
      hints: ['ST = Straight Tip, SC = Subscriber Connector, LC = Lucent Connector.'],
      explain: 'ST baïonnette, SC carré push-pull, LC petit (densité).' },
    { id: 'c12', type: 'qcm', q: 'Quelle technique permet de <b>localiser</b> un défaut (blessure, mauvais raccord) sur un câble ou une fibre ?',
      choices: ['Le ping', 'La réflectométrie', 'Le traceroute', 'L’Auto-MDIX'], good: 1,
      hints: ['On envoie une onde et on mesure le temps de retour de sa réflexion.'],
      explain: 'La <b>réflectométrie</b> : l’onde réfléchie par le défaut revient ; connaissant la vitesse de propagation, on convertit le temps en distance.' },
    { id: 'c-lab', type: 'pt', file: 'Labo-cablage.pkt', noAutoCable: true, tag: 'Câblage',
      q: 'À toi de câbler ! Dans ce Packet Tracer, les équipements sont posés mais aucun câble n’est branché. Utilise l’icône <b>Connections</b> (l’éclair orange, en bas à gauche) et choisis <b>toi-même</b> le bon câble pour chaque liaison demandée (la connexion automatique est interdite). Les voyants doivent passer au vert.',
      build: function () {
        return LAB.make({
          devices: [['PC0', 'PC-PT', 120, 120], ['Switch0', '2960-24TT', 330, 200], ['Switch1', '2960-24TT', 560, 200], ['Router0', '1941', 780, 200], ['Router1', '1941', 1000, 200], ['PC1', 'PC-PT', 1200, 120], ['PC2', 'PC-PT', 120, 320]],
          notes: [[80, 440, '1) PC0 - Switch0   2) PC2 - Switch0   3) Switch0 - Switch1'], [80, 470, '4) Switch1 - Router0 (G0/0)   5) Router0 (G0/1) - Router1 (G0/1)   6) Router1 (G0/0) - PC1']],
          cli: {
            Router0: ['conf t', 'hostname Router0', 'interface g0/0', 'no shutdown', 'interface g0/1', 'no shutdown', 'end'],
            Router1: ['conf t', 'hostname Router1', 'interface g0/0', 'no shutdown', 'interface g0/1', 'no shutdown', 'end']
          }
        });
      },
      tasks: [
        { label: 'PC0 ⟷ Switch0 avec le bon câble', check: function (n) { return LAB.linked(n, 'PC0', 'Switch0', 'straight'); } },
        { label: 'PC2 ⟷ Switch0 avec le bon câble', check: function (n) { return LAB.linked(n, 'PC2', 'Switch0', 'straight'); } },
        { label: 'Switch0 ⟷ Switch1 avec le bon câble', check: function (n) { return LAB.linked(n, 'Switch0', 'Switch1', 'cross'); } },
        { label: 'Switch1 ⟷ Router0 (GigabitEthernet0/0) avec le bon câble', check: function (n) { var l = n.linkOf('Router0', 'GigabitEthernet0/0'); return LAB.linked(n, 'Switch1', 'Router0', 'straight') && !!l && (l.a.dev === 'Switch1' || l.b.dev === 'Switch1'); } },
        { label: 'Router0 (G0/1) ⟷ Router1 (G0/1) avec le bon câble', check: function (n) { return LAB.linkedPorts(n, 'Router0', 'GigabitEthernet0/1', 'Router1', 'GigabitEthernet0/1') && n.linkOf('Router0', 'GigabitEthernet0/1').cable === 'cross'; } },
        { label: 'Router1 (G0/0) ⟷ PC1 avec le bon câble', check: function (n) { var l = n.linkOf('Router1', 'GigabitEthernet0/0'); return !!l && LAB.linked(n, 'Router1', 'PC1', 'cross') && (l.a.dev === 'PC1' || l.b.dev === 'PC1'); } }
      ],
      hints: ['Rappel : droit entre équipements de familles différentes (PC/routeur ⟷ switch), croisé dans la même famille (switch ⟷ switch, routeur ⟷ routeur, PC ⟷ routeur).', 'Dans la palette Connections : « Copper Straight-Through » = droit (trait plein), « Copper Cross-Over » = croisé (pointillés). Clique sur le câble, puis sur le 1er équipement (choisis le port), puis sur le 2e.', 'Tu t’es trompé ? Outil <b>Delete</b> (la croix, ou touche Suppr) puis clique sur le câble pour l’enlever.'],
      solution: [
        { link: ['PC0', 'FastEthernet0', 'Switch0', 'FastEthernet0/1', 'straight'] },
        { link: ['PC2', 'FastEthernet0', 'Switch0', 'FastEthernet0/2', 'straight'] },
        { link: ['Switch0', 'GigabitEthernet0/1', 'Switch1', 'GigabitEthernet0/1', 'cross'] },
        { link: ['Switch1', 'FastEthernet0/1', 'Router0', 'GigabitEthernet0/0', 'straight'] },
        { link: ['Router0', 'GigabitEthernet0/1', 'Router1', 'GigabitEthernet0/1', 'cross'] },
        { link: ['Router1', 'GigabitEthernet0/0', 'PC1', 'FastEthernet0', 'cross'] }
      ],
      explain: 'Droit : PC ⟷ switch, switch ⟷ routeur. Croisé : switch ⟷ switch, routeur ⟷ routeur, PC ⟷ routeur. Tous les voyants sont verts (les ports des switchs passent par l’orange quelques secondes, le temps du Spanning Tree).' }
  ]
});
