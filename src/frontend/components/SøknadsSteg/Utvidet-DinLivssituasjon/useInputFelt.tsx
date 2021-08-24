import React from 'react';

import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import useFørsteRender from '../../../hooks/useFørsteRender';
import { ISøknadSpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const useInputFelt = (
    søknadsfelt: ISøknadSpørsmål<string>,
    feilmeldingSpråkId: string,
    skalVises: boolean
) => {
    const input = useFelt<string>({
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

    useFørsteRender(() => {
        input.verdi !== '' && input.validerOgSettFelt(input.verdi);
    });

    return input;
};

export default useInputFelt;
