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
- **Sans WebGL**, sans processeur graphique pour le dessiner (un rendu logiciel, comme dans
  un navigateur sans GPU), avec `prefers-reduced-motion` ou l'économie de données, le champ
  reste un dégradé CSS fixe des mêmes jetons : la page pré-rendue est complète sans
  JavaScript, et un appareil sans GPU ne paie pas une scène redessinée à chaque image.
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

## Révision du 2026-09-29 : un titre qui mène

William a trouvé le texte du hero « pas hyper bien implémenté et lisible », puis pas assez
« mis en avant » ni « intégré ». Mesuré, le titre cumulait les défauts :

- **Des lettres qui se touchaient** : une approche de −0,05 em sur Inter Tight, une police
  déjà resserrée. Elle passe à −0,025 em, portée par le jeton `text-display` avec la
  graisse (650) et l'interligne.
- **Une colonne trop étroite pour sa taille** : 72 px dans environ 520 px, soit une dizaine
  de caractères par ligne, et des coupures au hasard (« I measure / it, I ship it. »).
- **Une ligne qui finissait sur un mot court** (« I choose an / architecture, »). Des
  espaces insécables, dans la phrase elle-même, lient chaque pronom et chaque article au
  mot qu'il introduit, et gardent entières les propositions courtes.
- **Un titre posé sur le champ, pas dedans**, et coupé par sa diagonale, fixée à une
  hauteur d'écran.

Sur deux options rendues (titre pleine largeur au-dessus de la photo, ou côte à côte avec
une colonne élargie), William a choisi la seconde, les lettres teintées par le champ, puis
une photo un peu plus grande et la carte de preuve à cheval sur le bas de la photo :

- **Le titre est dimensionné sur sa colonne** (`cqi`), pas sur l'écran : à un 8,5e de la
  colonne, son plus long groupe insécable (« d'une architecture, ») tient toujours, et il
  se coupe aux mêmes endroits sur un téléphone et sur un écran large. De 34 à 70 px ;
  `overflow-wrap` protège la colonne si l'on agrandit le seul texte.
- **La colonne de texte prend 1,4 part de la grille** pour 1 à la photo (28rem au plus).
- **Les lettres se fondent dans le champ** (`mix-blend-mode: hard-light`) : l'encre
  `flow-ink` multiplie le champ en thème clair et l'éclaircit en thème sombre, si bien que
  le titre prend les teintes qui passent derrière lui. Le contraste testé est celui du
  mélange, sur chaque teinte et dans les deux thèmes (au moins 5,3:1).
- **Le champ se règle sur le contenu du hero** et descend sous toute la colonne de texte :
  le titre, le chapeau et les boutons se lisent sur un même fond.
- **La carte « 10 h → 5 min »** chevauche le bord bas de la photo, sans couvrir le visage.
