# 0008 — Rester sur TypeScript 6.0 en mode strict renforcé, sans `any` ni `unknown`

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Tout le code doit être typé, sans aucun `any` ni `unknown`. TypeScript 7.0.2 (tsgo) est
publié, mais `typescript-eslint@8.70` exige `typescript <6.1.0`, et TS 7 n'aura d'API
programmatique qu'à partir de la 7.1.

## Décision

- **TypeScript `~6.0.3`**. Renovate est bloqué sur `<7` jusqu'au support par
  typescript-eslint.
- `strict` + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noImplicitOverride`, `noImplicitReturns`, `noPropertyAccessFromIndexSignature`,
  `verbatimModuleSyntax`, `erasableSyntaxOnly`.
- Interdits par le lint, sans aucune exception de configuration : `any`, `unknown` écrit,
  assertions `as` (sauf `as const`), `!` non nul, commentaires `@ts-*`, `export default`
  (hors fichiers de config d'outils).
- Chaque frontière (réseau, stockage, env, URL) est parsée par Zod 4. Les types en sont
  dérivés.

## Alternatives écartées

- **TS 7 dès maintenant.** On perdrait tout le lint typé, soit la moitié des garde-fous.
- **Autoriser `unknown` dans `src/lib/`.** Plus conventionnel, mais contraire à l'exigence
  explicite. Zod permet de s'en passer : la valeur non typée est passée directement à
  `schema.parse()` sans jamais être nommée.

## Conséquences

Les données sont sûres de bout en bout, mais certaines API tierces trop lâches devront
être enveloppées dans `src/lib/`. Signal de révision : sortie de TS 7.1 et son support
par typescript-eslint.
