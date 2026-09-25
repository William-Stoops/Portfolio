import { type Configuration } from 'lint-staged/config';

const config: Configuration = {
  '*.{ts,tsx}': [
    'oxlint --fix --max-warnings=0',
    'eslint --fix --max-warnings=0',
    'prettier --write',
  ],
  '*.{json,md,css,html,yml,yaml}': 'prettier --write',
};

export default config;
