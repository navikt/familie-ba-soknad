import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

const useNavnInputFelt = (
    feilmeldingSpråkId: string,
    avhengigheter: {
        navnetErUbestemt: Felt<ESvar>;
    }
) => {
    return useFelt<string | undefined>({
        verdi: '',
        valideringsfunksjon: (felt, avhengigheter) => {
            const navnErUbestemt = avhengigheter?.navnetErUbestemt?.verdi === ESvar.JA;
            if (navnErUbestemt) {
                return ok(felt);
            }
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={feilmeldingSpråkId} />);
        },
        avhengigheter,
    });
};

export default useNavnInputFelt;
