import { RequestHandler } from 'express';
import xss from 'xss';

import { ISøknadKontraktV7 } from '../../frontend/typer/kontrakt/v7';

export const escapeBody: RequestHandler = async (req, _res, next) => {
    const søknad: ISøknadKontraktV7 = req.body;
    req.body = JSON.parse(xss(JSON.stringify(søknad)));
    next();
};
