import React, { useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import {
    Avhengigheter,
    feil,
    Felt,
    FeltState,
    ok,
    useFelt,
    Valideringsstatus,
} from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { søknadDataKeySpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

type JaNeiSpmFeltAvhengigheter = { [key: string]: Felt<ESvar | undefined> };

const useJaNeiSpmFelt = (
    søknadsdatafelt: søknadDataKeySpørsmål,
    språkTekstIdForFeil: string,
    avhengigheter?: JaNeiSpmFeltAvhengigheter
) => {
    const { søknad } = useApp();
    const [harBlittVist, settHarBlittVist] = useState<boolean>(!avhengigheter);

    return useFelt<ESvar | undefined>({
        feltId: søknad[søknadsdatafelt].id,
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

            const avhengigeJaNeiSpmIkkeSvartPå = Object.values(avhengigheter).find(
                (jaNeiSpørsmål: Felt<ESvar | undefined>) =>
                    jaNeiSpørsmål.valideringsstatus !== Valideringsstatus.OK
            );

            const skalVises = !avhengigeJaNeiSpmIkkeSvartPå;
            skalVises && settHarBlittVist(true);

            return skalVises;
        },
        avhengigheter: avhengigheter,
    });
};

export default useJaNeiSpmFelt;
