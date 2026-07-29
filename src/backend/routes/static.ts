import path from 'path';

import express, { Express } from 'express';
import mustacheExpress from 'mustache-express';
import type { ViteDevServer } from 'vite';

import { BASE_PATH } from '../../common/miljø.js';

export const konfigurerStatic = (app: Express, viteDevServer?: ViteDevServer): Express => {
    const frontendMappe = viteDevServer ? path.join(process.cwd(), 'src/frontend') : path.join(process.cwd(), 'dist');
    app.set('views', frontendMappe);
    app.set('view engine', 'mustache');
    app.engine('html', mustacheExpress());

    // I dev-mode vil vi ikke cache index.html, siden denne oppdateres med nye js-bundles når vi endrer ting i appen
    if (process.env.NODE_ENV !== 'production') {
        app.set('view cache', false);
    }

    if (!viteDevServer) {
        // Serve alle statiske filer utenom index.html direkte fra dist-mappen
        app.use(BASE_PATH, express.static(frontendMappe, { index: false }));
    }
    return app;
};
