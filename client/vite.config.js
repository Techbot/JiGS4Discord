import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'

export default defineConfig({
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

    },
  },
})
