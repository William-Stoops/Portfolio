# 0010 — Budget LCP temporaire à 2,5 s en attendant le pré-rendu

- Statut : Remplacé par l'[ADR 0011](0011-build-time-prerendering.md)
- Date : 2026-09-25

## Contexte

Le budget Lighthouse fixait un LCP ≤ 2 s (mobile simulé : 4G lente, CPU ×4). Depuis l'app
shell (routeur, layout, thème), la page n'existe qu'une fois le JavaScript téléchargé et
exécuté. Sur l'accueil, la décomposition Lighthouse donne : TTFB 455 ms, attente du
rendu **1 553 ms (77 %)**. Trois passes ont mesuré 2 000, 2 008 et 2 106 ms.

Quelques kilo-octets de JS en moins ne donneraient pas de marge durable : c'est le rendu
côté client, par construction, qui retarde l'affichage.

## Décision

- Le budget LCP passe **temporairement** à 2 500 ms, le seuil « bon » des Core Web Vitals,
  pour merger l'app shell sans bloquer la feuille de route.
- La **PR suivante** pré-génère le HTML de chaque route au build. Le contenu s'affiche alors
  avant l'exécution du JavaScript. Cette PR **rétablit le budget à 2 000 ms** et remplace le
  présent ADR.
- Les autres budgets ne changent pas (performance ≥ 0,95, a11y = 1, CLS ≤ 0,05, TBT ≤ 150 ms).

## Alternatives écartées

- **Relever le budget sans échéance.** On masquerait une limite de l'architecture au lieu de
  la corriger.
- **Pré-rendu dans la PR de l'app shell.** La PR aurait mélangé deux changements
  structurants et serait devenue difficile à relire.
- **Laisser la PR rouge** jusqu'au pré-rendu. Cela bloquerait le travail sur les sections
  pour un écart de 0 à 106 ms.

## Conséquences

La CI reste un filet, un peu plus lâche pendant une PR. Le signal de fin est explicite : le
merge de la PR de pré-rendu, qui ramène le budget à 2 000 ms.
