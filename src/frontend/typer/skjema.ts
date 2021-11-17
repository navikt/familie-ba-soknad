import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { BarnetsId, DatoMedUkjent, ESvarMedUbesvart } from './common';
import { barnDataKeySpørsmål, IBarn, IUtenlandsperiode } from './person';
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
    mottarUtenlandspensjon: ESvar | null;
    pensjonsland: Alpha3Code | '';
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
}

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    værtINorgeITolvMåneder: ESvar | null;
    planleggerÅBoINorgeTolvMnd: ESvar | null;
    registrerteUtenlandsperioder: IUtenlandsperiode[];
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
export type SkjemaFeltTyper =
    | IOmDegFeltTyper
    | IVelgBarnFeltTyper
    | ILeggTilBarnTyper
    | IOmBarnetUtvidetFeltTyper
    | IOmBarnaDineFeltTyper
    | IDinLivssituasjonFeltTyper
    | IUtenlandsoppholdFeltTyper
    | ITidligereSamboerFeltTyper;
