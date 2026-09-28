import { SITE_FACTS } from '@/features/behind-the-scenes/data/site-facts';
import { type BehindTheScenesContent } from '@/features/behind-the-scenes/types/behind-the-scenes-content';
import { NEW_TAB_HINT } from '@/i18n/common-messages';
import { INTL_LOCALES } from '@/i18n/locales';
import { formatNumber } from '@/utils/format-number';

function number(value: number): string {
  return formatNumber(value, 'fr');
}

const SCORE = new Intl.NumberFormat(INTL_LOCALES.fr, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

// Asked for by William on 2026-09-28: how the site is made. The figures come from
// SITE_FACTS, checked against the configuration that enforces them.
export const BEHIND_THE_SCENES = {
  title: 'Les coulisses du site',
  description:
    'Comment le site de William Stoops est construit : mesures en direct, contrôles de la CI, décisions d’architecture et code public.',
  intro:
    'Ce site fait partie de mon dossier autant que son contenu. Son code, ses tests et ses décisions sont publics : voici comment il est construit, et ce qui l’empêche de se dégrader.',
  repository: 'Voir le code sur GitHub',
  newTab: NEW_TAB_HINT.fr,
  vitals: {
    title: 'Mesuré à l’instant, dans votre navigateur',
    intro:
      'Ces chiffres ne viennent pas d’un laboratoire : votre navigateur les a mesurés en chargeant ce site.',
    labels: {
      firstContentfulPaint: 'Premier affichage',
      largestContentfulPaint: 'Plus grand élément affiché',
      cumulativeLayoutShift: 'Décalage de la mise en page',
      javascriptBytes: 'JavaScript téléchargé, compressé',
      requests: 'Fichiers demandés',
    },
    thresholds: {
      largestContentfulPaint: `Seuil de la CI : ${number(SITE_FACTS.lighthouse.largestContentfulPaintMs)} ms`,
      cumulativeLayoutShift: `Seuil de la CI : ${SCORE.format(SITE_FACTS.lighthouse.cumulativeLayoutShift)}`,
    },
    pending: 'Mesure en cours',
    unsupported: 'Non mesuré par ce navigateur',
    format: {
      milliseconds: (value) => `${number(Math.round(value))} ms`,
      score: (value) => SCORE.format(value),
      kilobytes: (bytes) => `${number(Math.round(bytes / 1000))} Ko`,
      count: (value) => number(value),
    },
  },
  gates: {
    title: 'Ce que la CI refuse',
    intro:
      'Chaque modification passe par une pull request, et la CI la bloque si l’un de ces contrôles échoue.',
    items: [
      {
        title: 'Un type approximatif',
        text: 'TypeScript strict : aucun « any », aucun « unknown », aucune assertion de type. Ce qui entre de l’extérieur (adresse, stockage, formulaire) passe par un schéma Zod.',
      },
      {
        title: 'Un avertissement',
        text: 'Oxlint puis ESLint avec le typage, sans un seul avertissement. L’architecture en features et le sens des imports sont imposés par le lint.',
      },
      {
        title: 'Du code mort',
        text: 'Knip sur tout le dépôt, puis sur le seul code livré : aucun fichier, export ou dépendance inutile.',
      },
      {
        title: 'Une régression',
        text: `Tests unitaires dans Node, composants dans un vrai Chromium, parcours Playwright sur ${number(SITE_FACTS.devices)} appareils. Au moins ${number(SITE_FACTS.coverage.lines)} % des lignes et ${number(SITE_FACTS.coverage.branches)} % des branches couvertes.`,
      },
      {
        title: 'Une barrière d’accessibilité',
        text: `axe sur chaque page, dans les deux thèmes (WCAG 2.2 AA), et un score Lighthouse d’accessibilité de ${number(SITE_FACTS.lighthouse.accessibility)}.`,
      },
      {
        title: 'Du poids en trop',
        text: `JavaScript initial sous ${number(SITE_FACTS.budgets.initialJs)} Ko et CSS sous ${number(SITE_FACTS.budgets.css)} Ko, compressés. Lighthouse : performance d’au moins ${number(SITE_FACTS.lighthouse.performance)}, plus grand affichage sous ${number(SITE_FACTS.lighthouse.largestContentfulPaintMs / 1000)} s, blocage sous ${number(SITE_FACTS.lighthouse.totalBlockingTimeMs)} ms.`,
      },
    ],
  },
  decisions: {
    title: 'Les décisions',
    text: `${number(SITE_FACTS.decisions)} décisions d’architecture, chacune avec son contexte, son choix et les alternatives écartées. Parmi elles :`,
    highlights: [
      'pré-rendre chaque page au build, pour que le contenu s’affiche sans attendre le JavaScript ;',
      'animer en CSS natif, sur le compositeur, sans bibliothèque ;',
      'mettre la langue dans l’adresse, une page par langue ;',
      'faire la course des deux cycles de calcul à l’échelle, plutôt qu’un faux calcul.',
    ],
    link: 'Lire les décisions sur GitHub',
  },
} as const satisfies BehindTheScenesContent;
