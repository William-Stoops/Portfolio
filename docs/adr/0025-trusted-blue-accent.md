# 0025 — Passer l'accent de l'orange corail à un bleu de confiance

- Statut : Accepté
- Date : 2026-09-26
- Remplace en partie : 0005 (valeurs de l'accent)

## Contexte

L'accent orange corail venait de la maquette de référence. William l'a relevé : pour un
recruteur, l'orange évoque plutôt un avertissement, et le site doit rassurer. Il a choisi,
parmi trois accents tous validés en contraste (bleu, sarcelle, bleu pétrole), le bleu :
la couleur de la confiance, calme et sérieuse, qui forme avec le fond bleu nuit une
palette froide et cohérente.

## Décision

Les six jetons d'accent passent au bleu. Leurs rôles et leurs paires de contraste ne
changent pas :

| Jeton          | Clair     | Sombre    |
| -------------- | --------- | --------- |
| `accent`       | `#1D4ED8` | `#6EA8FE` |
| `accent-hover` | `#1E40AF` | `#93BEFF` |
| `accent-fg`    | `#1D4ED8` | `#7FB2FF` |
| `accent-tint`  | `#E8EEFC` | `#26324A` |
| `on-accent`    | `#FFFFFF` | `#12151C` |
| `focus`        | `#1E40AF` | `#93BEFF` |

- La contrainte de l'ADR 0005 reste vraie en bleu : sur `#1B1F2A`, **aucun bleu ne peut à
  la fois servir de texte (≥ 4,5:1) et porter du texte blanc (≥ 4,5:1)** (blanc sur
  `#6EA8FE` : 2,42:1). En thème sombre, le bouton primaire reste donc clair avec un texte
  foncé (`#12151C` sur `#6EA8FE` : 7,56:1).
- Tout ce qui lisait l'accent suit sans autre changement : l'anneau du portrait, la surface
  WebGL du hero (teintée depuis `text-accent`), les chiffres clés, la ligne de vol, les
  liens, le focus.
- Les couleurs des drapeaux (ADR 0019, 0021) restent les leurs.

## Alternatives écartées

- **Sarcelle** (`#2DD4BF` / `#0F766E`) — plus singulière, mais moins immédiatement associée
  à la confiance. À peine sous le seuil en clair sur `surface-raised` (4,89:1, conforme).
- **Bleu pétrole** (`#4CC3E6` / `#0E6E8C`) — un entre-deux posé, moins lisible comme
  couleur d'action.
- **Garder l'orange en l'adoucissant** — il reste chaud, et la connotation d'alerte avec lui.

## Conséquences

- Le contrat de palette (`color-tokens.test.ts`) passe tel quel avec les nouvelles valeurs :
  aucune paire ajoutée.
- L'accent n'est plus proche du rouge d'erreur. Une erreur garde son icône et son préfixe
  « Erreur : ».
- Le bleu de l'accent et le bleu du drapeau français (`#000091`) ne se côtoient que dans
  le retour en France. Le drapeau garde ses propres jetons.
