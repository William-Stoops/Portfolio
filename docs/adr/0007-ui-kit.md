# 0007 — Construire l'UI avec Tailwind CSS v4 et shadcn sur Base UI

- Statut : Accepté
- Date : 2026-09-25

## Contexte

Le design doit être entièrement personnalisé et professionnel, avec un design system
cohérent et des primitives accessibles, sans subir l'identité visuelle d'une bibliothèque.
Au 2026-09-25, shadcn 4.21 propose Base UI par défaut (depuis juillet 2026), Radix restant
supporté. Tailwind 4.3 se configure en CSS (`@theme`).

## Décision

- **Tailwind CSS 4.3** via `@tailwindcss/vite`. Jetons dans `src/styles/globals.css`
  (`@theme`), sans `tailwind.config.js`.
- **shadcn (CLI 4.21) sur Base UI** : le code des composants est copié dans
  `src/components/ui/`, un composant à la fois, quand une feature en a besoin. Chaque copie
  est adaptée dans la même PR : nommage, jetons, focus en `outline`, tailles de cible, tests.
- `cva` pour les variantes, `cn()` (`clsx` + `tailwind-merge`) pour les fusions.
- Icônes `lucide-react`. Animations Motion 13 (`LazyMotion`).

## Alternatives écartées

- **MUI.** Identité Material forte et difficile à effacer, runtime CSS-in-JS plus lourd.
- **shadcn sur Radix.** Viable, mais Base UI est désormais la voie par défaut et la plus
  active. Rien ne bloque un retour à Radix composant par composant.
- **Tout coder à la main.** Réimplémenter focus trap, dialogues et menus accessibles est un
  risque sans valeur ajoutée.

## Conséquences

Nous possédons le code des primitives, que Knip surveille comme le reste. Les mises à jour
de shadcn ne sont pas automatiques : on les compare au besoin.
