import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'bootstrap-vue-next';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const apiUrl = env.VITE_API_URL || 'http://localhost:5000/api';
  const target = apiUrl.startsWith('http')
    ? apiUrl.replace(/\/api$/, '')
    : 'http://localhost:5000';

  return {
    base: '/',
    plugins: [
      vue(),
      Components({
        resolvers: [BootstrapVueNextResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
        },
      },
    },
  };
});
