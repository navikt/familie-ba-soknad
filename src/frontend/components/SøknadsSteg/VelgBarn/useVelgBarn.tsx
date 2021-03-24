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
    oppdaterSøknad: () => void;
} => {
    const { søknad, settSøknad } = useApp();

    const barnMedISøknadFelt = useFelt<IBarn[]>({
        verdi: søknad.barn,
        valideringsfunksjon: felt => {
            return felt.verdi.length > 0
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'velgbarn.feilmelding.du-må-velge-barn'} />);
        },
    });

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IVelgBarnFeltTyper, string>({
        felter: {
            barnMedISøknad: barnMedISøknadFelt,
        },
        skjemanavn: 'velgbarn',
    });

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            barn: barnMedISøknadFelt.verdi,
        });
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
    };
};
