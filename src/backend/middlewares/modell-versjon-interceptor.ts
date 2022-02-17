import { RequestHandler } from 'express';

import familieTyper from '@navikt/familie-typer';

import {
    modellMismatchMelding,
    ModellMismatchRespons,
    modellVersjon,
    modellVersjonHeaderName,
} from '../../shared-utils/modellversjon';

export const modellVersjonInterceptor: RequestHandler = (req, res, next) => {
    const requestModellVersjon = req.get(modellVersjonHeaderName);
    const requestModellVersjonInt = Number.parseInt(requestModellVersjon ?? '0');
    if (!requestModellVersjon || requestModellVersjonInt < modellVersjon) {
        const responsBody: familieTyper.ApiRessurs<ModellMismatchRespons> = {
            data: { modellVersjon },
            melding: modellMismatchMelding,
            stacktrace: '',
            status: familieTyper.RessursStatus.FEILET,
        };
        res.status(403).send(responsBody);
    } else {
        next();
    }
};
