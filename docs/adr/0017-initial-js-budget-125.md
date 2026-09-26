# 0017 — Relever le budget du JS initial à 125 kB

- Statut : Accepté
- Date : 2026-09-26

## Contexte

Le budget « Initial JS » (size-limit, brotli) a été fixé à 120 kB à la création du projet,
avant toute fonctionnalité. Il était atteint après la refonte animée et la scène WebGL
(119,8 kB). L'étape suivante le dépasse de 0,4 kB :

- les titres de section et le nom en pied de page ont des lettres animées, c'est-à-dire du
  balisage rendu par React ;
- les deux hooks qui chargent les chunks à la demande s'y ajoutent.

Tout le reste est déjà hors du bundle initial :

- la scène WebGL : 3,3 kB, avec son budget de 4 kB ;
- le curseur et le décodage de texte : 1,1 kB, avec leur budget de 2 kB.

Les budgets qui mesurent ce que vit le visiteur sont ceux de Lighthouse, en émulation
mobile et bridage réel (ADR 0013) : TBT ≤ 150 ms, LCP ≤ 2 s. Ils restent inchangés.

## Décision

- Le budget du bundle d'entrée passe de **120 à 125 kB** brotli.
- La règle qui l'accompagne se durcit : tout ce qui n'est pas nécessaire au premier
  affichage est **chargé à la demande**, dans un chunk qui a son propre budget
  size-limit. Le bundle initial ne garde que le rendu et les décisions (« faut-il charger
  la scène ? »).
- Les budgets Lighthouse ne bougent pas : ce sont eux qui arbitrent.

## Alternatives écartées

- **Retirer les lettres animées des titres** : c'est l'effet demandé, pour 0,4 kB.
- **Rendre les lettres côté client seulement** : le HTML pré-rendu perdrait l'animation au
  chargement, et l'hydratation remplacerait le balisage, ce qui coûte plus cher en TBT.
- **Supprimer des icônes pour tenir 120 kB** : on gagnerait quelques centaines d'octets en
  retirant des repères utiles, et le prochain ajout reposerait le problème.

## Conséquences

- 4,6 kB de marge. Un dépassement futur se traite d'abord en chargeant à la demande, puis
  en mesurant ce qui pèse (dépendances, icônes), et seulement ensuite par un nouvel ADR.
- Si le TBT ou le LCP mesurés par Lighthouse se dégradent, ce budget redescend.
