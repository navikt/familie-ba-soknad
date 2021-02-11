export interface IPerson {
    navn: string;
    barn: IBarn[];
}

interface IBarn {
    ident: string;
    navn: string;
    borMedSøker: boolean;
    fødselsdato: string;
}
