import React from 'react';

import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarn } from '../../../typer/person';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

export interface IVelgBarnFeltTyper {
    barnMedISøknad: IBarn[];
}

export const useVelgBarn = (): {
    skjema: ISkjema<IVelgBarnFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
} => {
    const { søknad } = useApp();
    const { barn: barnMedISøknad } = søknad;

    const barnMedISøknadFelt = useFelt<IBarn[]>({
        verdi: barnMedISøknad,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.barnMedISøknad.length > 0
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'velgbarn.feilmelding.du-må-velge-barn'} />);
        },
        avhengigheter: { barnMedISøknad },
    });

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IVelgBarnFeltTyper, string>({
        felter: {
            barnMedISøknad: barnMedISøknadFelt,
        },
        skjemanavn: 'velgbarn',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
    };
};
