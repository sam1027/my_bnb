import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // .env.[mode] 파일을 읽어온다 (예: .env.local, .env.production)
  const env = loadEnv(mode, process.cwd());

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
      proxy: {
        '/bnb': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/bnb/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
    },
    base: '/my-bnb',
  };
});
