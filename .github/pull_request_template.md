## Contexte

<!-- Pourquoi ce changement existe. Lien vers l'issue / l'ADR concerné. -->

## Changements

<!-- Puces concrètes, regroupées par zone (feature, ui, config…). -->

-

## Décisions techniques

<!-- Choix non évidents, alternatives écartées, dépendances ajoutées (taille, maintenance, licence). -->

## Tests

- Unitaires :
- Composants (Vitest browser) :
- E2E Playwright :
- Accessibilité : axe (auto) + vérifications manuelles (clavier, lecteur d'écran)
- Responsive : balayage de largeurs, profils mobile / tablette / desktop

## Captures

<!-- Mobile (375) et desktop (1280), avant / après si visuel. -->

## Checklist

- [ ] Tests écrits avant le code (TDD), tous verts
- [ ] `pnpm verify` vert en local, CI verte
- [ ] Aucun `any`, `unknown`, `as`, `!`, `eslint-disable`, `@ts-*`
- [ ] Conventions de nommage respectées (fichiers kebab-case, composants PascalCase, constantes SCREAMING_SNAKE_CASE, variables camelCase)
- [ ] Knip propre (aucun code, export ou dépendance inutilisé)
- [ ] Budgets de performance respectés
- [ ] Critères WCAG 2.2 AA concernés vérifiés, dans les deux thèmes
- [ ] Rendu vérifié de 320 px à 1920 px, sans défilement horizontal
- [ ] CLAUDE.md / skills / ADR mis à jour si une convention change
