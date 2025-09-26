import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { barnDataKeySpørsmål } from './barn';
import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent, ESvarMedUbesvart, ISODateString } from './common';
import { Slektsforhold } from './kontrakt/generelle';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    ISvalbardOppholdPeriode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer, ITidligereSamboer } from './person';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';
import { Årsak } from './utvidet';

export interface IDinLivssituasjonFeltTyper {
    årsak: Årsak | '';
    separertEnkeSkilt: ESvar | null;
    separertEnkeSkiltUtland: ESvar | null;
    separertEnkeSkiltDato: ISODateString;
    harSamboerNå: ESvar | null;
    hattAnnenSamboerForSøktPeriode: ESvar | null;
    nåværendeSamboerNavn: string;
    nåværendeSamboerFnr: string;
    nåværendeSamboerFnrUkjent: ESvar;
    nåværendeSamboerFødselsdato: DatoMedUkjent;
    nåværendeSamboerFødselsdatoUkjent: ESvar;
    nåværendeSamboerFraDato: ISODateString;
    erAsylsøker: ESvar | null;
    arbeidIUtlandet: ESvar | null;
    tidligereSamboere: ITidligereSamboer[];
    registrerteArbeidsperioder: IArbeidsperiode[];
    mottarUtenlandspensjon: ESvar | null;
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
    harNoenAvBarnaBoddPåSvalbard: ESvar | null;
    hvemHarBoddPåSvalbard: BarnetsId[];
    hvemErSøktAsylFor: BarnetsId[];
    hvemAvdødPartner: BarnetsId[];
}

export interface IOmBarnetFeltTyper {
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
    mottarEllerMottokEøsBarnetrygd: ESvar | null;
    registrerteEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    andreForelderNavn: string;
    andreForelderKanIkkeGiOpplysninger: ESvar;
    andreForelderFnr: string;
    andreForelderFnrUkjent: ESvar;
    andreForelderFødselsdatoUkjent: ESvar;
    andreForelderFødselsdato: DatoMedUkjent;
    andreForelderArbeidUtlandet: ESvar | null;
    andreForelderArbeidsperioderUtland: IArbeidsperiode[];
    andreForelderPensjonUtland: ESvar | null;
    andreForelderPensjonsperioderUtland: IPensjonsperiode[];
    borFastMedSøker: ESvar | null;
    skriftligAvtaleOmDeltBosted: ESvar | null;
    sammeForelderSomAnnetBarn: string | null;
    søkerHarBoddMedAndreForelder: ESvar | null;
    borMedAndreForelderCheckbox: ESvar;
    søkerFlyttetFraAndreForelderDato: ISODateString;
    registrerteSvalbardOppholdPerioder: ISvalbardOppholdPeriode[];
    registrerteUtenlandsperioder: IUtenlandsperiode[];
}

export interface IOmDegFeltTyper {
    borPåRegistrertAdresse: ESvar | null;
    borPåSvalbard: ESvar | null;
    registrerteSvalbardOppholdPerioder: ISvalbardOppholdPeriode[];
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
    andreForelderPågåendeSøknadFraAnnetEøsLand: ESvar | null;
    andreForelderPågåendeSøknadHvilketLand: Alpha3Code | '';
    andreForelderBarnetrygdFraEøs: ESvar | null;
    andreForelderEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    andreForelderAdresse: string | AlternativtSvarForInput.UKJENT;
    andreForelderAdresseVetIkke: ESvar;
    søkersSlektsforhold: Slektsforhold | '';
    søkersSlektsforholdSpesifisering: string;
    borMedAndreForelder: ESvar | null;
    borMedOmsorgsperson: ESvar | null;
    [key: IdNummerKey]: IIdNummer;
    omsorgspersonNavn: string;
    omsorgspersonSlektsforhold: Slektsforhold | '';
    omsorgpersonSlektsforholdSpesifisering: string;
    omsorgspersonIdNummer: string;
    omsorgspersonIdNummerVetIkke: ESvar;
    omsorgspersonAdresse: string;
    omsorgspersonArbeidUtland: ESvar | null;
    omsorgspersonArbeidsperioderUtland: IArbeidsperiode[];
    omsorgspersonArbeidNorge: ESvar | null;
    omsorgspersonArbeidsperioderNorge: IArbeidsperiode[];
    omsorgspersonPensjonUtland: ESvar | null;
    omsorgspersonPensjonsperioderUtland: IPensjonsperiode[];
    omsorgspersonPensjonNorge: ESvar | null;
    omsorgspersonPensjonsperioderNorge: IPensjonsperiode[];
    omsorgspersonAndreUtbetalinger: ESvar | null;
    omsorgspersonAndreUtbetalingsperioder: IUtbetalingsperiode[];
    omsorgspersonPågåendeSøknadFraAnnetEøsLand: ESvar | null;
    omsorgspersonPågåendeSøknadHvilketLand: Alpha3Code | '';
    omsorgspersonBarnetrygdFraEøs: ESvar | null;
    omsorgspersonEøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    barnetsAdresse: string | AlternativtSvarForInput.UKJENT;
    barnetsAdresseVetIkke: ESvar;
}

export interface IVelgBarnFeltTyper {
    barnMedISøknad: IBarn[];
}

export interface ILeggTilBarnTyper
    extends Omit<IBarn, 'borMedSøker' | 'alder' | 'navn' | 'adressebeskyttelse' | 'id' | barnDataKeySpørsmål> {
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

export interface ISvalbardOppholdPeriodeFeltTyper {
    fraDatoSvalbardOpphold: ISODateString;
    tilDatoSvalbardOpphold: ISODateString;
    tilDatoSvalbardOppholdUkjent: ESvar;
}

export type SkjemaFeltTyper =
    | IOmDegFeltTyper
    | IVelgBarnFeltTyper
    | ILeggTilBarnTyper
    | IOmBarnetFeltTyper
    | IOmBarnaDineFeltTyper
    | IDinLivssituasjonFeltTyper
    | IUtenlandsoppholdFeltTyper
    | IPensjonsperiodeFeltTyper
    | ITidligereSamboerFeltTyper
    | IEøsForSøkerFeltTyper
    | IEøsForBarnFeltTyper
    | IUtbetalingerFeltTyper
    | IArbeidsperioderFeltTyper
    | IBarnetrygdperioderFeltTyper
    | ISvalbardOppholdPeriodeFeltTyper;
