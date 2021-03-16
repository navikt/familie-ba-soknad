import { INøkkelPar } from './common';
import { ESivilstand, IBarnNy, ISøkerNy } from './person';

export enum ESøknadstype {
    IKKE_SATT = 'IKKE_SATT',
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTIVIDET',
    EØS = 'EØS',
}

export enum ESteg {
    STEG_EN,
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

interface ISøker {
    navn: ISøknadsfelt<string>;
}

export interface IBarn {
    navn: ISøknadsfelt<string>;
    alder: ISøknadsfelt<string>;
    ident: ISøknadsfelt<string>;
    borMedSøker: ISøknadsfelt<string>;
    medISøknad: ISøknadsfelt<boolean>;
}

export interface ISøknad {
    søknadstype: ISøknadsfelt<ESøknadstype>;
    søker: ISøknadsfelt<ISøker>;
    barn: ISøknadsfelt<ISøknadsfelt<IBarn>[]>;
}
export interface ISøknadsfelt<T> {
    label: string;
    verdi: T;
}

export interface ISøknadNy {
    søknadstype: ESøknadstype;
    søker: ISøkerNy;
    barn: IBarnNy[];
    spørsmål?: ISøknadsfeltNy[];
}

export interface ISøknadsfeltNy {
    label: string;
    id: string;
}

export const initialStateSøknadNy: ISøknadNy = {
    søknadstype: ESøknadstype.IKKE_SATT,
    søker: {
        navn: '',
        barn: [],
        statsborgerskap: [],
        kontakttelefon: '',
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
    },
    barn: [],
    spørsmål: [],
};
