import path from 'path';

import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import mustacheExpress from 'mustache-express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import projectWebpackDevConfig from '../webpack/webpack.development.config.js';
import getDecorator from './dekorator.js';
import environment from './environment.js';
import { createApiForwardingFunction } from './proxy.js';

dotenv.config();
const app = express();

const frontendMappe = path.join(process.cwd(), 'dist');

app.set('views', frontendMappe + '/familie/barnetrygd/soknad/ordinaer');
app.set('view engine', 'mustache');
app.engine('html', mustacheExpress());

app.use(compression());
app.use('/familie/barnetrygd/soknad/ordinaer/api', createApiForwardingFunction());

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line
    // @ts-ignore
    const compiler = webpack(projectWebpackDevConfig);
    app.use(
        webpackDevMiddleware(compiler, {
            // eslint-disable-next-line
            // @ts-ignore
            publicPath: projectWebpackDevConfig.output.publicPath,
            writeToDisk: true,
        })
    );
    app.use(webpackHotMiddleware(compiler));
} else {
    // Static files
    app.use(express.static(frontendMappe, { index: false }));
}

// Nais functions
app.get(/^\/(internal\/)?(isAlive|isReady)\/?$/, (_req, res) => res.sendStatus(200));

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
