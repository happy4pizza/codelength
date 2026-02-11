import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// Prettier integration
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Prettier as recommendations only
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // Disable ESLint rules that fight Prettier
  eslintConfigPrettier,

  // Override default ignores of eslint-config-next
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
