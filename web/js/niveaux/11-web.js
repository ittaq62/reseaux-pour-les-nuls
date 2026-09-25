/* Module 11 — questions supplémentaires des niveaux */
(window.EXTRAS = window.EXTRAS || {}).web = [
  /* ---------- Débutant ---------- */
  { id: 'xw1', lvl: 1, type: 'qcm', q: 'Dans Packet Tracer, comment ouvres-tu une page web depuis un PC ?',
    choices: ['Desktop → Web Browser, puis on tape l’URL', 'Onglet Physical → Web', 'Onglet Config → HTTP', 'Command Prompt → start http'], good: 0,
    hints: ['Le navigateur est une application du bureau (Desktop) du PC.'],
    explain: 'Desktop → <b>Web Browser</b> → URL (par exemple <code>http://www.imt.local</code>) → Go. Le service HTTP, lui, se règle sur le <b>serveur</b> : Services → HTTP.' },
  /* ---------- Extrême ---------- */
  { id: 'xw2', lvl: 5, type: 'match', q: 'Le navigateur de Packet Tracer affiche un message. Qu’en conclus-tu ?',
    pairs: [['Host Name Unresolved', 'Le nom n’a pas été traduit : DNS du PC, serveur DNS ou enregistrement en cause'], ['Request Timeout', 'Le nom est résolu, mais personne ne répond sur ce port (service arrêté, mauvaise adresse, serveur injoignable)'], ['La page s’affiche', 'DNS, routage et service HTTP fonctionnent']],
    hints: ['Le navigateur fait d’abord une résolution DNS, puis ouvre une connexion TCP vers le serveur.'],
    explain: '« Host Name Unresolved » = on n’a même pas d’adresse (problème DNS). « Request Timeout » = on a une adresse, mais la connexion TCP n’aboutit pas. C’est le premier tri à faire quand un site ne s’affiche pas.' },
  { id: 'xw3', lvl: 5, type: 'text', kind: 'int', accept: 11, ph: 'connexions',
    q: 'Une page HTML contient <b>10 images</b>, toutes sur le même serveur. En <b>HTTP/1.0</b> (sans keep-alive), combien de connexions TCP le navigateur ouvre-t-il pour afficher la page complète ?',
    hints: ['En HTTP/1.0, une connexion = un seul objet, puis on ferme.'],
    explain: '1 pour la page + 10 pour les images = <b>11</b> connexions, chacune avec sa poignée de main TCP. C’est précisément ce que HTTP/1.1 améliore avec les connexions persistantes.' },
  /* ---------- Impossible ---------- */
  { id: 'xw4', lvl: 6, type: 'order', q: 'Tu tapes <code>https://www.imt.local</code> dans le navigateur (caches vides). Remets dans l’ordre les protocoles utilisés.',
    items: ['DNS : le PC obtient l’adresse de www.imt.local', 'TCP : poignée de main en trois temps vers le port 443', 'TLS : négociation (certificat du serveur, clés de session)', 'HTTP : la requête GET part, chiffrée'],
    hints: ['On ne peut pas se connecter sans adresse, ni chiffrer sans connexion.'],
    explain: 'DNS (UDP 53) → TCP vers le port 443 → négociation TLS → requête HTTP à l’intérieur du tunnel chiffré. Si l’étape TCP échoue (HTTPS éteint), le navigateur affiche « Request Timeout ».' },
  { id: 'xw5', lvl: 6, type: 'qcm', q: 'Le certificat du serveur est parfaitement valide pour <b>www.imt.local</b>. Pourtant, en tapant <code>https://192.168.1.10</code>, le navigateur affiche un avertissement de sécurité. Pourquoi ?',
    choices: ['Parce que HTTPS ne fonctionne jamais avec une adresse IP privée', 'Parce que le nom demandé (192.168.1.10) ne correspond pas au nom inscrit dans le certificat (www.imt.local)', 'Parce que le port 443 est fermé', 'Parce que le certificat a expiré'], good: 1,
    hints: ['Le certificat authentifie un <b>nom</b>…'],
    explain: 'Le navigateur vérifie que le nom tapé figure dans le certificat. 192.168.1.10 n’y est pas : il ne peut pas prouver qu’il parle au bon serveur, d’où l’alerte. La connexion TCP, elle, a bien abouti (sinon ce serait « Request Timeout »).' },
  { id: 'xw6', lvl: 6, type: 'text', q: 'PC0 ouvre une connexion vers le serveur web depuis son port source <b>49152</b>. Donne les ports du segment de <b>réponse</b> envoyé par le serveur.',
    fields: [{ label: 'Port source de la réponse', kind: 'int', answer: 80 }, { label: 'Port destination de la réponse', kind: 'int', answer: 49152 }],
    hints: ['La réponse fait le chemin inverse : on échange source et destination.'],
    explain: 'Requête : 49152 → <b>80</b>. Réponse : <b>80</b> → <b>49152</b>. Le port 49152 (éphémère) permet au PC de reconnaître à quel onglet ou quelle application appartient la réponse.' }
];
