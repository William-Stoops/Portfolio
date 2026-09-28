# 0034 — Une recherche rapide (⌘K), en éléments natifs, dans son propre chunk

- Statut : Accepté
- Date : 2026-09-28

## Contexte

Parmi les détails que William a retenus pour l'effet « waouh » : une palette ⌘K, comme dans les outils que les développeurs utilisent tous les jours. Elle doit mener partout (sections, pages) et faire ce que font l'en-tête et le pied de page (thème, langue, CV, contact).

Contraintes :

- **Budget** : il reste 2,1 kB de marge sur le JS initial (125 kB, ADR 0017).
- **Accessibilité** :
  - un raccourci d'une seule touche gênerait la frappe (WCAG 2.1.4) ;
  - le focus doit revenir d'où il vient, et Safari ne donne pas le focus à un bouton qu'on clique ;
  - le lint impose les éléments natifs plutôt que les rôles ARIA, et aucune exception n'est admise.
- **Place** : à 64rem, l'en-tête tient juste sur une ligne.

## Décision

- **⌘K sur Mac, Ctrl+K ailleurs**, et un **bouton loupe dans l'en-tête**, pour ceux qui ne connaissent pas le raccourci et sur écran tactile (dans le menu). Son nom dit le raccourci, et les grands écrans (80rem) l'affichent à côté de l'icône. Avec Maj ou Alt, les touches restent celles du navigateur.
- **Ce qu'elle propose** :
  - les sections de l'accueil ;
  - les pages du site, dont les coulisses ;
  - les trois thèmes ;
  - l'autre langue, à l'endroit lu (comme le sélecteur de l'en-tête) ;
  - le CV ;
  - l'e-mail ;
  - LinkedIn.

  La recherche prend le début de chaque mot, sans tenir compte des accents (`matchesQuery`). Chaque action a quelques mots-clés : « apparence » trouve les thèmes.

- **Des éléments natifs, pas un combobox ARIA** :
  - une `<dialog>` modale (`showModal`) ;
  - un champ `type="search"` ;
  - une liste par groupe, nommée par son titre ;
  - chaque résultat est l'élément qu'il est : un lien vers une section, l'autre langue ou un fichier (le CV porte `download`, LinkedIn s'ouvre dans un nouvel onglet), un lien du routeur vers une page, un bouton pour un thème.
- **Au clavier** :
  - les flèches déplacent le vrai focus, du champ au premier résultat et de résultat en résultat ;
  - la flèche vers le haut depuis le premier revient au champ ;
  - Entrée dans le champ suit le premier résultat ;
  - Échap ferme la palette, et seulement elle : l'événement ne sort pas de la fenêtre, pour que le menu mobile ouvert dessous reste ouvert.
- **Le focus revient** au bouton qui l'a ouverte, désigné explicitement, ou à ce qui l'avait pour le raccourci. Une page de destination prend ensuite le focus sur son titre, comme toute navigation.
- **Le chargement** :
  - L'état, le raccourci, le bouton et l'hôte vivent dans le chunk principal.
  - La palette est dans son propre chunk (budget 4 kB), chargé à la première ouverture, ou dès que le visiteur vise le bouton.
  - Elle n'est montée que lorsqu'elle est ouverte : chaque ouverture repart d'une recherche vide.
- **Ses icônes viennent de l'hôte.** Importées directement dans le chunk de la palette, les icônes de lucide faisaient sortir React du chunk principal vers un chunk à part, soit +1,06 kB de JS initial. L'hôte, qui est dans le chunk principal, lui passe les deux icônes.
- **L'en-tête reste sur une ligne** : entre 64 et 80rem, ses espacements se resserrent pour laisser la place à la loupe. Un test de composant le vérifie à 1024 px.

## Alternatives écartées

- **Le motif combobox + listbox** (`aria-activedescendant`) : il faudrait tenir à jour l'option active en ARIA, et le lint refuse ces rôles quand un élément natif existe. Surtout, les résultats sont vraiment des liens et des boutons : autant qu'ils le soient.
- **Une bibliothèque** (cmdk, kbar) : plusieurs kilo-octets de plus, pour ce que `<dialog>` et une liste font déjà.
- **Charger la palette avec la page** : +3,8 kB sur le budget initial, pour un outil que la plupart des visiteurs n'ouvriront pas.
- **« / » comme raccourci** : une touche seule gêne la frappe, et WCAG 2.1.4 demanderait un moyen de la désactiver.

## Conséquences

- JS initial : 122,88 → 123,60 kB (budget 125). Chunk de la palette : 3,79 kB (budget 4).
- Le compteur de résultats est annoncé poliment. Un titre de page reçoit le focus après une navigation.
- Une nouvelle page ou section du site apparaît d'elle-même dans la palette : elle lit les mêmes listes que la navigation et le pied de page.
