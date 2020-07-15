export enum ESøknadstype {
    IKKE_SATT = 'Ikke satt',
    ORDINÆR = 'Ordinær',
    UTVIDET = 'Utvidet',
    EØS = 'EØS',
}

interface ISøker {
    navn: ISøknadsfelt<string>;
}

export interface IBarn {
    navn: ISøknadsfelt<string>;
    alder: ISøknadsfelt<number>;
    fødselsdato: ISøknadsfelt<string>;
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
