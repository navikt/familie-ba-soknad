import { RequestHandler } from 'express';

import { logInfo } from '@navikt/familie-logging';
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
    if (!requestModellVersjon || requestModellVersjonInt < modellVersjon) {
        const responsBody: ApiRessurs<ModellMismatchRespons> = {
            data: { modellVersjon },
            melding: modellMismatchMelding,
            stacktrace: '',
            status: RessursStatus.FEILET,
        };
        const callId = req.headers['nav-call-id'] ?? req.headers['x-correlation-id'];
        logInfo(
            `Utdatert modellVersjon. Nåværende: ${modellVersjon}, versjon i request: ${requestModellVersjon}. CallID: ${callId}`
        );
        res.status(403).send(responsBody);
    } else {
        next();
    }
};
