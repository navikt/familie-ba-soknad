import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { søknadDataKeySpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const useJaNeiSpmFelt = (søknadsdatafelt: søknadDataKeySpørsmål, språkTekstIdForFeil: string) => {
    const { søknad } = useApp();

    return useFelt<ESvar | undefined>({
        feltId: søknad[søknadsdatafelt].id,
        verdi: søknad[søknadsdatafelt].svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
    });
};

export default useJaNeiSpmFelt;
