# Portfolio — William Stoops

Portfolio SPA de William Stoops, Software Engineer & AI Engineer. Il sera présenté au **CTO
d'Hymaïa** (cabinet de conseil et de formation Data & IA, Paris) pour un entretien technique.

**Le dépôt fait partie du dossier autant que le site.** Le CTO lira l'architecture, les
tests, la CI, les ADR et l'historique git. Chaque PR doit pouvoir être montrée telle quelle.

- Contenu : [docs/content/cv-source.md](docs/content/cv-source.md), **seule source de
  vérité**. On n'affiche rien qui ne figure pas dans le CV sans l'accord explicite de William.
- Décisions : [docs/adr/](docs/adr/)
- Maquette de référence : thème sombre bleu nuit, accent orange corail, hero avec portrait
  dans un anneau, bandeau de technos, « À propos » avec axes et chiffres clés, projets.
  S'en inspirer, **ne pas la copier**. Zéro esthétique générique « AI slop ».

## Invariants — non négociables

Aucun contournement sans ADR.

### 1. Architecture `features/`, imports à sens unique

`app → features → partagé` (`components`, `hooks`, `lib`, `config`, `types`, `utils`,
`styles`, `testing`). Une feature n'importe **jamais** une autre feature : la composition
se fait dans `app/`. Le code partagé n'importe jamais `features/` ni `app/`. Pas de barrel
files (`index.ts` de ré-export). Règles imposées par `eslint-plugin-boundaries` et
l'interdiction des ré-exports (`no-restricted-syntax`). Détails : skill `feature-architecture`, [ADR 0001](docs/adr/0001-architecture-features.md).

### 2. Les composants dessinent, les hooks décident

Composants UI génériques dans `src/components/ui/`, sans connaissance métier. Composants
métier dans `src/features/<f>/components/` : **fonctions pures de leurs props**, pas
d'effet, pas de fetch, pas de calcul. La logique (état, dérivations, effets, accès aux
données) vit dans un hook `use-*.ts` de la feature, testé seul. Skill `react-components`.

### 3. Typage total, `any` et `unknown` interdits

Aucun `any`, aucun `unknown` écrit, aucun `@ts-ignore` / `@ts-expect-error`, aucun `as`
pour fabriquer un type (seul `as const` est permis), aucun `!` non justifié. Toute
frontière externe (réseau, `localStorage`, `import.meta.env`, URL) est parsée par un schéma
**Zod**. Les types en dérivent (`z.infer`). Skill `typescript-standards`.

### 4. Conventions de nommage

| Élément                               | Convention                 | Exemple                             |
| ------------------------------------- | -------------------------- | ----------------------------------- |
| Fichiers et dossiers                  | kebab-case                 | `hero-section.tsx`, `use-theme.ts`  |
| Composants, types, interfaces         | PascalCase                 | `HeroSection`, `ExperienceItem`     |
| Constantes de module (valeurs figées) | SCREAMING_SNAKE_CASE       | `NAV_ITEMS`, `CV_FILE_URL`          |
| Variables, fonctions, hooks, props    | camelCase                  | `activeSection`, `useActiveSection` |
| Schémas Zod                           | camelCase suffixé `Schema` | `contactFormSchema`                 |

Exports nommés uniquement, jamais de `export default` (sauf les fichiers de config
d'outils qui l'exigent). Tout est imposé par le lint.

### 5. Aucun code mort

Le dépôt ne contient que du code nécessaire : pas de fichier orphelin, pas d'export ni de
type inutilisé, pas de dépendance superflue ou non déclarée. **Knip** l'impose en pre-push
et en CI. On ne l'apaise pas avec un `ignore` : on supprime le code. Une exception doit
être justifiée par un commentaire dans `knip.config.ts`.

### 6. TDD

On écrit un test rouge, puis le code minimal qui le fait passer, puis on refactore. Aucun
code de production sans test qui l'exige. Chaque PR de feature livre ses tests unitaires,
de composants, E2E et d'accessibilité. Skill `tdd-workflow`.

### 7. Accessibilité WCAG 2.2 AA + RGAA 4.1.2

L'accessibilité est un critère d'acceptation testé, pas une finition. Sur le fond
`#1B1F2A`, **aucun orange ne peut à la fois servir de texte et porter du texte blanc** :
le bouton primaire est donc orange clair avec un texte foncé. Tous les jetons de couleur
sont validés. On n'en invente pas d'autres. Skills `accessibility` et `design-system`.

### 8. Responsive pensé, pas rattrapé

Mobile-first, de 320 px à 2560 px, sans défilement horizontal à aucune largeur. Chaque
composant est conçu pour **son conteneur** (container queries) et chaque page pour **le
viewport** (breakpoints). La typographie et les espacements sont fluides (`clamp()` dans
les jetons). On adapte l'interaction à l'appareil (`pointer`, `hover`), et non à une
largeur supposée. Les images sont servies à la bonne taille (`srcset` / `sizes`). Les
unités `dvh` / `svh` et les safe areas sont respectées. Chaque feature est testée en E2E
sur 5 profils d'appareils, avec régression visuelle aux largeurs clés. Skill
`responsive-design`, [ADR 0006](docs/adr/0006-responsive-strategy.md).

### 9. Performance mesurée

Pages pré-rendues au build (ADR 0011) : le contenu s'affiche sans attendre le JavaScript.
React Compiler actif : pas de `useMemo`, `useCallback` ni `memo` par défaut. Budgets de bundle et Lighthouse imposés en CI. Une optimisation sans
mesure n'est pas une optimisation. Skill `react-performance`.

## Stack — versions vérifiées le 2026-09-25

| Couche      | Choix                                                       | Version           |
| ----------- | ----------------------------------------------------------- | ----------------- |
| Runtime     | Node (CI sur 24 LTS, local ≥ 22.22)                         | 24                |
| Paquets     | pnpm                                                        | 12                |
| Langage     | TypeScript                                                  | **~6.0.3**        |
| UI          | React + React Compiler                                      | 19.3 / 1.0        |
| Bundler     | Vite (Rolldown) + @vitejs/plugin-react                      | 8.3 / 6.1         |
| Routing     | React Router, **mode data**                                 | 8.4               |
| Styles      | Tailwind CSS (`@theme` en CSS) + shadcn (Base UI)           | 4.3 / CLI 4.21    |
| Formulaires | React Hook Form + @hookform/resolvers + Zod                 | 7.88 / 5.9 / 4.6  |
| Validation  | `zod/mini` dans le code livré (voir `typescript-standards`) | 4.6               |
| Icônes      | lucide-react (`aria-hidden` toujours explicite)             | 1.48              |
| État        | Local / URL / contexte — **pas de Redux par défaut**        | voir ADR 0004     |
| Animation   | CSS natif (scroll-driven, View Transitions), sans lib       | ADR 0015          |
| Tests       | Vitest (projets `unit` + `browser`) + Playwright + axe      | 5.0 / 1.63 / 4.13 |
| Lint        | Oxlint + ESLint + typescript-eslint (strictTypeChecked)     | 1.85 / 10 / 8.70  |
| Format      | Prettier + prettier-plugin-tailwindcss                      | 3.9 / 0.8         |
| Code mort   | Knip (fichiers, exports, dépendances inutilisés)            | 6.38              |
| Git         | Husky + lint-staged + commitlint (conventional)             | 9 / 17 / 21       |

Les plafonds suivants sont délibérés :

- **TypeScript reste en 6.0.x, pas en 7.0.2.** `typescript-eslint@8.70` exige
  `typescript <6.1.0`, et TS 7 n'aura d'API programmatique qu'à partir de la 7.1. Monter
  maintenant supprimerait tout le lint typé. Renovate est bloqué sur `<7`.
- **Babel reste en 7.29**, parce que `babel-plugin-react-compiler` dépend de `@babel/types ^7`.
- **Pas de `eslint-plugin-jsx-a11y`**, dont les peerDeps s'arrêtent à ESLint 9. On utilise
  le plugin `jsx-a11y` natif d'Oxlint.

Avant d'utiliser une API de bibliothèque, consulter la doc à jour via **Context7**. React
Router 8, shadcn sur Base UI, Vitest 5 et pnpm 12 sont tous sortis en 2026 : **ne pas
coder de mémoire**.

## Arborescence cible

```
src/
  app/                 # composition : routes.tsx (table des routes), routes/* (pages, layout, erreur)
  components/
    ui/                # primitives du design system (shadcn adapté), sans métier
    layout/            # skip-link, site-header, site-footer, page-shell
  features/
    <feature>/
      components/      # rendu pur
      hooks/           # logique, testée seule
      data/            # contenu typé (issu du CV), validé par schéma
      schemas/         # schémas Zod
      types/           # types dérivés
      utils/           # fonctions pures
  hooks/               # hooks génériques (use-media-query, use-page-heading…)
  lib/                 # cn(), adaptateurs externes
  config/              # env.ts (Zod), paths.ts, site.ts
  styles/              # globals.css (@theme), base.css
  testing/             # setup, helpers axe, render utils
  main.tsx             # hydrate le HTML pré-rendu (createRoot en dev)
  entry-server.tsx     # rend une route en HTML au build
scripts/               # pré-rendu au build (prerender.ts, prerender-pages.ts)
e2e/                   # Playwright
docs/adr/  docs/content/  docs/a11y/
```

Tests à côté du code : `hero-section.test.tsx`, `use-theme.test.ts`.

## Commandes

```bash
pnpm dev            # serveur de dev
pnpm lint           # oxlint puis eslint, 0 warning toléré
pnpm typecheck      # tsc -b
pnpm test           # vitest (unit + browser)
pnpm test:coverage  # avec seuils
pnpm test:e2e       # playwright (build + preview)
pnpm build          # build de prod + pré-rendu HTML (dist/index.html, dist/404.html)
pnpm knip           # code mort : fichiers, exports, types, dépendances inutilisés
pnpm knip:production # idem sur le seul code livré, dépendances de prod strictes
pnpm size           # budget de bundle (size-limit)
pnpm images         # régénère public/images depuis docs/content/images (puis commiter)
pnpm verify         # tout ce qui précède, identique à la CI
```

## Discipline de travail

- **Branches** `william/<type>/<sujet>`, une PR détaillée par changement, jamais de commit
  direct sur `main`. Skill `git-workflow`.
- **Conventional Commits** avec scope obligatoire, vérifiés par commitlint.
- **Aucune attribution IA** (`Co-Authored-By`, « Generated with ») dans les commits ni dans
  les PR. `.claude/settings.json` la désactive, et William l'exige.
- Chaque développement se termine par des commits atomiques, un push de la branche et une
  PR détaillée (demande permanente de William). **On ne merge jamais** : la relecture et
  le merge appartiennent à William. Aucun push sur `main`.
- **Tout le code est en anglais** (identifiants, commentaires, noms de tests). La
  documentation (CLAUDE.md, ADR, PR) et les textes affichés sont en **français**.
- Les commentaires expliquent **pourquoi**, jamais **quoi**.
- Toute décision structurante donne un ADR dans `docs/adr/`.
- Définition de « terminé » : skill `quality-gates`.

## Skills du projet

| Skill                  | Charger avant de…                                                      |
| ---------------------- | ---------------------------------------------------------------------- |
| `feature-architecture` | créer un fichier, une feature, déplacer du code, ajouter un import     |
| `react-components`     | écrire ou modifier un composant ou un hook                             |
| `typescript-standards` | écrire du TypeScript, un type, un schéma Zod                           |
| `design-system`        | toucher aux couleurs, typo, espacements, composants `ui/`, animations  |
| `accessibility`        | écrire du markup, un composant interactif, une route, un formulaire    |
| `responsive-design`    | poser une mise en page, une grille, une image, un comportement tactile |
| `tdd-workflow`         | écrire la moindre ligne de production (le test vient d'abord)          |
| `react-performance`    | ajouter une route, une image, une police, une dépendance, une anim     |
| `state-and-forms`      | ajouter de l'état partagé, un formulaire, une donnée persistée         |
| `content-data`         | afficher un contenu issu du CV                                         |
| `quality-gates`        | configurer lint, tests, hooks, CI ; avant d'ouvrir une PR              |
| `git-workflow`         | créer une branche, committer, ouvrir une PR                            |

## Feuille de route

| #   | Branche                                        | Contenu                                                                                                             |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | `william/docs/agent-context`                   | CLAUDE.md, skills, ADR, source de contenu (cette PR)                                                                |
| 2   | `william/chore/project-scaffold`               | Vite, TS strict, Tailwind, lint, format, Husky, commitlint, Vitest, Playwright, CI                                  |
| 3   | `william/feat/design-system`                   | Palette fermée testée, typographie fluide, polices, styles de base (primitives `ui/` livrées avec leur feature)     |
| 4   | `william/feat/app-shell`                       | Router, layout, skip link, header, footer, thème, focus de route, 404                                               |
| 5   | `william/perf/prerender`                       | Pré-rendu HTML des routes au build, budget LCP ramené à 2 s (remplace l'ADR 0010)                                   |
| 6   | `william/feat/hero`                            | Hero, CTA contact et CV téléchargeable, bandeau de technos                                                          |
| 7   | `william/feat/about`                           | Profil, trois axes, chiffres clés                                                                                   |
| 8   | `william/feat/experience`                      | ProRealTime, INTM, Strattt / GDS Élec en frise, mot pour mot. Pages détaillées reportées : le CV n'a pas la matière |
| 9   | `william/feat/projects`                        | STAXX (vidéo du pitch), travaux IA                                                                                  |
| 10  | `william/feat/skills-education`                | Compétences, formation                                                                                              |
| 11  | `william/feat/contact`                         | Coordonnées + formulaire RHF / Zod qui prépare un `mailto:` (sans serveur)                                          |
| 12  | `william/feat/legal-pages`                     | Déclaration d'accessibilité, mentions légales, plan du site                                                         |
| 13  | `william/feat/video-lightbox`                  | Vidéo du pitch en plein écran, jetons de couleur résolus par élément                                                |
| 14  | `william/feat/motion-design`                   | Refonte animée et ludique, tout en CSS natif (ADR 0015)                                                             |
| 15  | `william/feat/hero-scene`                      | Surface de volatilité WebGL2 dans le hero, typographie cinétique (ADR 0016)                                         |
| 16  | `william/feat/case-study-and-finale`           | STAXX en étude de cas, périodes collantes, chapitres collants, final sur la surface, pied de page intégré           |
| 17  | `william/feat/about-story`                     | À propos : profil écrit à l'encre au défilement, axes sur filets, registre des chiffres clés                        |
| 18  | `william/feat/summit-photo`                    | Victoire à l'Epitech Summit et passage sur NRJ Lille dans l'étude STAXX                                             |
| 19  | `william/feat/korea`                           | Corée du Sud : voyage épinglé, drapeau assemblé, photos entières (ADR 0019, 0020)                                   |
| 20  | `william/feat/flight-log`                      | La page en parcours : une escale par année d'Epitech, ligne de vol, vol retour (ADR 0021)                           |
| 21  | `william/feat/one-flight`                      | Toute la page en un seul vol : rail continu, repères, en-têtes d'escale partout (ADR 0022)                          |
| 22  | `william/feat/site-harmony`                    | La ligne de vol réservée au parcours, chapitres hors du temps en rangées, hiérarchie (ADR 0023)                     |
| 23  | `william/feat/pitch-stage`                     | Vidéo du pitch sur sa première image, ouverte depuis l'affiche, récit STAXX dans l'ordre (ADR 0024)                 |
| 24  | `william/perf/lighthouse-budget` + déploiement | Budgets, Open Graph, déploiement sur Cloudflare Pages (ADR 0014)                                                    |

Questions encore ouvertes : un traitement serveur du formulaire de contact (service
tiers ou fonction serverless) au-delà du `mailto:`, une éventuelle version anglaise.
