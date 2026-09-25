/* Module 19 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).examen = [
  /* ---------- Débutant ---------- */
  { id: 'xex1', lvl: 1, type: 'qcm', q: 'Sur quel support se passe le DS de réseaux ?',
    choices: ['Un classeur Excel à remplir, corrigé automatiquement par des formules', 'Une copie papier', 'Un QCM en ligne', 'Un oral devant le prof'], good: 0,
    hints: ['Relis « Le format du DS ».'],
    explain: 'Un <b>classeur Excel</b> : les formules de la feuille de correction comparent tes cellules au corrigé. D’où l’importance de l’ordre des lignes et des fautes de frappe.' },
  { id: 'xex2', lvl: 1, type: 'multi', q: 'Sujet 1 (adressage) : que faut-il donner pour chaque sous-réseau ?',
    choices: ['L’adresse réseau', 'Le masque', 'La première et la dernière adresse', 'L’adresse de broadcast', 'L’adresse MAC du routeur'], good: [0, 1, 2, 3],
    hints: ['Tout ce qui décrit une plage d’adresses IP.'],
    explain: 'Adresse réseau, masque, début, fin et broadcast. Aucune adresse MAC dans ce sujet.' },
  { id: 'xex3', lvl: 1, type: 'qcm', q: 'Dans une table de routage « format Windows », comment s’écrit la route par défaut d’un PC ?',
    choices: ['Réseau 0.0.0.0, masque 0.0.0.0, passerelle = l’adresse de son routeur', 'Réseau 255.255.255.255, masque 0.0.0.0', 'Réseau du PC, masque 255.255.255.255', 'Un PC n’a pas de route par défaut'], good: 0,
    hints: ['« Par défaut » = pour toutes les destinations : aucun bit imposé.'],
    explain: '<b>0.0.0.0 / 0.0.0.0</b> vers la passerelle, avec comme interface l’IP du PC. Elle vaut 2 points au DS.' },
  /* ---------- Impossible ---------- */
  { id: 'xex4', lvl: 6, type: 'text', q: 'Sujet 1 : 10.0.0.0 est découpé en <b>16</b> sous-réseaux (le 1er étant 10.0.0.0). Pour le <b>11e</b> sous-réseau, donne :',
    fields: [{ label: 'Adresse réseau', kind: 'ip', answer: '10.160.0.0' }, { label: 'Adresse de broadcast', kind: 'ip', answer: '10.175.255.255' }],
    hints: ['16 sous-réseaux = 4 bits empruntés → /12, pas de 16 sur le 2e octet.', 'Le n-ième commence à (n − 1) × 16 : 10 × 16 = 160.'],
    explain: 'Blocs 10.0, 10.16, 10.32… Le 11e commence à 10 × 16 = <b>10.160.0.0</b> et finit juste avant le suivant (10.176.0.0) : broadcast <b>10.175.255.255</b>.' },
  { id: 'xex5', lvl: 6, type: 'text', q: 'Variante du Sujet 1 : on veut découper 192.168.254.0/24 en <b>5</b> sous-réseaux (au lieu de 4), le plus grands possible.',
    fields: [{ label: 'Masque (décimal pointé)', kind: 'maskdot', answer: '255.255.255.224', ph: 'a.b.c.d' }, { label: 'Hôtes utilisables par sous-réseau', kind: 'int', answer: 30 }],
    hints: ['2 bits donnent 4 sous-réseaux : pas assez pour 5.', '3 bits empruntés → /27.'],
    explain: '5 sous-réseaux exigent 3 bits (2³ = 8 ≥ 5) → /27 = <b>255.255.255.224</b>, 2⁵ − 2 = <b>30</b> hôtes. Passer de 4 à 5 sous-réseaux divise la taille par deux !' },
  { id: 'xex6', lvl: 6, type: 'multi', q: 'Sujet 2 : R1 n’a qu’une sortie (vers R2). Quelles routes <b>uniques</b> pourraient remplacer ses deux routes statiques (192.168.200.0/24 et 192.168.20.0/24 via 172.31.0.3) sans rien casser ?',
    choices: ['ip route 0.0.0.0 0.0.0.0 172.31.0.3', 'ip route 192.168.0.0 255.255.0.0 172.31.0.3', 'ip route 192.168.20.0 255.255.255.0 172.31.0.3', 'ip route 0.0.0.0 0.0.0.0 172.31.0.1'], good: [0, 1],
    hints: ['R1 est un « cul-de-sac » : tout ce qui n’est pas chez lui part vers R2.', 'Et 192.168.0.0/16 ? Elle couvre aussi 192.168.254.0… mais la route connectée /24 est plus précise.'],
    explain: 'La route par défaut via R2 marche (R1 est un cul-de-sac). La route résumée 192.168.0.0/16 aussi : elle couvre 192.168.200.0 et 192.168.20.0, et pour 192.168.254.0 la route connectée /24, plus précise, l’emporte. La 3e oublie SRV1 ; la 4e pointe vers R1 lui-même.' }
];
