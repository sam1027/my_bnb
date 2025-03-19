import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.recommended, // ✅ React 플러그인 추가
      prettier, // ✅ Prettier 설정 추가 (ESLint와 충돌 방지)
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react, // ✅ React 플러그인 추가
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier, // ✅ Prettier 플러그인 추가
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off', // ✅ React 17+에서는 필요 없음
      'prettier/prettier': 'error', // ✅ Prettier 포맷 규칙 적용
    },
  },
);
