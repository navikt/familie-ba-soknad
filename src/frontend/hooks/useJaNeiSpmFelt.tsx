import React, { useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { feil, Felt, FeltState, ok, useFelt, Valideringsstatus } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/søknad';
import { useKunUtvidetFelt } from './useKunUtvidetFelt';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FeltGruppe {
    hovedSpørsmål: Felt<any>;
    tilhørendeFelter?: Felt<any>[];
}

export const erRelevanteAvhengigheterValidert = (avhengigheter: { [key: string]: FeltGruppe }) => {
    if (
        Object.values(avhengigheter).find(
            feltGruppe => feltGruppe.hovedSpørsmål.valideringsstatus !== Valideringsstatus.OK
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
    avhengigheter?: {
        [key: string]: FeltGruppe;
    },
    nullstillVedAvhengighetEndring = false,
    kunUtvidet = false
) => {
    const [harBlittVist, settHarBlittVist] = useState<boolean>(!avhengigheter);

    const feltFunksjon = kunUtvidet ? useKunUtvidetFelt : useFelt;

    return feltFunksjon<ESvar | undefined>({
        feltId: søknadsfelt.id,
        nullstillVedAvhengighetEndring,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: (felt: FeltState<ESvar | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.mangler-svar.feilmelding'} />);
        },
        skalFeltetVises: (avhengigheter: { [key: string]: FeltGruppe }) => {
            if (!avhengigheter) return harBlittVist;

            // borPåRegistrertAdresse er et spesialtilfelle for avhengighet, fordi hvis svaret på den er Nei må man søke på papir.
            if (
                avhengigheter.borPåRegistrertAdresse &&
                avhengigheter.borPåRegistrertAdresse.hovedSpørsmål.verdi === ESvar.NEI
            ) {
                return false;
            }

            if (harBlittVist) {
                return true;
            }

            // Hvis kall kommer fra useKunUtvidetFelt har vi med et felt "søknadstype" som ikke er en FeltGruppe
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { søknadstype, ...avhengigheterUtenSøknadstype } = avhengigheter;
            const skalVises = erRelevanteAvhengigheterValidert(avhengigheterUtenSøknadstype);
            skalVises && settHarBlittVist(true);

            return skalVises;
        },
        avhengigheter: avhengigheter,
    });
};

export default useJaNeiSpmFelt;
