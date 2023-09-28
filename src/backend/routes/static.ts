import path from 'path';

import express, { Express } from 'express';
import mustacheExpress from 'mustache-express';

import { basePath } from '../../shared-utils/Miljø';

export const konfigurerStatic = (app: Express): Express => {
    // Sett opp mustache templates for index.html og disabled.html
    const frontendMappe = path.join(process.cwd(), 'dist');
    app.set('views', frontendMappe);
    app.set('view engine', 'mustache');
    app.engine('html', mustacheExpress());

    // I dev-mode vil vi ikke cache index.html, siden denne oppdateres med nye js-bundles når vi endrer ting i appen
    process.env.NODE_ENV !== 'production' && app.set('view cache', false);

    console.log('NODE_ENV = ' + process.env.NODE_ENV);
    console.log('BASE_PATH = ' + basePath + ',' + process.env.BASE_PATH);
    console.log('Frontend-mappe = ' + frontendMappe);

    // Serve alle statiske filer utenom index.html direkte fra dist-mappen
    app.use(basePath, express.static(frontendMappe, { index: false }));
    return app;
};
