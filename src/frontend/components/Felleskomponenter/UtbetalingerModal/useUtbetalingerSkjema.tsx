import { ESvar } from '@navikt/familie-form-elements';
import { useFelt, useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IUtbetalingerFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { UtbetalingerSpørsmålId } from './spørsmål';

export interface IUseUtenlandsoppholdSkjemaParams {
    gjelderAndreForelder: boolean;
    tilbakeITid: boolean;
    barnetsNavn?: string;
}

export const useUtbetalingerSkjema = (gjelderAndreForelder, barnetsNavn) => {
    const fårUtbetalingNå = useJaNeiSpmFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.fårUtbetalingNå, svar: null },
        feilmeldingSpråkId: gjelderAndreForelder
            ? 'eøs.andreforelderutbetalinger.feilmelding'
            : 'eøs.utbetalinger.feilmelding',
        feilmeldingSpråkVerdier: { barn: barnetsNavn },
    });

    const tilbakeITid = fårUtbetalingNå.verdi === ESvar.NEI;

    const feilmeldingForLand = () => {
        if (tilbakeITid) {
            return gjelderAndreForelder
                ? 'modal.andreforelderytselselandfortid.feilmelding'
                : 'modal.ytselseslandfortid.feilmeldinger';
        } else {
            return gjelderAndreForelder
                ? 'eøs.andreforelderytselseland.feilmelding'
                : 'eøs.ytselseland.feilmelding';
        }
    };

    const ytelseFraHvilketLand = useLanddropdownFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.utbetalingFraHvilketLand, svar: '' },
        feilmeldingSpråkId: feilmeldingForLand(),
        skalFeltetVises: fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        nullstillVedAvhengighetEndring: true,
        feilmeldingSpråkVerdier: { barn: barnetsNavn },
    });

    const utbetalingFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: UtbetalingerSpørsmålId.utbetalingFraDato,
            svar: '',
        },
        skalFeltetVises: fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'felles.nårbegynteytelsen.feilmelding',
        sluttdatoAvgrensning: fårUtbetalingNå.verdi === ESvar.JA ? dagensDato() : gårsdagensDato(),
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
        feilmeldingSpråkId: tilbakeITid
            ? 'felles.nårytelsenavsluttet.feilmelding'
            : 'felles.nåravsluttesytelsen.feilmelding',
        skalFeltetVises: fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK,
        sluttdatoAvgrensning: fårUtbetalingNå.verdi === ESvar.NEI ? dagensDato() : undefined,
        startdatoAvgrensning: utbetalingFraDato.verdi,
    });

    const skjema = useSkjema<IUtbetalingerFeltTyper, 'string'>({
        felter: {
            fårUtbetalingNå,
            ytelseFraHvilketLand,
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
