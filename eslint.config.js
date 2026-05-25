import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const typedTsConfig = {
  files: ['backend/src/**/*.{ts,tsx}', 'frontend/src/**/*.{ts,tsx}'],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  plugins: {
    react,
    'react-hooks': reactHooks,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    ...react.configs.flat.recommended.rules,
    ...react.configs.flat['jsx-runtime'].rules,
    ...reactHooks.configs.recommended.rules,
    'react/prop-types': 'off',
  },
};

const configTsConfig = {
  files: ['*.config.ts', 'vitest.config.ts'],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};

const nodeJsConfig = {
  files: [
    '*.config.js',
    '*.config.mjs',
    'scripts/**/*.mjs',
    'backend/**/*.js',
    'frontend/**/*.js',
    'frontend/**/*.mjs',
  ],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
};

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'backend/dist/**',
      'frontend/dist/**',
      'node_modules/**',
      'backend/logs/**',
      'backend/weather.db*',
      'dev.out.log',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  nodeJsConfig,
  configTsConfig,
  typedTsConfig,
]);
