import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { logInfo } from '@navikt/familie-logging';

import { BASE_PATH } from '../common/miljø.js';

import { cspString } from './csp.js';
import { envVar, erPreprod, erLokalt, erProd } from './env.js';
import { expressToggleInterceptor } from './middlewares/feature-toggles.js';
import { konfigurerApi } from './routes/api.js';
import { konfigurerAllFeatureTogglesEndpoint } from './routes/feature-toggles.js';
import { konfigurerIndex, konfigurerIndexFallback } from './routes/index.js';
import { konfigurerModellVersjonEndpoint } from './routes/modellversjon.js';
import { konfigurerNais } from './routes/nais.js';
import { konfigurerStatic } from './routes/static.js';
import { initializeUnleash } from './utils/unleash.js';

dotenv.config();

initializeUnleash();

const app = express();

// FIXME
// webpack serve kjører på en annen port enn oss, må tillate det som origin
if (process.env.NODE_ENV === 'development') {
    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        })
    );
}

// Alltid bruk gzip-compression på alt vi server med express
app.use(compression());

// Parse cookies, bl.a. for rendring av lang-attribute
app.use(cookieParser());

konfigurerStatic(app);

// Middleware for unleash kill-switch
app.use(expressToggleInterceptor);

app.use((_req, res, next) => {
    res.header('Content-Security-Policy', cspString(process.env.DEKORATOREN_URL ?? 'https://www.nav.no/dekoratoren'));
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    next();
});

konfigurerIndex(app);
konfigurerNais(app);
konfigurerApi(app);
konfigurerAllFeatureTogglesEndpoint(app);
konfigurerModellVersjonEndpoint(app);

konfigurerIndexFallback(app);

logInfo('erLokalt(): ' + erLokalt());
logInfo('erDev(): ' + erPreprod());
logInfo('erProd(): ' + erProd());
logInfo(`Starting server on localhost: http://localhost:${envVar('PORT')}${BASE_PATH}`);

app.listen(envVar('PORT'));
