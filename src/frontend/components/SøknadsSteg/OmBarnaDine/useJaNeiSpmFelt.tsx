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

import { ISøknadSpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const useJaNeiSpmFelt = (
    søknadsfelt: ISøknadSpørsmål<ESvar | undefined>,
    språkTekstIdForFeil: string,
    avhengigheter?: Avhengigheter,
    nullstillVedAvhengighetEndring = false
) => {
    const [harBlittVist, settHarBlittVist] = useState<boolean>(!avhengigheter);

    return useFelt<ESvar | undefined>({
        feltId: søknadsfelt.id,
        nullstillVedAvhengighetEndring,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            // borPåRegistrertAdresse er et spesialtilfelle for avhengighet, fordi hvis svaret på den er Nei må man søke på papir.
            if (
                avhengigheter.borPåRegistrertAdresse &&
                avhengigheter.borPåRegistrertAdresse.verdi === ESvar.NEI
            ) {
                return false;
            }

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
