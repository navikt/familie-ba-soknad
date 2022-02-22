import { RequestHandler } from 'express';

import * as familieTyper from '@navikt/familie-typer';
import { ApiRessurs } from '@navikt/familie-typer';

import {
    modellMismatchMelding,
    ModellMismatchRespons,
    modellVersjon,
    modellVersjonHeaderName,
} from '../../shared-utils/modellversjon';
const { RessursStatus } = familieTyper;

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
        res.status(403).send(responsBody);
    } else {
        next();
    }
};
