import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnMedISøknad } from '../../../typer/barn';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { PersonType } from '../../../typer/personType';
import { IUtbetalingerFeltTyper } from '../../../typer/skjema';
import {
    dagensDato,
    erSammeDatoSomDagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';

import { fårUtbetalingNåFeilmelding, utbetalingslandFeilmelding } from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';

export interface IUseUtbetalingerSkjemaParams {
    personType: PersonType;
    barn?: IBarnMedISøknad;
    erDød?: boolean;
}

export const useUtbetalingerSkjema = (personType, barn, erDød) => {
    const andreForelderErDød = personType === PersonType.AndreForelder && erDød;

    const { toggles } = useFeatureToggles();

    const fårUtbetalingNå = useJaNeiSpmFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.fårUtbetalingNå, svar: null },
        feilmeldingSpråkId: fårUtbetalingNåFeilmelding(personType),
        skalSkjules: andreForelderErDød,
        feilmeldingSpråkVerdier: barn ? { barn: barn.navn } : undefined,
    });

    const periodenErAvsluttet = fårUtbetalingNå.verdi === ESvar.NEI || andreForelderErDød;

    const utbetalingLand = useLanddropdownFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.utbetalingLand, svar: '' },
        feilmeldingSpråkId: utbetalingslandFeilmelding(personType, periodenErAvsluttet),
        skalFeltetVises:
            fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: barn ? { barn: barn.navn } : undefined,
    });

    const utbetalingFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: UtbetalingerSpørsmålId.utbetalingFraDato,
            svar: '',
        },
        skalFeltetVises:
            andreForelderErDød || fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'felles.nårbegynteutbetalingene.feilmelding',
        sluttdatoAvgrensning: periodenErAvsluttet ? gårsdagensDato() : dagensDato(),
    });

    const utbetalingTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter?.fårUtbetalingNå?.verdi === ESvar.JA,
        avhengigheter: { fårUtbetalingNå },
    });

    const utbetalingTilDatoSluttdatoAvgrensning = toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO]
        ? sisteDagDenneMåneden()
        : dagensDato();

    const utbetalingTilDato = useDatovelgerFeltMedUkjent({
        feltId: UtbetalingerSpørsmålId.utbetalingTilDato,
        initiellVerdi: '',
        vetIkkeCheckbox: utbetalingTilDatoUkjent,
        feilmeldingSpråkId: periodenErAvsluttet
            ? 'felles.nårstoppetutbetalingene.feilmelding'
            : 'felles.nårstopperutbetalingene.feilmelding',
        skalFeltetVises:
            andreForelderErDød || fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        sluttdatoAvgrensning: periodenErAvsluttet
            ? utbetalingTilDatoSluttdatoAvgrensning
            : undefined,
        startdatoAvgrensning: minTilDatoForUtbetalingEllerArbeidsperiode(
            periodenErAvsluttet,
            utbetalingFraDato.verdi
        ),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(stringTilDate(utbetalingFraDato.verdi)) || periodenErAvsluttet
                ? undefined
                : 'felles.dato.tilbake-i-tid.feilmelding',
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
