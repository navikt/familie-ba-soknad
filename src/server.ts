import dotenv from 'dotenv';
import express from 'express';
import mustacheExpress from 'mustache-express';

import getDecorator from './dekorator.js';
import { createApiForwardingFunction } from './proxy.js';
import finnFrontendMappe from './utils/finnFrontendMappe.js';

dotenv.config();

const app = express();

const frontendBuild = finnFrontendMappe();

app.set('views', frontendBuild);
app.set('view engine', 'mustache');
app.engine('html', mustacheExpress());

app.use('/api', createApiForwardingFunction());

// Static files
app.use(express.static(frontendBuild, { index: false }));

// Nais functions
app.get(`/internal/isAlive|isReady`, (_req, res) => res.sendStatus(200));

app.get('*', (_req, res) =>
    getDecorator()
        .then(fragments => {
            // @ts-ignore
            res.render('index.html', fragments);
        })
        .catch(e => {
            console.log(e);
            const error = `En feil oppstod. Klikk <a href="https://www.nav.no">her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
            res.status(500).send(error);
        })
);

app.listen(9000);
