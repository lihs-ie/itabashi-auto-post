'use strict';

const gtsConfig = require('gts/build/eslint.config.js');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      'build/**',
      'dist/**',
      'dist-dev/**',
      'dist-prd/**',
      'template/**',
      'template-ui/**',
      'testing/**',
    ],
  },
  ...gtsConfig,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './test/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'n/no-unpublished-import': [
        'error',
        {
          allowModules: [
            'sync-request',
            'jest-to-equal-type',
            'uuid',
            'immutable',
          ],
        },
      ],
    },
  },
];
