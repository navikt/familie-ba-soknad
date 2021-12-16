import React, { useEffect } from 'react';

import { useSkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUtenlandsoppholdFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import {
    harTilhørendeFomFelt,
    hentMinAvgrensningPåTilDato,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import {
    fraDatoFeilmeldingSpråkId,
    landFeilmeldingSpråkId,
    tilDatoFeilmeldingSpråkId,
} from './pensjonSpråkUtils';
import { PensjonSpørsmålId } from './spørsmål';

export interface IUsePensjonSkjemaParams {
    barn?: IBarnMedISøknad;
}

export const usePensjonSkjema = ({ barn }: IUsePensjonSkjemaParams) => {
    const { erEøsLand } = useEøs();
    const mottarPensjonNå = useJaNeiSpmFelt({
        søknadsfelt: { id: PensjonSpørsmålId.fårPensjonNå, svar: null },
        feilmeldingSpråkId: '',
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [mottarPensjonNå.verdi]);

    const pensjonsland = useLanddropdownFelt({
        søknadsfelt: { id: PensjonSpørsmålId.pensjonsland, svar: '' },
        feilmeldingSpråkId: 'felles.velg-land.feilmelding',
        skalFeltetVises: !!mottarPensjonNå.verdi,
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonSpørsmålId.fraDatoPensjon,
            svar: '',
        },
        skalFeltetVises: !!(pensjonsland.verdi && erEøsLand(pensjonsland.verdi)),
        feilmeldingSpråkId: fraDatoFeilmeldingSpråkId(mottarPensjonNå.verdi, barn),
        sluttdatoAvgrensning: hentMaxAvgrensningPåFraDato(mottarPensjonNå.verdi),
        avhengigheter: { mottarPensjonNå },
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonTilDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonSpørsmålId.tilDatoPensjon,
            svar: '',
        },
        skalFeltetVises: !!(pensjonsland.verdi && erEøsLand(pensjonsland.verdi)),
        feilmeldingSpråkId: fraDatoFeilmeldingSpråkId(mottarPensjonNå.verdi, barn),
        sluttdatoAvgrensning: hentMaxAvgrensningPåFraDato(mottarPensjonNå.verdi),
        avhengigheter: { mottarPensjonNå },
        nullstillVedAvhengighetEndring: true,
    });

    const skjema = useSkjema<IUtenlandsoppholdFeltTyper, 'string'>({
        felter: {
            mottarPensjonNå,
            oppholdsland: pensjonsland,
            oppholdslandFraDato: pensjonFraDato,
            oppholdslandTilDato: pensjonTilDato,
        },
        skjemanavn: 'utenlandsopphold',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
