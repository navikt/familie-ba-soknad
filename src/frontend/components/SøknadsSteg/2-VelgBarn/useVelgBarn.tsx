import React from 'react';

import { FormattedMessage } from 'react-intl';

import { feil, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { IBarnNy } from '../../../typer/person';

export interface IStegToFeltTyper {
    barnMedISøknad: IBarnNy[];
}

export const useVelgBarn = (): {
    skjema: ISkjema<IStegToFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
} => {
    const { søknad } = useApp();
    const { barn: barnMedISøknad } = søknad;

    const barnMedISøknadFelt = useFelt<IBarnNy[]>({
        verdi: barnMedISøknad,
        valideringsfunksjon: (felt, avhengigheter) => {
            return avhengigheter?.barnMedISøknad.length > 0
                ? ok(felt)
                : feil(felt, <FormattedMessage id={'velgbarn.feilmelding.du-må-velge-barn'} />);
        },
        avhengigheter: { barnMedISøknad },
    });

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IStegToFeltTyper, string>({
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
