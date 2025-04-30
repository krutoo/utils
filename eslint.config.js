import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginJSDoc from 'eslint-plugin-jsdoc';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // object with "ignores" only means global ignores in ESLint 9
  // yes, this is awful design but we have what we have
  {
    ignores: ['**/.tsimp/*', '**/dist/*', '**/tests-pkg/*', '**/tests-e2e/*'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'error',
      eqeqeq: 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
    },
  },
  {
    plugins: {
      react: pluginReact,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/jsx-curly-brace-presence': 'error',
    },
  },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useIsomorphicLayoutEffect)',
        },
      ],
    },
  },
  {
    ...pluginJSDoc.configs['flat/recommended'],
    rules: {
      ...pluginJSDoc.configs['flat/recommended'].rules,
      'jsdoc/require-description-complete-sentence': 'warn',
      'jsdoc/require-param': [
        'warn',
        {
          checkDestructured: false,
        },
      ],
      'jsdoc/check-param-names': [
        'warn',
        {
          checkDestructured: false,
        },
      ],
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-property-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/tag-lines': 'off',
      'jsdoc/require-jsdoc': 'error',
    },
  },
  {
    files: ['**/*.test.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
];
