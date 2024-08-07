import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [
      vue(), // write this
    ],
    server: {
      proxy: {
        /**
         * When developing locally - proxies "/api" to the local Colyseus server.
         * This mimics the behaviour of the production server.
         */
        '/api': {
          target: 'http://localhost:2567',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        /**
         * When developing locally - proxies "/drupal" to the local Drupal server.
         */
        '/drupal': {
          target: process.env.VITE_FULL_DRUPAL_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/drupal/, ''),
        }
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined, // Ensure manualChunks is undefined to disable chunking
          format: 'iife', // Use 'iife' format for a single self-contained file
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        },
      },
      chunkSizeWarningLimit: 5000, // Increase limit to avoid warnings
    },
  });
}
