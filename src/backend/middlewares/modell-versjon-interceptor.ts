import { RequestHandler } from 'cookies/node_modules/@types/express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import { modellVersjon, modellVersjonHeaderName } from '../../shared-utils/modellversjon';

export const modellVersjonInterceptor: RequestHandler = (req, res, next) => {
    const requestModellVersjon = req.get(modellVersjonHeaderName);
    const requestModellVersjonInt = Number.parseInt(requestModellVersjon ?? '0');
    if (!requestModellVersjon || requestModellVersjonInt < modellVersjon) {
        res.sendStatus(403).send(byggFeiletRessurs('Ny modellversjon, refresh siden'));
    } else {
        next();
    }
};
