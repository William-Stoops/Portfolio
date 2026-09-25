export const PATHS = {
  home: '/',
  accessibility: '/accessibilite',
  legalNotice: '/mentions-legales',
  siteMap: '/plan-du-site',
} as const;

// Fragment ids of the home page sections, shared by the sections and the navigation.
export const SECTION_IDS = {
  about: 'a-propos',
  experience: 'parcours',
  projects: 'projets',
  aiPractice: 'ia',
  skills: 'competences',
  contact: 'contact',
} as const;
