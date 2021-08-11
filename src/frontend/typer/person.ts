import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { Årsak } from '../components/Felleskomponenter/Dropdowns/ÅrsakDropdown';
import { BarnetsId } from '../components/SøknadsSteg/OmBarnaDine/HvilkeBarnCheckboxGruppe';
import { ISøknadSpørsmål } from './søknad';

export enum ESivilstand {
    GIFT = 'GIFT',
    ENKE_ELLER_ENKEMANN = 'ENKE_ELLER_ENKEMANN',
    SKILT = 'SKILT',
    SEPARERT = 'SEPARERT',
    REGISTRERT_PARTNER = 'REGISTRERT_PARTNER',
    SEPARERT_PARTNER = 'SEPARERT_PARTNER',
    SKILT_PARTNER = 'SKILT_PARTNER',
    GJENLEVENDE_PARTNER = 'GJENLEVENDE_PARTNER',
    UGIFT = 'UGIFT',
    UOPPGITT = 'UOPPGITT',
}

export interface IPerson {
    ident: string;
    navn: string;
    adressebeskyttelse: boolean;
}

export interface ISøkerRespons extends IPerson {
    barn: IBarnRespons[];
    statsborgerskap: { landkode: Alpha3Code }[];
    adresse?: IAdresse;
    sivilstand: { type: ESivilstand };
}

export interface ISøker extends Omit<ISøkerRespons, 'barn'> {
    barn: IBarn[];
    borPåRegistrertAdresse: ISøknadSpørsmål<ESvar | null>;
    oppholderSegINorge: ISøknadSpørsmål<ESvar | null>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    oppholdslandDato: ISøknadSpørsmål<ISODateString>;
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | null>;
    komTilNorgeDato: ISøknadSpørsmål<ISODateString>;
    planleggerÅBoINorgeTolvMnd: ISøknadSpørsmål<ESvar | null>;
    erAsylsøker: ISøknadSpørsmål<ESvar | null>;
    jobberPåBåt: ISøknadSpørsmål<ESvar | null>;
    arbeidsland: ISøknadSpørsmål<Alpha3Code | ''>;
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | null>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
    utvidet: {
        årsak: ISøknadSpørsmål<Årsak | ''>;
    };
}

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    poststed?: string;
}

export enum barnDataKeySpørsmål {
    erFosterbarn = 'erFosterbarn',
    erAdoptertFraUtland = 'erAdoptertFraUtland',
    erAsylsøker = 'erAsylsøker',
    barnetrygdFraAnnetEøsland = 'barnetrygdFraAnnetEøsland',
    barnetrygdFraEøslandHvilketLand = 'barnetrygdFraEøslandHvilketLand',
    oppholderSegIInstitusjon = 'oppholderSegIInstitusjon',
    institusjonsnavn = 'institusjonsnavn',
    institusjonsadresse = 'institusjonsadresse',
    institusjonspostnummer = 'institusjonspostnummer',
    institusjonOppholdStartdato = 'institusjonOppholdStartdato',
    institusjonOppholdSluttdato = 'institusjonOppholdSluttdato',
    oppholderSegIUtland = 'oppholderSegIUtland',
    oppholdsland = 'oppholdsland',
    oppholdslandStartdato = 'oppholdslandStartdato',
    oppholdslandSluttdato = 'oppholdslandSluttdato',
    boddMindreEnn12MndINorge = 'boddMindreEnn12MndINorge',
    nårKomBarnTilNorgeDato = 'nårKomBarnTilNorgeDato',
    planleggerÅBoINorge12Mnd = 'planleggerÅBoINorge12Mnd',
    andreForelderNavn = 'andreForelderNavn',
    andreForelderFnr = 'andreForelderFnr',
    andreForelderFødselsdato = 'andreForelderFødselsdato',
    andreForelderArbeidUtlandet = 'andreForelderArbeidUtlandet',
    andreForelderArbeidUtlandetHvilketLand = 'andreForelderArbeidUtlandetHvilketLand',
    andreForelderPensjonUtland = 'andreForelderPensjonUtland',
    andreForelderPensjonHvilketLand = 'andreForelderPensjonHvilketLand',
    borFastMedSøker = 'borFastMedSøker',
    skriftligAvtaleOmDeltBosted = 'skriftligAvtaleOmDeltBosted',
    søkerForTidsromStartdato = 'søkerForTidsromStartdato',
    søkerForTidsromSluttdato = 'søkerForTidsromSluttdato',
}

export enum barnDataKeySpørsmålUtvidet {
    søkerHarBoddMedAndreForelder = 'søkerHarBoddMedAndreForelder',
}

export interface IBarnRespons extends Omit<IPerson, 'ident'> {
    ident: string;
    borMedSøker: boolean;
    fødselsdato: string | undefined;
}

export interface IBarn extends Omit<IPerson, 'ident'> {
    ident: string;
    id: BarnetsId;
    borMedSøker: boolean | undefined;
    alder: string | undefined;
}

export enum AlternativtSvarForInput {
    UKJENT = 'UKJENT',
}

export type DatoMedUkjent = ISODateString | AlternativtSvarForInput.UKJENT;

export interface IBarnMedISøknad extends IBarn {
    barnErFyltUt: boolean;
    [barnDataKeySpørsmål.erFosterbarn]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAdoptertFraUtland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.barnetrygdFraAnnetEøsland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.erAsylsøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.oppholderSegIUtland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.oppholdsland]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.oppholdslandStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.oppholdslandSluttdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.oppholderSegIInstitusjon]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.institusjonsnavn]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonsadresse]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonspostnummer]: ISøknadSpørsmål<string>;
    [barnDataKeySpørsmål.institusjonOppholdStartdato]: ISøknadSpørsmål<ISODateString>;
    [barnDataKeySpørsmål.institusjonOppholdSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.boddMindreEnn12MndINorge]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.nårKomBarnTilNorgeDato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.planleggerÅBoINorge12Mnd]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.barnetrygdFraEøslandHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.andreForelderNavn]: ISøknadSpørsmål<
        string | AlternativtSvarForInput.UKJENT
    >;
    [barnDataKeySpørsmål.andreForelderFnr]: ISøknadSpørsmål<
        string | AlternativtSvarForInput.UKJENT
    >;
    [barnDataKeySpørsmål.andreForelderFødselsdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.andreForelderArbeidUtlandet]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.andreForelderArbeidUtlandetHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.andreForelderPensjonUtland]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.andreForelderPensjonHvilketLand]: ISøknadSpørsmål<Alpha3Code | ''>;
    [barnDataKeySpørsmål.borFastMedSøker]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.skriftligAvtaleOmDeltBosted]: ISøknadSpørsmål<ESvar | null>;
    [barnDataKeySpørsmål.søkerForTidsromStartdato]: ISøknadSpørsmål<DatoMedUkjent>;
    [barnDataKeySpørsmål.søkerForTidsromSluttdato]: ISøknadSpørsmål<DatoMedUkjent>;
    utvidet: {
        [barnDataKeySpørsmålUtvidet.søkerHarBoddMedAndreForelder]: ISøknadSpørsmål<ESvar | null>;
    };
}
