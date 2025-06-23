import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './vitest.setup.ts',
    },
    // For å fikse window-problemer med dekoratøren:
    // https://github.com/vitest-dev/vitest/issues/1293#issuecomment-1560660670
    define: process.env.VITEST ? {} : { global: 'window' },
});
