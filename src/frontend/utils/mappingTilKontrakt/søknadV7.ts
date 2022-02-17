import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktV7 } from '../../typer/kontrakt/v7';
import { ISøknad } from '../../typer/søknad';
import { tilIAndreUtbetalingsperioderIKontraktFormat } from './andreUtbetalingsperioder';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { barnISøknadsFormatV7 } from './barnV7';
import { tilIPensjonsperiodeIKontraktFormat } from './pensjonsperioder';
import { dataISøknadKontraktFormat } from './søknad';

export const dataISøknadKontraktFormatV7 = (
    intl: IntlShape,
    valgtSpråk: LocaleType,
    søknad: ISøknad
): ISøknadKontraktV7 => {
    const v6 = dataISøknadKontraktFormat(intl, valgtSpråk, søknad);
    const {
        søker: {
            arbeidsperioderUtland,
            pensjonsperioderUtland,
            arbeidsperioderNorge,
            pensjonsperioderNorge,
            andreUtbetalingsperioder,
        },
        barnInkludertISøknaden,
    } = søknad;
    return {
        ...v6,
        kontraktVersjon: 7,
        søker: {
            ...v6.søker,
            arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
                tilIArbeidsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    gjelderUtlandet: true,
                    gjelderAndreForelder: false,
                    tilbakeITid: periode.arbeidsperiodeAvsluttet?.svar === ESvar.JA,
                    erAndreForelderDød: false,
                })
            ),
            arbeidsperioderNorge: arbeidsperioderNorge.map((periode, index) =>
                tilIArbeidsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    gjelderUtlandet: false,
                    gjelderAndreForelder: false,
                    tilbakeITid: periode.arbeidsperiodeAvsluttet?.svar === ESvar.JA,
                    erAndreForelderDød: false,
                })
            ),
            pensjonsperioderUtland: pensjonsperioderUtland.map((periode, index) =>
                tilIPensjonsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    tilbakeITid: periode.mottarPensjonNå?.svar === ESvar.NEI,
                    gjelderAndreForelder: false,
                    erAndreForelderDød: false,
                    gjelderUtlandet: true,
                })
            ),
            pensjonsperioderNorge: pensjonsperioderNorge.map((periode, index) =>
                tilIPensjonsperiodeIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    tilbakeITid: periode.mottarPensjonNå?.svar === ESvar.NEI,
                    gjelderAndreForelder: false,
                    erAndreForelderDød: false,
                    gjelderUtlandet: false,
                })
            ),
            andreUtbetalingsperioder: andreUtbetalingsperioder.map((periode, index) =>
                tilIAndreUtbetalingsperioderIKontraktFormat({
                    periode,
                    periodeNummer: index + 1,
                    tilbakeITid: periode.fårUtbetalingNå?.svar === ESvar.NEI,
                    gjelderAndreForelder: false,
                    erAndreForelderDød: false,
                })
            ),
        },
        barn: barnInkludertISøknaden.map(barn => {
            return barnISøknadsFormatV7(intl, barn);
        }),
    };
};
