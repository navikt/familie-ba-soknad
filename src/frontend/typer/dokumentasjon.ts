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
    barnDetGjelderFor: string[];
    harSendtInn: boolean;
    opplastedeVedlegg?: IVedlegg[];
    tittelSpråkId: string;
    beskrivelseSpråkId: string;
}

export enum EFiltyper {
    PDF = 'application/pdf',
    PNG = 'image/png',
    JPG = 'image/jpg',
    JPEG = 'image/jpeg',
}
