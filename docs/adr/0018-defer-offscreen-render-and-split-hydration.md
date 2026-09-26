# 0018 — Différer le rendu hors écran et découper l'hydratation

- Statut : Accepté
- Date : 2026-09-26

## Contexte

Après la refonte animée (#14) et la scène WebGL (#15), Lighthouse CI échouait sur `main` :
Total Blocking Time à 192 puis 168 ms, pour un budget de 150 ms (mobile, bridage réel).
Les PR passaient de justesse, et le bruit de mesure faisait basculer le résultat.

Une trace Chrome (mobile, CPU bridé ×10, sans GPU) comparée à la version d'avant la
refonte montre que le JavaScript n'est pas en cause :

- l'évaluation du module est inchangée (~187 ms) ;
- le premier rendu du document passe de 145 à 241 ms (style 54 → 95, mise en page
  58 → 79, peinture 11 → 35), puis un second rendu complet de 116 ms apparaît ;
- l'hydratation React, d'un seul tenant, passe de 88 à 101 ms.

Le navigateur calcule le style, la mise en page et la peinture de toute la page (animations
liées au défilement, bande cinétique, sections), alors que le visiteur ne voit que le hero.

## Décision

- **Rendu différé** (`defer-render`, `content-visibility: auto`) :
  - Il s'applique aux sections de l'accueil et à la bande cinétique : au chargement, seul le
    hero est rendu.
  - Les blocs restent dans l'arbre d'accessibilité et dans la recherche de la page.
- **Rendu au premier mouvement** (`useProgressiveRender`) :
  - Rien n'est planifié pendant les temps morts : sur un téléphone lent (la machine de CI),
    chaque bloc rendu ainsi formait une tâche longue de 55 à 130 ms, comptée dans le TBT.
    Un bloc se rend donc à l'approche de l'écran, comme le prévoit `content-visibility`.
  - Dès que le visiteur bouge, tout est rendu d'un coup, avant le mouvement
    (`data-render-all` sur la racine) : premier défilement, lien d'ancre pressé, touche du
    clavier, changement d'ancre.
  - Une page ouverte sur une ancre rend tout d'emblée (script inline d'`index.html`).
  - Ainsi, aucun saut n'est calculé sur les tailles provisoires, et rien ne bouge sous le
    pointeur.
- **Hydratation découpée** : chaque section sous le hero est une frontière `<Suspense>`.
  Rien n'y suspend : React hydrate chaque section comme une unité de travail séparée et rend
  la main au navigateur entre deux (hydratation sélective).

## Alternatives écartées

- **Rendu différé seul, avec tailles provisoires** : les ancres dérivaient sous WebKit, et
  une fois sous Chrome. Un clic en fin de page pouvait aussi rater sa cible pendant que les
  sections se rendaient.
- **Réserver le rendu différé aux navigateurs dotés de scroll anchoring** : WebKit
  l'annonce (`overflow-anchor`), mais les ancres dérivaient quand même.
- **Découper l'hydratation seule** : ~205 ms contre ~235 ms (CPU ×10), trop peu.
- **Relever le budget TBT** : il mesure ce que le visiteur ressent. C'est lui qui arbitre.

## Conséquences

- TBT médian mesuré (mobile, CPU ×10, sans GPU, 7 passages) : 212–259 ms → **156 ms**,
  sous la version d'avant la refonte (169 ms). La marge revient en CI.
- Toute nouvelle section de l'accueil passe par `PageSection` (donc `defer-render`) et reçoit
  sa frontière `<Suspense>` dans `HomeRoute`.
- Le script inline d'`index.html` a changé : une future CSP devra autoriser sa nouvelle
  empreinte.
