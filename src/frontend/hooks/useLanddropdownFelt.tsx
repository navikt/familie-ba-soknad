import React from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/søknad';

interface ILandDropdownAvhengighet {
    jaNeiSpm: Felt<ESvar | undefined>;
}

const useLandDropdownFelt = (
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | undefined>,
    språkTekstIdForFeil: string,
    avhengigSvarCondition: ESvar,
    avhengighet?: Felt<ESvar | undefined>
) => {
    return useFelt<Alpha3Code | undefined>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            const typetAvhengigheter = avhengigheter as ILandDropdownAvhengighet;
            return typetAvhengigheter
                ? typetAvhengigheter.jaNeiSpm.verdi === avhengigSvarCondition
                : true;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | undefined>) => {
            return felt.verdi !== undefined
                ? ok(felt)
                : feil(felt, <SpråkTekst id={språkTekstIdForFeil} />);
        },
        avhengigheter: { jaNeiSpm: avhengighet } as ILandDropdownAvhengighet,
    });
};

export default useLandDropdownFelt;
