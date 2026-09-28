# Source de contenu — CV de William Stoops

> **Source de vérité unique** du contenu affiché par le portfolio (CV français, transmis le
> 2026-09-25). Aucune information absente de ce fichier n'apparaît sur le site sans
> validation explicite de William. Les autres projets personnels seront ajoutés plus tard.
>
> Les données du site vivent dans `src/features/*/data/*.ts`, typées et validées par Zod,
> recopiées depuis ce fichier. Toute divergence entre les deux est un bug.
>
> Le site existe aussi en anglais (ADR 0026, demande de William le 2026-09-27) : les
> modules `*.en.ts` **traduisent** ce contenu, sans rien ajouter. William relit la traduction.

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

Portrait, hors CV, fourni par William le 2026-09-28 (`docs/content/images/william-stoops-portrait.jpg`) :
en veste sombre, dans la lumière du soleil. Il est montré en grand dans une carte du hero
(ADR 0037) et sur la carte des aperçus de liens.

La pastille « Basé à Paris · ouvert à Lille ou en full remote » du hero est retirée à la
demande de William le 2026-09-28 ; « Paris » reste au-dessus du titre.

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

Sur le site, la section « Chiffres clés » d'À propos est retirée à la demande de William le
2026-09-28 : chaque chiffre reste dit là où il s'est produit (IT-Finance, STAXX).
La section À propos elle-même est retirée à la demande de William le même jour, avec ses
trois axes et le bandeau qui les répétait en grands caractères : le hero porte déjà la phrase
d'accroche et la suite du profil. « 3 ans d'expérience en entreprise » n'est donc plus dit
sur le site.

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

Laboratoire de la volatilité implicite (ADR 0036), hors CV, validé par William le 2026-09-28
sur une capture : l'explication du calcul (« Le prix d'une option dépend de la volatilité
qu'on attend du sous-jacent… »), la surface résolue dans le navigateur à partir de prix
simulés, et la course des cycles sous le titre « Un cycle complet, à l'échelle ».

### Full Stack Engineer — INTM Groupe (ESN) · 2024

- Livré **seul et from scratch** l'outil interne de pilotage d'activité de l'entreprise :
  KPI des business managers, suivi du statut des consultants (en formation, en mission, chez
  quel client). Du schéma PostgreSQL aux écrans React, back NestJS compris.

Sur le site, à la demande de William le 2026-09-29 : la dernière phrase (« Du schéma
PostgreSQL aux écrans React… ») est retirée ; la stack reste dite par les badges du poste.

Recommandation, hors CV, fournie par William le 2026-09-28 : celle que **Paul Plancq**,
son mentor chez INTM Groupe (aujourd'hui Senior Consultant Craft chez HoppR), a écrite sur
LinkedIn le 27 juin 2025. Citée mot pour mot sous le poste INTM ; traduite, et dite
traduite, sur la page anglaise.

### Full Stack Engineer — Strattt, puis GDS Élec · 2022 – 2024

- Automatisé une chaîne comptable de bout en bout, et livré **trois applications mobiles
  en production**.

Précisé par William le 2026-09-29, et c'est ce que dit le site : deux postes distincts, dans
l'ordre où ils ont eu lieu.

- **GDS Élec**, juillet 2022 – janvier 2023 : une application en production qui gère à
  distance des bornes de recharge électriques, via le **protocole OCPP**.
- **Strattt**, septembre 2023 – février 2024 : automatisé une chaîne comptable de bout en
  bout.

Les « trois applications mobiles » ne sont plus dites. Dans le parcours, GDS Élec est
l'escale de 2022 ; Strattt ouvre celle de 2023, avant INTM.

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

Affiche de la vidéo, avec l'accord de William le 2026-09-26 : la première image du pitch,
à 1:02:21, capturée depuis la vidéo en 1920 × 1080 (`docs/content/images/staxx-pitch.jpg`).
Légende : « Devant 300 personnes, sur la scène de l'Epitech Summit. »

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

Sur le site, à la demande de William le 2026-09-28 : la section IA ne cite plus les serveurs
MCP un à un (Pennylane, outils Google, Context7, 21st.dev), et n'a plus le point « Modèles
entraînés à Korea University », une redite : ces modèles sont racontés dans le chapitre
de la Corée du Sud.

Correction de William le 2026-09-28 : Korea University n'était pas à Séoul. Le site dit
« Korea University » ou « Corée du Sud », jamais « Séoul ».

Hors CV, donné par William le 2026-09-28 pour la section « Ce que j'y ai appris » : à Korea
University, il a suivi de l'**algèbre linéaire** sur le manuel de Gilbert Strang
(_Introduction to Linear Algebra_, 6e édition, MIT) et approfondi l'IA : les calculs de
**propagation avant et de rétropropagation**, l'**apprentissage supervisé** et
l'**apprentissage par renforcement**, les architectures **MLP, RNN, LSTM, Transformers**
(le CNN vient des modèles entraînés ci-dessus). Les thèmes d'algèbre linéaire affichés
reprennent la table des matières du manuel, à confirmer par William ; l'ACP en est retirée
à sa demande le même jour. Les deux équations d'abord posées sous le schéma du réseau sont
retirées à sa demande le 2026-09-29 : la légende dit les deux passes en mots seulement.

## Compétences techniques

| Catégorie  | Éléments                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Langages   | TypeScript, Python, C++, Rust, SQL                                                                                                                     |
| Plateforme | NestJS, Node.js, React, PostgreSQL, Prisma, Drizzle, Docker, CI/CD                                                                                     |
| IA         | LLM OpenAI et Anthropic, function calling, JSON Schema, agents, MCP, Hugging Face, apprentissage par transfert, CNN, YOLO, pandas, numpy, scikit-learn |

Sur le site, à la demande de William le 2026-09-28 : SQL retiré des langages, **Jenkins**
ajouté aux frameworks et outils, et le groupe IA retiré (une liste de noms qui ne prouvait
rien seule ; la pratique IA reste racontée dans sa section).

## Formation

- **Epitech** — Master of Science, Expert en Technologies de l'Information, 2021 – 2026.
- **Korea University** (Corée du Sud) — année suivie en anglais, deep learning et computer vision.

Hors CV, fourni par William le 2026-09-26 pour la section « Corée du Sud » : des photos
(`docs/content/images/korea-*.jpg` : du code dans un café face aux montagnes, un pavillon
illuminé de nuit) et quelques mots en coréen qui les encadrent (안녕하세요, 고려대학교, 한국,
딥러닝, 컴퓨터 비전, 카페, 밤). La photo au stade de baseball est retirée à la demande de
William le 2026-09-28.

- Anglais professionnel, **TOEIC 820**.

## Chronologie

Hors CV, donnée par William le 2026-09-26 et confirmée par lui : le fil conducteur de la
page (le parcours, une escale par année d'Epitech).

- **2021**, 1re année : entrée à Epitech (Master of Science, promo 2026).
- **2022**, 2e année : GDS Élec (juillet 2022 – janvier 2023).
- **2023**, 3e année : début de STAXX, le projet de fin d'études, développé en 3e, 4e et
  5e année ; Strattt (septembre 2023 – février 2024), puis INTM en 2024.
- **2024**, 4e année : Korea University, en Corée du Sud.
- **2025**, 5e année : retour en France ; IT-Finance depuis septembre 2025 ; passage sur
  NRJ Lille et 1er au concours Epitech Summit avec STAXX.
- **2026** : promo 2026.

## La course « 10 h → 5 min »

Demandée par William le 2026-09-28 (ADR 0032) : une maquette à l'échelle du chiffre clé,
sous le rôle IT-Finance. Elle ne reprend que le CV : le calcul tourne en continu, 10 heures
par cycle avant la refonte, 5 minutes après, des valeurs de nouveau à jour. Le rapport de
120 cycles en est déduit (600 minutes divisées par 5) ; l'échelle (une heure = 1,2 seconde)
est affichée.

## Les coulisses du site

Demandées par William le 2026-09-28 (ADR 0033) : une page sur la façon dont le site est
fait, pas sur William. Ses chiffres sont ceux de la configuration du dépôt (budgets, seuils,
couverture, appareils, nombre de décisions), vérifiés par un test, et les mesures du
navigateur du lecteur. Le dépôt est public : https://github.com/William-Stoops/Portfolio.

## Libellés propres au site

Choisis avec William le 2026-09-26 pour des lecteurs recruteurs : ils reformulent des
titres du CV sans en changer le fond.

- Section IA : « Intelligence artificielle », avec le titre du CV en sous-titre (« Pratique
  personnelle et travaux académiques »).
- Familles de compétences : « Plateforme » devient « Frameworks et outils », « IA » devient
  « IA et data » ; chaque compétence prend une majuscule initiale, sauf les noms qui s'écrivent
  en minuscules (pandas, numpy, scikit-learn).

## Correspondance avec la maquette de référence

| Zone de la maquette                        | Contenu du portfolio                                                       |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| Hero « Hello. I'm … / Software Developer » | « Bonjour. Je suis William » / « Software Engineer & AI Engineer »         |
| CTA « Got a project? » / « My resume »     | « Me contacter » / « Télécharger le CV » (PDF servi depuis `public/`)      |
| Bandeau de technos                         | Mots-clés d'en-tête (TypeScript, Python, C++, Rust, NestJS, React…)        |
| Services (Website Development…)            | Trois axes : Calcul & performance · Produits full stack · IA, agents & LLM |
| Stats (120+, 95 %, 10+)                    | Chiffres clés ci-dessus — **réels et sourcés, jamais inventés**            |
| Projects                                   | Expériences (ProRealTime, INTM, Strattt, GDS Élec) + STAXX + travaux IA    |
| (absent de la maquette)                    | Parcours / formation, contact                                              |

La déclaration d'accessibilité est retirée du site à la demande de William le 2026-09-29 :
rien ne l'impose à un site personnel, et l'accessibilité reste testée.

## Contexte de destination

Le site est présenté au **CTO d'Hymaïa** (cabinet de conseil et formation Data & IA, Paris,
~35 experts ; valeurs : expertise, transmission, pragmatisme, « giver mindset »). Le site est
lui-même une pièce du dossier : son code, ses tests, sa CI et ses ADR sont lus autant que
son contenu.
