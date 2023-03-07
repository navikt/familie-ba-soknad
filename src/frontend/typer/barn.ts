import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent, ISODateString } from './common';
import { Slektsforhold } from './kontrakt/generelle';
import { IOmsorgsperson } from './omsorgsperson';
import {
    IArbeidsperiode,
    IEøsBarnetrygdsperiode,
    IPensjonsperiode,
    IUtbetalingsperiode,
    IUtenlandsperiode,
} from './perioder';
import { IBarn, IIdNummer } from './person';
import { ISøknadSpørsmål } from './spørsmål';

export enum andreForelderDataKeySpørsmål {
    kanIkkeGiOpplysninger = 'kanIkkeGiOpplysninger',
    navn = 'navn',
    fnr = 'fnr',
    fødselsdato = 'fødselsdato',
    arbeidUtlandet = 'arbeidUtlandet',
    pensjonUtland = 'pensjonUtland',
    skriftligAvtaleOmDeltBosted = 'skriftligAvtaleOmDeltBosted',
    søkerHarBoddMedAndreForelder = 'søkerHarBoddMedAndreForelder',
    søkerFlyttetFraAndreForelderDato = 'søkerFlyttetFraAndreForelderDato',
    adresse = 'adresse',

    // EØS
    pensjonNorge = 'pensjonNorge',
    arbeidNorge = 'arbeidNorge',
    andreUtbetalinger = 'andreUtbetalinger',
    barnetrygdFraEøs = 'barnetrygdFraEøs',
    pågåendeSøknadFraAnnetEøsLand = 'pågåendeSøknadFraAnnetEøsLand',
    pågåendeSøknadHvilketLand = 'pågåendeSøknadHvilketLand',
}

export enum barnDataKeySpørsmål {
    erFosterbarn = 'erFosterbarn',
    erAdoptertFraUtland = 'erAdoptertFraUtland',
    erAsylsøker = 'erAsylsøker',
    barnetrygdFraAnnetEøsland = 'barnetrygdFraAnnetEøsland',
    pågåendeSøknadFraAnnetEøsLand = 'pågåendeSøknadFraAnnetEøsLand',
    pågåendeSøknadHvilketLand = 'pågåendeSøknadHvilketLand',
    mottarEllerMottokEøsBarnetrygd = 'mottarEllerMottokEøsBarnetrygd',
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
    søkersSlektsforhold = 'søkersSlektsforhold',
    søkersSlektsforholdSpesifisering = 'søkersSlektsforholdSpesifisering',
    borMedAndreForelder = 'borMedAndreForelder',
    borMedOmsorgsperson = 'borMedOmsorgsperson',
    adresse = 'adresse',
}

export interface IAndreForelder {
    arbeidsperioderUtland: IArbeidsperiode[];
    pensjonsperioderUtland: IPensjonsperiode[];
    eøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    kanIkkeGiOpplysninger: ISøknadSpørsmål<ESvar>;
    [andreForelderDataKeySpørsmål.navn]: ISøknadSpørsmål<string | ''>;
    [andreForelderDataKeySpørsmål.fnr]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    [andreForelderDataKeySpørsmål.fødselsdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [andreForelderDataKeySpørsmål.arbeidUtlandet]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pensjonUtland]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: ISøknadSpørsmål<ESvar | null>;

    //EØS
    arbeidsperioderNorge: IArbeidsperiode[];
    pensjonsperioderNorge: IPensjonsperiode[];
    andreUtbetalingsperioder: IUtbetalingsperiode[];
    idNummer: IIdNummer[];
    [andreForelderDataKeySpørsmål.adresse]: ISøknadSpørsmål<
        string | AlternativtSvarForInput.UKJENT
    >;
    [andreForelderDataKeySpørsmål.pensjonNorge]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.arbeidNorge]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.andreUtbetalinger]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.barnetrygdFraEøs]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: ISøknadSpørsmål<ESvar | null>;
    [andreForelderDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;

    utvidet: {
        [andreForelderDataKeySpørsmål.søkerHarBoddMedAndreForelder]: ISøknadSpørsmål<ESvar | null>;
        [andreForelderDataKeySpørsmål.søkerFlyttetFraAndreForelderDato]: ISøknadSpørsmål<DatoMedUkjent>;
    };
}

export interface IBarnMedISøknad extends IBarn {
    barnErFyltUt: boolean;
    utenlandsperioder: IUtenlandsperiode[];
    eøsBarnetrygdsperioder: IEøsBarnetrygdsperiode[];
    idNummer: IIdNummer[];
    andreForelder: IAndreForelder | null;
    omsorgsperson: IOmsorgsperson | null;
    triggetEøs: boolean;
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAdoptertFraUtland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.pågåendeSøknadFraAnnetEøsLand]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.pågåendeSøknadHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.mottarEllerMottokEøsBarnetrygd]: ISøknadSpørsmål<ESvar | null>;
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
    [barnDataKeySpørsmål.borFastMedSøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.søkerForTidsrom]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.sammeForelderSomAnnetBarnMedId]: ISøknadSpørsmål<
        BarnetsId | AlternativtSvarForInput.ANNEN_FORELDER | null
    >;
    [barnDataKeySpørsmål.søkersSlektsforhold]: ISøknadSpørsmål<Slektsforhold | ''>;
    [barnDataKeySpørsmål.søkersSlektsforholdSpesifisering]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.borMedAndreForelder]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.borMedOmsorgsperson]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.adresse]: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
}

export const muligeSlektsforhold: Slektsforhold[] = [
    Slektsforhold.FORELDER,
    Slektsforhold.ONKEL_ELLER_TANTE,
    Slektsforhold.BESTEFORELDER,
    Slektsforhold.ANNEN_FAMILIERELASJON,
    Slektsforhold.ANNEN_RELASJON,
];
