# 0013 — Mesurer Lighthouse en bridage réel, sur la médiane des passes

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Avec le hero, l'élément LCP de l'accueil devient le portrait. Lighthouse CI, avec son
bridage **simulé** par défaut (Lantern), a mesuré un LCP de 2 087 à 2 122 ms pour un budget
de 2 000 ms. Mesures locales, avec Lighthouse 13.5 et trois passes par variante :

| Variante (simulation Lantern)          | FCP      | LCP      |
| -------------------------------------- | -------- | -------- |
| Build actuel                           | 1 954 ms | 2 104 ms |
| Hydratation après le premier affichage | 1 953 ms | 2 103 ms |
| Sans polices (expérience)              | 1 518 ms | 1 668 ms |
| Sans JavaScript (expérience)           | 1 354 ms | 1 505 ms |
| JS en `fetchpriority="low"`            | 1 354 ms | 2 102 ms |

| Variante (bridage **réel** : 4G lente, CPU ×4) | FCP      | LCP      | Perf |
| ---------------------------------------------- | -------- | -------- | ---- |
| Build actuel                                   | 1 322 ms | 1 333 ms | 1,00 |
| JS en `fetchpriority="low"`                    | 1 319 ms | 1 333 ms | 1,00 |

Lantern reconstruit le chargement bridé à partir d'une trace **non bridée**. Sur la machine
de CI, rapide, le script s'évalue avant que l'image soit peinte : Lantern rattache donc
le portrait au JavaScript. Une page pré-rendue affiche pourtant son image sans attendre le
script. Le vrai bridage le confirme : le LCP réel est d'environ 1,33 s.

## Décision

- Lighthouse CI utilise le **bridage réel** (`throttlingMethod: "devtools"`).
- Toutes les assertions portent sur la **médiane** des 3 passes. Avant, la valeur par défaut
  de LHCI était `optimistic` : la meilleure passe décidait.
- Le budget LCP **reste à 2 000 ms**. Aucune optimisation n'est ajoutée sans gain réel
  mesuré : `fetchpriority="low"` sur le script améliore la simulation, pas le chargement
  réel, donc il n'est pas appliqué.

## Alternatives écartées

- **Relever le budget** : on corrigerait le thermomètre au lieu de la mesure.
- **`fetchpriority="low"` sur le script** : il ne change rien au LCP réel.
- **Hydrater après le premier affichage** : aucun effet mesuré.
- **Rendre le texte plus grand que l'image pour qu'il devienne l'élément LCP** : ce serait
  truquer la métrique.

## Conséquences

- Le bridage réel est plus bruité que la simulation. La médiane de 3 passes l'absorbe, et
  le budget garde une marge d'environ 650 ms.
- Les polices restent la piste d'optimisation réelle la plus rentable (environ 430 ms en
  simulation) : sous-ensemble de glyphes ou graisses statiques, à mesurer dans une PR
  dédiée.
