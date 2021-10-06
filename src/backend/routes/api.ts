import express, { Express } from 'express';

import { basePath } from '../environment';
import { erklaeringInterceptor } from '../middlewares/erklaering-interceptor';
import { escapeBody } from '../middlewares/escape';
import { createApiForwardingFunction } from '../middlewares/proxy';

export const konfigurerApi = (app: Express): Express => {
    // Sett opp middleware for input-sanitering
    app.use(`${basePath}api/soknad`, express.json());
    app.use(`${basePath}api/soknad`, erklaeringInterceptor);
    app.use(`${basePath}api/soknad`, escapeBody);
    app.use(`${basePath}api`, createApiForwardingFunction());

    return app;
};
