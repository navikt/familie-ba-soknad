import { Express } from 'express';

import { byggSuksessRessurs } from '@navikt/familie-typer';

import { BASE_PATH } from '../../shared-utils/miljø.js';
import { modellVersjon } from '../../shared-utils/modellversjon.js';

export const konfigurerModellVersjonEndpoint = (app: Express): Express => {
    app.get(`${BASE_PATH}modellversjon`, (_, res) => {
        res.send(byggSuksessRessurs(modellVersjon));
    });
    return app;
};
