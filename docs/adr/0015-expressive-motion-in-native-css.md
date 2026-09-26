# 0015 — Un mouvement expressif, en CSS natif

- Statut : Accepté
- Date : 2026-09-26

## Contexte

La première version du site suivait une ligne très sobre : animations d'entrée seulement,
une fois, sur 16 px au plus, jamais en boucle. William l'a trouvée trop classique et a
demandé un site plus ludique et plus travaillé, animé, dans l'esprit des portfolios
animés les plus appréciés.

Trois contraintes encadrent la réponse :

- **Budget JS** : 115 kB brotli sur 120 avant la refonte. La bibliothèque Motion prévue
  (`LazyMotion` + `domAnimation`) coûte environ 20 kB.
- **Accessibilité** : WCAG 2.2.2 (tout mouvement automatique de plus de 5 s doit pouvoir
  être arrêté), 2.3.3 (respect de « réduire les animations »), le contraste et le focus
  jamais masqué (2.4.11).
- **Pré-rendu** (ADR 0011) : le contenu doit rester lisible sans JavaScript, et le LCP
  sous 2 s.

## Décision

- **Tout le mouvement est en CSS**, dans `src/styles/motion.css`. Aucune bibliothèque
  d'animation n'est ajoutée, et Motion n'est plus prévu.
  - Au chargement, une fois : lettres du nom, anneau du portrait, stickers.
  - Au défilement, sans JavaScript (`animation-timeline: view()` / `scroll()`) : titres
    qui se dévoilent, mots du profil qui s'encrent, jauges des chiffres clés, rail du
    parcours, puces qui rebondissent, barre de progression de lecture.
  - Au pointeur : inclinaison, aimant, halo de bordure. Les positions viennent d'un seul
    écouteur délégué (`usePointerGlow`) ; les composants s'inscrivent par un attribut
    `data-pointer`.
  - Au changement de thème : cercle qui se propage depuis le bouton, par une View
    Transition.
- **Amélioration progressive** : chaque effet est derrière
  `prefers-reduced-motion: no-preference`, et chaque effet lié au défilement derrière
  `@supports`. Sans eux, la page est statique et complète, jamais masquée.
- **Une seule boucle**, le bandeau de technos. Il se met en pause au survol, a son bouton
  pause (WCAG 2.2.2) et disparaît au profit d'une liste immobile en mouvement réduit.
- Les keyframes animent `translate`, `scale` et `rotate` : ils se composent avec les effets
  de pointeur, qui possèdent `transform`.
- **Le halo suit la bordure, jamais le fond du texte** : le contrat de contraste reste
  valable. Les mots qui s'encrent passent de `fg-subtle` à `fg`, deux couleurs du contrat :
  chaque étape intermédiaire passe aussi.
- Les décorations (lettres animées, stickers, visuels des chiffres, rail, numéros) sont
  `aria-hidden` : le texte lisible dit déjà tout.

## Alternatives écartées

- **Motion (`motion/react`)** : environ 20 kB brotli, soit le budget dépassé. Les
  animations au défilement y tourneraient sur le thread principal, alors que les
  scroll-driven animations CSS tournent sur le compositeur.
- **GSAP + ScrollTrigger** : même problème de poids, plus une licence à surveiller.
- **Monter le budget JS** pour s'offrir une bibliothèque : le gain par rapport au CSS natif
  ne le justifie pas.
- **Rendre le contenu invisible jusqu'à l'animation** (IntersectionObserver + classes) :
  sans JavaScript ou en cas d'erreur, le contenu resterait caché.

## Conséquences

- Firefox n'active pas encore les scroll-driven animations par défaut : la page y est
  statique, comme en mouvement réduit. Chrome, Edge et Safari 26 ont tout.
- **Le budget JS est presque épuisé** : 119,2 kB sur 120 (+4 kB, surtout des icônes et du
  balisage). La prochaine fonctionnalité devra compenser (icônes, code mort) ou passer par
  un ADR qui relève le budget, mesures à l'appui.
- CSS : 8,2 kB brotli sur 15.
- `e2e/motion.spec.ts` garantit que rien ne bouge en mouvement réduit, et que le bandeau
  se met en pause. Le test clavier vérifie qu'aucun focus n'est masqué par l'en-tête
  collant.
