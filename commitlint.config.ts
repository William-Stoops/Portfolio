import { type UserConfig } from '@commitlint/types';

// Scopes mirror the feature slices and cross-cutting areas listed in the git-workflow skill.
// Adding a feature slice means adding its scope here in the same pull request.
const SCOPES = [
  'hero',
  'about',
  'experience',
  'projects',
  'ai-practice',
  'korea',
  'skills',
  'education',
  'contact',
  'legal',
  'app',
  'ui',
  'layout',
  'design-system',
  'a11y',
  'responsive',
  'perf',
  'seo',
  'content',
  'test',
  'e2e',
  'deps',
  'config',
  'ci',
  'docs',
  'adr',
  'agent',
];

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', SCOPES],
    'scope-empty': [2, 'never'],
    'body-max-line-length': [2, 'always', 100],
  },
};

export default config;
