# Source de contenu — CV de William Stoops

> **Source de vérité unique** du contenu affiché par le portfolio (CV français, transmis le
> 2026-09-25). Aucune information absente de ce fichier n'apparaît sur le site sans
> validation explicite de William. Les autres projets personnels seront ajoutés plus tard.
>
> Les données du site vivent dans `src/features/*/data/*.ts`, typées et validées par Zod,
> recopiées depuis ce fichier. Toute divergence entre les deux est un bug.

## Identité

| Champ        | Valeur                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------- |
| Nom          | William Stoops                                                                           |
| Titre        | Software Engineer & AI Engineer                                                          |
| Sous-titre   | Full stack TypeScript · Python · C++ · Systèmes de calcul                                |
| Localisation | Paris — ouvert à Paris, Lille ou full remote                                             |
| E-mail       | william.stoops@epitech.eu                                                                |
| LinkedIn     | https://www.linkedin.com/in/william-stoops-a1029b233                                     |
| Téléphone    | **Jamais affiché sur le site** (décision de William, 2026-09-25)                         |
| CV PDF       | Téléchargeable : `public/cv/william-stoops-cv-fr.pdf` (copie de `WILLIAM-STOOPS-FR.pdf`) |

Mots-clés d'en-tête : TypeScript · Python · C++ · Rust · NestJS · React · PostgreSQL ·
Docker · LLM · Agents · MCP

## Profil

Software Engineer, 3 ans d'expérience en entreprise. Je décide d'une architecture, je la
mesure, je la livre. Je viens du calcul et de la performance, je construis des produits
full stack en TypeScript, et je travaille tous les jours avec des agents et des LLM.

## Chiffres clés (section « À propos », équivalent des stats de la maquette)

| Valeur       | Libellé                                                      | Source dans le CV |
| ------------ | ------------------------------------------------------------ | ----------------- |
| 10 h → 5 min | Cycle de calcul de volatilité implicite après refonte        | IT-Finance        |
| −99 %        | Latence sur la majorité des requêtes du service d'actualités | IT-Finance        |
| 3 ans        | D'expérience en entreprise                                   | Profil            |
| 1er          | Concours Epitech Summit (STAXX), pitché devant 300 personnes | Projets           |

## Expérience professionnelle

### Software Engineer — IT-Finance, éditeur de ProRealTime · depuis sept. 2025

Éditeur de logiciel financier, environ 70 personnes. Stack : C++, Rust, Python.

- Conçu et mis en production, en C++, un calcul de **volatilité implicite** qui n'existait
  pas dans le produit, sur l'univers d'options **OPRA**, de l'étude des modèles au
  déploiement. **Seul développeur sur le sujet.** Les résultats servent aujourd'hui **des
  dizaines de milliers de traders sur options**.
- Ce calcul tourne en continu et avait décroché à dix heures par cycle. Contre l'hypothèse
  de l'équipe, qui visait l'algorithme, démontré **par la mesure** que le coût venait de la
  structure de données. Refonte : **de 10 heures à 5 minutes**, valeurs de nouveau à jour.
- Migré en **Rust** le service d'actualités financières de la plateforme, en place depuis
  des années, avec ajout d'un cache : **99 % de latence en moins** sur la majorité des
  requêtes. En production, devant **des centaines de milliers d'utilisateurs**. Langage
  appris sur le poste.

### Full Stack Engineer — INTM Groupe (ESN) · 2024

- Livré **seul et from scratch** l'outil interne de pilotage d'activité de l'entreprise :
  KPI des business managers, suivi du statut des consultants (en formation, en mission, chez
  quel client). Du schéma PostgreSQL aux écrans React, back NestJS compris.

### Full Stack Engineer — Strattt, puis GDS Élec · 2022 – 2024

- Automatisé une chaîne comptable de bout en bout, et livré **trois applications mobiles
  en production**.

## Projets

### STAXX — plateforme de commande de matériel pour le BTP · depuis 2024

Projet de fin d'études Epitech. **1er au concours Epitech Summit**, pitché devant 300
personnes. Stack : NestJS, PostgreSQL, React. Vidéo du pitch :
https://www.youtube.com/watch?v=K_TsQ0Itoek&t=3741s (démarre à 1:02:21).

- Porté le projet et **dirigé les deux autres développeurs** : découpage des sujets,
  arbitrages d'architecture, cohérence technique jusqu'à la livraison. Réalisé
  l'intégralité du back-end.
- Conçu le **moteur de correspondance** entre le langage des équipes de chantier et le
  catalogue : « 20 colliers Atlas pour du tube de 26 » retrouve la bonne référence malgré
  les fautes, via un dictionnaire d'alias que chaque correction utilisateur enrichit.

Hors CV, fourni par William le 2026-09-26 avec ses photos (`docs/content/images/`) : la
remise du trophée sur la scène de l'Epitech Summit, et le passage de l'équipe sur
**NRJ Lille**, la radio régionale de NRJ, pour présenter STAXX.

## IA : pratique personnelle et travaux académiques

- **Agents et MCP.** Agents de code au quotidien : décomposition de tâches, boucles
  agentiques, conventions de dépôt et garde-fous. Serveurs MCP branchés (Pennylane, outils
  Google, Context7, 21st.dev) pour automatiser ses propres flux.
- **Intégration de LLM.** Appels des API OpenAI et Anthropic : function calling avec
  fonctions déclarées, sorties contraintes par schéma, gestion du contexte et des tokens,
  arbitrage coût / latence entre modèles.
- **Modèles entraînés à Korea University** (61e mondiale, QS) : BERT affiné (Hugging Face)
  pour de la classification de texte ; CNN reconnaissant l'état d'une partie d'échecs sur
  image du plateau ; détecteur de gestes temps réel de type YOLO sur flux webcam.

## Compétences techniques

| Catégorie  | Éléments                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Langages   | TypeScript, Python, C++, Rust, SQL                                                                                                                     |
| Plateforme | NestJS, Node.js, React, PostgreSQL, Prisma, Drizzle, Docker, CI/CD                                                                                     |
| IA         | LLM OpenAI et Anthropic, function calling, JSON Schema, agents, MCP, Hugging Face, apprentissage par transfert, CNN, YOLO, pandas, numpy, scikit-learn |

## Formation

- **Epitech** — Master of Science, Expert en Technologies de l'Information, 2021 – 2026.
- **Korea University** (Séoul) — année suivie en anglais, deep learning et computer vision.

Hors CV, fourni par William le 2026-09-26 pour la section « Corée du Sud » : trois photos
(`docs/content/images/korea-*.jpg` : au stade de baseball en blouson de Korea University, du
code dans un café face aux montagnes, un pavillon illuminé de nuit) et quelques mots en
coréen qui les encadrent (안녕하세요, 고려대학교, 서울, 딥러닝, 컴퓨터 비전, 야구장, 카페, 밤).

- Anglais professionnel, **TOEIC 820**.

## Chronologie

Hors CV, donnée par William le 2026-09-26 et confirmée par lui : le fil conducteur de la
page (le parcours, une escale par année d'Epitech).

- **2021**, 1re année : entrée à Epitech (Master of Science, promo 2026).
- **2022**, 2e année : Strattt, puis GDS Élec (2022 – 2024).
- **2023**, 3e année : début de STAXX, le projet de fin d'études, développé en 3e, 4e et
  5e année ; INTM en 2024.
- **2024**, 4e année : Korea University, à Séoul.
- **2025**, 5e année : retour en France ; IT-Finance depuis septembre 2025 ; passage sur
  NRJ Lille et 1er au concours Epitech Summit avec STAXX.
- **2026** : promo 2026.

## Correspondance avec la maquette de référence

| Zone de la maquette                        | Contenu du portfolio                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| Hero « Hello. I'm … / Software Developer » | « Bonjour. Je suis William » / « Software Engineer & AI Engineer »         |
| CTA « Got a project? » / « My resume »     | « Me contacter » / « Télécharger le CV » (PDF servi depuis `public/`)      |
| Bandeau de technos                         | Mots-clés d'en-tête (TypeScript, Python, C++, Rust, NestJS, React…)        |
| Services (Website Development…)            | Trois axes : Calcul & performance · Produits full stack · IA, agents & LLM |
| Stats (120+, 95 %, 10+)                    | Chiffres clés ci-dessus — **réels et sourcés, jamais inventés**            |
| Projects                                   | Expériences (ProRealTime, INTM, Strattt/GDS Élec) + STAXX + travaux IA     |
| (absent de la maquette)                    | Parcours / formation, contact, déclaration d'accessibilité                 |

## Contexte de destination

Le site est présenté au **CTO d'Hymaïa** (cabinet de conseil et formation Data & IA, Paris,
~35 experts ; valeurs : expertise, transmission, pragmatisme, « giver mindset »). Le site est
lui-même une pièce du dossier : son code, ses tests, sa CI et ses ADR sont lus autant que
son contenu.
