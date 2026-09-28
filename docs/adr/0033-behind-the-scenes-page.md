# 0033 — Montrer les coulisses du site, avec des chiffres vérifiés

- Statut : Accepté
- Date : 2026-09-28

## Contexte

Le dépôt fait partie du dossier autant que le site : le CTO d'Hymaïa lira le code, les tests, la CI et les décisions. William a demandé une page des « coulisses » pour les montrer depuis le site.

Trois pièges :

- **Des chiffres qui mentent.** Une page qui annonce un budget, un seuil ou un nombre de décisions ment dès que l'un d'eux change sans elle.
- **Des mesures de laboratoire.** Les scores de Lighthouse CI sont pris sur une machine de CI, avec un réseau et un processeur simulés : ce ne sont pas ceux du lecteur.
- **Le budget du JS initial** (125 kB, ADR 0017) n'a plus que 2,5 kB de marge, et une page pré-rendue ne peut pas être une route chargée à la demande.

## Décision

- **Une page pré-rendue** : `/fr/coulisses`, `/en/behind-the-scenes`. Elle est liée en tête du pied de page (et donc du plan du site), et présente dans le sitemap. Une nouvelle feature, `behind-the-scenes`.
- **Les mesures de la visite, prises par le navigateur du lecteur** (`usePageVitals`, `PerformanceObserver`) :
  - premier affichage ;
  - plus grand élément affiché ;
  - décalage de la mise en page, calculé par fenêtres de session comme le font les navigateurs depuis 2021 ;
  - JavaScript téléchargé, compressé ;
  - nombre de fichiers demandés.

  Pré-rendue, la page dit « Mesure en cours ». Un navigateur qui ne prend pas une mesure le dit aussi. Sous le LCP et le CLS, le seuil de la CI. Une page ouverte en arrière-plan ne peint qu'une fois affichée : ses affichages mesureraient l'attente de l'onglet, pas le site. Comme dans la bibliothèque web-vitals, ils sont écartés, et la tuile le dit.

- **Ce que la CI refuse, avec ses vrais seuils** : typage, lint, code mort, tests et couverture, accessibilité, poids et Lighthouse.
  - Les nombres viennent de `SITE_FACTS`.
  - Un test unitaire les relit dans la configuration qui les impose : `.size-limit.json`, `lighthouserc.json`, `vitest.config.ts`, `playwright.config.ts`, et le dossier `docs/adr`.
  - Changer un budget, un seuil, un appareil, ou ajouter une décision sans mettre la page à jour fait échouer la CI.
- **Les décisions** : leur nombre (vérifié de la même façon), quatre exemples, et le lien vers le dossier des ADR sur GitHub.
- **Le corps de la page est son propre chunk** (`lazy` et `Suspense`, comme le parcours, ADR 0020). La route reste synchrone, comme doit l'être celle d'une page pré-rendue. Le pré-rendu attend le chunk, et le client l'hydrate à son arrivée.

## Alternatives écartées

- **Générer les chiffres au build** (un module virtuel Vite) : il faudrait un plugin, une déclaration de module et une exception Knip. Le test obtient la même garantie sans rien livrer.
- **Afficher les scores d'une exécution de Lighthouse** : ils seraient périmés dès l'exécution suivante, et ils ne sont pas mesurés chez le lecteur.
- **Afficher le nombre de tests** : il change à chaque PR. Les seuils et les budgets, eux, sont des engagements.
- **La bibliothèque web-vitals** : `onLCP` ne rend sa valeur qu'une fois la mesure finale, à la première interaction. Ici, `PerformanceObserver` montre la mesure en direct, en 2,4 kB pour toute la page.
- **Un lien dans l'en-tête** : les cinq sections y tiennent juste sur une ligne à 64rem. Le pied de page et le plan du site suffisent, et la palette ⌘K y mènera.

## Conséquences

- JS initial : 122,44 → 122,88 kB. Corps de la page : 2,41 kB (budget 3 kB). Contenu : français 6,92 → 8,12 kB, anglais 6,00 → 7,07 kB (budget 9 kB).
- Tout nouvel ADR, et tout changement de budget, de seuil, de couverture ou d'appareils, passe aussi par `SITE_FACTS` : c'est voulu.
- Le lien vers les décisions mène à `main`. Les ADR de la pile en attente y apparaîtront au merge.
