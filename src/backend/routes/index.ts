import { Express, RequestHandler } from 'express';

const naisMetaTags = (): string => {
    const app = process.env.NAIS_APP_NAME ?? '';
    const team = process.env.NAIS_NAMESPACE ?? process.env.NAIS_TEAM ?? '';
    const cluster = process.env.NAIS_CLUSTER_NAME ?? '';
    const telemetryUrl = process.env.NAIS_TELEMETRY_URL ?? '';

    if (!app && !team) return '';

    return [
        app ? `<meta name="nais-app" content="${app}">` : '',
        team ? `<meta name="nais-team" content="${team}">` : '',
        cluster ? `<meta name="nais-cluster" content="${cluster}">` : '',
        telemetryUrl ? `<meta name="nais-telemetry-url" content="${telemetryUrl}">` : '',
    ]
        .filter(Boolean)
        .join('\n    ');
};

export const indexHandler: RequestHandler = async (req, res) => {
    const språk = req.cookies['decorator-language'];

    const hbsVariabler = {
        LOCALE_CODE: språk ?? 'nb',
        NAIS_META_TAGS: naisMetaTags(),
    };

    res.render('index.html', hbsVariabler);
};

export const konfigurerIndex = (app: Express): Express => {
    app.get('/', indexHandler);
    return app;
};

export const konfigurerIndexFallback = (app: Express): Express => {
    // Fallback, alt vi ikke treffer med andre handlere returnerer index.html
    app.get('*splat', indexHandler);
    return app;
};

export default indexHandler;
