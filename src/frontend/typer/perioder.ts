import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { ISODateString } from '../../common/typer/ISODateString';

import { ISøknadSpørsmål } from './spørsmål';
import { DatoMedUkjent } from './svar';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';

export interface IUtenlandsperiode {
    utenlandsoppholdÅrsak: ISøknadSpørsmål<EUtenlandsoppholdÅrsak>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    oppholdslandFraDato?: ISøknadSpørsmål<ISODateString>;
    oppholdslandTilDato?: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IArbeidsperiode {
    arbeidsperiodeAvsluttet: ISøknadSpørsmål<ESvar | null>;
    arbeidsperiodeland: ISøknadSpørsmål<Alpha3Code | ''>;
    arbeidsgiver: ISøknadSpørsmål<string>;
    fraDatoArbeidsperiode: ISøknadSpørsmål<ISODateString | ''>;
    tilDatoArbeidsperiode: ISøknadSpørsmål<DatoMedUkjent | ''>;
}

export interface IPensjonsperiode {
    mottarPensjonNå: ISøknadSpørsmål<ESvar | null>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
    pensjonFra: ISøknadSpørsmål<ISODateString | ''>;
    pensjonTil: ISøknadSpørsmål<ISODateString | ''>;
}

export interface IUtbetalingsperiode {
    fårUtbetalingNå: ISøknadSpørsmål<ESvar | null>;
    utbetalingLand: ISøknadSpørsmål<Alpha3Code | ''>;
    utbetalingFraDato: ISøknadSpørsmål<ISODateString>;
    utbetalingTilDato: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IEøsBarnetrygdsperiode {
    mottarEøsBarnetrygdNå: ISøknadSpørsmål<ESvar | null>;
    barnetrygdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    fraDatoBarnetrygdperiode: ISøknadSpørsmål<ISODateString>;
    tilDatoBarnetrygdperiode: ISøknadSpørsmål<ISODateString | ''>;
    månedligBeløp: ISøknadSpørsmål<string>;
}
