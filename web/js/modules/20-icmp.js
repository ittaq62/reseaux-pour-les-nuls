(function () {
  /* route présente dans la table d'un routeur (et passerelle attendue si précisée) */
  function route(n, dev, cidr, nh) {
    var c = NET.parseCIDR(cidr), d = n.dev(dev);
    return !!d && n.routeTable(d).some(function (r) { return r.net === c.ip && r.len === c.len && (nh == null || r.nh === NET.ip2int(nh)); });
  }
  var RT_WIN = [{ h: 'Rôle de la ligne', w: 210 }, { h: 'Réseau', kind: 'ip', w: 130 }, { h: 'Masque', kind: 'maskdot', w: 140 }, { h: 'Passerelle', kind: 'ip', w: 130 }, { h: 'Interface', kind: 'ip', w: 130 }];

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'icmp', num: 20, icon: '📡', titre: 'Le protocole IP et ICMP',
  sous: 'En-tête IP, TTL, types et codes ICMP, ping, tracert, redirection',
  source: 'Protocoles de la couche 3.pdf (CV du 02/10), PROTOCLES RESO ET TRANSPORT.pdf et Etude ICMP.pdf (CV du 09/10)',
  cours: `
<h3>1. L’aiguillage entre la couche 2 et la couche 3</h3>
<p>Quand une carte réseau reçoit une trame Ethernet, comment sait-elle à quel protocole donner le contenu ? Grâce au champ <b>Type</b> (EtherType) de l’en-tête Ethernet :</p>
<table><tr><th>EtherType</th><th>Protocole transporté</th></tr>
<tr><td><code>0x0800</code></td><td>IPv4</td></tr>
<tr><td><code>0x0806</code></td><td>ARP</td></tr>
<tr><td><code>0x8035</code></td><td>RARP</td></tr>
<tr><td><code>0x86DD</code></td><td>IPv6</td></tr></table>
<div class="tip"><b>✔ Lecture de ton poly :</b> la diapo écrit « Ox8O35 » avec des <b>lettres O</b> à la place des zéros : il faut lire <code>0x8035</code> (hexadécimal). Même chose pour 0x0800 et 0x0806.</div>
<p>Au-dessus d’IP, c’est le champ <b>Protocole</b> de l’en-tête IP qui fait le même travail : <b>1 = ICMP</b>, 2 = IGMP, <b>6 = TCP</b>, <b>17 = UDP</b>, 89 = OSPF.</p>

<h3>2. IP : livrer des paquets « au mieux »</h3>
<ul><li><b>Mode datagramme</b> : chaque paquet voyage seul, avec ses adresses source et destination.</li>
<li><b>Remise non fiable</b> (<i>best effort</i>) : IP ne garantit ni l’arrivée, ni l’ordre, ni l’absence de doublons. La fiabilité, c’est le travail de <b>TCP</b> (UDP, lui, n’en ajoute pas).</li>
<li>IP assure le <b>routage</b> et la <b>fragmentation</b> (découper un paquet trop gros pour un lien).</li>
<li>Le « contrôle de flux rudimentaire » cité par ton poly, c’était le message ICMP <b>Source Quench</b> (type 4) : il est <b>abandonné</b> aujourd’hui (RFC 6633).</li></ul>

<h4>L’en-tête IPv4 (20 octets sans options)</h4>
<table><tr><th>Champ</th><th>Taille</th><th>À retenir</th></tr>
<tr><td>Version</td><td>4 bits</td><td>4 pour IPv4</td></tr>
<tr><td>Longueur d’en-tête (IHL)</td><td>4 bits</td><td>en <b>mots de 32 bits</b> : 5 → 20 octets (minimum), 15 → 60 octets (maximum)</td></tr>
<tr><td>Type de service</td><td>8 bits</td><td>priorité du paquet (aujourd’hui DSCP + ECN, utilisé pour la qualité de service)</td></tr>
<tr><td>Longueur totale</td><td>16 bits</td><td>taille du paquet <b>en-tête compris</b>, en octets (65 535 max)</td></tr>
<tr><td>Identification</td><td>16 bits</td><td>numéro du paquet : tous les fragments d’un même paquet portent le même</td></tr>
<tr><td>Drapeaux</td><td>3 bits</td><td><b>DF</b> (ne pas fragmenter), <b>MF</b> (d’autres fragments suivent)</td></tr>
<tr><td>Décalage du fragment</td><td>13 bits</td><td>position du fragment, en blocs de 8 octets</td></tr>
<tr><td>Durée de vie (TTL)</td><td>8 bits</td><td><b>−1 à chaque routeur</b> ; à 0 le paquet est détruit</td></tr>
<tr><td>Protocole</td><td>8 bits</td><td>1 ICMP, 6 TCP, 17 UDP…</td></tr>
<tr><td>Somme de contrôle d’en-tête</td><td>16 bits</td><td>ne protège que l’en-tête ; <b>recalculée par chaque routeur</b> (le TTL change)</td></tr>
<tr><td>Adresses source et destination</td><td>32 bits chacune</td><td><b>ne changent pas</b> de bout en bout (sauf NAT)</td></tr>
<tr><td>Options + bourrage</td><td>variable</td><td>complètent l’en-tête à un multiple de 32 bits</td></tr></table>
<div class="memo"><b>📌 De saut en saut :</b> à chaque routeur, les adresses <b>MAC</b> de la trame sont <b>remplacées</b> (source = le routeur, destination = le saut suivant), alors que les adresses <b>IP</b> restent celles de l’émetteur et du destinataire final. Seuls le TTL et la somme de contrôle de l’en-tête changent.</div>

<h3>3. ICMP : le messager d’IP</h3>
<p><b>ICMP</b> (<i>Internet Control Message Protocol</i>) signale les erreurs et aide au diagnostic. Il est <b>transporté dans IP</b> (protocole n° 1) mais fait partie de la couche réseau. Quand un routeur détruit un paquet (pas de route, TTL à 0…), il prévient <b>l’émetteur</b> par un message ICMP.</p>
<div class="figure"><svg viewBox="0 0 620 70" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<rect x="10" y="15" width="110" height="40" rx="4" fill="#1f6fb2"/><text x="65" y="40" fill="#fff" text-anchor="middle">Type (8 bits)</text>
<rect x="125" y="15" width="110" height="40" rx="4" fill="#1f6fb2"/><text x="180" y="40" fill="#fff" text-anchor="middle">Code (8 bits)</text>
<rect x="240" y="15" width="150" height="40" rx="4" fill="#1f6fb2"/><text x="315" y="40" fill="#fff" text-anchor="middle">Checksum (16 bits)</text>
<rect x="395" y="15" width="215" height="40" rx="4" fill="#3d4f6b"/><text x="502" y="34" fill="#fff" text-anchor="middle">Données complémentaires</text><text x="502" y="49" fill="#cfe3ff" text-anchor="middle" font-size="11">(id + séquence, adresse de passerelle…)</text>
</svg><div class="figcap">Les 4 premiers octets d’un message ICMP. Un message d’erreur ajoute ensuite l’en-tête IP et les 64 premiers bits (8 octets) du paquet en cause.</div></div>
<table><tr><th>Type</th><th>Message</th><th>Exemple</th></tr>
<tr><td><b>0</b></td><td>Echo Reply (réponse d’écho)</td><td>réponse au ping</td></tr>
<tr><td><b>3</b></td><td>Destination Unreachable</td><td>pas de route, port fermé, filtrage…</td></tr>
<tr><td>4</td><td>Source Quench</td><td>« ralentis » — obsolète</td></tr>
<tr><td><b>5</b></td><td>Redirect (change de route)</td><td>« passe plutôt par ce routeur »</td></tr>
<tr><td><b>8</b></td><td>Echo Request (demande d’écho)</td><td>le ping</td></tr>
<tr><td><b>11</b></td><td>Time Exceeded</td><td>TTL tombé à 0 (base du traceroute)</td></tr>
<tr><td>12</td><td>Parameter Problem</td><td>en-tête incorrect</td></tr>
<tr><td>13 / 14</td><td>Timestamp Request / Reply</td><td>horodatage</td></tr>
<tr><td>15 / 16, 17 / 18</td><td>Information, Address Mask Request / Reply</td><td>obsolètes</td></tr></table>
<p>Le <b>code</b> précise la cause. Pour le type 3 :</p>
<table><tr><th>Code</th><th>Signification</th></tr>
<tr><td>0</td><td>réseau inaccessible</td></tr><tr><td>1</td><td>hôte (machine) inaccessible</td></tr>
<tr><td>2</td><td>protocole inaccessible</td></tr><tr><td>3</td><td><b>port</b> inaccessible (rien n’écoute sur ce port UDP)</td></tr>
<tr><td>4</td><td>fragmentation nécessaire mais DF positionné</td></tr><tr><td>5</td><td>échec du routage par la source</td></tr>
<tr><td>6 / 7</td><td>réseau / machine inconnu(e)</td></tr><tr><td>9 / 10</td><td>communication avec le réseau / la machine interdite</td></tr>
<tr><td>11 / 12</td><td>réseau / machine inaccessible pour ce type de service</td></tr>
<tr><td><b>13</b></td><td>communication interdite par filtrage</td></tr></table>
<div class="warnbox"><b>⚠ Deux erreurs dans ton poly « Protocoles de la couche 3 » :</b><br>• Le tableau des codes du type 3 écrit deux fois le code <b>11</b> : la dernière ligne (« communication interdite, filtrage ») est le code <b>13</b>.<br>• La diapo « Exemple de codes » (11, 5, 4, 8, 15…18) liste en réalité des <b>types</b>, pas des codes. Et il y manque les deux plus utiles : <b>0</b> (Echo Reply) et <b>3</b> (Destination Unreachable).</div>
<div class="memo"><b>📌 Pas d’effet boule de neige :</b> on n’émet <b>jamais</b> de message d’erreur ICMP à propos d’un message d’<b>erreur</b> ICMP (ni pour un paquet en diffusion ou multicast, ni pour un fragment autre que le premier). Attention, ton poly dit « les messages ICMP ne produisent pas de messages d’erreur » : c’est trop large. Une <b>demande d’écho</b> (le ping) <b>peut</b> provoquer une erreur ICMP : c’est justement ce que montre l’étude ICMP (R2 répond « destination inaccessible » au ping de P2).</div>

<h3>4. Les outils : ping et tracert</h3>
<ul><li><b>ping</b> envoie des <b>Echo Request</b> (type 8, code 0) avec un <b>identifiant</b> et un <b>numéro de séquence</b> ; la cible répond par des <b>Echo Reply</b> (type 0) qui recopient l’identifiant, la séquence et les données.</li>
<li>Le <b>TTL</b> affiché dans la réponse = TTL de départ de la cible − nombre de routeurs traversés <b>par la réponse</b>. Valeurs de départ courantes : <b>128</b> (Windows), <b>64</b> (Linux), <b>255</b> (routeurs Cisco). « TTL=127 » venant d’un PC Windows = 1 routeur sur le chemin du retour.</li>
<li><b>tracert</b> (Windows) envoie des echo avec un TTL de 1, puis 2, puis 3… Chaque routeur qui met le TTL à 0 répond <b>Time Exceeded</b> (type 11, code 0) : on découvre le chemin saut par saut. Le <code>traceroute</code> de Cisco et de Linux envoie plutôt de l’UDP vers des ports improbables : la destination finit par répondre <b>port inaccessible</b> (type 3, code 3).</li></ul>
<div class="demo dark">C:\&gt;ping 192.168.0.10
Reply from 192.168.100.2: Destination host unreachable.   ← un ROUTEUR répond : il n’a pas de route
Request timed out.                                         ← aucune réponse du tout (perte, filtrage, pas de retour)
Reply from 192.168.0.10: bytes=32 time&lt;1ms TTL=127        ← la cible répond, 1 routeur au retour</div>

<h4>L’astuce de la somme de contrôle (vue dans l’étude)</h4>
<p>La somme de contrôle ICMP est un complément à 1 de la somme des mots de 16 bits. Conséquences pratiques :</p>
<ul><li>La réponse d’écho est la copie de la demande avec le type 8 remplacé par 0 : le premier mot passe de 0x0800 à 0x0000, donc la somme de contrôle <b>augmente de 0x0800</b>. Demande <code>08 00 2E 5C</code> → réponse <code>00 00 36 5C</code>.</li>
<li>Le ping suivant a une séquence +1 (0x1D00 → 0x1E00, soit +0x0100) : la somme de contrôle <b>diminue de 0x0100</b> (2E5C → 2D5C).</li></ul>

<h3>5. La redirection ICMP (type 5)</h3>
<p>Un routeur qui doit renvoyer un paquet <b>par l’interface d’où il vient</b>, vers un routeur du <b>même réseau que l’émetteur</b>, le transmet quand même… puis envoie à l’émetteur un <b>Redirect</b> : « la prochaine fois, passe directement par ce routeur-là ». Code 0 = pour tout le réseau, <b>code 1 = pour cette machine</b>. Windows ajoute alors une <b>route d’hôte</b> (masque 255.255.255.255) dans sa table de routage.</p>
<div class="figure"><svg viewBox="0 0 700 170" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="12">
<line x1="20" y1="60" x2="680" y2="60" stroke="#8a9bb3" stroke-width="2"/>
<text x="20" y="50" fill="#6fd6f5" font-weight="700">192.168.200.0/24</text><text x="290" y="50" fill="#6fd6f5" font-weight="700">192.168.100.0/24</text><text x="560" y="50" fill="#6fd6f5" font-weight="700">192.168.0.0/24</text>
<ellipse cx="200" cy="60" rx="32" ry="18" fill="#1f6fb2"/><text x="200" y="65" fill="#fff" text-anchor="middle" font-weight="700">R2</text>
<ellipse cx="480" cy="60" rx="32" ry="18" fill="#1f6fb2"/><text x="480" y="65" fill="#fff" text-anchor="middle" font-weight="700">R1</text>
<text x="140" y="95" fill="currentColor">.200.2</text><text x="225" y="95" fill="currentColor">.100.2</text><text x="420" y="95" fill="currentColor">.100.1</text><text x="505" y="95" fill="currentColor">.0.1</text>
<line x1="60" y1="60" x2="60" y2="120" stroke="#8a9bb3" stroke-width="2"/><rect x="38" y="120" width="44" height="26" rx="3" fill="#3d4f6b"/><text x="60" y="138" fill="#fff" text-anchor="middle">P1</text><text x="60" y="162" fill="currentColor" text-anchor="middle">.200.10</text>
<line x1="340" y1="60" x2="340" y2="120" stroke="#8a9bb3" stroke-width="2"/><rect x="318" y="120" width="44" height="26" rx="3" fill="#3d4f6b"/><text x="340" y="138" fill="#fff" text-anchor="middle">P2</text><text x="340" y="162" fill="currentColor" text-anchor="middle">.100.10</text>
<line x1="640" y1="60" x2="640" y2="120" stroke="#8a9bb3" stroke-width="2"/><rect x="618" y="120" width="44" height="26" rx="3" fill="#3d4f6b"/><text x="640" y="138" fill="#fff" text-anchor="middle">P3</text><text x="640" y="162" fill="currentColor" text-anchor="middle">.0.10</text>
</svg><div class="figcap">Le réseau de l’étude ICMP (annexe 1). P2 a R2 pour passerelle, mais c’est R1 qui mène à P3.</div></div>

<h3>6. L’étude ICMP corrigée</h3>
<table><tr><th>Configuration</th><th>Ce qui se passe</th></tr>
<tr><td><b>1</b> — P2 sans passerelle</td><td>P2 voit que 192.168.0.10 n’est pas dans son réseau (192.168.100.0/24) et n’a <b>aucune passerelle</b> : le message d’erreur est fabriqué <b>localement</b> par le système. Il n’y a même pas de requête ARP, donc <b>aucune trame</b> capturée.</td></tr>
<tr><td><b>2</b> — passerelle 192.168.100.2 (R2)</td><td>Trame 1 : demande d’écho de P2 vers 192.168.0.10, MAC destination = <b>R2</b> (la passerelle), MAC source = P2. R2 n’a <b>pas de route</b> vers 192.168.0.0 : il détruit le paquet et renvoie la trame 2, un ICMP <b>type 3</b> (destination inaccessible), code 1 (hôte inaccessible : d’où le texte « impossible de joindre l’<b>hôte</b> »). Elle contient l’en-tête IP et les 8 premiers octets du ping d’origine. C’est elle qui produit « Réponse de 192.168.100.2 : impossible de joindre l’hôte de destination ».</td></tr>
<tr><td><b>3</b> — R2 apprend 192.168.0.0/24 via 192.168.100.1</td><td>Trame 1 : P2 → R2 (comme avant). R2 doit repartir <b>par la même interface</b> vers R1, qui est sur le réseau de P2 : il envoie la trame 2, une <b>redirection</b> (type <b>5</b>, code <b>1</b>, passerelle <code>C0 A8 64 01</code> = <b>192.168.100.1</b>), et relaie le paquet (trame 3 : MAC source = <b>R2</b>, MAC destination = R1, IP source toujours <b>P2</b>). Trame 4 : P3 répond via R1 directement à P2 (R1 connaît le réseau de P2). Trames 5 et 6 : le 2e ping part <b>directement</b> vers R1, grâce à la redirection. TTL=127 : la réponse ne traverse que R1. Le 1er ping est plus lent (40 ms) : résolutions ARP, détour par R2 et redirection ; ensuite les caches sont remplis et le chemin est direct (10 ms).</td></tr>
<tr><td><b>4</b> — table de P2 après le test</td><td>Ligne 1 : <code>192.168.0.10 / 255.255.255.255 → 192.168.100.1</code>, la route <b>créée par la redirection</b> ; masque /32 car c’est une redirection « pour cet hôte » (code 1). Dernière ligne : la route par défaut vers R2, configurée en configuration 2. Les deux premières trames de l’échange : P2 → R1 (MAC P2 → MAC R1, IP 192.168.100.10 → 192.168.0.10), puis R1 → P2 (MAC R1 → MAC P2, IP 192.168.0.10 → 192.168.100.10).</td></tr></table>
<div class="tip"><b>✔ Coquilles de l’énoncé :</b> les questions de la 3e configuration renvoient à « l’Annexe 3 », mais les captures sont dans l’<b>Annexe 4</b> (il n’y a pas d’annexe 3). Et la phrase « un analyseur de trames où il a installé un analyseur de trames » est à lire « le poste P2, où il a installé un analyseur de trames ».</div>
`,
  questions: [
    /* ---------- Débutant ---------- */
    { id: 'ic1', lvl: 1, type: 'qcm', q: 'Comment un message ICMP voyage-t-il sur le réseau ?',
      choices: ['Dans un paquet IP (champ Protocole = 1)', 'Dans un segment TCP', 'Dans un datagramme UDP, port 7', 'Directement dans une trame Ethernet, sans IP'], good: 0,
      hints: ['ICMP est le « messager » d’IP : il utilise IP pour voyager.'],
      explain: 'ICMP est <b>encapsulé dans IP</b>, avec le numéro de protocole <b>1</b>. Il n’utilise ni TCP ni UDP (et donc pas de ports).' },
    { id: 'ic2', lvl: 1, type: 'qcm', q: 'Quels messages ICMP la commande <code>ping</code> utilise-t-elle ?',
      choices: ['Echo Request (type 8) à l’aller, Echo Reply (type 0) au retour', 'Echo Reply (type 0) à l’aller, Echo Request (type 8) au retour', 'Time Exceeded (type 11) dans les deux sens', 'Redirect (type 5) à l’aller, Echo Reply au retour'], good: 0,
      hints: ['On « demande » un écho, la cible y « répond ».'],
      explain: 'Demande d’écho <b>type 8</b>, réponse d’écho <b>type 0</b>. Les deux portent le même identifiant et le même numéro de séquence.' },
    { id: 'ic3', lvl: 1, type: 'qcm', q: 'Un routeur reçoit un paquet et, en décrémentant le TTL, celui-ci tombe à <b>0</b>. Que fait-il ?',
      choices: ['Il détruit le paquet et envoie un ICMP Time Exceeded (type 11) à l’émetteur', 'Il remet le TTL à 255 et transmet le paquet', 'Il transmet le paquet mais prévient le destinataire', 'Il garde le paquet en mémoire jusqu’à ce qu’une route plus courte apparaisse'], good: 0,
      hints: ['Le TTL sert à empêcher un paquet de tourner en rond pour toujours.'],
      explain: 'TTL à 0 = paquet <b>détruit</b>, et l’émetteur reçoit un <b>Time Exceeded</b> (type 11, code 0). C’est exactement ce qu’exploite tracert.' },
    { id: 'ic4', lvl: 1, type: 'match', q: 'Associe chaque valeur du champ Type (EtherType) d’une trame Ethernet au protocole transporté.',
      pairs: [['0x0800', 'IPv4'], ['0x0806', 'ARP'], ['0x8035', 'RARP'], ['0x86DD', 'IPv6']],
      hints: ['Le poly en cite trois (écrits avec des lettres O au lieu de zéros) ; le quatrième est celui d’IPv6.'],
      explain: '0x0800 IPv4, 0x0806 ARP, 0x8035 RARP, 0x86DD IPv6. C’est ce champ qui « aiguille » le contenu de la trame vers le bon protocole de couche 3.' },
    /* ---------- Facile ---------- */
    { id: 'ic5', lvl: 2, type: 'match', q: 'Associe chaque type ICMP à son message.',
      pairs: [['Type 0', 'Echo Reply'], ['Type 3', 'Destination Unreachable'], ['Type 5', 'Redirect'], ['Type 8', 'Echo Request'], ['Type 11', 'Time Exceeded']],
      hints: ['Les deux du ping : 8 (demande) et 0 (réponse).', 'Le 11 est celui du TTL tombé à 0.'],
      explain: '0 réponse d’écho, 3 destination inaccessible, 5 redirection, 8 demande d’écho, 11 temps dépassé.' },
    { id: 'ic6', lvl: 2, type: 'text', q: 'L’en-tête IPv4 a une taille variable (le champ IHL compte des mots de 32 bits). Donne sa taille en octets :',
      fields: [{ label: 'minimum (sans options)', kind: 'int', answer: 20 }, { label: 'maximum', kind: 'int', answer: 60 }],
      hints: ['IHL tient sur 4 bits : de 5 à 15 mots.', 'Un mot de 32 bits = 4 octets.'],
      explain: 'IHL = 5 → 5 × 4 = <b>20 octets</b> (en-tête sans options) ; IHL = 15 (valeur max sur 4 bits) → <b>60 octets</b>.' },
    { id: 'ic7', lvl: 2, type: 'qcm', q: '<b>Étude ICMP, configuration 1.</b> P2 (192.168.100.10/24) n’a <b>pas de passerelle</b>. Il pingue 192.168.0.10 : message d’erreur, et <b>aucune trame</b> capturée. Pourquoi aucune trame ?',
      choices: ['La destination n’est pas dans son réseau et il n’a aucune passerelle : il ne sait à qui envoyer, il n’émet même pas de requête ARP', 'Le câble de P2 est débranché', 'R2 a bloqué la trame avant qu’elle soit capturée', 'Les trames ICMP ne sont jamais capturées par un analyseur'], good: 0,
      hints: ['Première chose que fait P2 : comparer l’adresse de destination avec son propre réseau.'],
      explain: '192.168.0.10 n’est pas dans 192.168.100.0/24 → il faudrait passer par une passerelle. Sans passerelle, le système abandonne <b>tout seul</b> : pas d’ARP, pas de trame. Le message vient de P2 lui-même, pas du réseau.' },
    { id: 'ic8', lvl: 2, type: 'order', q: 'Remets dans l’ordre ce qui se passe quand tu lances <code>tracert</code> vers un PC situé derrière 2 routeurs.',
      items: ['Le PC envoie une demande d’écho avec un TTL de 1', 'Le 1er routeur met le TTL à 0 et répond « Time Exceeded » : tracert affiche son adresse', 'Le PC renvoie une demande d’écho avec un TTL de 2', 'Le 2e routeur met le TTL à 0 et répond « Time Exceeded »', 'Avec un TTL de 3, la demande arrive à destination, qui répond « Echo Reply » : fin du tracert'],
      hints: ['Le TTL augmente de 1 à chaque étape.'],
      explain: 'tracert « sonde » le chemin en augmentant le TTL : chaque routeur se dénonce par un <b>Time Exceeded</b> (type 11), et la destination finit par répondre par un <b>Echo Reply</b> (type 0).' },
    /* ---------- Moyen ---------- */
    { id: 'ic9', lvl: 3, type: 'qcm', q: '<b>Étude ICMP, configuration 2.</b> P2 a maintenant la passerelle 192.168.100.2 (R2) et pingue P3 (192.168.0.10). Dans la trame 1, quelles sont les adresses de destination ?',
      choices: ['MAC de destination = celle de R2 ; IP de destination = 192.168.0.10', 'MAC de destination = celle de P3 ; IP de destination = 192.168.0.10', 'MAC de destination = celle de R2 ; IP de destination = 192.168.100.2', 'MAC de destination = FF:FF:FF:FF:FF:FF ; IP de destination = 192.168.0.10'], good: 0,
      hints: ['La MAC sert au saut en cours, l’IP sert à la destination finale.'],
      explain: 'Destination hors réseau → la trame est adressée à la <b>passerelle</b> (MAC de R2 : 00:03:FF:40:6C:35), mais le paquet garde l’IP du <b>destinataire final</b>. La MAC de P3 est inconnue de P2 (elle n’est pas sur son réseau).' },
    { id: 'ic10', lvl: 3, type: 'text', q: '<b>Étude ICMP, annexe 4, trame 2.</b> Les champs ICMP commencent par <code>05 01 80 F8 C0 A8 64 01</code>. Donne en décimal :',
      fields: [{ label: 'octet 1 (type)', kind: 'int', answer: 5 }, { label: 'octet 2 (code)', kind: 'int', answer: 1 }, { label: 'octets 5 à 8 (une adresse IP)', kind: 'ip', answer: '192.168.100.1' }],
      hints: ['Octets 3 et 4 = la somme de contrôle (80 F8), on les saute.', 'C0 = 192, A8 = 168, 64 = 100.'],
      explain: 'Type <b>5</b> = Redirect, code <b>1</b> = redirection pour un hôte, et C0.A8.64.01 = <b>192.168.100.1</b> : l’adresse de R1, la passerelle que P2 doit utiliser désormais pour joindre P3.' },
    { id: 'ic11', lvl: 3, type: 'qcm', q: 'P2 (Windows) reçoit « Réponse de 192.168.0.10 : octets=32 temps=10ms <b>TTL=127</b> ». Que peut-on en déduire ?',
      choices: ['P3 est un Windows (TTL de départ 128) et sa réponse a traversé 1 routeur', 'La demande de P2 a traversé 127 routeurs', 'La réponse a traversé 127 routeurs', 'Le TTL de départ était 127 et aucun routeur n’a été traversé'], good: 0,
      hints: ['Windows part de 128, Linux de 64, un routeur Cisco de 255.'],
      explain: '128 − 127 = <b>1 routeur</b> traversé par la <b>réponse</b> (R1). Attention : c’est le chemin du <b>retour</b> qui compte, pas celui de l’aller (la 1re demande, elle, est passée par R2 puis R1).' },
    { id: 'ic12', lvl: 3, type: 'match', q: 'Messages ICMP de type 3 (destination inaccessible) : associe chaque code à sa cause.',
      pairs: [['Code 0', 'Réseau inaccessible'], ['Code 1', 'Hôte inaccessible'], ['Code 3', 'Port inaccessible'], ['Code 4', 'Fragmentation nécessaire mais DF positionné'], ['Code 13', 'Communication interdite par filtrage']],
      hints: ['Le port inaccessible est la réponse finale d’un traceroute UDP.', 'Le dernier code de la liste est celui que ton poly a mal numéroté.'],
      explain: '0 réseau, 1 hôte, 3 port, 4 fragmentation impossible (DF), <b>13</b> filtrage (une ACL qui bloque). Ton poly écrit 11 pour le filtrage : c’est une coquille, 11 signifie « réseau inaccessible pour ce type de service ».' },
    { id: 'ic13', lvl: 3, type: 'multi', q: 'Quand un routeur transmet un paquet IPv4 d’un réseau à un autre (sans NAT), quels champs de l’en-tête IP <b>modifie</b>-t-il ?',
      choices: ['La durée de vie (TTL)', 'La somme de contrôle de l’en-tête', 'L’adresse IP source', 'L’adresse IP de destination', 'Le champ Protocole', 'Le champ Identification'], good: [0, 1],
      hints: ['Un seul champ change « vraiment » ; un deuxième doit suivre, car il protège l’en-tête.'],
      explain: 'Le routeur décrémente le <b>TTL</b>, donc il doit <b>recalculer la somme de contrôle</b> de l’en-tête. Les adresses IP restent celles des deux extrémités (ce sont les adresses <b>MAC</b> qui changent à chaque saut).' },
    /* ---------- Difficile ---------- */
    { id: 'ic14', lvl: 4, type: 'qcm', q: '<b>Esprit critique.</b> Le tableau des codes ICMP de ton poly se termine par « 3 — 11 — Communication interdite (filtrage) ». Qu’en penses-tu ?',
      choices: ['C’est une coquille : la communication interdite par filtrage est le code 13 ; le code 11 est « réseau inaccessible pour ce service »', 'C’est juste : le code 11 signifie filtrage', 'C’est un message de type 11 (Time Exceeded), pas de type 3', 'Le code 11 n’existe pas pour le type 3'], good: 0,
      hints: ['Regarde la ligne juste au-dessus dans le même tableau : le code 11 y est déjà utilisé.'],
      explain: 'Le code 11 apparaît <b>deux fois</b> dans le tableau du poly. Le bon numéro pour « communication administrativement interdite » (une ACL) est <b>13</b> ; 9 et 10 concernent un réseau ou une machine interdits, 11 et 12 le type de service.' },
    { id: 'ic15', lvl: 4, type: 'text', q: 'La demande d’écho de P2 commence par <code>08 00 2E 5C 02 00 1D 00</code> (type, code, somme de contrôle, identifiant, séquence). La réponse de P3 est identique, sauf le type qui vaut 0. Quelle est la <b>somme de contrôle</b> de la réponse (4 chiffres hexa) ?',
      kind: 'word', accept: ['365C', '0x365C'],
      hints: ['Le premier mot de 16 bits passe de 0x0800 à 0x0000 : la somme des mots diminue de 0x0800.', 'La somme de contrôle est le complément à 1 de cette somme : elle varie en sens inverse.'],
      explain: 'La somme baisse de 0x0800, donc son complément augmente de 0x0800 : 0x2E5C + 0x0800 = <b>0x365C</b>. C’est exactement la valeur de la trame 4 de l’annexe 4 (<code>00 00 36 5C</code>).' },
    { id: 'ic16', lvl: 4, type: 'grid', q: '<b>Étude ICMP, configuration 4.</b> Complète la table de routage de P2 (format Windows de l’étude) après la redirection.',
      file: 'etude-icmp.xlsx', sheet: 'Table de P2',
      cols: RT_WIN,
      rows: [
        ['Route créée par la redirection ICMP', { a: '192.168.0.10' }, { a: '255.255.255.255' }, { a: '192.168.100.1' }, { a: '192.168.100.10' }],
        ['Réseau local de P2', { a: '192.168.100.0' }, { a: '255.255.255.0' }, { a: '192.168.100.10' }, { a: '192.168.100.10' }],
        ['Route par défaut', { a: '0.0.0.0' }, { a: '0.0.0.0' }, { a: '192.168.100.2' }, { a: '192.168.100.10' }]
      ],
      hints: ['Redirection de code 1 = pour un seul hôte : masque /32.', 'La route par défaut est celle de la configuration 2 (passerelle R2).', 'Dans ce format, l’interface est l’adresse IP de P2.'],
      explain: 'La redirection (type 5, code 1) a créé une <b>route d’hôte</b> : 192.168.0.10/32 via R1 (192.168.100.1). Le reste ne change pas : le réseau local et la route par défaut vers R2. Avec la correspondance la plus longue, le /32 l’emporte pour P3, et tout le reste passe toujours par R2.' },
    { id: 'ic-lab', lvl: 4, type: 'pt', file: 'Etude-ICMP.pkt', tag: 'ICMP',
      q: '<b>L’étude ICMP en vrai.</b> Le réseau de l’annexe 1 : P1 derrière R2 (192.168.200.0/24), P2 sur le réseau du milieu (192.168.100.0/24) avec R2 (.2) et R1 (.1), P3 derrière R1 (192.168.0.0/24). Au départ, P2 n’a <b>pas de passerelle</b> et les routeurs ne connaissent que leurs réseaux connectés.<br>1. Donne à P2 la passerelle <b>192.168.100.2</b> (configuration 2) et pingue P3 : observe qui répond.<br>2. Ajoute sur R2 la route qui manque (configuration 3) et pingue à nouveau, puis fais un <code>tracert</code>.<br>3. Va plus loin que l’étude : fais en sorte que <b>P1</b> joigne aussi P3.',
      build: function () {
        return LAB.make({
          devices: [['P1', 'PC-PT', 70, 330], ['R2', '2901', 260, 170], ['SW', '2960-24TT', 500, 170], ['P2', 'PC-PT', 500, 340], ['R1', '2901', 740, 170], ['P3', 'PC-PT', 930, 330]],
          links: [['P1', 'FastEthernet0', 'R2', 'GigabitEthernet0/0', 'cross'], ['R2', 'GigabitEthernet0/1', 'SW', 'FastEthernet0/1', 'straight'], ['P2', 'FastEthernet0', 'SW', 'FastEthernet0/2', 'straight'], ['R1', 'GigabitEthernet0/0', 'SW', 'FastEthernet0/3', 'straight'], ['P3', 'FastEthernet0', 'R1', 'GigabitEthernet0/1', 'cross']],
          notes: [[60, 450, 'R2 : G0/0 = 192.168.200.2, G0/1 = 192.168.100.2 · R1 : G0/0 = 192.168.100.1, G0/1 = 192.168.0.1'], [60, 475, 'P1 = 192.168.200.10 · P2 = 192.168.100.10 · P3 = 192.168.0.10 (tous en /24)']],
          cli: {
            R2: ['conf t', 'hostname R2', 'interface g0/0', 'ip address 192.168.200.2 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.100.2 255.255.255.0', 'no shutdown', 'end'],
            R1: ['conf t', 'hostname R1', 'interface g0/0', 'ip address 192.168.100.1 255.255.255.0', 'no shutdown', 'interface g0/1', 'ip address 192.168.0.1 255.255.255.0', 'no shutdown', 'end']
          },
          hosts: { P1: { ip: '192.168.200.10', mask: '255.255.255.0', gw: '192.168.200.2' }, P2: { ip: '192.168.100.10', mask: '255.255.255.0' }, P3: { ip: '192.168.0.10', mask: '255.255.255.0', gw: '192.168.0.1' } }
        });
      },
      tasks: [
        { label: 'P2 a pour passerelle 192.168.100.2 (configuration 2)', check: function (n) { return n.dev('P2').host.gw === NET.ip2int('192.168.100.2'); } },
        { label: 'R2 connaît 192.168.0.0/24 via 192.168.100.1 (configuration 3)', check: function (n) { return route(n, 'R2', '192.168.0.0/24', '192.168.100.1'); } },
        { label: 'P2 joint P3', check: function (n) { return n.canPing('P2', 'P3'); } },
        { label: 'R1 connaît le réseau de P1 (192.168.200.0/24) via R2', check: function (n) { return route(n, 'R1', '192.168.200.0/24', '192.168.100.2'); } },
        { label: 'P1 joint P3', check: function (n) { return n.canPing('P1', 'P3'); } }
      ],
      hints: ['P2 : Desktop → IP Configuration → Default Gateway 192.168.100.2. Le ping vers 192.168.0.10 répond alors « Reply from 192.168.100.2: Destination host unreachable » : c’est R2 qui parle (ICMP type 3).', 'R2 : <code>ip route 192.168.0.0 255.255.255.0 192.168.100.1</code>. Le ping passe (TTL=127), et <code>tracert 192.168.0.10</code> montre le détour par R2.', 'Pour P1 : le ping part bien, mais P3 ne sait pas répondre… R1 a besoin de <code>ip route 192.168.200.0 255.255.255.0 192.168.100.2</code>.'],
      solution: [
        { dev: 'P2', host: { gw: '192.168.100.2' } },
        { dev: 'R2', cli: ['conf t', 'ip route 192.168.0.0 255.255.255.0 192.168.100.1', 'end'] },
        { dev: 'R1', cli: ['conf t', 'ip route 192.168.200.0 255.255.255.0 192.168.100.2', 'end'] }
      ],
      explain: 'Tu retrouves les configurations de l’étude : sans route, R2 renvoie un ICMP <b>destination inaccessible</b> ; avec la route, le ping passe avec un <b>TTL=127</b> (la réponse ne traverse que R1). Le <code>tracert</code> depuis P2 montre 192.168.100.2 puis 192.168.100.1 : c’est le détour. Sur un vrai Windows, R2 enverrait une <b>redirection ICMP</b> et le tracert suivant partirait directement vers R1 ; le simulateur, lui, ne gère pas les redirections. Pour P1, il fallait penser au <b>retour</b> : sans route vers 192.168.200.0/24, R1 ne sait pas où renvoyer la réponse de P3.' },
    /* ---------- Extrême ---------- */
    { id: 'ic17', lvl: 5, type: 'multi', q: 'Dans quels cas un équipement <b>n’envoie pas</b> de message d’erreur ICMP, même si le paquet est détruit ?',
      choices: ['Le paquet détruit était lui-même un message d’erreur ICMP', 'Le paquet était envoyé à une adresse de diffusion', 'Le paquet était un fragment autre que le premier', 'Le paquet était une demande d’écho (ping) sans route vers sa destination', 'Le paquet était un segment TCP dont le TTL tombe à 0'], good: [0, 1, 2],
      hints: ['L’idée : éviter les avalanches de messages d’erreur.', 'Le cas du ping sans route, tu l’as vu dans l’étude : R2 a bien répondu.'],
      explain: 'Pas d’erreur sur une erreur (sinon effet boule de neige), ni sur un paquet en diffusion ou multicast (tout le monde répondrait), ni sur les fragments suivants. En revanche, un <b>ping</b> sans route reçoit bien un « destination inaccessible », et un segment TCP dont le TTL expire provoque un Time Exceeded.' },
    { id: 'ic18', lvl: 5, type: 'qcm', q: '<b>Étude ICMP, configuration 3, trame 3</b> : MAC source = <b>00:03:FF:40:6C:35</b> (R2), MAC destination = R1, mais IP source = <b>192.168.100.10</b> (P2). Comment l’expliquer ?',
      choices: ['C’est le ping de P2 que R2 relaie vers R1 : un routeur réécrit les adresses MAC mais garde les adresses IP', 'R2 usurpe l’adresse de P2 (attaque)', 'C’est la redirection ICMP envoyée par R2', 'P2 a changé d’adresse MAC après la redirection'], good: 0,
      hints: ['Qui envoie physiquement la trame sur le câble ? Qui a créé le paquet ?'],
      explain: 'R2 a reçu le ping (trame 1) et, en plus de la redirection (trame 2), il le <b>transmet</b> à R1 : nouvelle trame, MAC source = R2, MAC destination = R1. Le <b>paquet IP</b>, lui, est toujours celui de P2 vers P3 : les adresses IP ne changent pas de bout en bout.' },
    { id: 'ic19', lvl: 5, type: 'text', q: 'Le 2e ping de P2 a la séquence <code>1E 00</code> au lieu de <code>1D 00</code> ; le reste est identique (demande : <code>08 00 2E 5C 02 00 1D 00</code>). Quelle est la somme de contrôle de cette 2e demande (4 chiffres hexa) ?',
      kind: 'word', accept: ['2D5C', '0x2D5C'],
      hints: ['La séquence augmente de 0x0100.', 'La somme de contrôle est un complément à 1 : elle bouge en sens inverse.'],
      explain: 'Le mot de séquence augmente de 0x0100, la somme de contrôle diminue d’autant : 0x2E5C − 0x0100 = <b>0x2D5C</b>, la valeur de la trame 5. Et sa réponse (trame 6) vaut 0x2D5C + 0x0800 = <b>0x355C</b>.' },
    { id: 'ic20', lvl: 5, type: 'text', q: 'Un routeur doit transmettre un paquet de 1 500 octets avec le drapeau <b>DF</b> positionné sur un lien dont la MTU est de 1 400 octets. Quel message ICMP renvoie-t-il ?',
      fields: [{ label: 'Type', kind: 'int', answer: 3 }, { label: 'Code', kind: 'int', answer: 4 }],
      hints: ['DF = Don’t Fragment : le routeur n’a pas le droit de découper.', 'C’est un cas de « destination inaccessible ».'],
      explain: 'Type <b>3</b> (destination inaccessible), code <b>4</b> (fragmentation nécessaire mais DF positionné). C’est le mécanisme de découverte de la MTU du chemin (<i>Path MTU Discovery</i>), obligatoire en IPv6 où les routeurs ne fragmentent jamais.' },
    /* ---------- Impossible ---------- */
    { id: 'ic21', lvl: 6, type: 'qcm', q: 'Dans la trame 2 de l’annexe 4 (la redirection), les 8 derniers octets sont <code>08 00 2E 5C 02 00 1D 00</code>. Que sont-ils ?',
      choices: ['Les 64 premiers bits des données du paquet en cause : le début de la demande d’écho de P2 (type, code, somme de contrôle, identifiant, séquence)', 'Une nouvelle demande d’écho envoyée par R2 à P2', 'La somme de contrôle de la redirection', 'Le bourrage obligatoire d’un message ICMP'], good: 0,
      hints: ['Un message d’erreur ICMP recopie une partie du paquet qui l’a provoqué.', 'Compare avec la trame 1.'],
      explain: 'Un message d’erreur ICMP contient l’<b>en-tête IP</b> du paquet en cause (les « … » de l’annexe) suivi de ses <b>64 premiers bits</b>. Ici, ce sont les 8 premiers octets du ping de P2 : P2 peut ainsi savoir quel paquet (identifiant 0x0200, séquence 0x1D00) a provoqué la redirection.' },
    { id: 'ic22', lvl: 6, type: 'multi', q: '<b>Esprit critique.</b> Parmi ces phrases tirées des documents du cours, lesquelles sont <b>fausses ou trop rapides</b> ?',
      choices: ['« Les messages ICMP ne produisent pas de messages d’erreur »', '« Exemple de codes : 11 temps dépassé, 5 redirection, 8 demande d’écho »', '« UDP : pas d’accusé de réception, aucun contrôle de flux »', '« IP : remise de datagrammes non fiable (best effort) »', '« 3 — 11 — Communication interdite (filtrage) »'], good: [0, 1, 4],
      hints: ['Trois phrases contiennent une erreur ; deux sont justes.'],
      explain: '1) Trop large : seule une <b>erreur</b> ICMP ne déclenche jamais d’erreur ; un ping peut en déclencher une. 2) Ce sont des <b>types</b>, pas des codes. 5) Le filtrage est le code <b>13</b>. Les deux autres phrases sont correctes : UDP n’a ni accusé de réception ni contrôle de flux, et IP livre « au mieux ».' },
    { id: 'ic23', lvl: 6, type: 'qcm', q: 'Configuration 3 : le 1er ping répond en <b>40 ms</b>, le 2e en <b>10 ms</b>. Quelle explication est la plus complète ?',
      choices: ['Au 1er ping, il faut résoudre les adresses MAC (ARP) à chaque saut et le paquet fait le détour par R2, qui envoie une redirection ; au 2e, les caches ARP sont remplis et le chemin est direct vers R1', 'Le 1er ping est plus gros que le 2e', 'Le serveur P3 était en veille', 'Le TTL du 1er ping était plus élevé, donc il a mis plus longtemps'], good: 0,
      hints: ['Que contiennent les caches ARP au tout début ? Par où passe le 1er ping ?'],
      explain: 'Le 1er échange cumule les <b>requêtes ARP</b> (P2 → R2, R2 → R1, R1 → P3, R1 → P2), le <b>détour</b> par R2 et le traitement de la <b>redirection</b>. Ensuite tout est en cache et P2 envoie directement à R1 : 10 ms.' }
  ]
  });
})();
