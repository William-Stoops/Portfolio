# 0024 — Ouvrir la vidéo du pitch depuis son affiche, sans plein écran forcé

- Statut : Accepté
- Date : 2026-09-26

## Contexte

La vidéo du pitch de STAXX à l'Epitech Summit était un rectangle rayé avec un bouton de
lecture : on aurait dit un emplacement vide. La lecture ouvrait une fenêtre modale et
demandait le plein écran du navigateur. Sur macOS, Chrome anime alors son passage en plein
écran, puis la fenêtre restait vide le temps que le lecteur YouTube se charge. William
trouvait la vidéo peu mise en valeur, et sa lecture mal intégrée à la page.

## Décision

- **L'affiche est la première image du pitch** (à 1:02:21), capturée en 1920 × 1080 avec
  l'accord de William et servie par le site (`staxx-pitch-v1`, AVIF/WebP/JPEG). Aucune
  requête vers YouTube avant le clic, comme avant.
- **L'affiche grandit jusqu'au lecteur** par une View Transition typée (`video-morph`) :
  le cadre de l'affiche et celui du lecteur portent le même nom le temps de la transition
  seulement, et la fenêtre apparaît en fondu sur la page. À la fermeture, par le bouton ou
  par Échap (l'événement `cancel` est intercepté), le cadre revient à sa place dans la page.
- **Le lecteur apparaît par-dessus l'affiche une fois chargé.** La transition attend que
  l'affiche de destination soit décodée : le cadre ne s'ouvre jamais sur une boîte vide.
- **Plus de plein écran forcé.** La fenêtre couvre déjà la fenêtre du navigateur, et le
  lecteur garde son propre bouton plein écran.
- Sans View Transitions typées, ou avec « réduire les animations », la fenêtre s'ouvre
  directement, sans transition.
- Dans l'étude STAXX, le récit suit l'ordre réel : la radio, puis le pitch, puis la photo
  du trophée.

## Alternatives écartées

- **`<ViewTransition>` de React 19.3** — il anime les mises à jour marquées comme
  Transitions ; la fenêtre s'ouvre de façon impérative (`showModal()`). La bascule de
  thème pilote déjà l'API du navigateur : un seul chemin, avec le même repli.
- **Garder le plein écran du navigateur après la transition** — deux animations à la
  suite, dont celle du système, que la page ne maîtrise pas.
- **Détecter le début de la lecture par l'API postMessage du lecteur** — protocole non
  documenté, et un lecteur bloqué (lecture automatique refusée) aurait laissé l'affiche en
  place.
- **Réutiliser la photo du trophée comme affiche** — elle montre la victoire, pas le pitch,
  et elle figure déjà juste en dessous.

## Conséquences

- Le nom de transition n'existe que pendant `video-morph` : la bascule de thème capture
  l'affiche avec le reste de la page.
- Entre l'affiche et la première image jouée, le lecteur YouTube peut afficher un bref
  temps de chargement : il dépend du réseau et de YouTube.
- Si l'affiche change de rapport, le cadre ne coïncide plus avec le lecteur : un test
  impose le 16:9.
- À revoir si un navigateur cible perd les View Transitions typées : le repli ouvre la
  fenêtre sans transition.
