# 0035 — Des sons discrets, synthétisés, coupés par défaut

- Statut : Remplacé par l’[ADR 0036](0036-premium-direction.md)
- Date : 2026-09-28

## Contexte

Dernier des détails retenus par William : des sons discrets, coupés par défaut. Contraintes :

- **WCAG 1.4.2** : un son lancé automatiquement pendant plus de trois secondes doit pouvoir être arrêté. Un son que personne n'a demandé surprend toujours, même court.
- **La politique des navigateurs** : avant le premier geste du visiteur, l'audio est suspendu. Un son programmé à ce moment-là ne se perd pas : il sort plus tard, au premier clic, hors de propos.
- **Le budget** : il reste 1,4 kB de marge sur le JS initial (125 kB).
- **Aucune requête ni aucun tiers** de plus.

## Décision

- **Coupés par défaut.** Le choix du visiteur est enregistré (`localStorage`, lu à travers un schéma Zod ; seul « activé » est stocké), et suivi d'un onglet à l'autre.
- **L'interrupteur** :
  - dans le pied de page, un bouton « Sons » dont l'état est porté par `aria-pressed` et montré par son icône ;
  - dans la recherche rapide, une action « Activer les sons » ou « Couper les sons ».

  Il n'est pas dans l'en-tête : à 64rem, celui-ci n'a plus la place.

- **Trois sons, synthétisés** (Web Audio : des sons purs, sinus ou triangle, avec une attaque douce et une chute rapide) :
  - un « tap » pour un choix fait (un thème, les sons activés, le départ de la course) ;
  - deux notes à l'ouverture de la recherche rapide ;
  - le carillon d'une cabine d'avion (aigu puis grave) quand un vol se termine : l'arrivée de la course, et la 404 (le vol dérouté).
- **Courts et bas** : moins de 0,3 s, ou 1,9 s pour le carillon ; pic à 0,06 au plus. Toujours après un geste du visiteur, et bien en deçà des trois secondes de WCAG 1.4.2.
- **Seulement après un premier geste** (`navigator.userActivation.hasBeenActive`) : une 404 atteinte par un lien du site sonne ; une 404 ouverte directement reste muette, plutôt que de sonner plus tard.
- **Le synthétiseur est son propre chunk** (415 octets), chargé avec le premier son, une fois les sons activés.

## Alternatives écartées

- **Des fichiers audio** : des requêtes, du poids et des licences, pour trois sons que quelques lignes jouent.
- **Des sons au défilement** (le tableau des départs qui tourne) : ce n'est pas un geste, le navigateur les retiendrait, et un son au défilement devient vite une gêne.
- **Activés par défaut** : ce serait surprendre le visiteur, souvent en open space ou en réunion.
- **L'interrupteur dans l'en-tête** : il n'y tient plus sur une ligne à 64rem (ADR 0034).

## Conséquences

- JS initial : 123,60 → 124,24 kB (budget 125). Synthétiseur : 415 octets (budget 1 kB).
- **Une leçon de découpage**, notée dans le skill `react-performance`. Le synthétiseur importait son type avec un import de type en ligne. Cet import gardait un import réel d'un module du chunk principal, et Rolldown a alors sorti le cœur de Zod dans un chunk à part (+0,67 kB). Un `import type` l'a réglé.
