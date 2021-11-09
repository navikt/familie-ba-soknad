import { Alpha3Code } from 'i18n-iso-countries';

import { ISODateString } from '@navikt/familie-form-elements';

import { DatoMedUkjent } from './common';

export enum EUtenlandsoppholdÅrsak {
    FLYTTET_PERMANENT_TIL_NORGE = 'FLYTTET_PERMANENT_TIL_NORGE',
    FLYTTET_PERMANENT_FRA_NORGE = 'FLYTTET_PERMANENT_FRA_NORGE',
    OPPHOLDER_SEG_UTENFOR_NORGE = 'OPPHOLDER_SEG_UTENFOR_NORGE',
    HAR_OPPHOLDT_SEG_UTENFOR_NORGE = 'HAR_OPPHOLDT_SEG_UTENFOR_NORGE',
}

export interface UtenlandsPeriode {
    utenlandsoppholdÅrsak: EUtenlandsoppholdÅrsak;
    oppholdsland: Alpha3Code;
    oppholdslandFraDato?: ISODateString;
    oppholdslandTilDato?: DatoMedUkjent;
}

export interface FlyttetFraNorgePeriode extends UtenlandsPeriode {
    oppholdslandFraDato: ISODateString;
}

export interface FlyttetTilNorgePeriode extends UtenlandsPeriode {
    oppholdslandTilDato: ISODateString;
}

export interface HarOppholdtSegIUtlandPeriode extends UtenlandsPeriode {
    oppholdslandFraDato: ISODateString;
    oppholdslandTilDato: ISODateString;
}

export interface OppholderSegIUtlandPeriode extends UtenlandsPeriode {
    oppholdslandFraDato: ISODateString;
    oppholdslandTilDato: DatoMedUkjent;
}

export type Periode =
    | FlyttetFraNorgePeriode
    | FlyttetTilNorgePeriode
    | HarOppholdtSegIUtlandPeriode
    | OppholderSegIUtlandPeriode;
