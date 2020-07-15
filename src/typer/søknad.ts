export enum ESøknadstype {
    IKKE_SATT = 'Ikke satt',
    ORDINÆR = 'Ordinær',
    UTVIDET = 'Utvidet',
    EØS = 'EØS',
}

interface ISøker {
    navn: ISøknadsfelt<string>;
}

interface IBarn {
    navn: ISøknadsfelt<string>;
    alder: ISøknadsfelt<string>;
    ident: ISøknadsfelt<string>;
    borMedSøker: ISøknadsfelt<boolean>;
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
