# 0002 — Combiner Oxlint et ESLint, formater avec Prettier, traquer le code mort avec Knip

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Les exigences sont les suivantes : conventions de nommage imposées (kebab-case pour les
fichiers, PascalCase pour les composants, SCREAMING_SNAKE_CASE pour les constantes,
camelCase pour les variables), interdiction de `any` et de `unknown`, frontières entre
features, règles du React Compiler, accessibilité, aucun code mort. Au 2026-09-25, Oxlint
1.85 est stable, y compris en type-aware via tsgolint, mais ne propose ni
`naming-convention`, ni `no-restricted-syntax`, ni `boundaries`, ni les règles du
compilateur React. `eslint-plugin-jsx-a11y` ne déclare pas ESLint 10 dans ses peerDeps.

## Décision

- **Oxlint** en premier passage (rapide) : correction, `jsx-a11y` natif, `react`,
  `unicorn/filename-case`, `oxc/no-barrel-file`, `import/no-cycle`, `no-explicit-any`.
- **ESLint 10 + typescript-eslint `strictTypeChecked`** : `naming-convention`,
  `no-restricted-syntax` (`unknown`, assertions, `export default`), `boundaries`,
  `react-hooks` 7, `check-file` pour les dossiers. `eslint-plugin-oxlint` placé en dernier
  désactive les doublons.
- **Prettier 3.9** + `prettier-plugin-tailwindcss` pour le formatage.
- **Knip 6** pour les fichiers, exports, types et dépendances inutilisés, en mode normal et
  en mode `--production --strict`, en pre-push et en CI.

## Alternatives écartées

- **Oxlint seul.** Il manque des règles indispensables à nos conventions.
- **ESLint seul.** Il est plus lent et sait moins bien faire les règles a11y en ESLint 10.
- **Biome.** Son lint typé est approximatif, et il serait redondant avec Oxlint.
- **oxfmt.** Encore en bêta. Migration possible à sa 1.0 (`oxfmt --migrate prettier`).
- **ts-prune ou unimported à la place de Knip.** Ils ne sont plus maintenus, ou couvrent un
  périmètre plus étroit.

## Conséquences

- Deux configurations de lint à maintenir, le prix de règles impossibles à obtenir
  autrement.
- Signal de révision : quand Oxlint couvrira `naming-convention`, les frontières et les
  règles du compilateur, et que TS 7.1 sera supporté, on passera à Oxlint seul.

## Note d'application (2026-09-25)

L'interdiction des barrel files est passée d'Oxlint (`oxc/no-barrel-file`, inopérant sur les
petits barrels) à ESLint (`no-restricted-syntax`). Les 36 règles `jsx-a11y` d'Oxlint sont
activées explicitement, et `import/no-default-export` est porté par Oxlint.
