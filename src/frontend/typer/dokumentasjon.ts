export enum Dokumentasjonsbehov {
    DELT_BOSTED = 'DELT_BOSTED',
}

export interface IVedlegg {
    dokumentId: string;
    navn: string;
    størrelse: number;
    tidspunkt: string;
}

export interface IDokumentasjon {
    dokumentasjonsbehov: Dokumentasjonsbehov;
    tittelSpråkId: string;
    beskrivelseSpråkId: string;
    harSendtInn: boolean;
    opplastedeVedlegg?: IVedlegg[];
}
