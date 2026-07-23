import path from 'path';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { BASE_PATH } from './src/common/miljø';

// Backend (Node/Express) kjører lokalt på denne porten, se src/common/miljø.ts
const BACKEND_URL = 'http://localhost:55554';

export default defineConfig({
    root: path.resolve(__dirname, 'src/frontend'),
    base: BASE_PATH,
    plugins: [
        react(),
        process.env.SENTRY_AUTH_TOKEN
            ? sentryVitePlugin({
                  org: 'nav',
                  project: 'familie-ba-soknad',
                  authToken: process.env.SENTRY_AUTH_TOKEN,
                  url: 'https://sentry.gc.nav.no/',
                  release: {
                      name: process.env.SENTRY_RELEASE,
                  },
                  sourcemaps: {
                      assets: ['dist/**'],
                      filesToDeleteAfterUpload: ['dist/**/*.js.map'],
                  },
                  errorHandler: err => {
                      console.warn('Sentry Vite Plugin: ' + err.message);
                  },
              })
            : undefined,
    ],
    server: {
        port: 3000,
        // Tillat at vite dev-serveren leser filer utenfor src/frontend (f.eks. src/common)
        fs: {
            allow: [path.resolve(__dirname)],
        },
        proxy: {
            [`${BASE_PATH}api`]: { target: BACKEND_URL, changeOrigin: true },
            [`${BASE_PATH}dokument`]: { target: BACKEND_URL, changeOrigin: true },
            [`${BASE_PATH}modellversjon`]: { target: BACKEND_URL, changeOrigin: true },
            [`${BASE_PATH}toggles`]: { target: BACKEND_URL, changeOrigin: true },
            [`${BASE_PATH}konverter`]: { target: BACKEND_URL, changeOrigin: true },
        },
    },
    build: {
        // Backend serverer statiske filer fra denne mappen, se src/backend/routes/static.ts
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: false,
        // Sourcemaps trengs for at Sentry skal kunne laste opp og vise korrekt stacktrace
        sourcemap: true,
    },
});
