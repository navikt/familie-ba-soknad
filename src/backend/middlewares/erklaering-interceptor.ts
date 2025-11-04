import { RequestHandler, Request, Response, NextFunction } from 'express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import engelsk from '../../frontend/assets/lang/en.json' with { type: 'json' };
import bokmål from '../../frontend/assets/lang/nb.json' with { type: 'json' };
import nynorsk from '../../frontend/assets/lang/nn.json' with { type: 'json' };
import { LocaleType } from '../../frontend/typer/common';
import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/kontrakt';

export const hentSpråkteksterAlleSpråk = (språknøkkel: string): Record<LocaleType, string> => {
    return {
        nb: bokmål[språknøkkel],
        nn: nynorsk[språknøkkel],
        en: engelsk[språknøkkel],
    };
};

export const erklaeringInterceptor: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const søknad: ISøknadKontrakt = request.body;
    const lestOgForståttErklæringKey = 'lestOgForståttBekreftelse';

    if (!(lestOgForståttErklæringKey in søknad)) {
        response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat'));
        return;
    }

    if (søknad.lestOgForståttBekreftelse) {
        next();
    } else {
        response.status(400).send(byggFeiletRessurs('Du må huke av for at du oppgir korrekte opplysninger'));
    }
};
