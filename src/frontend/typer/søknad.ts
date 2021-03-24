import { OmDegSpørsmålId } from '../components/SøknadsSteg/OmDeg/typer';
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

export interface ISøknad {
    søknadstype: ESøknadstype;
    søker: ISøker;
    barn: IBarn[];
}

export interface ISøknadSpørsmål<T> {
    id: OmDegSpørsmålId;
    svar: T;
}

export const initialStateSøknad: ISøknad = {
    søknadstype: ESøknadstype.IKKE_SATT,
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
    barn: [],
};
