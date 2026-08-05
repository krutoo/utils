import preset from '@krutoo/presets/eslint';
import type { Config } from 'eslint/config';

const config: Config[] = [
  ...preset,
  {
    rules: {
      // any is widely used in this project but it is justified
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
  {
    files: ['docs/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
  {
    files: ['tests-e2e/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
];

export default config;
