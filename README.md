# Réseaux pour les nuls

Application web locale pour réviser le module IMT « Architecture, modèles et protocoles des réseaux » :
19 modules (cours + questions bloquantes), un Packet Tracer intégré (topologie, CLI Cisco, PC, serveurs),
des tableaux façon Excel (corrigés comme au DS) et une fiche de révision imprimable.

## Lancer

- Double-clic sur **« Réseaux pour les nuls »** sur le Bureau (ou sur `lancer.bat`).
- Le script démarre un petit serveur PowerShell sur `http://localhost:8766` (accessible depuis ce PC uniquement)
  et ouvre la page. Laisser la fenêtre du serveur ouverte (réduite) pendant la révision.
- Sans serveur, `web/index.html` s’ouvre aussi directement, mais la progression reste alors dans le navigateur.

## Progression

- Enregistrée au fur et à mesure dans `sauvegarde/progression.json` (+ copie `progression.bak.json`
  et un export `progression.csv` lisible dans Excel), et en double dans le navigateur.
- Bouton « Réinitialiser » en bas du menu pour tout remettre à zéro.

## Contenu

| # | Module | Labos Packet Tracer |
|---|---|---|
| 1-4 | Bases, OSI/TCP-IP, câbles, équipements | câblage, premier LAN |
| 5-7 | IPv4, sous-réseaux/VLSM, routage | EX0-ROUTAGE, Lille/Lens/Arras, RIP |
| 8-12 | VLAN, DHCP, DNS, Web, messagerie | TP1 (VLAN, router-on-a-stick, relais DHCP), trunk, DNS |
| 13-17 | NAT/PAT, IPv6, STP, HSRP, SDN | NAT-PAT, IPv6/DHCPv6, TP-TAP, HSRP ; client REST |
| 18-19 | Projet Datamax, examen blanc (DS avec barème) | SC1 : missions 1 à 5 |

## Développement

- `web/js/pt/` : moteur réseau (`engine.js`), CLI IOS (`ios.js`), invite de commandes PC (`pcshell.js`), interface Packet Tracer.
- `web/js/modules/NN-*.js` : un fichier par module (`cours` en HTML + `questions`).
- `outils/pkt_vers_js.py "<dossier des .pkt>"` : régénère `web/js/data/topologies.js` depuis les fichiers Packet Tracer du cours.
- Tests (Node.js) :

```bash
node tests/modules.js   # chaque question et chaque labo (départ en échec, solution OK, rechargement)
node tests/calculs.js   # recalcul indépendant des réponses d’adressage et des tables de routage
node tests/t1.js        # moteur, CLI, scénarios PT (t1 à t4)
```

Les icônes Packet Tracer (`web/assets/pt/`) proviennent de l’installation locale de Cisco Packet Tracer :
usage personnel uniquement, ne pas redistribuer.
