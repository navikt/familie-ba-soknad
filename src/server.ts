import path from 'path';

import dotenv from 'dotenv';
import express from 'express';
import mustacheExpress from 'mustache-express';

import getDecorator from './dekorator';
import { createApiForwardingFunction } from './proxy';

dotenv.config();

const app = express();

app.set('views', `${__dirname}/../build`);
app.set('view engine', 'mustache');
app.engine('html', mustacheExpress());

app.use('/api', createApiForwardingFunction());

// Static files
app.use(express.static(path.join(__dirname, '..', 'build'), { index: false }));

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
