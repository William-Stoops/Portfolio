# 0037 — Un hero vivant : une couleur qui ondule, une phrase, la photo en carte

- Statut : Accepté
- Date : 2026-09-28
- Remplace en partie : 0036 (la référence visuelle et le hero ; ses retraits restent)

## Contexte

L'ADR 0036 a pris dennissnellenberg.com comme niveau à atteindre. Une fois dans le site, le
hero qui en découlait (portrait plein écran sur fond anthracite, nom immense qui glisse) a
été jugé « cheap », puis « grossier ». Six essais ont suivi le même jour :

| Essai                                              | Verdict de William  |
| -------------------------------------------------- | ------------------- |
| Portrait détouré sur fond sombre, halo             | « grossier »        |
| Éditorial clair, portrait encadré en noir et blanc | « rien de tout ça » |
| Noir raffiné, nom très fin                         | « rien de tout ça » |
| Portrait en trame de points qui réagit au pointeur | « horrible »        |
| Fond de couleur vivant, surface de volatilité      | « pas mal »         |
| Le même, avec la photo en grand dans une carte     | **retenu**          |

Ce qui ne marchait pas tenait à la photo : une photo prise au soleil, dans la rue, montrée
en plein écran, en montre les défauts (lumière dure, décor). Trois questions ont fixé le
cap : la photo « en petit » dans le hero plutôt qu'en décor, l'univers de Stripe (couleur,
mouvement, sérieux mais vivant), fond indifférent. Puis William a voulu la photo « en
grand quand même », à la place du calculateur.

## Décision

- **Un champ de couleur vivant** en haut de la page d'accueil, tranché en biais : un
  shader WebGL2 mélange quatre teintes par un bruit lent. Les teintes sont des jetons de la
  palette (`flow-sky`, `flow-blue`, `flow-violet`, `flow-peach`), claires en thème clair,
  profondes en thème sombre, et le texte `fg` reste lisible sur chacune (test de contraste).
  Comme viridis pour les données, ces teintes ne servent qu'au décor : le bleu `accent`
  reste la seule couleur de ce sur quoi on agit.
- **La phrase du CV en titre** : « Je décide d'une architecture, je la mesure, je la
  livre. », puis la phrase du profil, « Me contacter » et « Télécharger le CV ».
- **La photo en grand, dans une carte** : la photo originale, avec son décor, cadrée en
  4:5, arrondie et portée par une ombre douce. Encadrée, elle se lit comme un portrait et
  non comme un fond d'écran.
- **Deux cartes flottantes** sur ses bords, sans couvrir le visage : où William travaille,
  et « IT-Finance, 10 h → 5 min », qui mène à la section IT-Finance.
- **Le calculateur** (surface de volatilité implicite, course des cycles) quitte le hero :
  il va dans la section IT-Finance, où il a son contexte.
- **Sans WebGL**, avec `prefers-reduced-motion` ou l'économie de données, le champ reste un
  dégradé CSS fixe des mêmes jetons : la page pré-rendue est complète sans JavaScript.
- **Une barre simple** posée sur le champ : le nom, les sections, le CV, et un bouton
  « Menu » à toutes les largeurs (recherche, thème, langue). Le bouton rond flottant de
  0036 disparaît : sur grand écran, il laissait le thème et la langue introuvables à la
  souris sur une page courte.

## Alternatives écartées

- **Les essais du tableau** : voir leur verdict.
- **La photo détourée** sur un fond doux : plus « studio », mais le liseré du détourage se
  voit autour des cheveux.
- **Un dégradé CSS animé** au lieu du shader : il ne peut animer que des positions de
  dégradés, qui se lisent comme des taches ; le bruit du shader donne un mouvement continu,
  pour un coût mesuré (chunk à part, chargé après l'hydratation).
- **Copier Stripe** : son dégradé, ses couleurs et ses maquettes produit sont les siens ; on
  en reprend le langage (couleur vivante, cartes, précision), avec nos teintes et notre
  contenu.

## Conséquences

- Le hero de 0036 (portrait plein écran, nom qui glisse, bouton rond) est retiré avec son
  code.
- Un chunk WebGL de plus, chargé après l'hydratation et seulement quand le mouvement est
  permis : son budget est suivi par size-limit.
- Quatre jetons décoratifs rejoignent la palette fermée, validés dans les deux thèmes.
- La suite de la page adopte le même langage dans les PR suivantes : cartes, précision,
  la couleur vivante réservée au haut de la page.
