import { SECTION_IDS } from '@/config/paths';
import { type ContactContent } from '@/features/contact/types/contact-content';
import { NEW_TAB_HINT } from '@/i18n/common-messages';
import { formatNumber } from '@/utils/format-number';

// Source: docs/content/cv-source.md (identity and "Formation": Paris, Lille ou full remote).
export const CONTACT_CONTENT = {
  id: SECTION_IDS.fr.contact,
  title: 'Contact',
  location: 'Paris, Lille ou full remote',
  invitation: 'Un poste, une mission ou une question ? Écrivez-moi.',
  labels: {
    email: 'E-mail',
    copyEmail: 'Copier l’adresse e-mail',
    linkedIn: 'LinkedIn',
    newTab: NEW_TAB_HINT.fr,
    location: 'Localisation',
  },
  copyAnnouncements: {
    copied: 'Adresse e-mail copiée',
    failed: 'Copie impossible : sélectionnez l’adresse pour la copier',
  },
  form: {
    help: 'Tous les champs sont obligatoires. Le formulaire prépare l’e-mail dans votre messagerie.',
    name: 'Nom',
    email: 'E-mail',
    message: 'Message',
    submit: 'Préparer l’e-mail',
    sent: (email) =>
      `Votre messagerie s’ouvre avec le message prêt à envoyer. Si rien ne s’ouvre, écrivez à ${email}.`,
    mailSubject: (senderName) => `Contact depuis le portfolio – ${senderName}`,
    errors: {
      name: 'Erreur : saisissez votre nom.',
      email: 'Erreur : saisissez une adresse e-mail valide, par exemple nom@domaine.fr.',
      messageTooShort: (minimum) =>
        `Erreur : écrivez un message d’au moins ${formatNumber(minimum, 'fr')} caractères.`,
      messageTooLong: (maximum) =>
        `Erreur : raccourcissez votre message à ${formatNumber(maximum, 'fr')} caractères au plus.`,
    },
  },
} as const satisfies ContactContent;
