/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/(answers|questions)\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'data',
              expiration: {
                maxAgeSeconds: 30 * 24 * 60 * 60,
              }
            }
          }
        ],
        skipWaiting: true,
      },
      manifest: {
        name: 'Math Practice',
        short_name: 'Math Practice',
        orientation: 'portrait',
        lang: 'id',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ef4444',
        background_color: '#ffffff',
      }
    })
  ]
});
