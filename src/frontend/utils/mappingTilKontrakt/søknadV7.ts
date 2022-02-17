import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktV7 } from '../../typer/kontrakt/v7';
import { ISøknad } from '../../typer/søknad';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { barnISøknadsFormat } from './barn';
import { tilIEøsBarnetrygsperiodeIKontraktFormat } from './eøsBarnetrygdsperiode';
import { dataISøknadKontraktFormat } from './søknad';

export const dataISøknadKontraktFormatV7 = (
    intl: IntlShape,
    valgtSpråk: LocaleType,
    søknad: ISøknad
): ISøknadKontraktV7 => {
    const v6 = dataISøknadKontraktFormat(intl, valgtSpråk, søknad);
    const {
        søker: { arbeidsperioderUtland },
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
        },
        barn: barnInkludertISøknaden.map(barn => {
            const iSøknadKontraktBarnV6 = barnISøknadsFormat(intl, barn);
            return {
                ...iSøknadKontraktBarnV6,
                eøsBarnetrygdsperioder: barn.eøsBarnetrygdsperioder.map((periode, index) =>
                    tilIEøsBarnetrygsperiodeIKontraktFormat({
                        periode,
                        periodeNummer: index + 1,
                        tilbakeITid: periode.mottarEøsBarnetrygdNå.svar === ESvar.NEI,
                        barn,
                    })
                ),
            };
        }),
    };
};
