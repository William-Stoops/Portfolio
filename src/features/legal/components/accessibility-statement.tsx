import { CONTACT_EMAIL, SITE_OWNER } from '@/config/site';
import { LegalBlock } from '@/features/legal/components/legal-block';

// Honest by construction: no conformance rate is claimed until a full RGAA audit exists
// (RGAA rules), and manual screen-reader tests are listed as still to do.
export function AccessibilityStatement() {
  return (
    <>
      <p className="max-w-prose text-lead text-fg-muted">
        {SITE_OWNER} s’engage à rendre ce site accessible. Site personnel, il n’est pas soumis à
        l’obligation d’accessibilité de l’article 47 de la loi n° 2005-102, mais il vise le niveau
        AA des WCAG 2.2 et suit la méthode du RGAA 4.1.2.
      </p>

      <LegalBlock title="État de conformité">
        <p>
          Aucun audit RGAA complet n’a encore été réalisé : aucun taux de conformité n’est
          revendiqué.
        </p>
      </LegalBlock>

      <LegalBlock title="Vérifications réalisées">
        <ul>
          <li>
            Tests automatisés axe-core sur chaque page, en thème clair et sombre, sur cinq profils
            d’appareils (téléphones, tablette, ordinateurs).
          </li>
          <li>
            Contraste calculé pour chaque couple de couleurs du site, dans les deux thèmes : 4,5:1
            pour le texte, 3:1 pour les composants.
          </li>
          <li>
            Parcours au clavier testés : lien d’évitement, ordre de tabulation, focus toujours
            visible et jamais entièrement masqué, menu mobile, formulaire de contact.
          </li>
          <li>
            Aucun défilement horizontal de 320 à 2 560 pixels de large, pages lisibles sans
            JavaScript.
          </li>
        </ul>
        <p>
          Restent à réaliser : les tests avec les lecteurs d’écran NVDA (Windows) et VoiceOver
          (macOS et iOS), et un zoom de 400 % vérifié à la main.
        </p>
      </LegalBlock>

      <LegalBlock title="Contenus non accessibles">
        <p>
          Le lecteur de la vidéo YouTube est un contenu tiers : son accessibilité ne dépend pas de
          ce site. La vidéo reste aussi accessible par un lien direct vers YouTube.
        </p>
      </LegalBlock>

      <LegalBlock title="Établissement de cette déclaration">
        <p>Déclaration établie le 25 septembre 2026.</p>
        <ul>
          <li>Technologies : HTML, CSS, JavaScript (React), WAI-ARIA.</li>
          <li>
            Outils : axe-core, Playwright (Chromium et WebKit), Vitest, Lighthouse, calcul des
            contrastes WCAG.
          </li>
          <li>
            Pages concernées : accueil, déclaration d’accessibilité, mentions légales, plan du site,
            page d’erreur 404.
          </li>
        </ul>
      </LegalBlock>

      <LegalBlock title="Retour d’information et contact">
        <p>
          Si vous rencontrez une difficulté pour accéder à un contenu, écrivez à{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> : une alternative accessible vous
          sera proposée.
        </p>
      </LegalBlock>

      <LegalBlock title="Voies de recours">
        <p>
          Si vous n’obtenez pas de réponse satisfaisante, vous pouvez saisir le{' '}
          <a href="https://www.defenseurdesdroits.fr">Défenseur des droits</a>.
        </p>
      </LegalBlock>
    </>
  );
}
