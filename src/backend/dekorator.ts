import { RequestHandler } from 'express';
import jsdom from 'jsdom';
import NodeCache from 'node-cache';
import request from 'request';

import { logError } from '@navikt/familie-logging';

import environment from './environment';

const { JSDOM } = jsdom;

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

// Refresh cache every hour
const cache = new NodeCache({
    stdTTL: SECONDS_PER_HOUR,
    checkperiod: SECONDS_PER_MINUTE,
});

interface DekoratørRespons {
    NAV_SCRIPTS: string;
    NAV_STYLES: string;
    NAV_HEADING: string;
    NAV_FOOTER: string;
}

export const getDecorator = (språk?: string): Promise<DekoratørRespons> =>
    new Promise((resolve, reject) => {
        const params = new URLSearchParams({
            simple: 'true',
            language: språk ?? 'nb',
        });
        const cacheKey = `main-cache-${params.get('language')}`;

        const decorator = cache.get<DekoratørRespons>(cacheKey);
        if (decorator) {
            resolve(decorator);
        } else {
            const dekoratørUrl = [environment().dekoratørUrl, params.toString()].join('?');
            request(dekoratørUrl, (error, response, body) => {
                if (!error && response.statusCode >= 200 && response.statusCode < 400) {
                    const { document } = new JSDOM(body).window;
                    const prop = 'innerHTML';
                    const data = {
                        NAV_SCRIPTS: document.getElementById('scripts')[prop],
                        NAV_STYLES: document.getElementById('styles')[prop],
                        NAV_HEADING: document.getElementById('header-withmenu')[prop],
                        NAV_FOOTER: document.getElementById('footer-withmenu')[prop],
                    };
                    cache.set(cacheKey, data);
                    resolve(data);
                } else {
                    reject(new Error(error));
                }
            });
        }
    });

export const indexHandler: RequestHandler = (req, res) => {
    const språk = req.cookies['decorator-language'];

    getDecorator(språk)
        .then(fragments => {
            res.render('index.html', fragments);
        })
        .catch((e: Error) => {
            logError('Feilmelding når vi henter dekoratøren: ', e);
            const error = `En feil oppstod. Klikk <a href="https://www.nav.no">her</a> for å gå tilbake til nav.no. Kontakt kundestøtte hvis problemet vedvarer.`;
            res.status(500).send(error);
        });
};
export default indexHandler;
