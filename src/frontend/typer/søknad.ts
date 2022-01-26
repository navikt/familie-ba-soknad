import { ESvar } from '@navikt/familie-form-elements';

import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { genererInitiellDokumentasjon } from '../utils/dokumentasjon';
import { IBarnMedISøknad } from './barn';
import { INøkkelPar } from './common';
import { dokumentasjonsbehovTilSpråkId, IDokumentasjon } from './dokumentasjon';
import { Dokumentasjonsbehov } from './kontrakt/dokumentasjon';
import { ESivilstand, ESøknadstype } from './kontrakt/generelle';
import { IBarn, ISøker } from './person';
import { ISøknadSpørsmål } from './spørsmål';
import { Årsak } from './utvidet';

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
        triggetEøs: false,
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
        arbeidsperioderUtland: [],
        arbeidsperioderNorge: [],
        pensjonsperioderNorge: [],
        pensjonsperioderUtland: [],
        andreUtbetalingsperioder: [],
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
