# 0014 — Héberger sur Cloudflare Pages, avec un fichier HTML par page

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Les pages légales ajoutent trois URL (`/accessibilite`, `/mentions-legales`,
`/plan-du-site`) au pré-rendu (ADR 0011). Leur nom de fichier dépend de l'hébergeur :
certains servent `/page` depuis `page.html`, d'autres exigent `page/index.html` et
redirigent vers `/page/`. Les mentions légales doivent aussi nommer l'hébergeur.

## Décision

- **Hébergeur : Cloudflare Pages.** Offre gratuite, CDN mondial, en-têtes HTTP déclarables
  dans un fichier `_headers` (CSP, cache), déploiement de chaque branche en aperçu.
- **Un fichier `<nom>.html` par page**, déclaré dans `scripts/prerender-pages.ts`. Cloudflare
  Pages sert `/nom` depuis `nom.html` et redirige `/nom.html` vers `/nom` : les URL restent
  sans extension ni barre oblique finale, comme dans `src/config/paths.ts`.
- **`404.html` à la racine** : sa présence désactive le repli SPA de Cloudflare Pages. Une
  URL inconnue reçoit donc la page introuvable avec un statut 404 (ADR 0011).
- `vite preview` reproduit ce routage (plugin dans `vite.config.ts`) : les tests E2E et
  Lighthouse voient ce que servira l'hébergeur.

## Alternatives écartées

- **`<nom>/index.html`** — fonctionne partout, mais Cloudflare Pages redirige alors `/nom`
  vers `/nom/`, soit une redirection de plus et des URL différentes de celles du routeur.
- **GitHub Pages** — pas d'en-têtes HTTP personnalisés, donc pas de CSP par en-tête.
- **Netlify, Vercel** — équivalents pour ce besoin ; le choix de Cloudflare Pages est celui
  du propriétaire du site.

## Conséquences

- Les mentions légales citent Cloudflare, Inc. (adresse et téléphone tirés de son rapport
  annuel 10-K), dans `HOSTING_PROVIDER` (`src/config/site.ts`).
- Une nouvelle page = une route non paresseuse + une entrée dans `PRERENDERED_PAGES`. Sans
  l'entrée, elle répond 404 : les tests E2E de pré-rendu le détectent.
- Cloudflare oriente désormais les nouveaux sites statiques vers Workers (assets statiques,
  `not_found_handling: "404-page"`). Le comportement voulu y est le même ; la PR de
  déploiement tranchera entre les deux.
