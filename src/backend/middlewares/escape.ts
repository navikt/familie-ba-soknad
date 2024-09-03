import { RequestHandler } from 'express';
import xss from 'xss';

import { ISøknadKontraktV8 } from '../../frontend/typer/kontrakt/v8';

export const escapeBody: RequestHandler = async (req, _res, next) => {
    const søknad: ISøknadKontraktV8 = req.body;
    req.body = JSON.parse(xss(JSON.stringify(søknad)));
    next();
};
