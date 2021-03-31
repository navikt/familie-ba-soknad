import { ESvar } from '@navikt/familie-form-elements';

import { OmBarnaDineSpørsmålId } from '../components/SøknadsSteg/OmBarnaDine/spørsmål';
import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/spørsmål';
import { INøkkelPar } from './common';
import { ESivilstand, IBarn, ISøker } from './person';

export enum ESøknadstype {
    IKKE_SATT = 'IKKE_SATT',
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTIVIDET',
    EØS = 'EØS',
}

export const søknadstyper: INøkkelPar = {
    IKKE_SATT: {
        id: 'IKKE_SATT',
        navn: 'Velg søknadstype',
    },
    ORDINÆR: {
        id: 'ORDINÆR',
        navn: 'Ordinær',
    },
    UTVIDET: {
        id: 'UTVIDET',
        navn: 'Utvidet',
    },
    EØS: {
        id: 'EØS',
        navn: 'EØS',
    },
};

export interface ISøknadsfelt<T> {
    label: string;
    verdi: T;
}

export enum søknadDataKeySpørsmål {
    erNoenAvBarnaFosterbarn = 'erNoenAvBarnaFosterbarn',
    oppholderBarnSegIInstitusjon = 'oppholderBarnSegIInstitusjon',
    erBarnAdoptertFraUtland = 'erBarnAdoptertFraUtland',
    oppholderBarnSegIUtland = 'oppholderBarnSegIUtland',
    søktAsylForBarn = 'søktAsylForBarn',
    barnOppholdtSegTolvMndSammenhengendeINorge = 'barnOppholdtSegTolvMndSammenhengendeINorge',
    mottarBarnetrygdForBarnFraAnnetEøsland = 'mottarBarnetrygdForBarnFraAnnetEøsland',
}

export interface ISøknad {
    søknadstype: ESøknadstype;
    søker: ISøker;
    barnInkludertISøknaden: IBarn[];
    [søknadDataKeySpørsmål.erNoenAvBarnaFosterbarn]: ISøknadSpørsmål<ESvar | undefined>;
    [søknadDataKeySpørsmål.oppholderBarnSegIInstitusjon]: ISøknadSpørsmål<ESvar | undefined>;
    [søknadDataKeySpørsmål.erBarnAdoptertFraUtland]: ISøknadSpørsmål<ESvar | undefined>;
    [søknadDataKeySpørsmål.oppholderBarnSegIUtland]: ISøknadSpørsmål<ESvar | undefined>;
    [søknadDataKeySpørsmål.søktAsylForBarn]: ISøknadSpørsmål<ESvar | undefined>;
    [søknadDataKeySpørsmål.barnOppholdtSegTolvMndSammenhengendeINorge]: ISøknadSpørsmål<
        ESvar | undefined
    >;
    [søknadDataKeySpørsmål.mottarBarnetrygdForBarnFraAnnetEøsland]: ISøknadSpørsmål<
        ESvar | undefined
    >;
}

export interface ISøknadSpørsmål<T> {
    id: OmDegSpørsmålId | OmBarnaDineSpørsmålId;
    svar: T;
}

export const initialStateSøknad: ISøknad = {
    søknadstype: ESøknadstype.IKKE_SATT,
    barnInkludertISøknaden: [],
    søker: {
        navn: '',
        barn: [],
        statsborgerskap: [],
        ident: '',
        sivilstand: { type: ESivilstand.UOPPGITT },
        adresse: {
            adressenavn: '',
            husbokstav: '',
            husnummer: '',
            bruksenhetsnummer: '',
            postnummer: '',
            bostedskommune: '',
        },
        borPåRegistrertAdresse: {
            id: OmDegSpørsmålId.borPåRegistrertAdresse,
            svar: undefined,
        },
        telefonnummer: {
            id: OmDegSpørsmålId.telefonnummer,
            svar: '',
        },
        oppholderSegINorge: {
            id: OmDegSpørsmålId.oppholderSegINorge,
            svar: undefined,
        },
        oppholdsland: {
            id: OmDegSpørsmålId.oppholdsland,
            svar: undefined,
        },
        værtINorgeITolvMåneder: {
            id: OmDegSpørsmålId.værtINorgeITolvMåneder,
            svar: undefined,
        },
        erAsylsøker: {
            id: OmDegSpørsmålId.erAsylsøker,
            svar: undefined,
        },
        jobberPåBåt: {
            id: OmDegSpørsmålId.jobberPåBåt,
            svar: undefined,
        },
        arbeidsland: {
            id: OmDegSpørsmålId.arbeidsland,
            svar: undefined,
        },
        mottarUtenlandspensjon: {
            id: OmDegSpørsmålId.mottarUtenlandspensjon,
            svar: undefined,
        },
        pensjonsland: {
            id: OmDegSpørsmålId.pensjonsland,
            svar: undefined,
        },
    },
    erNoenAvBarnaFosterbarn: {
        id: OmBarnaDineSpørsmålId.erNoenAvBarnaFosterbarn,
        svar: undefined,
    },
    oppholderBarnSegIInstitusjon: {
        id: OmBarnaDineSpørsmålId.oppholderBarnSegIInstitusjon,
        svar: undefined,
    },
    erBarnAdoptertFraUtland: {
        id: OmBarnaDineSpørsmålId.erBarnAdoptertFraUtland,
        svar: undefined,
    },
    oppholderBarnSegIUtland: {
        id: OmBarnaDineSpørsmålId.oppholderBarnSegIUtland,
        svar: undefined,
    },
    søktAsylForBarn: {
        id: OmBarnaDineSpørsmålId.søktAsylForBarn,
        svar: undefined,
    },
    barnOppholdtSegTolvMndSammenhengendeINorge: {
        id: OmBarnaDineSpørsmålId.barnOppholdtSegTolvMndSammenhengendeINorge,
        svar: undefined,
    },
    mottarBarnetrygdForBarnFraAnnetEøsland: {
        id: OmBarnaDineSpørsmålId.mottarBarnetrygdForBarnFraAnnetEøsland,
        svar: undefined,
    },
};
