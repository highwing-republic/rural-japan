import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', '.local/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  { files: ['**/*.mjs'], languageOptions: { globals: { process: 'readonly', console: 'readonly', URL: 'readonly', fetch: 'readonly' } } },
);
