import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFelt = (
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | ''>,
    feilmelding: string,
    skalFeltetVises: boolean,
    nullstillVedAvhengighetEndring = false
) => {
    return useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.skalFeltetVises;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>, avhengigheter) => {
            return felt.verdi !== '' ? ok(felt) : feil(felt, avhengigheter?.feilmelding);
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { skalFeltetVises, feilmelding },
    });
};

export default useLanddropdownFelt;
