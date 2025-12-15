import { RequestHandler, Request, Response, NextFunction } from 'express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import engelsk from '../../common/lang/en.json' with { type: 'json' };
import bokmål from '../../common/lang/nb.json' with { type: 'json' };
import nynorsk from '../../common/lang/nn.json' with { type: 'json' };
import { ISøknadKontrakt } from '../../common/typer/kontrakt/kontrakt';
import { LocaleType } from '../../common/typer/localeType';

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
        response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat: mangler "lestOgForståttBekreftelse"'));
        return;
    }

    if (!søknad.lestOgForståttBekreftelse) {
        response.status(400).send(byggFeiletRessurs('Bruker har ikke huket av for at de oppgir korrekte opplysninger'));
        return;
    }

    next();
};
