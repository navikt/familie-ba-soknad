import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import useDatovelgerFeltMedUkjentForSanity from '../../../hooks/useDatovelgerFeltMedUkjentForSanity';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import useDatovelgerFeltForSanity from '../../../hooks/useSendInnSkjemaTest/useDatovelgerForSanity';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { PersonType } from '../../../typer/personType';
import { IAndreUtbetalingerTekstinnhold } from '../../../typer/sanity/modaler/andreUtbetalinger';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { IUtbetalingerFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';
import { minTilDatoForPeriode } from '../../../utils/perioder';

import { fårUtbetalingNåFeilmelding, utbetalingslandFeilmelding } from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';

export interface IUseUtbetalingerSkjemaParams {
    personType: PersonType;
    barn?: IBarnMedISøknad;
    erDød?: boolean;
}

export const useUtbetalingerSkjema = (personType, barn, erDød) => {
    const { toggles } = useFeatureToggles();
    const { tekster, plainTekst } = useAppContext();
    const teksterForPersontype: IAndreUtbetalingerTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.andreUtbetalinger[personType];
    const andreForelderErDød = personType === PersonType.AndreForelder && erDød;

    const fårUtbetalingNå = useJaNeiSpmFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.fårUtbetalingNå, svar: null },
        feilmeldingSpråkId: fårUtbetalingNåFeilmelding(personType),
        skalSkjules: andreForelderErDød,
        feilmeldingSpråkVerdier: barn ? { barn: barn.navn } : undefined,
        feilmelding: teksterForPersontype.faarUtbetalingerNaa.feilmelding,
        flettefelter: { barnetsNavn: barn?.navn },
    });

    const periodenErAvsluttet = fårUtbetalingNå.verdi === ESvar.NEI || andreForelderErDød;

    const utbetalingLand = useLanddropdownFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.utbetalingLand, svar: '' },
        feilmeldingSpråkId: utbetalingslandFeilmelding(personType, periodenErAvsluttet),
        feilmelding: periodenErAvsluttet
            ? teksterForPersontype.utbetalingLandFortid.feilmelding
            : teksterForPersontype.utbetalingLandNaatid.feilmelding,
        skalFeltetVises:
            fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: barn ? { barn: barn.navn } : undefined,
    });

    const utbetalingFraDato = useDatovelgerFeltForSanity({
        søknadsfelt: {
            id: UtbetalingerSpørsmålId.utbetalingFraDato,
            svar: '',
        },
        skalFeltetVises:
            andreForelderErDød || fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        feilmelding: teksterForPersontype.startdato.feilmelding,
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const utbetalingTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter?.fårUtbetalingNå?.verdi === ESvar.JA,
        avhengigheter: { fårUtbetalingNå },
    });

    const utbetalingTilDatoSluttdatoAvgrensning = toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO]
        ? sisteDagDenneMåneden()
        : dagensDato();

    const utbetalingTilDato = useDatovelgerFeltMedUkjentForSanity({
        feltId: UtbetalingerSpørsmålId.utbetalingTilDato,
        initiellVerdi: '',
        vetIkkeCheckbox: utbetalingTilDatoUkjent,
        feilmelding: periodenErAvsluttet
            ? teksterForPersontype.sluttdatoFortid.feilmelding
            : teksterForPersontype.sluttdatoFremtid.feilmelding,
        skalFeltetVises:
            andreForelderErDød || fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        sluttdatoAvgrensning: periodenErAvsluttet
            ? utbetalingTilDatoSluttdatoAvgrensning
            : undefined,
        startdatoAvgrensning: minTilDatoForPeriode(periodenErAvsluttet, utbetalingFraDato.verdi),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(stringTilDate(utbetalingFraDato.verdi)) || periodenErAvsluttet
                ? undefined
                : plainTekst(
                      tekster().FELLES.formateringsfeilmeldinger.datoKanIkkeVaereTilbakeITid
                  ),
        avhengigheter: { utbetalingFraDato },
        nullstillVedAvhengighetEndring: false,
    });

    const skjema = useSkjema<IUtbetalingerFeltTyper, 'string'>({
        felter: {
            fårUtbetalingNå,
            utbetalingLand,
            utbetalingFraDato,
            utbetalingTilDato,
            utbetalingTilDatoUkjent,
        },
        skjemanavn: 'utbetalinger',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
