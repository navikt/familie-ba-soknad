import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmBarnetSpørsmålsId } from '../components/SøknadsSteg/OmBarnet/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { genererInitiellDokumentasjon } from '../utils/dokumentasjon';
import { INøkkelPar } from './common';
import { Dokumentasjonsbehov, IDokumentasjon, ISøknadKontraktDokumentasjon } from './dokumentasjon';
import { ESivilstand, IAdresse, IBarn, IBarnMedISøknad, ISøker } from './person';

export enum ESøknadstype {
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
}

export const søknadstyper: INøkkelPar = {
    ORDINÆR: {
        id: 'ORDINÆR_BARNTETRYGD',
        navn: 'Ordinær barnetrygd',
    },
    UTVIDET: {
        id: 'UTVIDET_BARNETRYGD',
        navn: 'Utvidet barnetrygd',
    },
};

export interface ISøknadsfelt<T> {
    label: string;
    verdi: T;
}

export interface ISøknad {
    søknadstype: ESøknadstype;
    søker: ISøker;
    lestOgForståttBekreftelse: boolean;
    barnInkludertISøknaden: IBarnMedISøknad[];
    barnRegistrertManuelt: IBarn[];
    erNoenAvBarnaFosterbarn: ISøknadSpørsmål<ESvar | null>;
    oppholderBarnSegIInstitusjon: ISøknadSpørsmål<ESvar | null>;
    erBarnAdoptertFraUtland: ISøknadSpørsmål<ESvar | null>;
    oppholderBarnSegIUtland: ISøknadSpørsmål<ESvar | null>;
    søktAsylForBarn: ISøknadSpørsmål<ESvar | null>;
    barnOppholdtSegTolvMndSammenhengendeINorge: ISøknadSpørsmål<ESvar | null>;
    mottarBarnetrygdForBarnFraAnnetEøsland: ISøknadSpørsmål<ESvar | null>;
    dokumentasjon: IDokumentasjon[];
}

export interface ISøknadSpørsmål<T> {
    id: OmDegSpørsmålId | OmBarnaDineSpørsmålId | OmBarnetSpørsmålsId;
    svar: T;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SpørsmålMap = Record<string, ISøknadsfelt<any>>;

export interface ISøknadKontrakt {
    søknadstype: ESøknadstype;
    søker: ISøknadKontraktSøker;
    barn: ISøknadKontraktBarn[];
    spørsmål: SpørsmålMap;
    dokumentasjon: ISøknadKontraktDokumentasjon[];
}

export interface ISøknadKontraktSøker {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    statsborgerskap: ISøknadsfelt<string[]>;
    adresse: ISøknadsfelt<IAdresse>;
    sivilstand: ISøknadsfelt<ESivilstand>;
    telefonnummer: ISøknadsfelt<string>;
    spørsmål: SpørsmålMap;
}

export interface ISøknadKontraktBarn {
    ident: ISøknadsfelt<string>;
    navn: ISøknadsfelt<string>;
    borMedSøker: ISøknadsfelt<boolean>;
    alder: ISøknadsfelt<string>;
    spørsmål: SpørsmålMap;
}

export const initialStateSøknad: ISøknad = {
    søknadstype: ESøknadstype.ORDINÆR,
    barnInkludertISøknaden: [],
    lestOgForståttBekreftelse: false,
    barnRegistrertManuelt: [],
    dokumentasjon: [
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.AVTALE_DELT_BOSTED,
            'dokumentasjon.deltbosted.vedleggtittel',
            'dokumentasjon.deltbosted.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE,
            'dokumentasjon.oppholdstillatelse.vedleggtittel',
            'dokumentasjon.oppholdstillatelse.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.ADOPSJON_DATO,
            'dokumentasjon.adopsjon.vedleggtittel',
            'dokumentasjon.adopsjon.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN,
            'dokumentasjon.bekreftelsebarnevernet.vedleggtittel',
            'dokumentasjon.bekreftelsebarnevernet.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.BOR_FAST_MED_SØKER,
            'dokumentasjon.bekreftelseborsammen.vedleggtittel',
            'dokumentasjon.bekreftelseborsammen.informasjon'
        ),
        genererInitiellDokumentasjon(
            Dokumentasjonsbehov.ANNEN_DOKUMENTASJON,
            'dokumentasjon.annendokumentasjon.vedleggtittel',
            ''
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
        borPåRegistrertAdresse: {
            id: OmDegSpørsmålId.borPåRegistrertAdresse,
            svar: null,
        },
        telefonnummer: {
            id: OmDegSpørsmålId.telefonnummer,
            svar: '',
        },
        oppholderSegINorge: {
            id: OmDegSpørsmålId.oppholderSegINorge,
            svar: null,
        },
        oppholdsland: {
            id: OmDegSpørsmålId.oppholdsland,
            svar: '',
        },
        oppholdslandDato: {
            id: OmDegSpørsmålId.oppholdslandDato,
            svar: '',
        },
        værtINorgeITolvMåneder: {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: null,
        },
        komTilNorgeDato: {
            id: OmDegSpørsmålId.komTilNorgeDato,
            svar: '',
        },
        planleggerÅBoINorgeTolvMnd: {
            id: OmDegSpørsmålId.planleggerÅBoINorgeTolvMnd,
            svar: null,
        },
        erAsylsøker: {
            id: OmDegSpørsmålId.erAsylsøker,
            svar: null,
        },
        jobberPåBåt: {
            id: OmDegSpørsmålId.jobberPåBåt,
            svar: null,
        },
        arbeidsland: {
            id: OmDegSpørsmålId.arbeidsland,
            svar: '',
        },
        mottarUtenlandspensjon: {
            id: OmDegSpørsmålId.mottarUtenlandspensjon,
            svar: null,
        },
        pensjonsland: {
            id: OmDegSpørsmålId.pensjonsland,
            svar: '',
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
    oppholderBarnSegIUtland: {
        id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
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
};
