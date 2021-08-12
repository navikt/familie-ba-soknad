export enum Dokumentasjonsbehov {
    AVTALE_DELT_BOSTED = 'AVTALE_DELT_BOSTED',
    VEDTAK_OPPHOLDSTILLATELSE = 'VEDTAK_OPPHOLDSTILLATELSE',
    ADOPSJON_DATO = 'ADOPSJON_DATO',
    BEKREFTELSE_FRA_BARNEVERN = 'BEKREFTELSE_FRA_BARNEVERN',
    BOR_FAST_MED_SØKER = 'BOR_FAST_MED_SØKER',
    ANNEN_DOKUMENTASJON = 'ANNEN_DOKUMENTASJON',
    SEPARERT_SKILT_ENKE = 'SEPARERT_SKILT_ENKE',
    MEKLINGSATTEST = 'MEKLINGSATTEST',
}

export interface IVedlegg {
    dokumentId: string;
    navn: string;
    størrelse: number;
    tidspunkt: string;
}

export interface IDokumentasjon {
    dokumentasjonsbehov: Dokumentasjonsbehov;
    gjelderForBarnId: string[];
    gjelderForSøker: boolean;
    harSendtInn: boolean;
    opplastedeVedlegg: IVedlegg[];
    tittelSpråkId: string;
    beskrivelseSpråkId: string | null;
}

export interface ISøknadKontraktVedlegg {
    dokumentId: string;
    navn: string;
    tittel: Dokumentasjonsbehov;
}

export interface ISøknadKontraktDokumentasjon {
    dokumentasjonsbehov: Dokumentasjonsbehov;
    harSendtInn: boolean;
    opplastedeVedlegg: ISøknadKontraktVedlegg[];
}

export enum EFiltyper {
    PDF = 'application/pdf',
    PNG = 'image/png',
    JPG = 'image/jpg',
    JPEG = 'image/jpeg',
}
