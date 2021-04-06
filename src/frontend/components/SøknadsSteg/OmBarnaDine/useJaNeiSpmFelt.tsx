import React, { useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import {
    Avhengigheter,
    feil,
    FeltState,
    ok,
    useFelt,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { søknadDataKeySpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const useJaNeiSpmFelt = (
    søknadsdatafelt: søknadDataKeySpørsmål,
    språkTekstIdForFeil: string,
    avhengigheter?: Avhengigheter
) => {
    const { søknad } = useApp();
    const [harBlittVist, settHarBlittVist] = useState<boolean>(!avhengigheter);

    return useFelt<ESvar | undefined>({
        feltId: søknad[søknadsdatafelt].id,
        nullstillVedAvhengighetEndring: false,
        verdi: søknad[søknadsdatafelt].svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            if (harBlittVist) {
                return true;
            }

            const skalVises = !Object.values(avhengigheter).find(
                felt => felt.valideringsstatus !== Valideringsstatus.OK
            );
            skalVises && settHarBlittVist(true);
            return skalVises;
        },
        avhengigheter: avhengigheter,
    });
};

export default useJaNeiSpmFelt;
