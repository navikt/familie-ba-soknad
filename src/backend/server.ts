import path from 'path';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mustacheExpress from 'mustache-express';

import { indexHandler } from './dekorator';
import environment from './environment';
import { escapeBody } from './escape';
import { expressToggleInterceptor } from './feature-toggles';
import { createApiForwardingFunction } from './proxy';

dotenv.config();
const app = express();

const basePath = process.env.BASE_PATH ?? '/';
const frontendMappe = path.join(process.cwd(), 'dist');

// Sett opp mustache templates for index.html og disabled.html
app.set('views', frontendMappe);
app.set('view engine', 'mustache');
app.engine('html', mustacheExpress());

// I dev-mode vil vi ikke cache index.html, siden denne oppdateres med nye js-bundles når vi endrer ting i appen
process.env.NODE_ENV === 'development' && app.set('view cache', false);

// Alltid bruk gzip-compression på alt vi server med express
app.use(compression());

// Parse cookies for bruk i dekoratør-fetch
app.use(cookieParser());

// Middleware for unleash kill-switch
app.use(expressToggleInterceptor);

// Sett opp middleware for input-sanitering
app.use(`${basePath}api/soknad`, express.json());
app.use(`${basePath}api/soknad`, escapeBody);
app.use(`${basePath}api`, createApiForwardingFunction());

// Rendrer index.html med dekoratøren
app.get('/', indexHandler);

// Serve alle statiske filer utenom index.html direkte fra dist-mappen
app.use(basePath, express.static(frontendMappe, { index: false }));

// Nais functions
app.get(/^\/(internal\/)?(isAlive|isReady)\/?$/, (_req, res) => res.sendStatus(200));

// Fallback, alt vi ikke treffer med andre handlere returnerer index.html
app.get('*', indexHandler);

console.log(`Starting server on localhost: http://localhost:${environment().port}${basePath}`);

app.listen(environment().port);
