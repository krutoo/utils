export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [0],
    'body-max-line-length': [0],
    'subject-case': [0],
  },
} as const;
