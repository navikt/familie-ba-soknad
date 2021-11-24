import React from 'react';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/spørsmål';
import { trimWhiteSpace } from '../utils/hjelpefunksjoner';

const useInputFelt = ({
    søknadsfelt,
    feilmeldingSpråkId,
    skalVises = true,
}: {
    søknadsfelt: ISøknadSpørsmål<string>;
    feilmeldingSpråkId: string;
    skalVises?: boolean;
}) =>
    useFelt<string>({
        feltId: søknadsfelt.id,
        verdi: trimWhiteSpace(søknadsfelt.svar),
        valideringsfunksjon: (felt: FeltState<string>) => {
            const feltVerdi = trimWhiteSpace(felt.verdi);
            return feltVerdi !== '' ? ok(felt) : feil(felt, <SpråkTekst id={feilmeldingSpråkId} />);
        },
        avhengigheter: { skalVises },
        skalFeltetVises: avhengigheter => avhengigheter.skalVises,
    });

export default useInputFelt;
