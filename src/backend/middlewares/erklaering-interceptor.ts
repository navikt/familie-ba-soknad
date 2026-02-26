import { RequestHandler, Request, Response, NextFunction } from 'express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import { ISøknadKontrakt } from '../../common/typer/kontrakt/kontrakt';

export const erklaeringInterceptor: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const søknad: ISøknadKontrakt = request.body;
    const lestOgForståttErklæringKey = 'lestOgForståttBekreftelse';

    if (!(lestOgForståttErklæringKey in søknad)) {
        response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat: mangler "lestOgForståttBekreftelse"'));
        return;
    }

    if (!søknad.lestOgForståttBekreftelse) {
        response.status(400).send(byggFeiletRessurs('Bruker har ikke huket av for at de oppgir korrekte opplysninger'));
        return;
    }

    next();
};
