import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFelt = ({
    søknadsfelt,
    feilmeldingSpråkId,
    skalFeltetVises,
    nullstillVedAvhengighetEndring = false,
}: {
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmeldingSpråkId: string;
    skalFeltetVises: boolean;
    nullstillVedAvhengighetEndring?: boolean;
}) => {
    return useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.skalFeltetVises;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>, avhengigheter) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      avhengigheter?.feilmeldingSpråkId ? (
                          <SpråkTekst id={avhengigheter.feilmeldingSpråkId} />
                      ) : (
                          ''
                      )
                  );
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { skalFeltetVises, feilmeldingSpråkId },
    });
};

export default useLanddropdownFelt;
