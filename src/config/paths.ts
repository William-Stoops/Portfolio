export const PATHS = {
  home: '/',
  accessibility: '/accessibilite',
  legalNotice: '/mentions-legales',
  siteMap: '/plan-du-site',
} as const;

// Fragment ids of the home page sections, shared by the sections and the navigation. Their
// order is the page order, and it numbers them.
export const SECTION_IDS = {
  about: 'a-propos',
  experience: 'parcours',
  aiPractice: 'ia',
  skills: 'competences',
  contact: 'contact',
} as const;

// Fragment ids of stops inside the journey (the Parcours section), also in the navigation.
export const JOURNEY_ANCHORS = {
  korea: 'coree',
  projects: 'projets',
} as const;
