export enum ESøknadstype {
    IKKE_SATT = 'IKKE_SATT',
    ORDINÆR = 'ORDINÆR',
    UTVIDET = 'UTVIDET',
    EØS = 'EØS',
}

interface ISøker {
    navn: ISøknadsfelt<string>;
}

interface IBarn {
    navn: ISøknadsfelt<string>;
    alder: ISøknadsfelt<number>;
    fødselsdato: ISøknadsfelt<string>;
    ident: ISøknadsfelt<string>;
    borMedSøker: ISøknadsfelt<boolean>;
    medISøknad: ISøknadsfelt<boolean>;
}

export interface ISøknad {
    søknadstype: ISøknadsfelt<string>;
    søker: ISøker;
    barn: IBarn[];
}
export interface ISøknadsfelt<T> {
    label: string;
    verdi: T;
}
