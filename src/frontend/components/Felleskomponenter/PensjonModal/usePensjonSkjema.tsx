import { useEffect, useState } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IPensjonslandFeltTyper } from '../../../typer/skjema';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import {
    fraDatoFeilmeldingSpråkId,
    mottarNåFeilmeldingSpråkId,
    pensjonslandFeilmeldingSpråkId,
    tilDatoFeilmeldingSpråkId,
} from './pensjonSpråkUtils';
import { PensjonSpørsmålId } from './spørsmål';

export interface IUsePensjonSkjemaParams {
    barn?: IBarnMedISøknad;
}

export const usePensjonSkjema = ({ barn }: IUsePensjonSkjemaParams) => {
    const { erEøsLand } = useEøs();
    const [eøsPensjon, settEøsPensjon] = useState(false);

    const mottarPensjonNå = useJaNeiSpmFelt({
        søknadsfelt: { id: PensjonSpørsmålId.fårPensjonNå, svar: null },
        feilmeldingSpråkId: mottarNåFeilmeldingSpråkId(barn),
    });

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [mottarPensjonNå.verdi]);

    const pensjonsland = useLanddropdownFelt({
        søknadsfelt: { id: PensjonSpørsmålId.pensjonsland, svar: '' },
        feilmeldingSpråkId: pensjonslandFeilmeldingSpråkId(
            mottarPensjonNå.verdi === ESvar.JA,
            barn
        ),
        skalFeltetVises: !!mottarPensjonNå.verdi,
        nullstillVedAvhengighetEndring: true,
    });

    useEffect(() => settEøsPensjon(erEøsLand(pensjonsland.verdi)), [pensjonsland.verdi]);

    const pensjonFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonSpørsmålId.fraDatoPensjon,
            svar: '',
        },
        skalFeltetVises: eøsPensjon,
        feilmeldingSpråkId: fraDatoFeilmeldingSpråkId(mottarPensjonNå.verdi === ESvar.JA, barn),
        sluttdatoAvgrensning: gårsdagensDato(),
        avhengigheter: { mottarPensjonNå },
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonTilDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonSpørsmålId.tilDatoPensjon,
            svar: '',
        },
        skalFeltetVises: eøsPensjon && mottarPensjonNå.verdi === ESvar.NEI,
        feilmeldingSpråkId: tilDatoFeilmeldingSpråkId,
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: pensjonFraDato.verdi,
        avhengigheter: { mottarPensjonNå, pensjonFraDato },
        nullstillVedAvhengighetEndring: true,
    });

    const skjema = useSkjema<IPensjonslandFeltTyper, 'string'>({
        felter: {
            mottarPensjonNå,
            pensjonsland,
            pensjonFraDato,
            pensjonTilDato,
        },
        skjemanavn: 'pensjonsperiode',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
        eøsPensjon,
    };
};
