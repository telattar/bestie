import globals from 'globals';
import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config} */
export default {
  languageOptions: {
    globals: globals.node,
  },
  plugins: { import: importPlugin, prettier: eslintPluginPrettier },
  ...pluginJs.configs.recommended,
  rules: {
    'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
    'no-console': 'error',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    eqeqeq: 'error',
    semi: 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-prototype-builtins': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 140,
        singleQuote: true,
        semi: true,
        trailingComma: 'es5',
        escapeSequences: 'allow',
        jsxSingleQuote: true,
      },
    ],
  },
};
