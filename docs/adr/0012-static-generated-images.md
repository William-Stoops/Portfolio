# 0012 — Générer les images en fichiers statiques, hors du bundler

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Le hero affiche un portrait, qui est l'image du LCP sur la plupart des écrans. Il doit être
servi en AVIF, WebP et JPEG, en plusieurs largeurs. Les skills prévoyaient `vite-imagetools`,
qui transforme les images à l'import. Mais le pré-rendu (ADR 0011) charge l'application à
travers le serveur de développement de Vite :

- en développement, `vite-imagetools` produit des URL `/@imagetools/…` ;
- au build, il produit des URL hachées `/assets/…`.

Le HTML pré-rendu référencerait donc des images inexistantes en production, et l'hydratation
ne correspondrait pas.

## Décision

- `scripts/generate-images.ts` (`pnpm images`, avec `sharp`) génère chaque variante dans
  `public/images/` selon la convention `<basePath>-<largeur>.<format>`. Les fichiers générés
  sont **commités**. La génération est déterministe (vérifié par empreinte).
- La même définition typée (`ResponsivePicture`, par exemple `PORTRAIT_PICTURE`) est lue par
  le script et par le composant `ResponsiveImage`. Les URL sont donc identiques dans le HTML
  pré-rendu et côté client.
- Le cache est invalidé par une **version dans le chemin** (`-v1`), à incrémenter quand la
  source change.
- Un test E2E vérifie que chaque URL déclarée par la page répond 200 avec le bon type MIME.

## Alternatives écartées

- **`vite-imagetools`** : URL divergentes entre le pré-rendu et le build, pour la raison
  exposée plus haut.
- **Pré-rendre depuis un build SSR** (`vite build --ssr`), où les URL seraient cohérentes. Il
  faudrait alors importer un bundle JavaScript non typé depuis le script, sans `any`
  possible, et ajouter un second build.
- **Une seule image JPEG** : 16 Ko en 520 px, contre 3,4 Ko en AVIF 256 px sur mobile.

## Conséquences

- Le build ne dépend pas de `sharp`, et la CI ne régénère rien.
- Les sources d'images vivent dans `docs/content/images/`, à côté de la source du CV.
- La vérification que les fichiers générés sont à jour reste manuelle : les binaires de
  libvips pourraient différer d'une plateforme à l'autre. Le test E2E garantit au moins que
  tout ce qui est déclaré existe.
