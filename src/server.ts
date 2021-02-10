import path from 'path';

import dotenv from 'dotenv';
import express from 'express';
import mustacheExpress from 'mustache-express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

import getDecorator from './dekorator.js';
import environment from './environment.js';
import { createApiForwardingFunction } from './proxy.js';
import projectWebpackConfig from './webpack.config.js';

dotenv.config();
const compiler = webpack(projectWebpackConfig);
const app = express();

const frontendMappe = path.join(process.cwd(), 'dist');

app.set('views', frontendMappe);
app.set('view engine', 'mustache');
app.engine('html', mustacheExpress());

app.use('/api', createApiForwardingFunction());

if (process.env.NODE_ENV === 'development') {
    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: projectWebpackConfig.output.publicPath,
        })
    );
} else {
    // Static files
    app.use(express.static(frontendMappe, { index: false }));
}

// Nais functions
app.get(`/internal/isAlive|isReady`, (_req, res) => res.sendStatus(200));

app.get('*', (_req, res) =>
    getDecorator()
        .then(fragments => {
            // eslint-disable-next-line
            // @ts-ignore
            res.render('index.html', fragments);
        })
        .catch(e => {
            console.log(e);
            const error = `En feil oppstod. Klikk <a href="https://www.nav.no">her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
            res.status(500).send(error);
        })
);

console.log(`Starting server on localhost: http://localhost:${environment().port}`);

app.listen(environment().port);
