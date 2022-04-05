import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtbetalingerFeltTyper } from '../../../typer/skjema';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato, erSammeDatoSomDagensDato, gårsdagensDato } from '../../../utils/dato';
import { UtbetalingerSpørsmålId } from './spørsmål';
import { minAvgrensningUtbetalingTilDato, utbetalingerFeilmelding } from './utils';

export const useUtbetalingerSkjema = (andreForelderData?: {
    barn: IBarnMedISøknad;
    erDød: boolean;
}) => {
    const intl = useIntl();

    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;
    const andreForelderErDød = !!andreForelderData?.erDød;

    const fårUtbetalingNå = useJaNeiSpmFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.fårUtbetalingNå, svar: null },
        feilmeldingSpråkId: utbetalingerFeilmelding(gjelderAndreForelder),
        skalSkjules: andreForelderErDød,
        feilmeldingSpråkVerdier: barn ? { barn: barnetsNavnValue(barn, intl) } : undefined,
    });

    const tilbakeITid = fårUtbetalingNå.verdi === ESvar.NEI;

    const feilmeldingForLand = () => {
        if (tilbakeITid || andreForelderErDød) {
            return gjelderAndreForelder
                ? 'modal.andreforelder-utbetalingerland-fikk.feilmelding'
                : 'modal.utbetalingsland-fikk-søker.feilmeldinger';
        } else {
            return gjelderAndreForelder
                ? 'modal.andreforelder-utbetalingerland-får.feilmelding'
                : 'modal.utbetalingsland-får-søker.feilmelding';
        }
    };

    const utbetalingLand = useLanddropdownFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.utbetalingLand, svar: '' },
        feilmeldingSpråkId: feilmeldingForLand(),
        skalFeltetVises:
            fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: barn ? { barn: barnetsNavnValue(barn, intl) } : undefined,
    });

    const utbetalingFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: UtbetalingerSpørsmålId.utbetalingFraDato,
            svar: '',
        },
        skalFeltetVises:
            andreForelderErDød || fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'felles.nårbegynteutbetalingene.feilmelding',
        sluttdatoAvgrensning: tilbakeITid || andreForelderErDød ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
    });

    const utbetalingTilDatoUkjent = useFelt<ESvar>({
        verdi: ESvar.NEI,
        feltId: UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke,
        skalFeltetVises: avhengigheter => avhengigheter?.fårUtbetalingNå?.verdi === ESvar.JA,
        avhengigheter: { fårUtbetalingNå },
    });

    const utbetalingTilDato = useDatovelgerFeltMedUkjent({
        feltId: UtbetalingerSpørsmålId.utbetalingTilDato,
        initiellVerdi: '',
        vetIkkeCheckbox: utbetalingTilDatoUkjent,
        feilmeldingSpråkId:
            tilbakeITid || andreForelderErDød
                ? 'felles.nårstoppetutbetalingene.feilmelding'
                : 'felles.nårstopperutbetalingene.feilmelding',
        skalFeltetVises:
            andreForelderErDød || fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        sluttdatoAvgrensning: tilbakeITid || andreForelderErDød ? dagensDato() : undefined,
        startdatoAvgrensning: minAvgrensningUtbetalingTilDato(
            fårUtbetalingNå,
            andreForelderErDød,
            utbetalingFraDato
        ),
        customStartdatoFeilmelding:
            erSammeDatoSomDagensDato(utbetalingFraDato.verdi) || tilbakeITid || andreForelderErDød
                ? undefined
                : 'felles.dato.tilbake-i-tid.feilmelding',
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
