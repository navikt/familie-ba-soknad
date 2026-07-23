import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { BASE_PATH } from './src/common/miljø';

// Backend (Node/Express) kjører lokalt på denne porten, se src/common/miljø.ts
const BACKEND_URL = 'http://localhost:55554';

export default defineConfig({
    root: path.resolve(__dirname, 'src/frontend'),
    base: BASE_PATH,
    plugins: [react()],
    resolve: {
        alias: {
            'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
        },
    },
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
    },
});
