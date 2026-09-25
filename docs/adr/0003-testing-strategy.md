# 0003 — Tester en TDD : Vitest (Node + browser mode) et Playwright

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Le développement se fait en TDD. On veut des tests unitaires, des tests fonctionnels (de
composants) et des tests E2E. L'accessibilité et le responsive doivent être vérifiés
automatiquement. Or jsdom n'a pas de moteur de mise en page : container queries, focus
visible, `matchMedia` et contrastes n'y sont pas testables.

## Décision

- **Vitest 5**, deux projets :
  - `unit` en Node : fonctions pures, schémas, données du CV, contrastes des jetons ;
  - `browser` dans un vrai Chromium (provider Playwright, `vitest-browser-react`) : hooks
    et composants, avec axe.
- **Playwright 1.63**, cinq profils d'appareils :
  - parcours utilisateur ;
  - a11y avec `@axe-core/playwright`, tags incluant `wcag22aa` ;
  - clavier, responsive (balayage de largeurs, paysage, impression) ;
  - régression visuelle `@visual` dans l'image Docker officielle.
- Couverture v8 avec seuils : 90 % pour les lignes, fonctions et instructions, 85 % pour
  les branches.

## Alternatives écartées

- **Testing Library sur jsdom pour les composants.** Plus rapide, mais ment sur tout ce qui
  dépend du rendu, précisément ce que ce projet veut prouver.
- **happy-dom.** Même limite, avec une API DOM moins complète.
- **Cypress.** Moins de navigateurs (pas de WebKit), et Playwright est déjà requis par
  Vitest browser mode.

## Conséquences

- Les tests de composants sont un peu plus lents que sous jsdom, et la CI installe
  Chromium.
- Un seul modèle mental de sélecteurs, orientés rôles, du composant à l'E2E.
