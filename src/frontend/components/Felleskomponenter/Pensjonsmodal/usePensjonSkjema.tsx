import { useEffect } from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { PersonType } from '../../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IPensjonsperiodeFeltTyper } from '../../../typer/skjema';
import {
    dagenEtterDato,
    dagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';

import { mottarPensjonNåFeilmeldingSpråkId, pensjonslandFeilmeldingSpråkId } from './språkUtils';
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
    const { toggles } = useFeatureToggles();
    const { tekster } = useApp();
    const { erEøsLand } = useEøs();
    const teksterForPersonType: IPensjonsperiodeTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.pensjonsperiode[personType];

    const erAndreForelderDød = personType === PersonType.AndreForelder && !!erDød;

    const mottarPensjonNå = useJaNeiSpmFelt({
        søknadsfelt: { id: PensjonsperiodeSpørsmålId.mottarPensjonNå, svar: null },
        feilmelding: teksterForPersonType.faarPensjonNaa.feilmelding,
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
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.pensjonLandFortid.feilmelding
            : teksterForPersonType.pensjonLandNaatid.feilmelding,
        feilmeldingSpråkId: pensjonslandFeilmeldingSpråkId(personType, periodenErAvsluttet),
        skalFeltetVises:
            (mottarPensjonNå.valideringsstatus === Valideringsstatus.OK || erAndreForelderDød) &&
            gjelderUtland,
        nullstillVedAvhengighetEndring: true,
    });

    const pensjonFraDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: PensjonsperiodeSpørsmålId.fraDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            (mottarPensjonNå.valideringsstatus === Valideringsstatus.OK || erAndreForelderDød) &&
            (!gjelderUtland || !!erEøsLand(pensjonsland.verdi)),
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.startdatoFortid.feilmelding
            : teksterForPersonType.startdatoNaatid.feilmelding,
        sluttdatoAvgrensning: toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
            ? sisteDagDenneMåneden()
            : dagensDato(),
        avhengigheter: { mottarPensjonNå },
    });

    const tilPensjonperiodeSluttdatoAvgrensning = toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
        ? sisteDagDenneMåneden()
        : dagensDato();

    const pensjonTilDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: PensjonsperiodeSpørsmålId.tilDatoPensjon,
            svar: '',
        },
        skalFeltetVises:
            (mottarPensjonNå.verdi === ESvar.NEI || erAndreForelderDød) &&
            (!gjelderUtland || !!erEøsLand(pensjonsland.verdi)),
        feilmelding: periodenErAvsluttet
            ? teksterForPersonType.sluttdatoFortid.feilmelding
            : teksterForPersonType.sluttdatoFremtid.feilmelding,
        sluttdatoAvgrensning: tilPensjonperiodeSluttdatoAvgrensning,
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
