# 0004 — Pas de store global par défaut ; Redux Toolkit seulement sur critères

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Redux Toolkit a été cité comme outil possible « si nécessaire ». Le contenu du portfolio
est statique et typé. L'état client se limite au thème, au menu mobile, à la section
active et au formulaire de contact.

## Décision

Le placement de l'état suit cet ordre : valeur dérivée, état local, URL, contexte dédié
(thème), préférence persistée via `useSyncExternalStore`. **Aucun store global n'est
installé.** Redux Toolkit est introduit par un nouvel ADR si au moins deux de ces critères
deviennent vrais :

- un état lu et écrit par au moins trois features distantes ;
- des mises à jour qui doivent rester cohérentes entre plusieurs tranches d'état ;
- un besoin de journal d'actions ou de time-travel pour déboguer ;
- un cache serveur avec invalidation.

## Alternatives écartées

- **RTK « pour le montrer ».** Ce serait de la complexité sans besoin, l'inverse du
  pragmatisme attendu d'un senior. Savoir **ne pas** l'installer, et dire quand on le
  ferait, est le signal recherché.
- **Zustand.** Même absence de besoin. Il resterait l'option légère si un besoin modéré
  apparaissait.

## Conséquences

Moins de dépendances et de re-rendus. L'état reste lisible là où il est utilisé. Les
critères d'introduction sont écrits à l'avance, donc la décision de revenir dessus sera
objective.
