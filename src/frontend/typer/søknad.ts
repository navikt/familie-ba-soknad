import { ESvar } from '@navikt/familie-form-elements';

import { DinLivssituasjonSpørsmålId } from '../components/SøknadsSteg/DinLivssituasjon/spørsmål';
import { EøsSøkerSpørsmålId } from '../components/SøknadsSteg/EøsSteg/Søker/spørsmål';
import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { genererInitiellDokumentasjon } from '../utils/dokumentasjon';

import { IBarnMedISøknad } from './barn';
import { INøkkelPar } from './common';
import { IDokumentasjon } from './dokumentasjon';
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

export const initialStateSøknad = (): ISøknad => {
    return {
        søknadstype: ESøknadstype.ORDINÆR,
        erEøs: false,
        barnInkludertISøknaden: [],
        lestOgForståttBekreftelse: false,
        barnRegistrertManuelt: [],
        dokumentasjon: Object.keys(Dokumentasjonsbehov).map((dok: string) =>
            genererInitiellDokumentasjon(dok as Dokumentasjonsbehov)
        ),
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
            borPåSvalbard: {
                id: OmDegSpørsmålId.borPåSvalbard,
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
            arbeidIUtlandet: {
                id: DinLivssituasjonSpørsmålId.arbeidIUtlandet,
                svar: null,
            },
            mottarUtenlandspensjon: {
                id: DinLivssituasjonSpørsmålId.mottarUtenlandspensjon,
                svar: null,
            },
            arbeidsperioderUtland: [],

            arbeidINorge: {
                id: EøsSøkerSpørsmålId.arbeidINorge,
                svar: null,
            },
            arbeidsperioderNorge: [],
            pensjonNorge: {
                id: EøsSøkerSpørsmålId.pensjonNorge,
                svar: null,
            },
            pensjonsperioderNorge: [],
            pensjonsperioderUtland: [],
            andreUtbetalinger: {
                id: EøsSøkerSpørsmålId.utbetalinger,
                svar: null,
            },
            andreUtbetalingsperioder: [],
            adresseISøkeperiode: { id: EøsSøkerSpørsmålId.adresseISøkeperiode, svar: '' },
            idNummer: [],
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
                    harSamboerNå: {
                        id: DinLivssituasjonSpørsmålId.harSamboerNå,
                        svar: null,
                    },
                    hattAnnenSamboerForSøktPeriode: {
                        id: DinLivssituasjonSpørsmålId.hattAnnenSamboerForSøktPeriode,
                        svar: null,
                    },
                },
                tidligereSamboere: [],
                nåværendeSamboer: null,
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
