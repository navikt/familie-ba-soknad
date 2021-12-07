import { Alpha3Code } from 'i18n-iso-countries';

import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { LocaleType } from '@navikt/familie-sprakvelger';

import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { genererInitiellDokumentasjon } from '../utils/dokumentasjon';
import { AlternativtSvarForInput, BarnetsId, DatoMedUkjent, INøkkelPar } from './common';
import {
    Dokumentasjonsbehov,
    dokumentasjonsbehovTilSpråkId,
    IDokumentasjon,
    ISøknadKontraktDokumentasjon,
} from './dokumentasjon';
import {
    andreForelderDataKeySpørsmål,
    barnDataKeySpørsmål,
    ESivilstand,
    IAdresse,
    IBarn,
    ISøker,
    IUtenlandsperiode,
} from './person';
import { ISøknadSpørsmål } from './spørsmål';
import { Årsak } from './utvidet';

export enum ESøknadstype {
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
}

export const søknadstyper: INøkkelPar = {
    ORDINÆR: {
        id: 330007,
        navn: 'Ordinær barnetrygd',
    },
    UTVIDET: {
        id: 330009,
        navn: 'Utvidet barnetrygd',
    },
};

export interface ISøknadsfelt<T> {
    label: Record<LocaleType, string>;
    verdi: Record<LocaleType, T>;
}

export interface IAndreForelder {
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
    andreForelder: IAndreForelder | null;
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

export interface ISøknad {
    søknadstype: ESøknadstype;
    erEøs: boolean;
    søker: ISøker;
    lestOgForståttBekreftelse: boolean;
    barnInkludertISøknaden: IBarnMedISøknad[];
    barnRegistrertManuelt: IBarn[];
    erNoenAvBarnaFosterbarn: ISøknadSpørsmål<ESvar | null>;
    oppholderBarnSegIInstitusjon: ISøknadSpørsmål<ESvar | null>;
    erBarnAdoptertFraUtland: ISøknadSpørsmål<ESvar | null>;
    søktAsylForBarn: ISøknadSpørsmål<ESvar | null>;
    erAvdødPartnerForelder: ISøknadSpørsmål<ESvar | null>;
    barnOppholdtSegTolvMndSammenhengendeINorge: ISøknadSpørsmål<ESvar | null>;
    mottarBarnetrygdForBarnFraAnnetEøsland: ISøknadSpørsmål<ESvar | null>;
    dokumentasjon: IDokumentasjon[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpørsmålMap = Record<string, ISøknadsfelt<any>>;

export interface ISøknadKontrakt {
    søknadstype: ESøknadstype;
    søker: ISøknadKontraktSøker;
    barn: ISøknadKontraktBarn[];
    spørsmål: SpørsmålMap;
    dokumentasjon: ISøknadKontraktDokumentasjon[];
    teksterUtenomSpørsmål: Record<string, Record<LocaleType, string>>;
    originalSpråk: LocaleType;
}

export interface IKontraktNåværendeSamboer {
    navn: ISøknadsfelt<string>;
    ident: ISøknadsfelt<string>;
    fødselsdato: ISøknadsfelt<string>;
    samboerFraDato: ISøknadsfelt<ISODateString>;
}

export interface IKontraktTidligereSamboer extends IKontraktNåværendeSamboer {
    samboerTilDato: ISøknadsfelt<ISODateString>;
}

export interface IUtenlandsperiodeIKontraktFormat {
    utenlandsoppholdÅrsak: ISøknadsfelt<string>;
    oppholdsland: ISøknadsfelt<string>;
    oppholdslandTilDato: ISøknadsfelt<string | undefined>;
    oppholdslandFraDato: ISøknadsfelt<string | undefined>;
}

export interface IAndreForelderIKontraktFormat {
    navn: ISøknadsfelt<string>;
    fnr: ISøknadsfelt<string>;
    fødselsdato: ISøknadsfelt<string>;
    pensjonUtland: ISøknadsfelt<ESvar | null>;
    pensjonHvilketLand: ISøknadsfelt<string>;
    arbeidUtlandet: ISøknadsfelt<ESvar | null>;
    arbeidUtlandetHvilketLand: ISøknadsfelt<string>;
    skriftligAvtaleOmDeltBosted: ISøknadsfelt<ESvar | null>;
    utvidet: {
        søkerHarBoddMedAndreForelder: ISøknadsfelt<ESvar | null>;
        søkerFlyttetFraAndreForelderDato: ISøknadsfelt<string>;
    };
}

export interface ISøknadKontraktSøker {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    statsborgerskap: ISøknadsfelt<string[]>;
    adresse: ISøknadsfelt<IAdresse>;
    sivilstand: ISøknadsfelt<ESivilstand>;
    spørsmål: SpørsmålMap;
    tidligereSamboere: ISøknadsfelt<IKontraktTidligereSamboer>[];
    nåværendeSamboer: ISøknadsfelt<IKontraktNåværendeSamboer> | null;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
}

export enum ERegistrertBostedType {
    REGISTRERT_SOKERS_ADRESSE = 'REGISTRERT_SOKERS_ADRESSE',
    REGISTRERT_ANNEN_ADRESSE = 'REGISTRERT_ANNEN_ADRESSE',
    IKKE_FYLT_INN = 'IKKE_FYLT_INN',
    ADRESSESPERRE = 'ADRESSESPERRE',
}

export interface ISøknadKontraktBarn {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    registrertBostedType: ISøknadsfelt<ERegistrertBostedType>;
    alder: ISøknadsfelt<string>;
    spørsmål: SpørsmålMap;
    utenlandsperioder: ISøknadsfelt<IUtenlandsperiodeIKontraktFormat>[];
    andreForelder: IAndreForelderIKontraktFormat | null;
}

export const hentSøknadstype = () => {
    return window.location.pathname.includes('utvidet')
        ? ESøknadstype.UTVIDET
        : ESøknadstype.ORDINÆR;
};

export const initialStateSøknad: ISøknad = {
    søknadstype: hentSøknadstype(),
    erEøs: false,
    barnInkludertISøknaden: [],
    lestOgForståttBekreftelse: false,
    barnRegistrertManuelt: [],
    dokumentasjon: [
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.AVTALE_DELT_BOSTED),
            'dokumentasjon.deltbosted.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE),
            'dokumentasjon.oppholdstillatelse.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.ADOPSJON_DATO,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.ADOPSJON_DATO),
            'dokumentasjon.adopsjon.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN),
            'dokumentasjon.bekreftelsebarnevernet.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BOR_FAST_MED_SØKER,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.BOR_FAST_MED_SØKER),
            'dokumentasjon.bekreftelseborsammen.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.SEPARERT_SKILT_ENKE,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.SEPARERT_SKILT_ENKE),
            'dokumentasjon.separasjonskilsmissedødsfall.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.MEKLINGSATTEST,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.MEKLINGSATTEST),
            'dokumentasjon.meklingsattest.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.EØS_SKJEMA,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.EØS_SKJEMA),
            'dokumentasjon.tilleggsskjema.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            dokumentasjonsbehovTilSpråkId(Dokumentasjonsbehov.ANNEN_DOKUMENTASJON),
            hentSøknadstype() === ESøknadstype.UTVIDET
                ? 'dokumentasjon.annendokumentasjon.utvidet.informasjon'
                : null
        ),
    ],
    søker: {
        navn: '',
        barn: [],
        statsborgerskap: [],
        ident: '',
        sivilstand: { type: ESivilstand.UOPPGITT },
        adressebeskyttelse: false,
        adresse: {
            adressenavn: '',
            husbokstav: '',
            husnummer: '',
            bruksenhetsnummer: '',
            postnummer: '',
            poststed: '',
        },
        utenlandsperioder: [],
        borPåRegistrertAdresse: {
            id: OmDegSpørsmålId.borPåRegistrertAdresse,
            svar: null,
        },
        værtINorgeITolvMåneder: {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: null,
        },
        planleggerÅBoINorgeTolvMnd: {
            id: OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd,
            svar: null,
        },
        erAsylsøker: {
            id: DinLivssituasjonSpørsmålId.erAsylsøker,
            svar: null,
        },
        jobberPåBåt: {
            id: DinLivssituasjonSpørsmålId.jobberPåBåt,
            svar: null,
        },
        arbeidsland: {
            id: DinLivssituasjonSpørsmålId.arbeidsland,
            svar: '',
        },
        mottarUtenlandspensjon: {
            id: DinLivssituasjonSpørsmålId.mottarUtenlandspensjon,
            svar: null,
        },
        pensjonsland: {
            id: DinLivssituasjonSpørsmålId.pensjonsland,
            svar: '',
        },
        harSamboerNå: {
            id: DinLivssituasjonSpørsmålId.harSamboerNå,
            svar: null,
        },
        nåværendeSamboer: null,
        utvidet: {
            spørsmål: {
                årsak: {
                    id: DinLivssituasjonSpørsmålId.årsak,
                    svar: '',
                },
                separertEnkeSkilt: {
                    id: DinLivssituasjonSpørsmålId.separertEnkeSkilt,
                    svar: null,
                },
                separertEnkeSkiltUtland: {
                    id: DinLivssituasjonSpørsmålId.separertEnkeSkiltUtland,
                    svar: null,
                },
                separertEnkeSkiltDato: {
                    id: DinLivssituasjonSpørsmålId.separertEnkeSkiltDato,
                    svar: '',
                },
            },
            tidligereSamboere: [],
        },
    },
    erNoenAvBarnaFosterbarn: {
        id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
        svar: null,
    },
    oppholderBarnSegIInstitusjon: {
        id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
        svar: null,
    },
    erBarnAdoptertFraUtland: {
        id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
        svar: null,
    },
    søktAsylForBarn: {
        id: OmBarnaDineSpørsmålId.søktAsylForBarn,
        svar: null,
    },
    barnOppholdtSegTolvMndSammenhengendeINorge: {
        id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
        svar: null,
    },
    mottarBarnetrygdForBarnFraAnnetEøsland: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: null,
    },
    erAvdødPartnerForelder: {
        id: OmBarnaDineSpørsmålId.erFolkeregAvdødEktefelleForelder,
        svar: null,
    },
};

export const muligeÅrsaker: Årsak[] = [
    Årsak.SEPARERT,
    Årsak.SKILT,
    Årsak.BRUDD_SAMBOER,
    Årsak.BODD_ALENE,
    Årsak.ENKE_ENKEMANN,
    Årsak.FENGSEL_VARETEKT,
    Årsak.BRUDD_GIFT,
    Årsak.FORVARING,
    Årsak.FORSVUNNET,
    Årsak.PSYKISK_HELSEVERN,
];
