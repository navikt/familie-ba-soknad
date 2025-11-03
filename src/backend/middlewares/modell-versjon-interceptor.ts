import { RequestHandler } from 'express';

import { logError, logInfo } from '@navikt/familie-logging';
import { type ApiRessurs, RessursStatus } from '@navikt/familie-typer';

import {
    modellMismatchMelding,
    ModellMismatchRespons,
    modellVersjon,
    modellVersjonHeaderName,
} from '../../shared-utils/modellversjon';

export const modellVersjonInterceptor: RequestHandler = (req, res, next) => {
    const requestModellVersjon = req.get(modellVersjonHeaderName);
    const requestModellVersjonInt = Number.parseInt(requestModellVersjon ?? '0');
    logInfo('Modellversjon i request:' + requestModellVersjon);
    logInfo('Utledet modellversjon i request:' + requestModellVersjonInt);
    logInfo('Gjeldende modellversjon:' + modellVersjon);
    if (!requestModellVersjon || requestModellVersjonInt < modellVersjon) {
        const responsBody: ApiRessurs<ModellMismatchRespons> = {
            data: { modellVersjon },
            melding: modellMismatchMelding,
            stacktrace: '',
            status: RessursStatus.FEILET,
        };
        logError('Modellversjon mismatch - sender 403 tilbake til klient');
        res.status(403).send(responsBody);
    } else {
        next();
    }
};
