# 0006 — Responsive : mobile-first, container queries pour les composants, tokens fluides

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Le site doit être entièrement responsive, de 320 px à 2560 px, en portrait comme en
paysage, au tactile comme à la souris, et zoomable jusqu'à 400 %. Il doit s'appuyer sur
une réflexion de fond plutôt que sur des corrections faites après coup.

## Décision

- Design mobile-first. Les breakpoints Tailwind sont en rem, ajoutés là où le contenu casse.
- **Deux niveaux** : les breakpoints de viewport sont réservés aux coquilles de page et aux
  sections. Les composants s'adaptent à leur conteneur (`@container`).
- Typographie et espacements fluides avec `clamp()`, qui mélange toujours rem et vw pour
  respecter le zoom.
- Grilles intrinsèques (`auto-fill` / `minmax(min(100%, …))`) de préférence.
- Ordre du DOM = ordre visuel. Aucun contenu dupliqué d'un breakpoint à l'autre.
- `svh` pour les hauteurs pleines, safe areas, variante `short:` pour les écrans bas.
- Adaptation à l'entrée (`pointer-coarse`, `hover`), jamais à une largeur supposée.
- Images servies via `srcset` / `sizes` fidèles à la mise en page, avec dimensions
  explicites.
- Tests :
  - 5 profils d'appareils Playwright ;
  - balayage de 12 largeurs sans défilement horizontal ;
  - paysage, impression ;
  - captures à 375, 768, 1280 et 1920 px.

## Alternatives écartées

- **Desktop-first avec `max-*`.** Il produit plus de surcharges CSS et dégrade le mobile,
  qui est la cible prioritaire des liens partagés.
- **Adaptation en JavaScript** (`window.innerWidth`). Elle provoque des re-rendus, des
  incohérences avec le CSS et un flash au chargement.
- **Composants pilotés par breakpoints de viewport.** Un composant ne serait alors plus
  réutilisable dans un autre emplacement.

## Conséquences

Les composants sont réutilisables quel que soit leur emplacement, et le rendu est testé à
chaque PR. La régression visuelle exige des captures générées dans l'image Docker
Playwright pour être déterministes.
