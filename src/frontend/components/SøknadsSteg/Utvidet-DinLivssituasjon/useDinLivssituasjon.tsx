import React from 'react';

import { feil, FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { Årsak } from './types-and-utilities';

export interface IDinLivssituasjonFeltTyper {
    årsak: Årsak | '';
}

export const useDinLivssituasjon = (): {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    validerAlleSynligeFelter: () => void;
} => {
    const { søknad, settSøknad } = useApp();
    const søker = søknad.søker;

    const årsak = useFelt<Årsak | ''>({
        feltId: søker.utvidet.spørsmål.årsak.id,
        verdi: søker.utvidet.spørsmål.årsak.svar,
        valideringsfunksjon: (felt: FeltState<Årsak | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'omdeg.velgårsak.feilmelding'} />);
        },
    });

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IDinLivssituasjonFeltTyper,
        string
    >({
        felter: {
            årsak,
        },
        skjemanavn: 'dinlivssituasjon',
    });

    const oppdaterSøknad = () => {
        settSøknad({
            ...søknad,
            søker: {
                ...søknad.søker,
                utvidet: {
                    ...søknad.søker.utvidet,
                    spørsmål: {
                        ...søknad.søker.utvidet.spørsmål,
                        årsak: {
                            ...søknad.søker.utvidet.spørsmål.årsak,
                            svar: skjema.felter.årsak.verdi,
                        },
                    },
                },
            },
        });
    };

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
        oppdaterSøknad,
    };
};
