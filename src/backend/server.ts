import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';

import { logInfo } from '@navikt/familie-logging';

import environment, { basePath } from './environment';
import { expressToggleInterceptor } from './middlewares/feature-toggles';
import { konfigurerIndex, konfigurerIndexFallback } from './routes';
import { konfigurerApi } from './routes/api';
import { konfigurerFeatureTogglesEndpoint } from './routes/feature-toggles';
import { konfigurerBildeProsessering } from './routes/imageprocessor';
import { konfigurerModellVersjonEndpoint } from './routes/modellversjon';
import { konfigurerNais } from './routes/nais';
import { konfigurerStatic } from './routes/static';

dotenv.config();
const app = express();

// Alltid bruk gzip-compression på alt vi server med express
app.use(compression());

// Parse cookies for bruk i dekoratør-fetch
app.use(cookieParser());

konfigurerStatic(app);

// Middleware for unleash kill-switch
app.use(expressToggleInterceptor);

konfigurerIndex(app);
konfigurerNais(app);
konfigurerApi(app);
konfigurerBildeProsessering(app);
konfigurerFeatureTogglesEndpoint(app);
konfigurerModellVersjonEndpoint(app);

konfigurerIndexFallback(app);

logInfo(`Starting server on localhost: http://localhost:${environment().port}${basePath}`);

app.listen(environment().port);
