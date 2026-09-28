# 0031 — Déployer sur Cloudflare Pages

- Statut : Accepté
- Date : 2026-09-28

## Contexte

L'ADR 0014 a choisi Cloudflare Pages et un fichier HTML par page, et laissé deux questions
à la PR de déploiement : Pages ou Workers avec des fichiers statiques, et comment
publier. William a demandé le déploiement à la fin des quatre tableaux de l'immersion
visuelle, en connectant le serveur MCP de Cloudflare à la session.

Contraintes :

- le compte Cloudflare utilise déjà Pages, avec un projet publié par envoi direct ;
- l'intégration Git de Pages demande d'installer l'application GitHub de Cloudflare sur le
  dépôt, c'est-à-dire un consentement OAuth qui revient à William ;
- aucun jeton d'API n'est enregistré sur la machine, et aucun ne doit être créé à sa
  place ;
- les pages sont servies depuis des adresses absolues pour les robots et les aperçus de
  liens (URL canonique, alternatives par langue, Open Graph), qui n'existaient pas encore
  (ADR 0026).

## Décision

- **Cloudflare Pages**, projet `william-stoops`, en production à
  **https://william-stoops.pages.dev**. Le routage voulu par l'ADR 0014 s'y applique sans
  configuration :
  - `/nom` est servi depuis `nom.html`, et `/nom.html` redirige vers `/nom` ;
  - la `404.html` la plus proche répond aux adresses inconnues de chaque langue, avec un
    vrai statut 404 ;
  - les en-têtes viennent de `_headers`.
- **Adresses et aperçus** : `SITE_ORIGIN` (`src/config/site.ts`) est la seule source de
  l'adresse. Le pré-rendu écrit dans chaque page :
  - son URL canonique ;
  - la même page dans chaque langue, avec la passerelle `/` en `x-default` ;
  - ses balises Open Graph et Twitter (son propre titre, sa description, la carte de
    partage).
  - La passerelle désigne les deux langues aux robots.
  - Le build écrit `sitemap.xml` et un `robots.txt` qui y renvoie.
  - La carte de partage (1200 × 630) est dessinée par `pnpm social-card`, dans le
    navigateur, avec les polices et les jetons du site.
- **En-têtes** (`public/_headers`) :
  - cache d'un an, immuable, pour les fichiers nommés par leur contenu (`/assets`) ou
    versionnés à la main (`/images`) ;
  - HTML en cache revalidé, le défaut de Pages ;
  - HSTS, `nosniff`, une politique de référent stricte, l'interdiction d'être encadré, une
    politique d'ouverture `same-origin`, et une politique de permissions qui coupe caméra,
    micro, géolocalisation, paiement et USB.
- **Premier déploiement, par envoi direct**, comme le fait `wrangler pages deploy` :
  - le serveur MCP de Cloudflare a créé le projet et fourni un jeton d'envoi, valable
    30 minutes et limité aux fichiers de ce projet ;
  - les 116 fichiers de `dist` ont été hachés et envoyés avec ce jeton ;
  - le déploiement a été créé à partir du manifeste (chemin → empreinte) et de
    `_headers` ;
  - aucun jeton de compte n'a été créé ni stocké.
- **Ensuite, par la CI** : `.github/workflows/deploy.yml` publie `main` quand la CI y a
  réussi, en construisant le commit testé.
  - Il reste ignoré tant que le dépôt n'a pas la variable `CLOUDFLARE_ACCOUNT_ID` et le
    secret `CLOUDFLARE_API_TOKEN` (un jeton limité à « Cloudflare Pages : Edit »), que
    William ajoutera.
  - À la main : `pnpm build && pnpm dlx wrangler pages deploy dist --project-name
william-stoops --branch main`.

## Alternatives écartées

- **Intégration Git de Pages** (build chez Cloudflare, un aperçu par branche) : elle
  demande l'application GitHub de Cloudflare, un consentement qui revient à William. Le
  workflow donne le même résultat, et il attend que la CI ait réussi.
- **Workers avec fichiers statiques** : c'est la voie que Cloudflare recommande
  aujourd'hui pour un nouveau site, et elle serait équivalente ici. Pages garde la
  configuration de l'ADR 0014 telle quelle, et le compte l'utilise déjà.
- **Une Content-Security-Policy dès maintenant** : les scripts en ligne (thème, position
  de lecture, passerelle) demandent leurs empreintes, calculées au build. Et `vite preview`
  n'applique pas `_headers` : aucun E2E ne verrait une CSP qui casse la page. Elle aura sa
  PR, avec un test sur les en-têtes servis.
- **La passerelle de langue en périphérie** (une fonction qui lit `Accept-Language`) : il
  faudrait envoyer une fonction avec le déploiement. La passerelle statique fonctionne ;
  ce sera une étape à part (ADR 0026).
- **Créer un jeton d'API pour déployer avec wrangler** : cela ajouterait un identifiant au
  compte de William sans son accord. Le jeton d'envoi du projet suffisait.

## Conséquences

- La production montre le haut de la pile au moment du déploiement : les PR #18 à #35 ne
  sont pas encore mergées, et le déploiement porte le commit de tête (visible dans le
  tableau de bord de Cloudflare Pages). Une fois mergées, le workflow republie `main`.
  Sans le workflow, la commande à la main le fait.
- Vérifié en ligne :
  - les huit pages en 200, et les adresses inconnues en 404 dans leur langue ;
  - `/fr.html` redirige en 308 vers `/fr` ;
  - les en-têtes de sécurité, et le cache immuable des fichiers nommés ;
  - `sitemap.xml`, `robots.txt`, la carte et le CV servis ;
  - dans Chromium, la passerelle, l'hydratation, les scènes WebGL, et aucune erreur.
- À faire : la CSP, la passerelle en périphérie, et un domaine personnalisé.
