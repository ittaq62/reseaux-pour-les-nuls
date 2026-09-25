(function () {
  /* TD VLSM 194.132.18.0/24 (Exo-vlsm + TD2-CORR) */
  function r(o) { return ['194.132.18.' + o, String(o)]; }
  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'sousreseaux', num: 6, icon: '🧩', titre: 'Sous-réseaux et VLSM',
  sous: 'Découper un réseau, plages d’adresses, masques variables',
  source: 'Adresse-routage.pdf (Situations 1 à 4, exercice 255.255.254.0), Exo-vlsm.pdf, TD2-CORR, DS routage et IP',
  cours: `
<h3>1. Pourquoi découper en sous-réseaux ?</h3>
<ul><li><b>Hiérarchiser</b> le réseau : faciliter sa gestion ;</li>
<li><b>Confiner les diffusions</b> : moins de trafic, de meilleures performances ;</li>
<li><b>Sécurité</b> : plus facile de filtrer entre sous-réseaux (pare-feu) ; une attaque sur un sous-réseau ne se propage pas forcément aux autres.</li></ul>
<p>Principe : on <b>emprunte des bits à la partie hôte</b> pour coder le numéro de sous-réseau → le masque s’allonge. Une adresse de sous-réseau contient : partie réseau + <b>champ sous-réseau</b> + champ hôte. On doit toujours laisser <b>au moins 2 bits</b> à l’hôte.</p>
<div class="nul"><b>🧠 L’analogie de la pizza :</b> ton réseau /24, c’est une pizza de 256 parts. Emprunter 1 bit = couper en 2 moitiés de 128. Emprunter 2 bits = 4 quarts de 64. Plus tu fais de parts (sous-réseaux), plus chaque part est petite (moins d’hôtes).</div>
<table><tr><th>Bits empruntés (n)</th><th>Nombre de sous-réseaux = 2<sup>n</sup></th></tr>
<tr><td>1</td><td>2</td></tr><tr><td>2</td><td>4</td></tr><tr><td>3</td><td>8</td></tr><tr><td>4</td><td>16</td></tr><tr><td>5</td><td>32</td></tr></table>
<p>Et pour les hôtes : avec <b>h</b> bits d’hôte → <b>2<sup>h</sup> − 2</b> adresses utilisables.</p>

<h3>2. La méthode en 4 étapes (celle du cours)</h3>
<ol><li><b>Considérations</b> : combien de sous-réseaux ? combien d’hôtes par sous-réseau ? quelles évolutions prévoir ?</li>
<li><b>Bits de sous-réseau</b> : le plus petit n tel que 2<sup>n</sup> ≥ nombre de sous-réseaux. <b>Bits d’hôte</b> : le plus petit h tel que 2<sup>h</sup> − 2 ≥ hôtes. Vérifie que n + h tient dans la partie hôte d’origine.</li>
<li><b>Nouveau masque</b> et <b>pas</b> (256 − valeur de l’octet du masque).</li>
<li><b>Plages</b> : pour chaque sous-réseau → adresse réseau, 1re adresse, dernière adresse, diffusion.</li></ol>
<h4>Situation 2 du cours : 192.168.59.0, 3 sous-réseaux de 61 adresses</h4>
<p>3 sous-réseaux → <b>2 bits</b> (4 ≥ 3) ; 61 adresses → <b>6 bits</b> d’hôte (2<sup>6</sup> − 2 = 62 ≥ 61). 2 + 6 = 8 bits : ça tient dans le dernier octet. Masque <b>255.255.255.192</b> (/26), pas de 64 :</p>
<table><tr><th>Sous-réseau</th><th>Bits S/R</th><th>Réseau</th><th>1re adresse</th><th>Dernière</th><th>Diffusion</th></tr>
<tr><td>SERVEURS</td><td>00</td><td>192.168.59.0</td><td>.1</td><td>.62</td><td>.63</td></tr>
<tr><td>FIXES</td><td>01</td><td>192.168.59.64</td><td>.65</td><td>.126</td><td>.127</td></tr>
<tr><td>MOBILES</td><td>10</td><td>192.168.59.128</td><td>.129</td><td>.190</td><td>.191</td></tr></table>
<div class="tip"><b>✔ Sous-réseau « zéro » :</b> dans la Situation 1, ton prof numérote les sous-réseaux à partir de 1 (172.16.<b>1</b>.0) ; dans le DS, le 1er sous-réseau est 10.<b>0</b>.0.0. Les deux se font : aujourd’hui le sous-réseau zéro est utilisable. Suis simplement la consigne (et en DS, commence à 0 comme dans le corrigé).</div>

<h3>3. VLSM : des masques de longueur variable</h3>
<p>Quand les besoins sont très différents (110 postes ici, 6 postes là, des liaisons de 2 routeurs…), un masque unique gaspille énormément. Le <b>VLSM</b> (<i>Variable Length Subnet Mask</i>) donne à chaque sous-réseau <b>juste la taille qu’il lui faut</b>.</p>
<div class="memo"><b>📌 La règle d’or du VLSM :</b> on range les besoins du <b>plus grand au plus petit</b>, et on attribue à chacun la <b>première plage libre</b>, sans trou. Les liaisons entre routeurs (2 adresses → <b>/30</b>) prennent les <b>dernières</b> plages.</div>
<h4>Situation 4 : 192.168.59.0/24 → MOBILES 100, FIXES 60, SERVEURS 15</h4>
<table><tr><th>Besoin</th><th>Taille du bloc</th><th>Masque</th><th>Réseau</th><th>Plage</th><th>Diffusion</th></tr>
<tr><td>MOBILES 100</td><td>128 (126 hôtes)</td><td>/25</td><td>192.168.59.0</td><td>.1 → .126</td><td>.127</td></tr>
<tr><td>FIXES 60</td><td>64 (62 hôtes)</td><td>/26</td><td>192.168.59.128</td><td>.129 → .190</td><td>.191</td></tr>
<tr><td>SERVEURS 15</td><td>32 (30 hôtes)</td><td>/27</td><td>192.168.59.192</td><td>.193 → .222</td><td>.223</td></tr></table>
<div class="warnbox"><b>⚠ Piège :</b> 15 adresses ne tiennent <b>pas</b> dans un /28 (2<sup>4</sup> − 2 = 14). Il faut un /27.</div>
<h4>Le cas du cours « VLSM subnets »</h4>
<p>Un même 10.0.0.0/8 peut être découpé en /16 (10.1.0.0, 10.2.0.0…), puis chaque /16 redécoupé différemment : 10.1.0.0/16 en /24, 10.3.0.0/16 en /28, 10.4.0.0/16 en /20… C’est ça, le VLSM.</p>
<div data-tool="subnets"></div>
`,
  questions: [
    { id: 's1', type: 'multi', q: 'D’après ton cours, pourquoi découper un réseau en sous-réseaux ?',
      choices: ['Hiérarchiser le réseau pour faciliter sa gestion', 'Confiner les diffusions pour de meilleures performances', 'Améliorer la sécurité (filtrage entre sous-réseaux)', 'Obtenir plus d’adresses IP publiques', 'Accélérer le débit des câbles'], good: [0, 1, 2],
      hints: ['Découper ne crée pas d’adresses supplémentaires : ça en consomme même un peu (réseau + diffusion de chaque sous-réseau).'],
      explain: 'Hiérarchie, confinement des broadcasts, sécurité. Découper <b>consomme</b> des adresses (2 par sous-réseau) et ne change rien au débit.' },
    { id: 's2', type: 'text', q: 'Combien de bits faut-il emprunter pour créer…', fields: [{ label: '10 sous-réseaux ?', kind: 'int', answer: 4 }, { label: '16 sous-réseaux ?', kind: 'int', answer: 4 }, { label: '3 sous-réseaux ?', kind: 'int', answer: 2 }, { label: '9 sous-réseaux ?', kind: 'int', answer: 4 }],
      hints: ['Plus petit n tel que 2<sup>n</sup> ≥ besoin. 2<sup>3</sup> = 8, 2<sup>4</sup> = 16.'], explain: '10 → 4 bits (16) ; 16 → 4 bits pile ; 3 → 2 bits (4) ; 9 → 4 bits (16).' },
    { id: 's3', type: 'grid', q: '<b>Situation 1 du cours</b> — réseau 172.16.0.0/16, besoin : 10 sous-réseaux de 100 adresses. Ton prof utilise le masque <b>255.255.255.0</b> et numérote à partir de 1 (sous-réseau 1 = 172.16.1.0). Complète les adresses de sous-réseaux.',
      file: 'situation1.xlsx', sheet: 'Situation 1',
      cols: [{ h: 'NUMÉRO SOUS RÉSEAU', w: 150 }, { h: 'ADRESSE SOUS RÉSEAU', kind: 'ip', w: 170 }],
      rows: [['1', '172.16.1.0'], ['2', { a: '172.16.2.0' }], ['3', { a: '172.16.3.0' }], ['4', { a: '172.16.4.0' }], ['5', { a: '172.16.5.0' }], ['6', { a: '172.16.6.0' }], ['7', { a: '172.16.7.0' }], ['8', { a: '172.16.8.0' }], ['9', { a: '172.16.9.0' }], ['10', { a: '172.16.10.0' }]],
      hints: ['Avec /24 sur un /16, on emprunte le 3e octet entier : le numéro de sous-réseau EST le 3e octet.'],
      explain: 'Masque /24 : 8 bits empruntés (256 sous-réseaux possibles, 254 hôtes chacun ≥ 100). Le n° de sous-réseau se lit dans le 3e octet : 172.16.<b>n</b>.0.' },
    { id: 's4', type: 'grid', q: '<b>Situation 1 (suite) — plages d’adresses.</b> Complète pour les sous-réseaux 1, 2 et 10.',
      file: 'situation1.xlsx', sheet: 'Plages',
      cols: [{ h: 'ADRESSE SOUS RÉSEAU', w: 150 }, { h: 'PREMIÈRE ADRESSE', kind: 'ip', w: 150 }, { h: 'DERNIÈRE ADRESSE', kind: 'ip', w: 150 }, { h: 'ADRESSE DE DIFFUSION', kind: 'ip', w: 160 }],
      rows: [['172.16.1.0', { a: '172.16.1.1' }, { a: '172.16.1.254' }, { a: '172.16.1.255' }], ['172.16.2.0', { a: '172.16.2.1' }, { a: '172.16.2.254' }, { a: '172.16.2.255' }], ['172.16.10.0', { a: '172.16.10.1' }, { a: '172.16.10.254' }, { a: '172.16.10.255' }]],
      hints: ['Partie hôte (dernier octet) : 00000001 → 1re adresse, 11111110 → dernière, 11111111 → diffusion.'],
      explain: 'Pour 172.16.1.0/24 : hôtes .1 à .254, diffusion .255 (partie hôte tout à 1).' },
    { id: 's5', type: 'text', q: '<b>Situation 2</b> — 192.168.59.0, 3 sous-réseaux de 61 adresses.',
      fields: [{ label: 'Bits pour le sous-réseau', kind: 'int', answer: 2 }, { label: 'Bits pour l’hôte', kind: 'int', answer: 6 }, { label: 'Masque (décimal pointé)', kind: 'maskdot', answer: '255.255.255.192' }],
      hints: ['3 sous-réseaux → 2<sup>2</sup> = 4 ≥ 3.', '61 adresses → 2<sup>6</sup> − 2 = 62 ≥ 61.'], explain: '2 bits S/R + 6 bits hôte = 8 bits (le dernier octet). Masque 255.255.255.<b>192</b>.' },
    { id: 's6', type: 'grid', q: '<b>Situation 2 (suite)</b> — complète les plages d’adresses (masque 255.255.255.192).',
      file: 'situation2.xlsx', sheet: 'Plages',
      cols: [{ h: 'SOUS RÉSEAU', w: 110 }, { h: 'ADRESSE RÉSEAU', kind: 'ip', w: 150 }, { h: 'PREMIÈRE', kind: 'ip', w: 150 }, { h: 'DERNIÈRE', kind: 'ip', w: 150 }, { h: 'DIFFUSION', kind: 'ip', w: 150 }],
      rows: [['SERVEURS', '192.168.59.0', { a: '192.168.59.1' }, { a: '192.168.59.62' }, { a: '192.168.59.63' }], ['FIXES', { a: '192.168.59.64' }, { a: '192.168.59.65' }, { a: '192.168.59.126' }, { a: '192.168.59.127' }], ['MOBILES', { a: '192.168.59.128' }, { a: '192.168.59.129' }, { a: '192.168.59.190' }, { a: '192.168.59.191' }]],
      hints: ['Pas = 256 − 192 = 64 : les réseaux sont .0, .64, .128.'], explain: 'Bits S/R 00 → .0, 01 → .64, 10 → .128. Diffusion = réseau suivant − 1.' },
    { id: 's7', type: 'text', q: '<b>Situation 3</b> — 172.16.0.0/16, besoin : 9 sous-réseaux de 300 adresses.',
      fields: [{ label: 'Bits S/R minimum', kind: 'int', answer: 4 }, { label: 'Bits hôte minimum', kind: 'int', answer: 9 }, { label: 'Masque si on garde le max d’hôtes (4 bits S/R)', kind: 'maskdot', answer: '255.255.240.0' }, { label: 'Masque si on garde le max de sous-réseaux (9 bits hôte)', kind: 'maskdot', answer: '255.255.254.0' }],
      hints: ['9 sous-réseaux → 2<sup>4</sup> = 16. 300 adresses → 2<sup>9</sup> − 2 = 510 (2<sup>8</sup> − 2 = 254 ne suffit pas).', 'Il y a 16 bits d’hôte au départ : 4 + 9 = 13 ≤ 16, il reste 3 bits libres qu’on peut donner au réseau ou à l’hôte.', '16 + 4 = /20 → 255.255.240.0 ; 32 − 9 = /23 → 255.255.254.0.'],
      explain: 'Tout masque entre /20 et /23 fonctionne. /20 (255.255.240.0) : 16 sous-réseaux de 4094 hôtes. /23 (255.255.254.0) : 128 sous-réseaux de 510 hôtes. À toi de choisir selon l’évolution prévue.' },
    { id: 's8', type: 'grid', q: '<b>Situation 4 (VLSM)</b> — 192.168.59.0/24 : SERVEURS 15 adresses, FIXES 60, MOBILES 100. Range du plus grand au plus petit et complète (masque en /n).',
      file: 'situation4.xlsx', sheet: 'VLSM',
      cols: [{ h: 'SOUS RÉSEAU', w: 110 }, { h: 'BESOIN', w: 80 }, { h: 'MASQUE', kind: 'mask', w: 90 }, { h: 'ADRESSE RÉSEAU', kind: 'ip', w: 150 }, { h: 'PREMIÈRE', kind: 'ip', w: 140 }, { h: 'DERNIÈRE', kind: 'ip', w: 140 }, { h: 'DIFFUSION', kind: 'ip', w: 140 }],
      rows: [['MOBILES', '100', { a: '/25' }, { a: '192.168.59.0' }, { a: '192.168.59.1' }, { a: '192.168.59.126' }, { a: '192.168.59.127' }], ['FIXES', '60', { a: '/26' }, { a: '192.168.59.128' }, { a: '192.168.59.129' }, { a: '192.168.59.190' }, { a: '192.168.59.191' }], ['SERVEURS', '15', { a: '/27' }, { a: '192.168.59.192' }, { a: '192.168.59.193' }, { a: '192.168.59.222' }, { a: '192.168.59.223' }]],
      hints: ['100 → bloc de 128 (/25) ; 60 → bloc de 64 (/26) ; 15 → bloc de 32 (/27) car un /28 n’offre que 14 hôtes.', 'On enchaîne sans trou : 0 → 127, puis 128 → 191, puis 192 → 223.'],
      explain: 'Le plus grand d’abord : MOBILES 192.168.59.0/25, FIXES .128/26, SERVEURS .192/27. Il reste .224 → .255 de libre pour plus tard.' },
    { id: 's9', type: 'match', q: '<b>Exercice du cours</b> — Réseau en <code>255.255.254.0</code>, serveur DHCP 192.168.4.10, étendue 192.168.5.10 → 192.168.5.240, passerelle 192.168.5.254, DNS 192.168.4.1 et 192.168.6.2, WINS 192.168.5.9. Tu veux donner une adresse <b>fixe</b> à un nouveau serveur : chaque adresse est-elle correcte ?',
      pairs: [['192.168.2.1', 'Non : elle est dans un autre réseau'], ['192.168.4.0', 'Non : c’est l’adresse du réseau'], ['192.168.4.1', 'Non : déjà utilisée (serveur DNS1)'], ['192.168.5.0', 'Oui : hôte valide, hors de l’étendue DHCP'], ['192.168.5.255', 'Non : c’est l’adresse de diffusion'], ['192.168.4.10', 'Non : déjà utilisée (serveur DHCP)'], ['192.168.6.1', 'Non : elle est dans un autre réseau'], ['192.168.4.255', 'Oui : hôte valide, hors de l’étendue DHCP']],
      hints: ['Commence par trouver le réseau : les machines sont en 192.168.4.x et 192.168.5.x avec un /23 → réseau 192.168.4.0/23.', 'Le /23 va de 192.168.4.0 (réseau) à 192.168.5.255 (diffusion). 192.168.4.255 et 192.168.5.0 sont donc au <b>milieu</b> de la plage !', 'Une adresse fixe ne doit pas être dans l’étendue DHCP (5.10 → 5.240) ni déjà prise.'],
      explain: 'Réseau 192.168.4.0/23 : de .4.0 (réseau) à .5.255 (diffusion). Valides et libres : <b>192.168.5.0</b> et <b>192.168.4.255</b>. 192.168.2.1 et 192.168.6.1 sont hors réseau (le DNS2 192.168.6.2 est joint via la passerelle).' },
    { id: 's10', type: 'qcm', q: '<b>TD VLSM</b> (194.132.18.0/24) — Réseau 4 : 110 postes, Réseau 2 : 30, Réseau 1 : 19, Réseau 5 : 12, Réseau 6 : 9, Réseau 3 : 6, plus 5 liaisons entre routeurs (R1-R2, R1-R4, R3-R4, R3-R6, R4-R5). Peut-on donner le <b>même masque</b> à tous les sous-réseaux ?',
      choices: ['Oui, avec /25', 'Oui, avec /27', 'Non : un masque assez grand pour 110 postes (/25) ne donne que 2 sous-réseaux, alors qu’il en faut 11', 'Oui, avec /28'], good: 2,
      hints: ['Il faut 6 réseaux locaux + 5 liaisons = 11 sous-réseaux.', 'Réseau 4 impose au moins 7 bits d’hôte (126 ≥ 110) → il ne reste qu’1 bit de sous-réseau.'],
      explain: '110 postes → /25 → seulement 2<sup>1</sup> = 2 sous-réseaux. Avec 4 bits de S/R (16 sous-réseaux), il ne reste que 4 bits d’hôte = 14 postes : trop peu pour 110. Donc <b>VLSM obligatoire</b>.' },
    { id: 's11', type: 'grid', q: '<b>TD VLSM — réseaux locaux</b> (corrigé TD2). Remplis comme dans le tableau du prof : nombre de bits hôte, bits S/R (dans le dernier octet), masque (/n), adresse réseau, première et dernière adresse (tu peux écrire juste le dernier octet).',
      file: 'TD2-VLSM.xlsx', sheet: 'Feuil1',
      cols: [{ h: 'NOM RÉSEAU', w: 90 }, { h: 'NBR ADR', w: 70 }, { h: 'BITS HOST', kind: 'int', w: 80 }, { h: 'BITS S/RÉSEAU', kind: 'int', w: 100 }, { h: 'MASQUE', kind: 'mask', w: 80 }, { h: 'ADR RÉSEAU', kind: 'ip', w: 140 }, { h: 'PREMIÈRE ADR', kind: 'text', w: 130 }, { h: 'DERNIÈRE ADR', kind: 'text', w: 130 }],
      rows: [
        ['RESEAU4', '110', { a: 7 }, { a: 1 }, { a: '/25' }, { a: '194.132.18.0' }, { a: r(1) }, { a: r(126) }],
        ['RESEAU2', '30', { a: 5 }, { a: 3 }, { a: '/27' }, { a: '194.132.18.128' }, { a: r(129) }, { a: r(158) }],
        ['RESEAU1', '19', { a: 5 }, { a: 3 }, { a: '/27' }, { a: '194.132.18.160' }, { a: r(161) }, { a: r(190) }],
        ['RESEAU5', '12', { a: 4 }, { a: 4 }, { a: '/28' }, { a: '194.132.18.192' }, { a: r(193) }, { a: r(206) }],
        ['RESEAU6', '9', { a: 4 }, { a: 4 }, { a: '/28' }, { a: '194.132.18.208' }, { a: r(209) }, { a: r(222) }],
        ['RESEAU3', '6', { a: 3 }, { a: 5 }, { a: '/29' }, { a: '194.132.18.224' }, { a: r(225) }, { a: r(230) }]
      ],
      hints: ['Le nombre de postes inclut le routeur. Bits hôte : plus petit h avec 2<sup>h</sup> − 2 ≥ besoin (110 → 7, 30 → 5, 19 → 5, 12 → 4, 9 → 4, 6 → 3). Bits S/R = 8 − h.', 'Enchaîne les blocs sans trou : 0 (+128) → 128 (+32) → 160 (+32) → 192 (+16) → 208 (+16) → 224 (+8).'],
      explain: 'Exactement le corrigé du prof : /25 .0, /27 .128, /27 .160, /28 .192, /28 .208, /29 .224. Attention au Réseau 2 : 30 postes tiennent pile dans un /27 (30 hôtes).' },
    { id: 's12', type: 'grid', q: '<b>TD VLSM — liaisons entre routeurs</b> : elles prennent les dernières plages. Complète.',
      file: 'TD2-VLSM.xlsx', sheet: 'Feuil1',
      cols: [{ h: 'LIAISON', w: 80 }, { h: 'NBR ADR', w: 70 }, { h: 'MASQUE', kind: 'mask', w: 80 }, { h: 'ADR RÉSEAU', kind: 'ip', w: 140 }, { h: 'PREMIÈRE ADR', kind: 'text', w: 130 }, { h: 'DERNIÈRE ADR', kind: 'text', w: 130 }],
      rows: [
        ['R1R2', '2', { a: '/30' }, { a: '194.132.18.232' }, { a: r(233) }, { a: r(234) }],
        ['R1R4', '2', { a: '/30' }, { a: '194.132.18.236' }, { a: r(237) }, { a: r(238) }],
        ['R3R4', '2', { a: '/30' }, { a: '194.132.18.240' }, { a: r(241) }, { a: r(242) }],
        ['R3R6', '2', { a: '/30' }, { a: '194.132.18.244' }, { a: r(245) }, { a: r(246) }],
        ['R4R5', '2', { a: '/30' }, { a: '194.132.18.248' }, { a: r(249) }, { a: r(250) }]
      ],
      hints: ['2 adresses utilisables → /30 (bloc de 4). La dernière plage utilisée par les LAN finit à .231 (diffusion du Réseau 3).', 'Blocs de 4 : .232, .236, .240, .244, .248.'],
      explain: 'Les /30 s’enchaînent : .232, .236, .240, .244, .248 (les plages .252 restent libres). Règle du TD : dans R1-R2, R1 prend l’adresse basse (.233) et R2 la haute (.234).' },
    { id: 's13', type: 'text', q: '<b>TD VLSM — adresses des interfaces</b> (règles : le routeur prend la 1re adresse de son LAN ; sur une liaison, le routeur au plus petit numéro prend l’adresse basse).',
      fields: [{ label: 'R4 dans le Réseau 4', kind: 'ip', answer: '194.132.18.1' }, { label: 'R4 sur la liaison R1-R4', kind: 'ip', answer: '194.132.18.238' }, { label: 'R3 sur la liaison R3-R4', kind: 'ip', answer: '194.132.18.241' }, { label: 'R2 dans le Réseau 2', kind: 'ip', answer: '194.132.18.129' }, { label: 'Un PC valide du Réseau 3 (le 2e hôte)', kind: 'ip', answer: '194.132.18.226' }],
      hints: ['R1-R4 : .237 (basse) pour R1, .238 (haute) pour R4.', 'Réseau 3 = 194.132.18.224/29 : .225 est le routeur R3, le PC suivant est .226.'],
      explain: 'R4 : .1 (LAN), .238 (R1-R4), .242 (R3-R4), .249 (R4-R5). R3 : .225 (LAN), .241 (R3-R4), .245 (R3-R6). R2 : .129 (LAN) et .234 (R1-R2). Un PC du Réseau 3 : 194.132.18.226/29, passerelle .225.' },
    { id: 's14', type: 'text', q: 'Dans le schéma « VLSM subnets » du cours, 10.3.0.0/16 est redécoupé en <b>/28</b>.',
      fields: [{ label: 'Nombre de sous-réseaux /28 possibles', kind: 'int', answer: 4096 }, { label: 'Nombre d’hôtes par /28', kind: 'int', answer: 14 }, { label: '3e sous-réseau (après 10.3.0.0 et 10.3.0.16)', kind: 'cidr', answer: '10.3.0.32/28', ph: 'a.b.c.d/n' }],
      hints: ['Bits empruntés : 28 − 16 = 12 → 2<sup>12</sup>.', 'Un /28 = blocs de 16 adresses.'],
      explain: '2<sup>12</sup> = 4096 sous-réseaux de 2<sup>4</sup> − 2 = 14 hôtes : 10.3.0.0, 10.3.0.16, <b>10.3.0.32</b>, 10.3.0.48… (ceux du schéma).' },
    { id: 's-lab', lvl: 4, type: 'pt', file: 'Situation2.pkt', tag: 'Sous-réseaux',
      q: '<b>La Situation 2 dans Packet Tracer.</b> Tu as calculé le plan de 192.168.59.0 découpé en /26 : SERVEURS = .0, FIXES = .64, MOBILES = .128. Mets-le en œuvre sur le routeur 2911 <b>R1</b> (déjà câblé) : chaque interface prend la <b>1re adresse</b> de son sous-réseau (G0/0 = SERVEURS, G0/1 = FIXES, G0/2 = MOBILES) et chaque machine la <b>2e adresse</b>, avec le bon masque et la bonne passerelle.',
      build: function () {
        return LAB.make({
          devices: [['R1', '2911', 520, 90], ['S-SERVEURS', '2960-24TT', 200, 280], ['S-FIXES', '2960-24TT', 520, 280], ['S-MOBILES', '2960-24TT', 840, 280], ['SRV1', 'Server-PT', 200, 460], ['FIXE1', 'PC-PT', 520, 460], ['MOBILE1', 'Laptop-PT', 840, 460]],
          links: [['R1', 'GigabitEthernet0/0', 'S-SERVEURS', 'GigabitEthernet0/1', 'straight'], ['R1', 'GigabitEthernet0/1', 'S-FIXES', 'GigabitEthernet0/1', 'straight'], ['R1', 'GigabitEthernet0/2', 'S-MOBILES', 'GigabitEthernet0/1', 'straight'], ['SRV1', 'FastEthernet0', 'S-SERVEURS', 'FastEthernet0/1', 'straight'], ['FIXE1', 'FastEthernet0', 'S-FIXES', 'FastEthernet0/1', 'straight'], ['MOBILE1', 'FastEthernet0', 'S-MOBILES', 'FastEthernet0/1', 'straight']],
          notes: [[120, 560, 'Situation 2 : 192.168.59.0 découpé en /26 — SERVEURS (G0/0) · FIXES (G0/1) · MOBILES (G0/2)']]
        });
      },
      tasks: [
        { label: 'R1 G0/0 (SERVEURS) : 1re adresse du sous-réseau, bon masque, interface active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/0', '192.168.59.1', '255.255.255.192') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/0'); } },
        { label: 'R1 G0/1 (FIXES) : 1re adresse du sous-réseau, bon masque, interface active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/1', '192.168.59.65', '255.255.255.192') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/1'); } },
        { label: 'R1 G0/2 (MOBILES) : 1re adresse du sous-réseau, bon masque, interface active', check: function (n) { return LAB.ifIp(n, 'R1', 'GigabitEthernet0/2', '192.168.59.129', '255.255.255.192') && LAB.ifUp(n, 'R1', 'GigabitEthernet0/2'); } },
        { label: 'SRV1 : 2e adresse de SERVEURS, masque et passerelle', check: function (n) { return LAB.hostIs(n, 'SRV1', '192.168.59.2', '255.255.255.192', '192.168.59.1'); } },
        { label: 'FIXE1 : 2e adresse de FIXES, masque et passerelle', check: function (n) { return LAB.hostIs(n, 'FIXE1', '192.168.59.66', '255.255.255.192', '192.168.59.65'); } },
        { label: 'MOBILE1 : 2e adresse de MOBILES, masque et passerelle', check: function (n) { return LAB.hostIs(n, 'MOBILE1', '192.168.59.130', '255.255.255.192', '192.168.59.129'); } },
        { label: 'FIXE1 et MOBILE1 joignent le serveur', check: function (n) { return n.canPing('FIXE1', 'SRV1') && n.canPing('MOBILE1', 'SRV1'); } }
      ],
      hints: ['Masque /26 = 255.255.255.192. 1res adresses : .1, .65, .129 ; 2es adresses : .2, .66, .130.', 'R1 (onglet CLI) : <code>enable</code> → <code>conf t</code> → <code>interface g0/0</code> → <code>ip address 192.168.59.1 255.255.255.192</code> → <code>no shutdown</code>, puis pareil pour g0/1 et g0/2.', 'Chaque machine : Desktop → IP Configuration. Passerelle = l’adresse de R1 dans son sous-réseau (SRV1 → .1, FIXE1 → .65, MOBILE1 → .129).'],
      solution: [
        { dev: 'R1', cli: ['conf t', 'interface g0/0', 'ip address 192.168.59.1 255.255.255.192', 'no shutdown', 'interface g0/1', 'ip address 192.168.59.65 255.255.255.192', 'no shutdown', 'interface g0/2', 'ip address 192.168.59.129 255.255.255.192', 'no shutdown', 'end'] },
        { dev: 'SRV1', host: { ip: '192.168.59.2', mask: '255.255.255.192', gw: '192.168.59.1' } },
        { dev: 'FIXE1', host: { ip: '192.168.59.66', mask: '255.255.255.192', gw: '192.168.59.65' } },
        { dev: 'MOBILE1', host: { ip: '192.168.59.130', mask: '255.255.255.192', gw: '192.168.59.129' } }
      ],
      explain: 'Le tableau devient un vrai réseau : trois sous-réseaux /26, donc trois domaines de diffusion séparés par R1. Aucune route à écrire : les trois réseaux sont directement connectés au routeur (lettre <b>C</b> dans <code>show ip route</code>).' }
  ]
  });
})();
