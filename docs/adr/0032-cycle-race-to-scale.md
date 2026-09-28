# 0032 — Faire la course des deux cycles de calcul, à l'échelle

- Statut : Accepté
- Date : 2026-09-28

## Contexte

Parmi les idées pour l'effet « waouh », William a retenu une seule démo vivante : rendre
visible le chiffre clé du CV, « 10 h → 5 min ». Il le montre aujourd'hui dans le registre
d'À propos et dans le rôle IT-Finance du parcours.

Contraintes :

- **Rien d'autre que le CV.** Le CV dit :
  - que le calcul de volatilité implicite tourne en continu ;
  - qu'il avait décroché à dix heures par cycle ;
  - que le coût venait de la structure de données, et non de l'algorithme que visait l'équipe ;
  - que la refonte l'a ramené à cinq minutes, avec des valeurs de nouveau à jour.

  Il ne dit ni la structure d'origine, ni celle de la refonte, ni le nombre d'options calculées.

- **Accessibilité** :
  - pas d'animation lancée seule de plus de cinq secondes (WCAG 2.2.2) ;
  - rien qui clignote plus de trois fois par seconde (2.3.1) ;
  - une version sans mouvement (2.3.3).
- **Budgets** : il ne reste que 2,5 kB de marge sur le JS initial (ADR 0011), et le chunk du parcours a un budget de 16 kB.

## Décision

- **Une maquette à l'échelle, lancée par le visiteur.** Une heure du vrai cycle y dure 1,2 seconde : le cycle d'avant dure 12 secondes, celui d'après un dixième. Le rapport de 120 entre les deux n'est pas un chiffre ajouté : c'est 600 minutes divisées par 5. L'échelle est annoncée (« Démo à l'échelle »), pour que personne ne prenne la maquette pour le vrai calcul.
- **Deux couloirs** :
  - « Avant la refonte » : une barre grise avance pendant douze secondes, avec l'horloge du cycle de 00:00 à 10:00 ;
  - « Après la refonte » : la barre est pleine dès le premier dixième de seconde, puis un compteur égrène les cycles terminés, jusqu'à 120.
- **Une barre qui se viderait et se remplirait dix fois par seconde clignoterait** (2.3.1) : les cycles suivants sont comptés, pas redessinés.
- **Le temps vient de l'horloge** (`performance.now()`), et non du nombre de tours de minuterie : un onglet en arrière-plan ralentit l'affichage, jamais la course. Le calcul est une fonction pure (`utils/cycle-race.ts`), testée seule. Le hook (`useCycleRace`) ne fait que la faire avancer.
- **Le résultat est affiché et annoncé** dans une `<output aria-live="polite">` : « Pendant qu'un cycle d'avant s'achève, la version refondue en boucle 120 : des valeurs de nouveau à jour. » Sa place est réservée dès le départ, avec une copie invisible, pour que la page ne bouge pas quand il apparaît.
- **En mouvement réduit, pas de course** : le bouton donne le résultat tout de suite.
- **La course est placée sous le rôle IT-Finance**, dans l'escale 2025 du parcours. Elle illustre son deuxième point, et vit dans le chunk du parcours, chargé quand l'hydratation l'atteint.

## Alternatives écartées

- **Un vrai calcul dans le navigateur**, avec deux structures de données dans un Web Worker : il faudrait inventer la structure d'origine et la refonte, que le CV ne décrit pas. Une démo inexacte ferait plus de tort qu'aucune démo.
- **Une échelle logarithmique**, ou un cycle d'après ralenti pour qu'on le voie avancer : le rapport de 120, qui est tout le propos, serait trahi.
- **Dans À propos, à côté du chiffre** : la course y serait loin du récit (le calcul en continu, l'hypothèse de l'équipe), et le chunk initial n'a plus la place.
- **Un départ automatique au défilement** : douze secondes d'animation non demandée (2.2.2), pour un résultat que le visiteur n'a pas choisi de regarder.

## Conséquences

- Chunk du parcours : 13,94 → 15,46 kB, pour un budget de 16. Contenu : +0,3 kB par langue. JS initial et CSS inchangés.
- Tests :
  - unitaires : l'échelle, les pas d'un cycle, l'arrêt ;
  - hook : la course sur une horloge simulée, le redémarrage, le mouvement réduit, l'arrêt de la minuterie au démontage ;
  - composant : les couloirs, le résultat dans les deux langues, axe ;
  - E2E : une vraie course de douze secondes, le mouvement réduit, l'anglais.
- Si William veut une autre échelle, elle tient en une constante (`RACE_MS_PER_MINUTE`).
