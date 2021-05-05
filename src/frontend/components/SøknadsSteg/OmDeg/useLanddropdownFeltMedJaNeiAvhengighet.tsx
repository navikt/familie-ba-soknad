import React, { useEffect } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import { ISøknadSpørsmål } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

const useLanddropdownFeltMedJaNeiAvhengighet = (
    søknadsfelt: ISøknadSpørsmål<Alpha3Code | ''>,
    avhengigSvarCondition: ESvar,
    avhengighet: Felt<ESvar | undefined>
) => {
    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const landDropdown = useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt.id,
        verdi: søknadsfelt.svar,
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | undefined>)
                ? skalFeltetVises(avhengigheter.jaNeiSpm.verdi)
                : true;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={'felles.velg-land.feilmelding'} />);
        },
        avhengigheter: { jaNeiSpm: avhengighet },
        nullstillVedAvhengighetEndring: false,
    });

    useEffect(() => {
        !skalFeltetVises(avhengighet.verdi) && landDropdown.validerOgSettFelt('');
    }, [avhengighet]);

    return landDropdown;
};

export default useLanddropdownFeltMedJaNeiAvhengighet;
