# 0020 — Pré-rendre avec `prerender` et charger la section Corée à la demande

- Statut : Accepté
- Date : 2026-09-26

## Contexte

La section « Corée du Sud » (vol animé, drapeau, photos) ajoute environ 4 kB brotli au JS de
la page. Le budget du JS initial (125 kB, ADR 0017) passait alors à 126,9 kB. Relever le
plafond une seconde fois reviendrait à suivre le code au lieu de le contraindre.

La section est en bas de page : rien n'oblige à livrer son code avec le reste. Mais le pré-rendu
(ADR 0011) utilisait `renderToString`, qui n'attend pas un composant chargé à la demande
(`React.lazy`) : la section aurait disparu du HTML pré-rendu, donc de la page sans JavaScript
et des moteurs de recherche.

## Décision

- La section est importée avec `React.lazy` dans la page d'accueil, dans sa propre frontière
  `Suspense` : son code devient un chunk (`korea-section-*.js`), avec son budget (6 kB).
- Le pré-rendu passe de `renderToString` à `prerender` (`react-dom/static`), qui **attend** les
  composants chargés à la demande : le HTML contient la section complète.
- `progressiveChunkSize: Infinity` : sans limite de taille, chaque frontière reste en ligne dans
  le HTML. Par défaut, React sort les grosses frontières du flux et les remet en place avec
  des scripts en ligne (`$RC`) : leur contenu serait caché sans JavaScript, et une CSP stricte
  les bloquerait.
- À l'hydratation, React garde le HTML pré-rendu de la section tant que son chunk n'est pas
  arrivé, puis l'hydrate (hydratation sélective).

## Alternatives écartées

- **Relever le budget à 130 kB** : repousse le problème, sans rien gagner pour l'utilisateur.
- **Rendre la section statique, sans hydratation** : plus d'animation liée au défilement
  pilotée par le composant, et React ne sait pas hydrater une partie seulement de la page.
- **`renderToReadableStream` + `allReady`** : même résultat que `prerender`, avec une API de
  flux dont le pré-rendu statique n'a pas besoin.

## Conséquences

- JS initial : 123,6 kB ; chunk de la section : 4,3 kB, chargé à l'hydratation.
- Un E2E vérifie que la section est dans le HTML pré-rendu ; l'inspection du build confirme
  l'absence de `<template>` et de scripts `$RC`.
- D'autres sections de bas de page pourront suivre le même chemin si le budget l'exige.
