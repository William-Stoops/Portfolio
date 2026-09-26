import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import boundaries from 'eslint-plugin-boundaries';
import checkFile from 'eslint-plugin-check-file';
import oxlint from 'eslint-plugin-oxlint';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Oxlint runs first and owns correctness, a11y, filenames, barrels and cycles.
// ESLint only carries what Oxlint cannot do yet (see docs/adr/0002).
export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', '.vitest']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSUnknownKeyword',
          message:
            'No explicit `unknown`: parse the value with a Zod schema and use its inferred type.',
        },
        {
          selector: 'TSAsExpression:not([typeAnnotation.typeName.name="const"])',
          message: 'No type assertions: narrow the value or parse it with a Zod schema.',
        },
        {
          selector: 'TSTypeAssertion',
          message: 'No type assertions: narrow the value or parse it with a Zod schema.',
        },
        {
          selector: 'ExportAllDeclaration, ExportNamedDeclaration[source]',
          message: 'No re-exports (barrel files): import from the module that defines the symbol.',
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': true, 'ts-ignore': true, 'ts-nocheck': true, 'ts-check': false },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        { selector: 'variable', format: ['camelCase'] },
        // Module-level: components are PascalCase, fixed values are SCREAMING_SNAKE_CASE.
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          types: ['boolean', 'string', 'number', 'array'],
          format: ['UPPER_CASE'],
        },
        // Destructured names mirror the source object's keys (e.g. an `Icon` component prop).
        { selector: ['variable', 'parameter'], modifiers: ['destructured'], format: null },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: ['objectLiteralProperty', 'typeProperty'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        // React Router's lazy route API requires `Component` / `ErrorBoundary` keys.
        { selector: 'objectLiteralMethod', format: ['camelCase', 'PascalCase'] },
        {
          selector: ['objectLiteralProperty', 'typeProperty', 'objectLiteralMethod'],
          modifiers: ['requiresQuotes'],
          format: null,
        },
      ],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true, project: './tsconfig.app.json' } },
      'boundaries/include': ['src/**/*'],
      'boundaries/files': [
        { pattern: 'src/main.tsx', category: 'entry' },
        { pattern: 'src/entry-server.*', category: 'entry' },
      ],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
        {
          type: 'shared',
          pattern: 'src/{assets,components,config,hooks,lib,styles,testing,types,utils}',
        },
      ],
    },
    rules: {
      // One-way dependencies: app → features → shared. Features never import each other.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            { allow: { to: { module: { origin: ['external', 'core'] } } } },
            {
              // Entries (browser bootstrap, prerender entry and its test) sit on top of app.
              from: { file: { categories: 'entry' } },
              allow: {
                to: [{ element: { type: ['app', 'shared'] } }, { file: { categories: 'entry' } }],
              },
            },
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { type: ['app', 'feature', 'shared'] } } },
            },
            {
              from: { element: { type: 'feature' } },
              allow: {
                to: [
                  { element: { type: 'shared' } },
                  {
                    element: {
                      type: 'feature',
                      captured: { featureName: '{{from.element.captured.featureName}}' },
                    },
                  },
                ],
              },
            },
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },
          ],
        },
      ],
      'boundaries/no-unknown-files': 'error',
    },
  },

  {
    files: ['src/**/*'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
    },
  },

  {
    // Type augmentations merge into a library's interface: that takes an `interface`, and
    // a template-literal key (`--${string}`) takes an index signature.
    files: ['src/types/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
    },
  },

  {
    files: ['*.config.ts', 'e2e/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: { globals: globals.node },
  },

  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  prettier,
]);
