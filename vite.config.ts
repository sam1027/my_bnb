import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 꼭 있어야 `@` 경로 인식돼
      },
    },
    css: {
      postcss: './postcss.config.js',
    },
    server: {
      port: 3000,
      open: false,
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild', // esbuild를 사용해 빠르게 압축
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'; // node_modules 코드 분리 (코드 스플리팅)
            }
          },
        },
      },
    },
    base: '/my-bnb',
  };
});
