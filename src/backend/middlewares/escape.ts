import { RequestHandler } from 'express';
import xss from 'xss';

import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/v6';

export const escapeBody: RequestHandler = async (req, _res, next) => {
    const søknad: ISøknadKontrakt = req.body;
    req.body = JSON.parse(xss(JSON.stringify(søknad)));
    next();
};
