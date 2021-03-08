module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    souceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    camelcase: 0,
  },
};
