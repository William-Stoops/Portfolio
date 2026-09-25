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

// Host named in the legal notice (LCEN art. 6). Source: Cloudflare, Inc. annual report
// (SEC form 10-K, fiscal year 2025), cover page.
export const HOSTING_PROVIDER = {
  name: 'Cloudflare, Inc.',
  address: '101 Townsend Street, San Francisco, California 94107, États-Unis',
  phone: '+1 888 993 5273',
  website: 'https://www.cloudflare.com',
} as const;
