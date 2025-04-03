import React, { ReactNode, useEffect } from 'react';

import { Alpha3Code } from 'i18n-iso-countries';
import { v4 as uuidv4 } from 'uuid';

import { ESvar } from '@navikt/familie-form-elements';
import {
    type Avhengigheter,
    feil,
    type Felt,
    type FeltState,
    ok,
    useFelt,
} from '@navikt/familie-skjema';

import SpråkTekst from '../components/Felleskomponenter/SpråkTekst/SpråkTekst';
import { useAppContext } from '../context/AppContext';
import { FlettefeltVerdier, LocaleRecordBlock } from '../typer/sanity/sanity';
import { ISøknadSpørsmål } from '../typer/spørsmål';

const useLanddropdownFeltMedJaNeiAvhengighet = ({
    søknadsfelt,
    feilmelding,
    feilmeldingSpråkId,
    avhengigSvarCondition,
    avhengighet,
    nullstillVedAvhengighetEndring = true,
    skalFeltetVises = true,
    flettefelter,
    feilmeldingSpråkVerdier,
}: {
    søknadsfelt?: ISøknadSpørsmål<Alpha3Code | ''>;
    feilmelding?: LocaleRecordBlock;
    feilmeldingSpråkId: string;
    avhengigSvarCondition: ESvar;
    avhengighet: Felt<ESvar | null>;
    nullstillVedAvhengighetEndring?: boolean;
    skalFeltetVises?: boolean;
    flettefelter?: FlettefeltVerdier;
    feilmeldingSpråkVerdier?: { [key: string]: ReactNode };
}) => {
    const skalViseFelt = jaNeiSpmVerdi => jaNeiSpmVerdi === avhengigSvarCondition;
    const { plainTekst } = useAppContext();

    const landDropdown = useFelt<Alpha3Code | ''>({
        feltId: søknadsfelt ? søknadsfelt.id : uuidv4(),
        verdi: søknadsfelt?.svar ?? '',
        skalFeltetVises: (avhengigheter: Avhengigheter) => {
            if (!skalFeltetVises) {
                return false;
            }
            return avhengigheter && (avhengigheter.jaNeiSpm as Felt<ESvar | null>)
                ? skalViseFelt(avhengigheter.jaNeiSpm.verdi)
                : true;
        },
        valideringsfunksjon: (felt: FeltState<Alpha3Code | ''>) => {
            return felt.verdi !== ''
                ? ok(felt)
                : feil(
                      felt,
                      feilmelding ? (
                          plainTekst(feilmelding, { ...flettefelter })
                      ) : (
                          <SpråkTekst id={feilmeldingSpråkId} values={feilmeldingSpråkVerdier} />
                      )
                  );
        },
        nullstillVedAvhengighetEndring,
        avhengigheter: { jaNeiSpm: avhengighet },
    });

    useEffect(() => {
        const skalVises = skalViseFelt(avhengighet.verdi);

        if (skalVises && landDropdown.verdi !== '') {
            landDropdown.validerOgSettFelt(landDropdown.verdi);
        }
        return () => {
            if (!skalViseFelt(avhengighet.verdi)) {
                landDropdown.validerOgSettFelt('');
            }
        };
    }, [avhengighet]);

    return landDropdown;
};

export default useLanddropdownFeltMedJaNeiAvhengighet;
