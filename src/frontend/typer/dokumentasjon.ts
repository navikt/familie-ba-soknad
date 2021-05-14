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
    harSendtInn: boolean;
    opplastedeVedlegg?: IVedlegg[];
}
