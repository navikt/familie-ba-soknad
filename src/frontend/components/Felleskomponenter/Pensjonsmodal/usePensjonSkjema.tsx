import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { PersonType } from '../../../typer/personType';
import { IPensjonsperiodeFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';

import {
    mottarPensjonNåFeilmeldingSpråkId,
    pensjonFraDatoFeilmeldingSpråkId,
    pensjonslandFeilmeldingSpråkId,
} from './språkUtils';
import { PensjonsperiodeSpørsmålId } from './spørsmål';

export interface IUsePensjonSkjemaParams {
    gjelderUtland: boolean;
    personType: PersonType;
    erDød?: boolean;
    barn?: IBarnMedISøknad;
}

export const usePensjonSkjema = ({
    gjelderUtland,
    personType,
    erDød,
    barn,
}: IUsePensjonSkjemaParams) => {
    const { erEøsLand } = useEøs();

    const { toggles } = useFeatureToggles();

    const erAndreForelderDød = personType === PersonType.AndreForelder && !!erDød;

    const mottarPensjonNå = useJaNeiSpmFelt({
        søknadsfelt: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: null },
        feilmeldingSpråkId: mottarPensjonNåFeilmeldingSpråkId(personType),
        feilmeldingSpråkVerdier: barn ? { barn: barn.navn } : undefined,
        skalSkjules: erAndreForelderDød,
    });

    const periodenErAvsluttet = mottarPensjonNå.verdi === ESvar.NEI || erAndreForelderDød;

    useEffect(() => {
        skjema.settVisfeilmeldinger(false);
    }, [mottarPensjonNå.verdi]);

    const pensjonsland = useLanddropdownFelt({
        søknadsfelt: { id: PensjonsperiodeSpørsmålId.pensjonsland, svar: '' },
        feilmeldingSpråkId: pensjonslandFeilmeldingSpråkId(personType, periodenErAvsluttet),
        skalFeltetVises:
            (mottarPensjonNå.valideringsstatus === Valideringsstatus.OK || erAndreForelderDød) &&
            gjelderUtland,
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonsperiodeSpørsmålId.fraDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            (mottarPensjonNå.valideringsstatus === Valideringsstatus.OK || erAndreForelderDød) &&
            (!gjelderUtland || !!erEøsLand(pensjonsland.verdi)),
        feilmeldingSpråkId: pensjonFraDatoFeilmeldingSpråkId(personType, periodenErAvsluttet),
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
        avhengigheter: { mottarPensjonNå },
    });

    const pensjonTilDato = useDatovelgerFelt({
        søknadsfelt: {
            id: PensjonsperiodeSpørsmålId.tilDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            (mottarPensjonNå.verdi === ESvar.NEI || erAndreForelderDød) &&
            (!gjelderUtland || !!erEøsLand(pensjonsland.verdi)),
        feilmeldingSpråkId: 'felles.nåravsluttetpensjon.feilmelding',
        sluttdatoAvgrensning: toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO]
            ? sisteDagDenneMåneden()
            : dagensDato(),
        startdatoAvgrensning: dagenEtterDato(stringTilDate(pensjonFraDato.verdi)),
        avhengigheter: { mottarPensjonNå, pensjonFraDato },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<IPensjonsperiodeFeltTyper, 'string'>({
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
    };
};
