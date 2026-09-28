# 0019 — Ajouter les couleurs du drapeau coréen à la palette fermée

- Statut : Accepté
- Date : 2026-09-26

## Contexte

La section « Corée du Sud » raconte l'année de William à Korea University. Il a demandé que
le drapeau y figure. La palette est fermée (`--color-*: initial`, invariant 7) : aucune couleur
hors des jetons validés, et chaque jeton est déclaré pour les deux thèmes avec `light-dark()`.
Le Taegeukgi a des couleurs officielles (rouge `#CD2E3A`, bleu `#0047A0`, noir, fond blanc)
qu'aucun jeton existant ne reproduit.

## Décision

- Quatre jetons `taegeuk-field`, `taegeuk-red`, `taegeuk-blue` et `taegeuk-ink`, **identiques
  dans les deux thèmes** : un drapeau national ne change pas de couleurs avec le thème du site.
- Ils ne servent **qu'au drapeau**, dessiné sur son propre fond blanc, jamais pour du texte.
- Le test de la palette vérifie que le rouge, le bleu et le noir atteignent 3:1 sur le fond du
  drapeau. Sur le fond du site, le drapeau garde un filet `border` qui le détache en thème
  clair.
- La construction suit le dessin de référence (domaine public) : `taegeuk-geometry.ts`, testé.

## Alternatives écartées

- **Drapeau recoloré avec les jetons existants** (accent, fg) : ce n'est plus le drapeau.
- **Drapeau sans fond blanc, trigrammes en `fg`** : plus fondu dans la page, mais le bleu
  officiel sur le fond sombre (1,9:1) fait disparaître la moitié du taegeuk.
- **Une image (SVG ou PNG) du drapeau** : ses pièces ne pourraient plus s'animer une à une
  sur le compositeur.

## Conséquences

- La palette compte quatre jetons de plus, bornés à un seul composant (`TaegeukFlag`).
- Toute autre utilisation de ces jetons doit passer par un nouvel ADR.
