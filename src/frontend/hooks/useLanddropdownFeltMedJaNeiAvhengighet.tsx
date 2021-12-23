import React, { useEffect } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';

import { guid } from 'nav-frontend-js-utils';

import { ESvar } from '@navikt/familie-form-elements';
import { Avhengigheter, feil, Felt, FeltState, ok, useFelt } from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    feilmeldingSpråkId,
    avhengigSvarCondition,
    avhengighet,
    nullstillVedAvhengighetEndring = true,
    skalSkjules = false,
}: {
    søknadsfelt?: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmeldingSpråkId: string;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    nullstillVedAvhengighetEndring?: boolean;
    skalSkjules?: boolean;
}) => {
    const skalFeltetVises = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;

    const landDropdown = useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt ? søknadsfelt.id : guid(),
        verdi: søknadsfelt?.svar ?? '',
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | null>)
                ? skalFeltetVises(avhengigheter.jaNeiSpm.verdi) && !avhengigheter.skalSkjules
                : true && !avhengigheter.skalSkjules;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(felt, <SpråkTekst id={feilmeldingSpråkId} />);
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { jaNeiSpm: avhengighet, skalSkjules },
    });

    useEffect(() => {
        const skalVises = skalFeltetVises(avhengighet.verdi);

        skalVises &&
            landDropdown.verdi !== '' &&
            landDropdown.validerOgSettFelt(landDropdown.verdi);

        return () => {
            !skalFeltetVises(avhengighet.verdi) && landDropdown.validerOgSettFelt('');
        };
    }, [avhengighet]);

    return landDropdown;
};

export default useLanddropdownFeltMedJaNeiAvhengighet;
