import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent } from './common';
import {
    IArbeidsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn } from './person';
import { ISøknadSpørsmål } from './spørsmål';

export enum andreForelderDataKeySpørsmål {
    navn = 'navn',
    fnr = 'fnr',
    fødselsdato = 'fødselsdato',
    arbeidUtlandet = 'arbeidUtlandet',
    arbeidUtlandetHvilketLand = 'arbeidUtlandetHvilketLand',
    pensjonUtland = 'pensjonUtland',
    pensjonHvilketLand = 'pensjonHvilketLand',
    skriftligAvtaleOmDeltBosted = 'skriftligAvtaleOmDeltBosted',
    søkerHarBoddMedAndreForelder = 'søkerHarBoddMedAndreForelder',
    søkerFlyttetFraAndreForelderDato = 'søkerFlyttetFraAndreForelderDato',
}

export enum barnDataKeySpørsmål {
    erFosterbarn = 'erFosterbarn',
    erAdoptertFraUtland = 'erAdoptertFraUtland',
    erAsylsøker = 'erAsylsøker',
    barnetrygdFraAnnetEøsland = 'barnetrygdFraAnnetEøsland',
    barnetrygdFraEøslandHvilketLand = 'barnetrygdFraEøslandHvilketLand',
    andreForelderErDød = 'andreForelderErDød',
    oppholderSegIInstitusjon = 'oppholderSegIInstitusjon',
    institusjonIUtland = 'institusjonIUtland',
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjonOppholdStartdato',
    institusjonOppholdSluttdato = 'institusjonOppholdSluttdato',
    boddMindreEnn12MndINorge = 'boddMindreEnn12MndINorge',
    planleggerÅBoINorge12Mnd = 'planleggerÅBoINorge12Mnd',
    borFastMedSøker = 'borFastMedSøker',
    søkerForTidsrom = 'søkerForTidsrom',
    søkerForTidsromStartdato = 'søkerForTidsromStartdato',
    søkerForTidsromSluttdato = 'søkerForTidsromSluttdato',
    sammeForelderSomAnnetBarnMedId = 'sammeForelderSomAnnetBarnMedId',
}

export interface IAndreForelder {
    arbeidsperioderUtland: IArbeidsperiode[];
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonsperioderUtland: IPensjonsperiode[];
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    [andreForelderDataKeySpørsmål.navn]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fnr]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fødselsdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [andreForelderDataKeySpørsmål.arbeidUtlandet]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.arbeidUtlandetHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [andreForelderDataKeySpørsmål.pensjonUtland]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pensjonHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: ISøknadSpørsmål<ESvar | null>;
    utvidet: {
        [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: ISøknadSpørsmål<ESvar | null>;
        [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: ISøknadSpørsmål<DatoMedUkjent>;
    };
}

export interface IBarnMedISøknad extends IBarn {
    barnErFyltUt: boolean;
    utenlandsperioder: IUtenlandsperiode[];
    // TODO: barnetrygdPerioder: IBarnetrygdPeriode[];
    andreForelder: IAndreForelder | null;
    triggetEøs: boolean;
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAdoptertFraUtland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.andreForelderErDød]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.institusjonIUtland]: ISøknadSpørsmål<ESvar>;
    [barnDataKeySpørsmål.institusjonsnavn]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonsadresse]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonspostnummer]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.borFastMedSøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.søkerForTidsrom]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: ISøknadSpørsmål<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >;
}
