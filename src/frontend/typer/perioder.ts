import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { DatoMedUkjent } from './common';
import { ISøknadSpørsmål } from './spørsmål';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';

export interface IUtenlandsperiode {
    utenlandsoppholdÅrsak: ISøknadSpørsmål<EUtenlandsoppholdÅrsak>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    oppholdslandFraDato?: ISøknadSpørsmål<ISODateString>;
    oppholdslandTilDato?: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IArbeidsperiode {
    arbeidsperiodeAvsluttet?: ISøknadSpørsmål<ESvar>; //TODO skrive om til å være null
    arbeidsperiodeland?: ISøknadSpørsmål<Alpha3Code | ''>;
    arbeidsgiver?: ISøknadSpørsmål<string>;
    fraDatoArbeidsperiode?: ISøknadSpørsmål<ISODateString>;
    tilDatoArbeidsperiode?: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IPensjonsperiode {
    mottarPensjonNå: ISøknadSpørsmål<ESvar>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
    pensjonFra?: ISøknadSpørsmål<ISODateString>;
    pensjonTil?: ISøknadSpørsmål<ISODateString>;
}

export interface IUtbetalingsperiode {
    fårUtbetalingNå: ISøknadSpørsmål<ESvar | null>;
    ytelseFraHvilketLand: ISøknadSpørsmål<Alpha3Code | ''>;
    utbetalingFraDato: ISøknadSpørsmål<ISODateString>;
    utbetalingTilDato: ISøknadSpørsmål<DatoMedUkjent>;
}
