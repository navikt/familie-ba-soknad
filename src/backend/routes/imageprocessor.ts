import { Express, RequestHandler, raw } from 'express';
import { default as convert } from 'heic-convert';

import { logError, logWarn } from '@navikt/familie-logging';

import { basePath } from '../environment';
import { jwtValidationInterceptor } from '../middlewares/jwt-interceptor';

async function prosesser(bilde: Buffer): Promise<Buffer> {
    return await convert({
        buffer: bilde, // the HEIC file buffer
        format: 'JPEG', // output format
        quality: 0.8, // the jpeg compression quality, between 0 and 1
    });
}

const bildeProsesseringHandler: RequestHandler = async (req, res) => {
    if (req.body === undefined) {
        logWarn('Mottok ingen data i bildeProsesseringHandler');
        res.sendStatus(400);
        return;
    }

    try {
        const jpeg = await prosesser(req.body);
        res.set('Content-Type', 'image/jpg');
        res.send(jpeg);
    } catch (reason) {
        logError('Feil under konvertering til jpeg', reason as Error);
        res.sendStatus(500);
    }
};

export const konfigurerBildeProsessering = (app: Express): Express => {
    const path = `${basePath}konverter`;
    const uploadOptions = {
        inflate: true,
        limit: '20Mb',
        type: '*/*',
    };

    app.use(path, raw(uploadOptions) as RequestHandler);
    app.use(path, jwtValidationInterceptor);
    app.post(path, bildeProsesseringHandler);

    return app;
};
