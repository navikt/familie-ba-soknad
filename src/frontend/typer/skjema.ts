import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from './barn';
import { BarnetsId, DatoMedUkjent, ESvarMedUbesvart } from './common';
import { IArbeidsperiode, IPensjonsperiode, IUtenlandsperiode } from './perioder';
import { IBarn } from './person';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';
import { Årsak } from './utvidet';

export interface IDinLivssituasjonFeltTyper {
    årsak: Årsak | '';
    separertEnkeSkilt: ESvar | null;
    separertEnkeSkiltUtland: ESvar | null;
    separertEnkeSkiltDato: ISODateString;
    harSamboerNå: ESvar | null;
    nåværendeSamboerNavn: string;
    nåværendeSamboerFnr: string;
    nåværendeSamboerFnrUkjent: ESvar;
    nåværendeSamboerFødselsdato: DatoMedUkjent;
    nåværendeSamboerFødselsdatoUkjent: ESvar;
    nåværendeSamboerFraDato: ISODateString;
    erAsylsøker: ESvar | null;
    jobberPåBåt: ESvar | null;
    arbeidsland: Alpha3Code | '';
    registrerteArbeidsperioder: IArbeidsperiode[];
    mottarUtenlandspensjon: ESvar | null;
    pensjonsland: Alpha3Code | '';
    registrertePensjonsperioder: IPensjonsperiode[];
}

export interface ITidligereSamboerFeltTyper {
    tidligereSamboerNavn: string;
    tidligereSamboerFnr: string;
    tidligereSamboerFnrUkjent: ESvar;
    tidligereSamboerFødselsdato: DatoMedUkjent;
    tidligereSamboerFødselsdatoUkjent: ESvar;
    tidligereSamboerFraDato: ISODateString;
    tidligereSamboerTilDato: ISODateString;
}

export interface IOmBarnaDineFeltTyper {
    erNoenAvBarnaFosterbarn: ESvar | null;
    oppholderBarnSegIInstitusjon: ESvar | null;
    erBarnAdoptertFraUtland: ESvar | null;
    søktAsylForBarn: ESvar | null;
    barnOppholdtSegTolvMndSammenhengendeINorge: ESvar | null;
    mottarBarnetrygdForBarnFraAnnetEøsland: ESvar | null;
    erAvdødPartnerForelder: ESvar | null;
    hvemErFosterbarn: BarnetsId[];
    hvemOppholderSegIInstitusjon: BarnetsId[];
    hvemErAdoptertFraUtland: BarnetsId[];
    hvemBarnetrygdFraAnnetEøsland: BarnetsId[];
    hvemTolvMndSammenhengendeINorge: BarnetsId[];
    hvemErSøktAsylFor: BarnetsId[];
    hvemAvdødPartner: BarnetsId[];
}

export interface IOmBarnetUtvidetFeltTyper {
    institusjonIUtlandCheckbox: ESvar;
    institusjonsnavn: string;
    institusjonsadresse: string;
    institusjonspostnummer: string;
    institusjonOppholdStartdato: ISODateString;
    institusjonOppholdSluttdato: DatoMedUkjent;
    institusjonOppholdSluttVetIkke: ESvar;
    planleggerÅBoINorge12Mnd: ESvar | null;
    barnetrygdFraEøslandHvilketLand: Alpha3Code | '';
    andreForelderNavn: string;
    andreForelderNavnUkjent: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderArbeidUtlandet: ESvar | null;
    andreForelderArbeidUtlandetHvilketLand: Alpha3Code | '';
    andreForelderPensjonUtland: ESvar | null;
    andreForelderPensjonHvilketLand: Alpha3Code | '';
    borFastMedSøker: ESvar | null;
    skriftligAvtaleOmDeltBosted: ESvar | null;
    søkerForTidsrom: ESvar | null;
    søkerForTidsromStartdato: ISODateString;
    søkerForTidsromSluttdato: DatoMedUkjent;
    søkerForTidsromSluttdatoVetIkke: ESvar;
    sammeForelderSomAnnetBarn: string | null;
    søkerHarBoddMedAndreForelder: ESvar | null;
    borMedAndreForelderCheckbox: ESvar;
    søkerFlyttetFraAndreForelderDato: ISODateString;
    registrerteUtenlandsperioder: IUtenlandsperiode[];
}

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    værtINorgeITolvMåneder: ESvar | null;
    planleggerÅBoINorgeTolvMnd: ESvar | null;
    registrerteUtenlandsperioder: IUtenlandsperiode[];
}

export interface IEøsForSøkerFeltTyper {
    placeholderForFeltSomKommer: string; //TODO
}

export interface IEøsForBarnFeltTyper {
    placeholderForFeltSomKommer: string; //TODO
}

export interface IVelgBarnFeltTyper {
    barnMedISøknad: IBarn[];
}

export interface ILeggTilBarnTyper
    extends Omit<
        IBarn,
        'borMedSøker' | 'alder' | 'navn' | 'adressebeskyttelse' | 'id' | barnDataKeySpørsmål
    > {
    erFødt: ESvarMedUbesvart;
    fornavn: string;
    etternavn: string;
    navnetErUbestemt: ESvar;
    ident: string;
    ikkeFåttIdentChecked: ESvar;
}

export interface IUtenlandsoppholdFeltTyper {
    utenlandsoppholdÅrsak: EUtenlandsoppholdÅrsak | '';
    oppholdsland: Alpha3Code | '';
    oppholdslandFraDato: ISODateString;
    oppholdslandTilDato: ISODateString;
    oppholdslandTilDatoUkjent: ESvar;
}

export interface IUtbetalingerFeltTyper {
    fårUtbetalingNå: ESvar | null;
    ytelseFraHvilketLand: Alpha3Code | '';
    utbetalingFraDato: ISODateString;
    utbetalingTilDato: ISODateString;
    utbetalingTilDatoUkjent: ESvar;
}

export interface IPensjonsperiodeFeltTyper {
    mottarPensjonNå: ESvar | null;
    pensjonsland: Alpha3Code | '';
    pensjonFraDato: ISODateString;
    pensjonTilDato: ISODateString;
}

export interface IArbeidsperioderFeltTyper {
    arbeidsperiodeAvsluttet: ESvar | null;
    arbeidsperiodeLand: Alpha3Code | '';
    arbeidsgiver: string;
    fraDatoArbeidsperiode: ISODateString;
    tilDatoArbeidsperiode: ISODateString;
    tilDatoArbeidsperiodeUkjent: ESvar;
}
export type SkjemaFeltTyper =
    | IOmDegFeltTyper
    | IVelgBarnFeltTyper
    | ILeggTilBarnTyper
    | IOmBarnetUtvidetFeltTyper
    | IOmBarnaDineFeltTyper
    | IDinLivssituasjonFeltTyper
    | IUtenlandsoppholdFeltTyper
    | IPensjonsperiodeFeltTyper
    | ITidligereSamboerFeltTyper
    | IEøsForSøkerFeltTyper
    | IEøsForBarnFeltTyper
    | IUtbetalingerFeltTyper
    | IArbeidsperioderFeltTyper;
