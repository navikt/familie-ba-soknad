import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';

import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent } from './common';
import { ISøknadSpørsmål } from './spørsmål';
import { EUtenlandsoppholdÅrsak } from './utenlandsopphold';
import { Årsak } from './utvidet';

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

export interface IBarnRespons extends Omit<IPerson, 'ident'> {
    ident: string;
    borMedSøker: boolean;
    fødselsdato: string | undefined;
}

export interface ISøkerRespons extends IPerson {
    barn: IBarnRespons[];
    statsborgerskap: { landkode: Alpha3Code }[];
    adresse?: IAdresse;
    sivilstand: { type: ESivilstand };
}

export interface IBarn extends Omit<IPerson, 'ident'> {
    ident: string;
    id: BarnetsId;
    borMedSøker: boolean | undefined;
    alder: string | undefined;
}

export interface ISøker extends Omit<ISøkerRespons, 'barn'> {
    barn: IBarn[];
    borPåRegistrertAdresse: ISøknadSpørsmål<ESvar | null>;
    værtINorgeITolvMåneder: ISøknadSpørsmål<ESvar | null>;
    planleggerÅBoINorgeTolvMnd: ISøknadSpørsmål<ESvar | null>;
    erAsylsøker: ISøknadSpørsmål<ESvar | null>;
    jobberPåBåt: ISøknadSpørsmål<ESvar | null>;
    arbeidsland: ISøknadSpørsmål<Alpha3Code | ''>;
    mottarUtenlandspensjon: ISøknadSpørsmål<ESvar | null>;
    pensjonsland: ISøknadSpørsmål<Alpha3Code | ''>;
    harSamboerNå: ISøknadSpørsmål<ESvar | null>;
    nåværendeSamboer: ISamboer | null;
    utenlandsperioder: IUtenlandsperiode[];
    arbeidsperioder: IArbeidsperiode[];
    utvidet: {
        spørsmål: {
            årsak: ISøknadSpørsmål<Årsak | ''>;
            separertEnkeSkilt: ISøknadSpørsmål<ESvar | null>;
            separertEnkeSkiltUtland: ISøknadSpørsmål<ESvar | null>;
            separertEnkeSkiltDato: ISøknadSpørsmål<ISODateString>;
        };
        tidligereSamboere: ITidligereSamboer[];
    };
}

export interface IUtenlandsperiode {
    utenlandsoppholdÅrsak: ISøknadSpørsmål<EUtenlandsoppholdÅrsak>;
    oppholdsland: ISøknadSpørsmål<Alpha3Code | ''>;
    oppholdslandFraDato?: ISøknadSpørsmål<ISODateString>;
    oppholdslandTilDato?: ISøknadSpørsmål<DatoMedUkjent>;
}

export interface IArbeidsperiode {
    arbeidsperiodeAvsluttet: ISøknadSpørsmål<ESvar | null>;
}

export interface ISamboer {
    navn: ISøknadSpørsmål<string>;
    ident: ISøknadSpørsmål<string | AlternativtSvarForInput.UKJENT>;
    fødselsdato: ISøknadSpørsmål<DatoMedUkjent>;
    samboerFraDato: ISøknadSpørsmål<ISODateString>;
}

export interface ITidligereSamboer extends ISamboer {
    samboerTilDato: ISøknadSpørsmål<ISODateString>;
}

export interface IAdresse {
    adressenavn?: string;
    postnummer?: string;
    husbokstav?: string;
    bruksenhetsnummer?: string;
    husnummer?: string;
    poststed?: string;
}

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
