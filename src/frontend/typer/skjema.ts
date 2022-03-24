import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from './barn';
import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent, ESvarMedUbesvart } from './common';
import { Slektsforhold } from './kontrakt/barn';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer } from './person';
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
    pågåendeSøknadFraAnnetEøsLand: ESvar | null;
    pågåendeSøknadHvilketLand: Alpha3Code | '';
    barnetrygdFraEøslandHvilketLand: Alpha3Code | '';
    mottarEllerMottokEøsBarnetrygd: ESvar | null;
    registrerteEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    andreForelderNavn: string;
    andreForelderNavnUkjent: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderArbeidUtlandet: ESvar | null;
    andreForelderArbeidUtlandetHvilketLand: Alpha3Code | '';
    andreForelderArbeidsperioderUtland: IArbeidsperiode[];
    andreForelderPensjonUtland: ESvar | null;
    andreForelderPensjonHvilketLand: Alpha3Code | '';
    andreForelderPensjonsperioderUtland: IPensjonsperiode[];
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

export type IdNummerKey = `${string}-idnummer-${string}`;

export interface IEøsForSøkerFeltTyper {
    arbeidINorge: ESvar | null;
    registrerteArbeidsperioder: IArbeidsperiode[];
    pensjonNorge: ESvar | null;
    registrertePensjonsperioder: IPensjonsperiode[];
    andreUtbetalinger: ESvar | null;
    registrerteAndreUtbetalinger: IUtbetalingsperiode[];
    adresseISøkeperiode: string;
    [key: IdNummerKey]: IIdNummer;
}

export interface IEøsForBarnFeltTyper {
    andreForelderPensjonNorge: ESvar | null;
    andreForelderPensjonsperioderNorge: IPensjonsperiode[];
    andreForelderArbeidNorge: ESvar | null;
    andreForelderArbeidsperioderNorge: IArbeidsperiode[];
    andreForelderAndreUtbetalinger: ESvar | null;
    andreForelderAndreUtbetalingsperioder: IUtbetalingsperiode[];
    andreForelderAdresse: string | AlternativtSvarForInput.UKJENT;
    andreForelderAdresseVetIkke: ESvar;
    søkersSlektsforhold: Slektsforhold | '';
    søkersSlektsforholdSpesifisering: string;
    borMedAndreForelder: ESvar | null;
    [key: IdNummerKey]: IIdNummer;
    omsorgspersonNavn: string;
    omsorgspersonSlektsforhold: Slektsforhold | '';
    omsorgpersonSlektsforholdSpesifisering: string;
    omsorgspersonIdNummer: string;
    omsorgspersonIdNummerVetIkke: ESvar;
    omsorgspersonAdresse: string;
    barnetsAdresse: string | AlternativtSvarForInput.UKJENT;
    barnetsAdresseVetIkke: ESvar;
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
    utbetalingLand: Alpha3Code | '';
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

export interface IBarnetrygdperioderFeltTyper {
    mottarEøsBarnetrygdNå: ESvar | null;
    barnetrygdsland: Alpha3Code | '';
    fraDatoBarnetrygdperiode: ISODateString;
    tilDatoBarnetrygdperiode: ISODateString;
    månedligBeløp: string;
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
    | IArbeidsperioderFeltTyper
    | IBarnetrygdperioderFeltTyper;
