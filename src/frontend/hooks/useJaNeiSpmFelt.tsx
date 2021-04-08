import React, { useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, FeltState, ok, useFelt, Valideringsstatus } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { FeltGruppe } from '../components/SøknadsSteg/OmDeg/useOmdeg';
import { ISøknadSpørsmål } from '../typer/søknad';

export const erRelevanteAvhengigheterValidert = (avhengigheter: { [key: string]: FeltGruppe }) => {
    if (
        Object.values(avhengigheter).find(
            feltGruppe => feltGruppe.jaNeiSpm.valideringsstatus !== Valideringsstatus.OK
        )
    ) {
        return false;
    }

    const tilhørendeSomIkkeErValidert = Object.values(avhengigheter).filter(feltGruppe => {
        if (!feltGruppe.tilhørendeFelter) {
            return false;
        } else {
            return !!feltGruppe.tilhørendeFelter.find(
                tilhørendeFelt =>
                    tilhørendeFelt.erSynlig &&
                    tilhørendeFelt.valideringsstatus !== Valideringsstatus.OK
            );
        }
    });
    return tilhørendeSomIkkeErValidert.length === 0;
};

const useJaNeiSpmFelt = (
    søknadsfelt: ISøknadSpørsmål<ESvar | undefined>,
    språkTekstIdForFeil: string,
    avhengigheter?: {
        [key: string]: FeltGruppe;
    },
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
        skalFeltetVises: (avhengigheter: { [key: string]: FeltGruppe }) => {
            if (!avhengigheter) return harBlittVist;
            if (harBlittVist) {
                return true;
            }

            // borPåRegistrertAdresse er et spesialtilfelle for avhengighet, fordi hvis svaret på den er Nei må man søke på papir.
            if (
                avhengigheter.borPåRegistrertAdresse &&
                avhengigheter.borPåRegistrertAdresse.jaNeiSpm.verdi === ESvar.NEI
            ) {
                return false;
            }

            const skalVises = erRelevanteAvhengigheterValidert(avhengigheter);
            skalVises && settHarBlittVist(true);

            return skalVises;
        },
        avhengigheter: avhengigheter,
    });
};

export default useJaNeiSpmFelt;
