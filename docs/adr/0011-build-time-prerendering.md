# 0011 — Pré-rendre les pages au build, en restant en mode data

- Statut : Accepté — remplace l'[ADR 0010](0010-temporary-lcp-budget-before-prerender.md)
- Date : 2026-09-25

## Contexte

L'ADR 0010 avait relâché le budget LCP à 2,5 s. En rendu purement côté client, 77 % du LCP de
l'accueil était de l'attente du rendu (JavaScript téléchargé puis exécuté avant tout
affichage). Un portfolio vitrine doit aussi être lisible sans JavaScript, indexable, et
donner un aperçu correct quand on partage son lien.

## Décision

- **Pré-rendu au build, en mode data de React Router.** `src/entry-server.tsx` rend une route
  en HTML (`createStaticHandler`, `StaticRouterProvider`, `renderToString`).
  `scripts/prerender.ts` le charge après `vite build` via le module runner SSR de Vite, avec
  un contrat typé partagé (`src/types/prerender.ts`). Il écrit `dist/index.html` et
  `dist/404.html`.
- **Hydratation** : `hydrateRoot` quand la page arrive pré-rendue, `createRoot` en
  développement. Les routes pré-rendues **ne sont pas paresseuses** : un test de garde
  (`scripts/prerender-pages.test.ts`) l'impose.
- **Aucun script d'hydratation inline** (`hydrate={false}`) : aucune route ne charge de
  données, et une CSP stricte reste possible.
- **Vraies 404** : toute URL inconnue reçoit `404.html` avec un statut 404, et non la page
  d'accueil en 200 (« soft 404 »). `vite preview` reproduit ce comportement grâce à un plugin.
  L'hébergeur devra faire de même, **sans règle de réécriture SPA**.
- Le thème reste correct : le HTML est rendu avec « system », puis `useSyncExternalStore`
  bascule sur le choix stocké juste après l'hydratation, sans erreur d'hydratation. Le script
  inline du `<head>` applique déjà les couleurs avant le premier rendu.
- Budget LCP rétabli à **2 000 ms**. Lighthouse n'audite que les pages indexables (`/`) : la
  404 répond 404, et l'audit SEO la pénaliserait à juste titre.

## Alternatives écartées

- **Mode framework de React Router** (`ssr: false`, `prerender`). C'est la voie officielle,
  mais elle impose des `export default` (contraire à nos conventions), un `root.tsx` qui rend
  tout le document, des conventions de fichiers et un plugin qui remplace notre build. Pour
  deux pages, le coût de migration dépasse le bénéfice. À reconsidérer si un rendu serveur
  à la requête devient nécessaire.
- **Garder le rendu client et optimiser le JS.** Des kilo-octets en moins ne suppriment pas
  l'attente de l'exécution. Le gain serait marginal.
- **Dupliquer à la main un squelette HTML dans `index.html`.** Le contenu serait écrit deux
  fois et divergerait, et une URL inconnue afficherait brièvement le mauvais contenu.

## Conséquences

- Mesure locale (mobile, 4G lente, CPU ×4) : LCP à **1 384 ms** au lieu de 2 000–2 110 ms,
  CLS à 0. Le contenu est visible sans JavaScript (test E2E dédié).
- Chaque nouvelle page doit être ajoutée à `scripts/prerender-pages.ts`, sinon elle est
  servie comme une 404. Les tests E2E le détectent.
- Prochaine piste mesurée : le CSS bloque le rendu (environ 540 ms récupérables).
