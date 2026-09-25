// Identity shown in the page chrome (header, footer, titles). Source: docs/content/cv-source.md.
export const SITE_OWNER = 'William Stoops';
export const SITE_TITLE = 'William Stoops – Software Engineer & AI Engineer';
export const CONTACT_EMAIL = 'william.stoops@epitech.eu';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/william-stoops-a1029b233';

// Served from public/. The weight in the label is checked against the real file by E2E.
export const CV_FILE = {
  href: '/cv/william-stoops-cv-fr.pdf',
  formatAndWeight: 'PDF, 56 Ko',
} as const;
