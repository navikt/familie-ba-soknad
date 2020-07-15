import { INøkkelPar } from './common';

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
    søker: ISøker;
    barn: IBarn[];
}
export interface ISøknadsfelt<T> {
    label: string;
    verdi: T;
}

export const initialState = {
    søknadstype: { label: 'Hva slags barnetrygd søker du om?', verdi: ESøknadstype.IKKE_SATT },
    søker: { navn: { label: '', verdi: '' } },
    barn: [],
};
