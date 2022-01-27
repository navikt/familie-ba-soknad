import { IntlShape } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { ISøknadKontraktV7 } from '../../typer/kontrakt/v7';
import { ISøknad } from '../../typer/søknad';
import { tilIArbeidsperiodeIKontraktFormat } from './arbeidsperioder';
import { dataISøknadKontraktFormat } from './søknad';

export const dataISøknadKontraktFormatV7 = (
    intl: IntlShape,
    valgtSpråk: LocaleType,
    søknad: ISøknad
): ISøknadKontraktV7 => {
    const v6 = dataISøknadKontraktFormat(intl, valgtSpråk, søknad);
    const {
        søker: { arbeidsperioderUtland },
    } = søknad;
    return {
        ...v6,
        kontraktVersjon: 7,
        søker: {
            ...v6.søker,
            arbeidsperioderUtland: arbeidsperioderUtland.map((periode, index) =>
                tilIArbeidsperiodeIKontraktFormat(
                    periode,
                    index + 1,
                    true,
                    false,
                    periode.arbeidsperiodeAvsluttet?.svar === ESvar.JA,
                    false
                )
            ),
        },
    };
};
