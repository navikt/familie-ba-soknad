import React from 'react';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/søknad';

const useInputFelt = (
    søknadsfelt: ISøknadSpørsmål<string>,
    feilmeldingSpråkId: string,
    skalVises = true
) =>
    useFelt<string>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt: FeltState<string>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={feilmeldingSpråkId} />);
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
    });

export default useInputFelt;
