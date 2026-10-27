(function () {
  /* valeur numérique proche (virgule acceptée) */
  function near(x, tol) { return function (v) { v = String(v).trim().replace(',', '.').replace(/\s/g, ''); return v !== '' && !isNaN(+v) && Math.abs(+v - x) <= tol; }; }

  window.MODULES = window.MODULES || [];
  window.MODULES.push({
  id: 'transport', num: 21, icon: '🚚', titre: 'TCP, UDP et performances',
  sous: 'Ports, en-têtes, poignée de main, séquences et acquittements, fenêtre, temporisateurs',
  source: 'PROTOCLES RESO ET TRANSPORT.pdf (CV du 09/10), CV1-Etude.pdf (CV du 02/10), Analyse d’un protocole d’échanges.pdf (CV du 16/10)',
  cours: `
<h3>1. Le rôle de la couche transport</h3>
<p>IP amène un paquet jusqu’à la bonne <b>machine</b>. La couche transport l’amène jusqu’à la bonne <b>application</b>, grâce aux <b>numéros de port</b> (16 bits, de 0 à 65 535). Le couple adresse IP + port s’appelle une <b>socket</b>.</p>
<ul><li>Ports <b>bien connus</b> (0 à 1023) : ceux des serveurs (80 HTTP, 53 DNS, 520 RIP…).</li>
<li>Ports <b>enregistrés</b> (1024 à 49 151) et <b>dynamiques</b> (49 152 à 65 535) : le client en choisit un au hasard pour chaque connexion (le port 1442 de la capture debian.org).</li></ul>
<p>Deux protocoles : <b>UDP</b> (léger, sans garantie) et <b>TCP</b> (fiable, orienté connexion). Les exemples de protocoles et de ports sont dans le module 2 ; ici on regarde <b>comment</b> ils fonctionnent.</p>

<h3>2. UDP : le minimum syndical</h3>
<p>En-tête de <b>8 octets</b> seulement : port source, port destination, longueur, somme de contrôle (16 bits chacun). UDP dépose les données dans la file d’attente de l’application qui écoute sur le port de destination, et c’est tout :</p>
<ul><li>pas de connexion, pas d’accusé de réception, pas de retransmission ;</li>
<li>pas de remise en ordre, pas de contrôle de flux ;</li>
<li>c’est donc à l’<b>application</b> de gérer pertes, doublons, retards et désordre si elle en a besoin (le DNS renvoie sa requête au bout d’un moment, la voix sur IP préfère perdre un morceau que l’attendre).</li></ul>

<h3>3. TCP : l’en-tête</h3>
<table><tr><th>Champ</th><th>Taille</th><th>Rôle</th></tr>
<tr><td>Ports source et destination</td><td>16 + 16 bits</td><td>les applications</td></tr>
<tr><td><b>Numéro de séquence</b></td><td>32 bits</td><td>numéro du <b>1er octet</b> de données du segment</td></tr>
<tr><td><b>Numéro d’acquittement</b></td><td>32 bits</td><td>numéro du <b>prochain octet attendu</b> (tout ce qui précède est bien reçu)</td></tr>
<tr><td>Offset (longueur d’en-tête)</td><td>4 bits</td><td>en mots de 32 bits (5 → 20 octets sans options)</td></tr>
<tr><td>Drapeaux</td><td>6 bits (et plus)</td><td><b>SYN</b> ouverture, <b>ACK</b> acquittement valide, <b>FIN</b> fermeture, <b>RST</b> coupure brutale, <b>PSH</b> « transmets tout de suite à l’application », URG données urgentes</td></tr>
<tr><td><b>Fenêtre</b></td><td>16 bits</td><td>nombre d’octets que le récepteur peut encore accepter (<b>contrôle de flux</b>)</td></tr>
<tr><td>Somme de contrôle</td><td>16 bits</td><td>en-tête + données (+ pseudo-en-tête IP)</td></tr>
<tr><td>Pointeur urgent, options, bourrage</td><td>—</td><td>option importante : la <b>MSS</b>, taille maximale des données d’un segment</td></tr></table>
<div class="tip"><b>✔ MSS = 1460 :</b> sur Ethernet, un paquet IP fait au plus 1 500 octets (la MTU). 1 500 − 20 (en-tête IP) − 20 (en-tête TCP) = <b>1 460</b> octets de données, la MSS annoncée dans le SYN de la capture debian.org.</div>

<h3>4. Ouvrir et fermer une connexion</h3>
<div class="figure"><svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI,Arial" font-size="13">
<text x="80" y="20" fill="#6fd6f5" font-weight="700" text-anchor="middle">Client</text><text x="560" y="20" fill="#6fd6f5" font-weight="700" text-anchor="middle">Serveur</text>
<line x1="80" y1="28" x2="80" y2="205" stroke="#8a9bb3" stroke-width="2"/><line x1="560" y1="28" x2="560" y2="205" stroke="#8a9bb3" stroke-width="2"/>
<line x1="80" y1="45" x2="560" y2="75" stroke="#fbab18" stroke-width="2"/><text x="320" y="50" fill="currentColor" text-anchor="middle">SYN, seq = x</text>
<line x1="560" y1="95" x2="80" y2="125" stroke="#6cc04a" stroke-width="2"/><text x="320" y="100" fill="currentColor" text-anchor="middle">SYN + ACK, seq = y, ack = x + 1</text>
<line x1="80" y1="145" x2="560" y2="175" stroke="#fbab18" stroke-width="2"/><text x="320" y="150" fill="currentColor" text-anchor="middle">ACK, seq = x + 1, ack = y + 1</text>
<text x="320" y="200" fill="currentColor" text-anchor="middle" font-size="12">→ la connexion est établie, les données peuvent partir</text>
</svg><div class="figcap">La poignée de main en trois temps (three-way handshake).</div></div>
<ul><li>Chaque côté choisit son <b>numéro de séquence initial</b> (x et y, au hasard). Les analyseurs comme Wireshark les affichent en <b>relatif</b> : Seq=0, comme dans la capture debian.org.</li>
<li>Le SYN « consomme » un numéro : c’est pour cela que la réponse acquitte <b>x + 1</b>. Même chose pour le FIN.</li>
<li><b>Fermeture</b> : chacun ferme son sens d’émission (FIN, ACK, FIN, ACK). Un <b>RST</b> coupe la connexion d’un coup (port fermé, erreur).</li></ul>

<h3>5. Séquences et acquittements</h3>
<div class="memo"><b>📌 La règle d’or :</b> prochain numéro de séquence = séquence actuelle + nombre d’octets de données. L’acquittement renvoyé = <b>le numéro du prochain octet attendu</b>. Exemple de la capture debian.org : le GET part avec Seq=1 et le serveur répond Ack=427, donc le GET faisait <b>426 octets</b>.</div>
<ul><li><b>PAR</b> (<i>Positive Acknowledgement and Retransmission</i>) : l’émetteur arme un temporisateur à chaque envoi ; sans acquittement à temps, il retransmet.</li>
<li><b>Anticipation (fenêtre glissante)</b> : au lieu d’attendre chaque ACK, TCP envoie plusieurs segments d’avance, dans la limite de la <b>fenêtre</b> annoncée par le récepteur. La fenêtre glisse au fur et à mesure des acquittements.</li>
<li><b>Contrôle de flux</b> : le récepteur annonce dans le champ <b>Window</b> ce qu’il peut encore lire. Fenêtre à 0 = « stop, mon tampon est plein ».</li>
<li><b>Petits paquets</b> (diapo « Les petits paquets surchargent le réseau ») : c’est l’<b>algorithme de Nagle</b>. Tant qu’un petit segment n’est pas acquitté, TCP regroupe les petites écritures suivantes au lieu d’envoyer une rafale de segments de quelques octets (40 octets d’en-têtes pour 1 octet de données, c’est un gâchis).</li></ul>

<h3>6. Le temporisateur de retransmission (RTO)</h3>
<p>Trop court, il retransmet pour rien ; trop long, on attend inutilement. TCP mesure donc le temps aller-retour (RTT) et adapte le RTO. Les bonnes formules (Jacobson, reprises par la RFC 6298) :</p>
<div class="demo">Erreur      = Mesure − Moyenne
Moyenne     = Moyenne + a × Erreur                  (a = 1/8)
Dérivation  = Dérivation + b × ( |Erreur| − Dérivation )   (b = 1/4)
RTO         = Moyenne + 4 × Dérivation</div>
<p>L’<b>algorithme de Karn</b>, lui, dit deux choses : on <b>n’utilise pas</b> le RTT d’un segment retransmis (on ne saurait pas à quel envoi correspond l’ACK), et on <b>double le RTO</b> à chaque retransmission (repli exponentiel).</p>
<div class="warnbox"><b>⚠ Trois erreurs dans la diapo « Algorithme de KARN » :</b><br>• « Moyenne = moyenne <b>−</b> a × erreur » : c’est un <b>+</b>. Si la mesure est plus grande que la moyenne (erreur positive), la moyenne doit augmenter.<br>• La dérivation utilise la <b>valeur absolue</b> de l’erreur (|erreur|), sinon une erreur négative ferait baisser l’écart alors que le RTT varie.<br>• Ces trois formules sont celles de <b>Jacobson</b> ; seule la dernière ligne (« la valeur est doublée à chaque retransmission ») relève de Karn. Et « Moyenne (RTO) = … » calcule le <b>RTO</b>, pas une moyenne.</div>

<h3>7. Lire un échange avec erreurs (diapos « Exemple d’échanges avec erreurs »)</h3>
<table><tr><th>N°</th><th>Ce qui se passe</th></tr>
<tr><td>1</td><td>B envoie le <b>SYN</b> (seq 72b24e00) : <b>B est le client</b>, A le serveur.</td></tr>
<tr><td>2 → 3</td><td>Le SYN+ACK de A est <b>perdu</b> ; A le retransmet 5,7 s plus tard (pas encore de RTT mesuré : le temporisateur part d’une valeur prudente). Même seq 562b9200, ack 72b24e01 = SYN de B + 1.</td></tr>
<tr><td>4</td><td>B acquitte (ack 562b9201) : connexion ouverte.</td></tr>
<tr><td>5 → 6</td><td>A envoie 3 octets (seq 562b9201) ; B en envoie 6 et acquitte 562b9201 + 3 = <b>562b9204</b>.</td></tr>
<tr><td>7, 8, 9</td><td>A envoie 9 octets (seq 562b9204, ack 72b24e01 + 6 = 72b24e07). Le n° 7 est <b>retardé</b> (pointillés), sa retransmission n° 8 est <b>perdue</b>, la n° 9 arrive. Le délai entre deux tentatives s’allonge (0,66 s puis 1,97 s).</td></tr>
<tr><td>10</td><td>B acquitte 562b9204 + 9 = <b>562b920d</b> et envoie 9 octets.</td></tr>
<tr><td>11 → 13</td><td>Le n° 11 (34 octets) est perdu. Le vieux n° 7 arrive enfin (n° 12) : seq 562b9204 &lt; 562b920d attendu, c’est un <b>doublon</b>, rejeté. A retransmet (n° 13)… avec <b>41</b> octets : TCP numérote des <b>octets</b>, pas des segments, il peut regrouper ses données différemment.</td></tr>
<tr><td>14</td><td>B acquitte 562b920d + 41 (0x29) = <b>562b9236</b>. Sa séquence vaut 72b24e16 = 72b24e10 + 6 : B a envoyé entre-temps un segment de <b>6 octets</b> qui n’est pas dessiné (son identifiant IP 0x47bb manque aussi entre 0x47ba et 0x47bc).</td></tr></table>

<h3>8. Mesurer les performances d’un protocole (étude CV1)</h3>
<p>Liaison satellite à C = <b>64 000 bit/s</b>, trames de F = <b>4 096 bits</b> (512 octets dont 12 d’en-tête, soit D = 4 000 bits de données), acquittements de 80 bits, propagation I = 72 000 / 300 000 = <b>0,24 s</b> dans chaque sens.</p>
<ul><li><b>Une trame puis son acquittement</b> (envoyer et attendre) : durée = F/C + I + Ack/C + I = 0,064 + 0,24 + 0,00125 + 0,24 = <b>0,54525 s</b>. Débit utile = D / durée = 4 000 / 0,54525 ≈ <b>7 336 bit/s</b>.</li>
<li><b>Émettre en continu</b> : il faut que l’émission de W trames dure au moins le temps du premier aller-retour : W × F/C ≥ F/C + 2I + Ack/C, soit W ≥ 1 + 2CI/F + Ack/F = <b>8,52</b>, donc <b>W ≥ 9</b> (une fenêtre compte des trames entières). Le débit utile vaut alors C × D/F = <b>62 500 bit/s</b> : le maximum, car l’en-tête prend toujours 96 bits sur 4 096.</li>
<li><b>Fenêtre trop petite</b> (W ≤ 8) : on envoie W trames par aller-retour, débit = W × 7 336 bit/s. W = 7 → <b>≈ 51 352 bit/s</b>. Pour W = 15 et W = 127 (au-dessus de 9) → <b>62 500 bit/s</b>.</li></ul>
<div class="warnbox"><b>⚠ Le corrigé distribué contient des erreurs :</b><br>• 7 × 7 336 = <b>51 352</b>, pas 51 342.<br>• L’énoncé demande W = 7, <b>15</b> et <b>127</b>, le corrigé enchaîne sur W = 9 et 20 (sans les finir).<br>• « débit = W × 7 336 » ne marche que <b>sous</b> 8,52 : 9 × 7 336 = 66 024 dépasserait le maximum de 62 500. Au-delà, le débit plafonne.<br>• Ce qu’il appelle « rendement = 7 336 bits par seconde » est un <b>débit utile</b>. Le rendement (sans unité) vaut 7 336 / 64 000 ≈ <b>11,5 %</b> : en « envoyer et attendre », la liaison satellite dort presque tout le temps.</div>

<h3>9. Analyser une capture : la connexion à www.debian.org</h3>
<table><tr><th>N°</th><th>Rôle</th></tr>
<tr><td>1-2</td><td><b>ARP</b> pour la <b>passerelle</b> 192.168.2.254 : le serveur DNS (193.1.2.3) n’est pas dans le réseau du poste, il faut donc la MAC de la passerelle.</td></tr>
<tr><td>3-4</td><td><b>DNS</b> : requête A pour www.debian.org (UDP 53) envoyée via la passerelle ; réponse 194.109.137.218.</td></tr>
<tr><td>5-7</td><td>Poignée de main TCP : SYN (port client 1442 → 80, MSS 1460), SYN+ACK, ACK.</td></tr>
<tr><td>8-9</td><td>Requête <b>GET /</b> (426 octets), acquittée par le serveur (Ack=427).</td></tr></table>
<div class="warnbox"><b>⚠ Incohérence de la capture :</b> les trames 5 à 9 utilisent la MAC <b>00:09:5B:D4:67:4E</b>, alors que le serveur web est hors du réseau local : elles devraient être adressées à la passerelle, <b>00:19:66:63:17:FF</b> (la seule MAC apprise, caches vidés, aucune autre requête ARP). La trace a sans doute été assemblée à partir de deux captures.</div>
<p><b>Avec un DNS local</b> (DNS1 = 192.168.2.20) : ARP pour 192.168.2.20, réponse ARP, requête DNS vers 192.168.2.20 (MAC du serveur DNS, sans passer par la passerelle), réponse DNS, <b>puis</b> ARP pour la passerelle (le serveur web reste distant), réponse ARP, SYN, SYN+ACK, ACK.</p>
<p><b>DNS1 en panne</b> : la requête ARP pour 192.168.2.20 reste <b>sans réponse</b> (elle est souvent répétée), le client abandonne et passe à <b>DNS2</b> (193.1.2.3) : ARP pour la passerelle, réponse, requête et réponse DNS via la passerelle, puis la connexion TCP. L’énoncé est ambigu : si la machine DNS1 est allumée mais que le <b>service</b> DNS est arrêté, l’ARP aboutit, la requête DNS part et DNS1 répond par un ICMP <b>port inaccessible</b> (type 3, code 3) avant le passage à DNS2. Précise ton hypothèse dans ta copie.</p>
`,
  questions: [
    /* ---------- Débutant ---------- */
    { id: 'tr1', lvl: 1, type: 'qcm', q: 'Quelle est la taille de l’en-tête UDP ?',
      choices: ['8 octets', '20 octets', '40 octets', '4 octets'], good: 0,
      hints: ['4 champs de 16 bits : ports source et destination, longueur, somme de contrôle.'],
      explain: '4 × 16 bits = 64 bits = <b>8 octets</b>. TCP en demande au moins 20, IPv4 aussi (20 sans options).' },
    { id: 'tr2', lvl: 1, type: 'qcm', q: 'Pour ouvrir une connexion TCP, que contient le tout premier segment ?',
      choices: ['Le drapeau SYN, envoyé par le client avec son numéro de séquence initial', 'Le drapeau ACK, envoyé par le serveur', 'Le drapeau FIN, envoyé par le client', 'Les premières données de l’application'], good: 0,
      hints: ['SYN = synchroniser les numéros de séquence.'],
      explain: 'Le client envoie un <b>SYN</b> avec son numéro de séquence initial x. Le serveur répondra SYN + ACK (ack = x + 1), puis le client ACK.' },
    { id: 'tr3', lvl: 1, type: 'qcm', q: 'À quoi sert le champ <b>Fenêtre</b> (Window) de l’en-tête TCP ?',
      choices: ['Le récepteur y annonce combien d’octets il peut encore accepter (contrôle de flux)', 'Il indique le numéro de la trame Ethernet', 'Il donne la durée de vie du segment', 'Il chiffre les données'], good: 0,
      hints: ['Diapo « Contrôle de flux » : adapter le rythme d’émission aux capacités du récepteur.'],
      explain: 'C’est le <b>contrôle de flux</b> : l’émetteur ne doit pas avoir plus d’octets non acquittés en vol que la fenêtre annoncée. Fenêtre 0 = le récepteur est saturé.' },
    { id: 'tr4', lvl: 1, type: 'match', q: 'Associe chaque drapeau TCP à son rôle.',
      pairs: [['SYN', 'Ouvrir une connexion'], ['ACK', 'Le numéro d’acquittement est valide'], ['FIN', 'Fermer proprement son sens d’émission'], ['RST', 'Couper brutalement la connexion'], ['PSH', 'Transmettre tout de suite les données à l’application']],
      hints: ['FIN = finish, RST = reset, PSH = push.'],
      explain: 'SYN ouvre, FIN ferme proprement (chaque côté le sien), RST coupe net (port fermé, erreur), ACK valide le champ d’acquittement, PSH demande la remise immédiate à l’application.' },
    /* ---------- Facile ---------- */
    { id: 'tr5', lvl: 2, type: 'order', q: 'Remets dans l’ordre l’ouverture d’une connexion TCP puis le premier envoi de données.',
      items: ['Le client envoie SYN (seq = x)', 'Le serveur répond SYN + ACK (seq = y, ack = x + 1)', 'Le client répond ACK (ack = y + 1)', 'Le client envoie ses premières données (seq = x + 1)'],
      hints: ['Le SYN « consomme » un numéro de séquence.'],
      explain: 'La poignée de main en trois temps, puis les données commencent à x + 1, puisque le SYN a pris le numéro x.' },
    { id: 'tr6', lvl: 2, type: 'text', q: 'Sur Ethernet (MTU 1 500 octets), avec des en-têtes IP et TCP sans options, quelle <b>MSS</b> (taille maximale des données d’un segment) annonce-t-on, en octets ?',
      kind: 'int', accept: 1460,
      hints: ['On retire les deux en-têtes de 20 octets.'],
      explain: '1 500 − 20 − 20 = <b>1 460</b>, la valeur « MSS=1460 » du SYN de la capture debian.org.' },
    { id: 'tr7', lvl: 2, type: 'multi', q: 'Coche ce qui est vrai pour <b>UDP</b>.',
      choices: ['Il distingue les applications grâce aux ports', 'Il n’envoie pas d’accusé de réception', 'Il ne remet pas les messages dans l’ordre', 'Il n’a pas de contrôle de flux', 'Il établit une connexion avant d’envoyer', 'Il retransmet les messages perdus'], good: [0, 1, 2, 3],
      hints: ['UDP ne garantit rien, mais il sait à quelle application parler.'],
      explain: 'UDP = ports + somme de contrôle, et c’est tout. Connexion, retransmission, remise en ordre et contrôle de flux sont des services de <b>TCP</b> ; avec UDP, c’est l’application qui s’en charge si besoin.' },
    { id: 'tr8', lvl: 2, type: 'text', q: '<b>Étude CV1.</b> Liaison à 64 000 bit/s, trames de 4 096 bits, satellite à 36 000 km, signal à 300 000 km/s. Calcule :',
      fields: [{ label: 'le temps d’émission d’une trame (en ms)', kind: 'num', answer: ['64', near(64, 0.01)] }, { label: 'le délai de propagation de A à B, aller simple (en s)', kind: 'num', answer: ['0.24', near(0.24, 0.0001)] }],
      hints: ['Émission : taille / débit.', 'Propagation : A → satellite → B, soit 2 × 36 000 km.'],
      explain: 'Émission : 4 096 / 64 000 = 0,064 s = <b>64 ms</b>. Propagation : 72 000 / 300 000 = <b>0,24 s</b>. Sur un satellite, c’est la propagation qui domine.' },
    /* ---------- Moyen ---------- */
    { id: 'tr9', lvl: 3, type: 'text', q: '<b>Étude CV1, question 1.</b> Durée totale de l’échange d’une trame (4 096 bits) et de son acquittement (80 bits) à 64 000 bit/s, avec 0,24 s de propagation dans chaque sens (en secondes) ?',
      kind: 'num', accept: ['0.54525', near(0.54525, 0.0005)],
      hints: ['Durée = F/C + I + Ack/C + I.', '0,064 + 0,24 + 0,00125 + 0,24.'],
      explain: 'F/C = 0,064 s, Ack/C = 0,00125 s, plus deux fois 0,24 s : <b>0,54525 s</b>.' },
    { id: 'tr10', lvl: 3, type: 'text', q: 'Toujours en « envoyer une trame et attendre son acquittement », quel est le <b>débit utile</b> (bit/s, arrondi à l’unité) ? Les données utiles font 4 000 bits par trame.',
      kind: 'int', accept: 7336,
      hints: ['Débit utile = données utiles / durée de l’échange.'],
      explain: '4 000 / 0,54525 ≈ <b>7 336 bit/s</b>, soit à peine 11,5 % des 64 000 bit/s : la liaison passe son temps à attendre.' },
    { id: 'tr11', lvl: 3, type: 'text', q: 'A envoie un segment de <b>3 octets</b> avec le numéro de séquence <code>562b9201</code>. Quel numéro d’acquittement B renverra-t-il (en hexa) ?',
      kind: 'word', accept: ['562B9204', '0x562B9204'],
      hints: ['L’acquittement = le prochain octet attendu.'],
      explain: 'Octets reçus : 562b9201, 562b9202, 562b9203. Prochain attendu : <b>562b9204</b>, exactement l’ack du n° 6 de la diapo.' },
    { id: 'tr12', lvl: 3, type: 'qcm', q: '<b>Capture debian.org.</b> Pourquoi la toute première trame est-elle une requête ARP pour <b>192.168.2.254</b> et pas pour le serveur DNS 193.1.2.3 ?',
      choices: ['Le serveur DNS n’est pas dans le réseau 192.168.2.0/24 : il faut passer par la passerelle, dont on cherche la MAC', 'ARP ne fonctionne qu’avec la passerelle', 'Le serveur DNS ne répond pas aux requêtes ARP', 'Le poste a oublié son serveur DNS'], good: 0,
      hints: ['On ne fait jamais d’ARP pour une machine d’un autre réseau.'],
      explain: '193.1.2.3 est hors du réseau du poste : la trame DNS sera adressée à la <b>passerelle</b> (MAC 00:19:66:63:17:FF), d’où l’ARP pour 192.168.2.254. Le même ARP servira ensuite pour le serveur web.' },
    /* ---------- Difficile ---------- */
    { id: 'tr13', lvl: 4, type: 'text', q: '<b>Étude CV1, question 2.</b> Quelle est la taille de fenêtre <b>minimale</b> (en nombre de trames) pour que A émette en continu ?',
      kind: 'int', accept: 9,
      hints: ['W × F/C ≥ F/C + 2I + Ack/C, soit W ≥ 1 + 2CI/F + Ack/F.', '1 + 7,5 + 0,02 = 8,52… et une fenêtre compte des trames entières.'],
      explain: 'W ≥ 1 + (2 × 64 000 × 0,24) / 4 096 + 80 / 4 096 = 8,52. Il faut un nombre entier de trames : <b>W = 9</b>. Le corrigé s’arrête à « 8,52 », ce n’est pas une taille de fenêtre possible.' },
    { id: 'tr14', lvl: 4, type: 'text', q: 'Quand A émet en continu, quel est le débit utile (bit/s) ?',
      kind: 'int', accept: 62500,
      hints: ['La liaison est pleine, mais chaque trame transporte 96 bits d’en-tête.', 'C × D / F.'],
      explain: '64 000 × 4 000 / 4 096 = <b>62 500 bit/s</b>. On ne peut pas faire mieux : les en-têtes prennent toujours leur part.' },
    { id: 'tr15', lvl: 4, type: 'qcm', q: 'La diapo « Les petits paquets surchargent le réseau… les données seront regroupées dans des paquets de grande taille » décrit quel mécanisme de TCP ?',
      choices: ['L’algorithme de Nagle', 'L’algorithme de Karn', 'La poignée de main en trois temps', 'Le démarrage lent (slow start)'], good: 0,
      hints: ['Son nom est celui de son inventeur, John Nagle.'],
      explain: '<b>Nagle</b> : tant qu’un petit segment n’est pas acquitté, TCP accumule les petites écritures suivantes au lieu d’envoyer des segments de 1 octet avec 40 octets d’en-têtes. Karn concerne le temporisateur de retransmission.' },
    { id: 'tr16', lvl: 4, type: 'order', q: '<b>Capture debian.org, nouvelle configuration</b> : DNS1 = <b>192.168.2.20</b> (dans le réseau du poste), caches vidés. Remets dans l’ordre les 9 premières trames émises ou reçues par le poste.',
      items: ['ARP : qui a 192.168.2.20 ?', 'ARP : 192.168.2.20 est à la MAC du serveur DNS', 'DNS : requête A www.debian.org vers 192.168.2.20', 'DNS : réponse 194.109.137.218', 'ARP : qui a 192.168.2.254 ?', 'ARP : 192.168.2.254 est à 00:19:66:63:17:FF', 'TCP : SYN vers 194.109.137.218 port 80', 'TCP : SYN + ACK', 'TCP : ACK'],
      hints: ['Le DNS est maintenant local : pas besoin de la passerelle pour lui.', 'Le serveur web, lui, est toujours distant.'],
      explain: 'Le DNS étant dans le réseau, on fait l’ARP <b>pour lui</b> et la requête lui est envoyée directement. La passerelle n’est cherchée qu’<b>ensuite</b>, pour joindre le serveur web, puis vient la poignée de main TCP (le GET serait la 10e trame).' },
    /* ---------- Extrême ---------- */
    { id: 'tr17', lvl: 5, type: 'grid', q: '<b>Étude CV1, question 3</b> (celle de l’énoncé, pas celle du corrigé). Donne le débit utile maximal pour chaque taille de fenêtre, en bit/s, arrondi à l’unité.',
      file: 'cv1-etude.xlsx', sheet: 'Question 3',
      cols: [{ h: 'Fenêtre W (trames)', w: 170 }, { h: 'Débit utile (bit/s)', kind: 'int', w: 170 }],
      rows: [['7', { a: ['51352', '51353'] }], ['15', { a: '62500' }], ['127', { a: '62500' }]],
      hints: ['Sous 8,52 trames : W × 4 000 / 0,54525.', 'À partir de 9 trames, la liaison est pleine : le débit plafonne.'],
      explain: 'W = 7 : 7 × 4 000 / 0,54525 ≈ <b>51 352</b> bit/s (le corrigé écrit 51 342 : erreur de calcul). W = 15 et W = 127 dépassent 9 : la fenêtre ne se ferme jamais, débit = <b>62 500</b> bit/s. Agrandir la fenêtre au-delà ne sert plus à rien.' },
    { id: 'tr18', lvl: 5, type: 'text', q: 'Moyenne du RTT = 100 ms, dérivation = 20 ms. Une nouvelle mesure donne <b>140 ms</b>. Avec a = 1/8 et b = 1/4 (formules correctes de Jacobson), calcule :',
      fields: [{ label: 'nouvelle moyenne (ms)', kind: 'num', answer: ['105', near(105, 0.01)] }, { label: 'nouvelle dérivation (ms)', kind: 'num', answer: ['25', near(25, 0.01)] }, { label: 'RTO (ms)', kind: 'num', answer: ['205', near(205, 0.01)] }],
      hints: ['Erreur = 140 − 100 = 40.', 'Moyenne + 40/8 ; dérivation + (40 − 20)/4.', 'RTO = moyenne + 4 × dérivation.'],
      explain: 'Erreur = 40 ms. Moyenne = 100 + 40/8 = <b>105</b>. Dérivation = 20 + (|40| − 20)/4 = <b>25</b>. RTO = 105 + 4 × 25 = <b>205 ms</b>. Avec la formule du poly (moyenne − a × erreur), la moyenne baisserait à 95 alors que le réseau ralentit : absurde.' },
    { id: 'tr19', lvl: 5, type: 'qcm', q: '<b>Exemple d’échanges avec erreurs</b>, n° 12 : B reçoit enfin le segment seq <code>562b9204</code> (le n° 7, retardé) et le rejette « hors séquence ». Pourquoi ?',
      choices: ['B a déjà reçu ces 9 octets (n° 9) et attend maintenant 562b920d : c’est un doublon', 'Le segment est corrompu', 'Le numéro d’acquittement 72b24e07 est faux', 'B n’accepte jamais un segment arrivé en retard, même s’il est nouveau'], good: 0,
      hints: ['Que vaut l’acquittement envoyé par B au n° 10 ?'],
      explain: 'Au n° 10, B a acquitté 562b920d : tout ce qui précède est arrivé. Le n° 7 contient des octets <b>déjà reçus</b> (via le n° 9) : doublon, jeté. TCP élimine ainsi les doublons qu’IP peut créer.' },
    { id: 'tr20', lvl: 5, type: 'qcm', q: '<b>Capture debian.org.</b> Les trames 5 à 9 (échange avec le serveur web 194.109.137.218) ont pour MAC 00:09:5B:D4:67:4E. Qu’en penses-tu ?',
      choices: ['C’est incohérent : le serveur web est distant, ces trames devraient porter la MAC de la passerelle 00:19:66:63:17:FF, la seule apprise par ARP', 'C’est normal : c’est la MAC du serveur web debian.org', 'C’est normal : chaque connexion TCP utilise une MAC différente', 'C’est la MAC du serveur DNS'], good: 0,
      hints: ['Une machine distante, on ne connaît jamais sa MAC.', 'Caches vidés : quelle MAC le poste a-t-il pu apprendre ?'],
      explain: 'Hors du réseau local, la MAC de destination est <b>toujours celle de la passerelle</b>. Le poste n’a appris que 00:19:66:63:17:FF (trame 2) ; 00:09:5B:D4:67:4E ne peut pas sortir de nulle part sans ARP. La capture a été assemblée à partir de deux traces : bon réflexe de le signaler.' },
    /* ---------- Impossible ---------- */
    { id: 'tr21', lvl: 6, type: 'multi', q: '<b>Esprit critique sur le corrigé de l’étude CV1.</b> Quelles remarques sont justes ?',
      choices: ['7 × 7 336 = 51 352, pas 51 342', 'Le « rendement = 7 336 bits par seconde » est en fait un débit utile ; le rendement vaut environ 11,5 %', 'Le corrigé traite W = 9 et W = 20 alors que l’énoncé demande 15 et 127', 'Le débit utile maximal n’est pas 62 500 mais 64 000 bit/s', 'Avec W = 9, le débit utile vaut 9 × 7 336 = 66 024 bit/s'], good: [0, 1, 2],
      hints: ['Deux remarques sont fausses : vérifie les calculs du plafond.'],
      explain: 'Les trois premières sont justes. 64 000 bit/s est le débit <b>brut</b> : les en-têtes en prennent 2,3 %, d’où 62 500 bit/s utiles. Et 9 × 7 336 dépasse ce plafond : la formule linéaire ne vaut que sous 8,52 trames.' },
    { id: 'tr22', lvl: 6, type: 'text', q: '<b>Exemple d’échanges avec erreurs</b>, n° 14 : B envoie seq <code>72b24e16</code>, alors que son dernier segment dessiné (n° 10, seq 72b24e07, 9 octets) s’arrêtait à 72b24e0f. Combien d’octets B a-t-il envoyés dans un segment <b>non dessiné</b> ?',
      kind: 'int', accept: 6,
      hints: ['Après le n° 10, la séquence suivante de B est 72b24e07 + 9 = 72b24e10.', '0x16 − 0x10 = ?'],
      explain: '72b24e10 → 72b24e16 : <b>6 octets</b> envoyés dans un segment absent du schéma. Indice qui le confirme : les identifiants IP de B passent de 0x47ba à 0x47bc, il manque <b>0x47bb</b>.' },
    { id: 'tr23', lvl: 6, type: 'qcm', q: 'La diapo « Algorithme de KARN » écrit : Moyenne = moyenne − a × erreur ; Dérivation = dérivation + b × (erreur − dérivation). Quelle correction est exacte ?',
      choices: ['Moyenne = moyenne + a × erreur, et la dérivation utilise |erreur| ; ce sont les formules de Jacobson, Karn ajoute le doublement du RTO et l’oubli des mesures sur segments retransmis', 'Il suffit de remplacer a = 1/8 par a = 8', 'Les formules sont justes, seule la valeur de b est fausse', 'Il faut retirer la dérivation : RTO = 2 × moyenne'], good: 0,
      hints: ['Si la mesure dépasse la moyenne, la moyenne doit-elle monter ou descendre ?'],
      explain: 'Signe <b>+</b> (la moyenne suit la mesure), <b>|erreur|</b> dans la dérivation, RTO = moyenne + 4 × dérivation : c’est l’estimateur de <b>Jacobson</b> (RFC 6298). <b>Karn</b> : ne pas mesurer le RTT d’un segment retransmis, et doubler le RTO à chaque retransmission.' },
    { id: 'tr24', lvl: 6, type: 'qcm', q: '<b>Capture debian.org, DNS1 (192.168.2.20) en panne</b> (machine éteinte), DNS2 = 193.1.2.3. Comment commence l’échange ?',
      choices: ['Une ou plusieurs requêtes ARP pour 192.168.2.20 sans réponse, puis ARP pour la passerelle et requête DNS vers 193.1.2.3 via la passerelle', 'Une requête DNS vers 192.168.2.20, puis une erreur ICMP port inaccessible', 'Directement une requête DNS vers 193.1.2.3, le poste sait que DNS1 est en panne', 'Une requête DNS envoyée en diffusion à tout le réseau'], good: 0,
      hints: ['Machine éteinte : peut-elle répondre à l’ARP ?', 'Le poste ne peut pas deviner la panne : il essaie d’abord DNS1.'],
      explain: 'Le poste essaie <b>d’abord DNS1</b> : sans réponse ARP, la requête DNS ne peut même pas partir. Après le délai d’attente, il bascule sur <b>DNS2</b>, qui est distant : ARP pour la passerelle, puis requête DNS via la passerelle. Le cas « ICMP port inaccessible » serait celui d’une machine allumée dont seul le service DNS est arrêté.' }
  ]
  });
})();
