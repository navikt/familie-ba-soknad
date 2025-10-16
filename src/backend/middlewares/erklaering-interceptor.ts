import { Request, Response, NextFunction, RequestHandler } from 'express';

import { byggFeiletRessurs } from '@navikt/familie-typer';

import engelsk from '../../frontend/assets/lang/en.json' with { type: 'json' };
import bokmål from '../../frontend/assets/lang/nb.json' with { type: 'json' };
import nynorsk from '../../frontend/assets/lang/nn.json' with { type: 'json' };
import { LocaleType } from '../../frontend/typer/common.js';
import { ISøknadKontrakt } from '../../frontend/typer/kontrakt/kontrakt.js';

export const hentSpråkteksterAlleSpråk = (språknøkkel: string): Record<LocaleType, string> => {
    return {
        nb: bokmål[språknøkkel],
        nn: nynorsk[språknøkkel],
        en: engelsk[språknøkkel],
    };
};

export const erklaeringInterceptor: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const søknad: ISøknadKontrakt = request.body;
    const spmKey = 'lestOgForståttBekreftelse';
    const aksepterteSvarSpråkNøkkel = 'forside.bekreftelsesboks.erklæring.spm';
    const aksepterteSvar = Object.values(hentSpråkteksterAlleSpråk(aksepterteSvarSpråkNøkkel));

    if (!('spørsmål' in søknad && spmKey in søknad.spørsmål && 'verdi' in søknad.spørsmål[spmKey])) {
        response.status(400).send(byggFeiletRessurs('Ugyldig søknadformat'));
        return;
    }

    const svar = søknad.spørsmål[spmKey];

    if (aksepterteSvar.includes(svar.verdi[søknad.originalSpråk])) {
        next();
    } else {
        response.status(403).send(byggFeiletRessurs('Du må huke av for at du oppgir korrekte opplysninger'));
    }
};
