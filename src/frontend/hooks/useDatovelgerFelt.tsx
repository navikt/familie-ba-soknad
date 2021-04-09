import React from 'react';

import dayjs from 'dayjs';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { feil, Felt, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/søknad';

const useDatovelgerFelt = (
    søknadsfelt: ISøknadSpørsmål<ISODateString>,
    språkTekstIdForFeil: string,
    avhengigSvarCondition: ESvar,
    avhengighet?: Felt<ESvar | undefined>
) => {
    return useFelt<ISODateString>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        valideringsfunksjon: felt => {
            return dayjs(felt.verdi, 'YYYY-MM-DD').format('YYYY-MM-DD') === felt.verdi
                ? ok(felt)
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
        skalFeltetVises: avhengigheter => {
            return avhengigheter && avhengigheter.jaNeiSpm
                ? (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>).verdi ===
                      avhengigSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet },
    });
};

export default useDatovelgerFelt;
