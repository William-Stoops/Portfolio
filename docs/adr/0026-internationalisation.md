# 0026 — Proposer le site en français et en anglais, la langue dans l'URL

- Statut : Accepté
- Date : 2026-09-26

## Contexte

William veut un site en français et en anglais. La langue par défaut doit être celle de
l'ordinateur du visiteur, et elle doit pouvoir être changée. Les contraintes du dépôt
pèsent sur le choix :

- les pages sont pré-rendues au build (ADR 0011, 0020) et le contenu s'affiche avant le
  JavaScript ;
- le typage est total, sans `any` ni `unknown`, et toute frontière est parsée par Zod ;
- le budget du JS initial est de 125 kB, avec 118,85 kB déjà consommés ;
- le contenu n'est pas un catalogue de phrases : ce sont des données typées (expériences,
  chiffres, images, emphases), rangées par feature.

## Décision

- **La langue est dans l'URL, avec des slugs traduits** : `/fr`, `/fr/mentions-legales`,
  `/en`, `/en/legal-notice`. Les ancres des sections sont traduites aussi. Une table typée
  (`src/config/paths.ts`) fait correspondre chaque page et chaque section dans les deux
  langues.
- **`/` est une passerelle (x-default)** : une page statique d'environ 1 kB, sans bundle.
  Avant l'affichage, elle choisit la langue : le choix enregistré par le sélecteur, sinon
  la première langue du navigateur prise en charge, sinon le français. Puis elle remplace
  l'URL. Sans JavaScript, un `meta refresh` mène à `/fr` et des liens proposent les deux
  langues. Les URL `/fr/…` et `/en/…` ne redirigent jamais.
- **Un document, une langue.** La langue est lue une fois dans l'URL, au démarrage. Changer
  de langue charge la page pré-rendue de l'autre langue, à l'endroit exact où le lecteur
  était (le même bloc de texte, à la même hauteur d'écran, avant le premier affichage) ;
  une View Transition entre documents en fait un fondu.
- **Pas de bibliothèque d'i18n**, deux mécanismes typés :
  - le **texte d'interface** des composants partagés est dans des dictionnaires
    `Localized<T>` placés à côté du composant, les deux langues livrées (quelques centaines
    d'octets) ;
  - le **contenu** est dans des modules par langue (`*.fr.ts`, `*.en.ts`), assemblés en un
    objet `SiteContent` par langue. Chaque langue est un chunk chargé avant l'hydratation
    et préchargé par le HTML (`modulepreload`). Un champ anglais manquant est une erreur de
    compilation.
- Formatage par `Intl` avec une locale explicite (`fr-FR`, `en-US`) ; typographie propre à
  chaque langue dans les données.
- La **règle de dépendances** accueille un module partagé `src/i18n/` (locales,
  négociation, contexte).

## Alternatives écartées

- **i18next / react-i18next** : environ 15 à 20 kB, des clés en chaînes (typables
  seulement par augmentation), des ressources JSON à plat. Cela ne tient pas dans le budget
  et ne décrit pas des données structurées.
- **Paraglide JS, Lingui** : des compilateurs de messages excellents, avec une étape de
  compilation, des fichiers de catalogue et une API par message. Notre contenu est fait
  d'objets typés et non de phrases isolées : le découper en messages casserait le modèle,
  pour deux langues seulement.
- **Même URL, langue choisie par le client** : le HTML pré-rendu serait dans une seule
  langue, avec un flash et une incohérence d'hydratation pour l'autre, et l'anglais serait
  impossible à indexer.
- **Français à la racine (`/`), anglais sous `/en`** : sans passerelle, un robot sans
  français serait redirigé depuis la page française par le script de détection, qui ne
  serait alors jamais indexée.
- **Un build par langue** (à la manière d'Angular) : aucun octet de trop, mais un build
  et des budgets en double, pour un gain que les chunks par langue donnent déjà.
- **Redirection par l'en-tête `Accept-Language` en périphérie** : c'est la meilleure
  passerelle (pas d'aller-retour, et les robots, qui n'envoient pas l'en-tête, restent sur
  la version par défaut). Elle demande une fonction Cloudflare. À ajouter au déploiement :
  elle remplacera la page passerelle sans rien changer d'autre.

## Conséquences

- Une visite sur `/` coûte un aller-retour vers une page de 1 kB. Les liens partagés
  peuvent pointer directement vers `/fr` ou `/en`.
- Tous les chemins changent : le site n'est pas encore déployé, il n'y a donc pas
  d'ancienne URL à rediriger.
- Les balises `hreflang` et `canonical` demandent des URL absolues : elles arrivent avec
  le domaine de production.
- La traduction anglaise traduit le CV sans rien ajouter ; William la relit.
- Le CV PDF n'existe qu'en français : la version anglaise le signale.
- Skill `i18n` : règles, emplacements, tests.
