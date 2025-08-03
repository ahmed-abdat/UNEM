/* eslint-env node */

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off', // Disable prop-types validation
    'no-unused-vars': ['error', { 'varsIgnorePattern': '^React$' }], // Allow React import
    'react/no-unescaped-entities': 'warn', // Warn instead of error for unescaped entities
    'react/jsx-no-target-blank': ['error', { allowReferrer: true }], // Allow referrer for target="_blank"
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], // Allow warnings for UI components
  },
  overrides: [
    {
      files: ['scripts/**/*.js'],
      env: { node: true, browser: false },
    },
  ],
}
