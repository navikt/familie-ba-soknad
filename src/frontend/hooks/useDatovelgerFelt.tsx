import React from 'react';

import dayjs from 'dayjs';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/søknad';

interface ILandDropdownAvhengighet {
    jaNeiSpm: Felt<ESvar | undefined>;
}

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
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            const typetAvhengigheter = avhengigheter as ILandDropdownAvhengighet;
            return typetAvhengigheter
                ? typetAvhengigheter.jaNeiSpm.verdi === avhengigSvarCondition
                : true;
        },
        avhengigheter: { jaNeiSpm: avhengighet } as ILandDropdownAvhengighet,
    });
};

export default useDatovelgerFelt;
