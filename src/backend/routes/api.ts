import express, { Express, RequestHandler } from 'express';

import { BASE_PATH } from '../../common/miljø.js';
import { envVar } from '../env.js';
import { erklaeringInterceptor } from '../middlewares/erklaering-interceptor.js';
import { escapeBody } from '../middlewares/escape.js';
import { modellVersjonInterceptor } from '../middlewares/modell-versjon-interceptor.js';
import { addCallId, doProxy } from '../middlewares/proxy.js';
import attachToken from '../middlewares/tokenProxy.js';

export const konfigurerApi = (app: Express): Express => {
    // Sett opp middleware for input-sanitering
    app.use(`${BASE_PATH}api/soknad`, modellVersjonInterceptor);
    app.use(`${BASE_PATH}api/soknad`, express.json({ limit: '5mb' }) as RequestHandler);
    app.use(`${BASE_PATH}api/soknad`, erklaeringInterceptor);
    app.use(`${BASE_PATH}api/soknad`, escapeBody);

    app.use(
        `${BASE_PATH}api`,
        addCallId(),
        attachToken('familie-baks-soknad-api'),
        doProxy(envVar('VITE_SOKNAD_API_PROXY_URL'))
    );

    app.use(`${BASE_PATH}dokument`, addCallId(), attachToken('familie-dokument'), doProxy(envVar('VITE_DOKUMENT_URL')));
    return app;
};
