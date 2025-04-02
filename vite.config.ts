import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // 👈 이거 추가
import tsconfigPaths from 'vite-tsconfig-paths'; // 👈 이것도 사용 가능

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ 꼭 있어야 `@` 경로 인식돼
    },
  },
  base: '/my-bnb/', // ❗️ 이게 꼭 있어야 함
});
