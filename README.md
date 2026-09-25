# Réseaux pour les nuls

Application web locale pour réviser le module IMT « Architecture, modèles et protocoles des réseaux » :
19 modules (cours + questions bloquantes), un Packet Tracer intégré (topologie, CLI Cisco, PC, serveurs,
client et serveur de messagerie), des tableaux façon Excel (corrigés comme au DS), des niveaux de difficulté
optionnels et une fiche de révision imprimable.

## Lancer

- Double-clic sur **« Réseaux pour les nuls »** sur le Bureau (ou sur `lancer.bat`).
- Le script démarre un petit serveur PowerShell sur `http://localhost:8766` (accessible depuis ce PC uniquement)
  et ouvre la page. Laisser la fenêtre du serveur ouverte (réduite) pendant la révision.
- Sur Mac (macOS 13 Ventura ou plus récent, puce Apple ou Intel) : double-clic sur **« Réseaux pour les nuls (Mac) »**.
  Le Terminal s’ouvre (c’est le serveur, même rôle que la fenêtre PowerShell) et la page s’ouvre dans le navigateur.
- Sans serveur, `web/index.html` s’ouvre aussi directement, mais la progression reste alors dans le navigateur.

## Partager avec des amis

```bash
python outils/paquet_amis.py
```

Crée `dist/Reseaux-pour-les-nuls.zip` (Windows + Mac, avec un `LISEZMOI.txt` qui explique le lancement et
l’autorisation à donner la première fois sur Mac). Ta progression (`sauvegarde/`) n’y est jamais incluse.
Partage ce zip tel quel : recompressé avec l’Explorateur Windows, l’exécutable Mac perdrait son droit d’exécution.

## Progression

- Enregistrée au fur et à mesure dans `sauvegarde/progression.json` (+ copie `progression.bak.json`
  et un export `progression.csv` lisible dans Excel), et en double dans le navigateur.
- Bouton « Réinitialiser » en bas du menu pour tout remettre à zéro.

## Niveaux de difficulté (optionnels)

Le parcours **Classique** (par défaut) suit les cours, comme avant. Le sélecteur « Niveau » du menu ouvre un
parcours par niveau : les questions du cours classées par difficulté, plus des questions et des labos
supplémentaires (au moins 3 par niveau et par module). La progression est commune : une question réussie
l’est dans tous les parcours où elle apparaît.

| Niveau | Indices | Bouton « Donne-moi la réponse » |
|---|---|---|
| 🐣 Débutant | tous, le premier est offert | tout de suite |
| 🙂 Facile · 🤔 Moyen | tous | tout de suite |
| 💪 Difficile | tous | après 1 essai raté |
| 🔥 Extrême | un seul | après 2 essais ratés |
| 💀 Impossible | aucun | après 3 essais ratés |

## Contenu

| # | Module | Labos Packet Tracer |
|---|---|---|
| 1-4 | Bases, OSI/TCP-IP, câbles, équipements | premier contact, ARP, câblage et câblage à dépanner, domaines de diffusion |
| 5-7 | IPv4, sous-réseaux/VLSM, routage | adressage à dépanner, Situation 2, VLSM ; EX0-ROUTAGE, Lille/Lens/Arras (et sa version en panne), RIP |
| 8-12 | VLAN, DHCP, DNS, Web, messagerie | TP1 (VLAN, router-on-a-stick, relais DHCP), trunk, inter-VLAN en panne, DHCP à distance, DNS (dont derrière un routeur), site web en panne, Email (dont relais entre deux domaines) |
| 13-17 | NAT/PAT, IPv6, STP, HSRP, SDN | NAT-PAT (et en panne), IPv6/DHCPv6 (et en panne), TP-TAP, pont racine, HSRP (et mal réglé), switch en SSH ; client REST |
| 18-19 | Projet Datamax, examen blanc (DS avec barème) | missions 1 à 5, « lundi matin » (dépannage) ; Sujet 2 du DS en vrai |

## Développement

- `web/js/pt/` : moteur réseau (`engine.js`), CLI IOS (`ios.js`), invite de commandes PC (`pcshell.js`), interface Packet Tracer.
- `web/js/modules/NN-*.js` : un fichier par module (`cours` en HTML + `questions`).
- `web/js/niveaux/NN-*.js` : questions et labos supplémentaires des niveaux ; `classement.js` donne le niveau des questions du cours.
- `web/js/labkit.js` : construction des labos, application des solutions et contrôles des objectifs.
- `outils/pkt_vers_js.py "<dossier des .pkt>"` : régénère `web/js/data/topologies.js` depuis les fichiers Packet Tracer du cours.
- `outils/mac/` : serveur Mac en Go (équivalent de `serveur.ps1`) ; `python outils/construire_mac.py <go.exe>` recompile
  l’exécutable universel depuis Windows (il faut Go : https://go.dev/dl/). À refaire seulement si le serveur change,
  pas quand le contenu de `web/` change.
- Tests (Node.js) :

```bash
node tests/modules.js   # chaque question et chaque labo (départ en échec, solution OK, rechargement)
NIV=1 node tests/modules.js   # affiche en plus le nombre de questions par niveau
STRICT=1 node tests/modules.js   # échoue si un module a moins de 3 questions à un niveau
node tests/calculs.js   # recalcul indépendant des réponses d’adressage et des tables de routage
node tests/t1.js        # moteur, CLI, scénarios PT (t1 à t4)
```

Les icônes Packet Tracer (`web/assets/pt/`) proviennent de l’installation locale de Cisco Packet Tracer :
usage personnel uniquement, ne pas redistribuer.
