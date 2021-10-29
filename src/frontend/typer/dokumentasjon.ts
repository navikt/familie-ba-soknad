import { LocaleType } from '@navikt/familie-sprakvelger';

export enum Dokumentasjonsbehov {
    AVTALE_DELT_BOSTED = 'AVTALE_DELT_BOSTED',
    VEDTAK_OPPHOLDSTILLATELSE = 'VEDTAK_OPPHOLDSTILLATELSE',
    ADOPSJON_DATO = 'ADOPSJON_DATO',
    BEKREFTELSE_FRA_BARNEVERN = 'BEKREFTELSE_FRA_BARNEVERN',
    BOR_FAST_MED_SØKER = 'BOR_FAST_MED_SØKER',
    SEPARERT_SKILT_ENKE = 'SEPARERT_SKILT_ENKE',
    MEKLINGSATTEST = 'MEKLINGSATTEST',
    EØS_SKJEMA = 'EØS_SKJEMA',
    ANNEN_DOKUMENTASJON = 'ANNEN_DOKUMENTASJON',
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
    dokumentasjonSpråkTittel: Record<LocaleType, string>;
}

export enum EFiltyper {
    PDF = 'application/pdf',
    PNG = 'image/png',
    JPG = 'image/jpg',
    JPEG = 'image/jpeg',
}

export const dokumentasjonsbehovTilSpråkId = (dokumentasjonsbehov: Dokumentasjonsbehov): string => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return 'dokumentasjon.adopsjon.vedleggtittel';
        case Dokumentasjonsbehov.ANNEN_DOKUMENTASJON:
            return 'dokumentasjon.annendokumentasjon.vedleggtittel';
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return 'dokumentasjon.deltbosted.vedleggtittel';
        case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
            return 'dokumentasjon.bekreftelsebarnevernet.vedleggtittel';
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return 'dokumentasjon.bekreftelseborsammen.vedleggtittel';
        case Dokumentasjonsbehov.EØS_SKJEMA:
            return 'dokumentasjon.tilleggsskjema.vedleggtittel';
        case Dokumentasjonsbehov.MEKLINGSATTEST:
            return 'dokumentasjon.meklingsattest.vedleggtittel';
        case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
            return 'dokumentasjon.separasjonskilsmissedødsfall.vedleggtittel';
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return 'dokumentasjon.oppholdstillatelse.vedleggtittel';
    }
};
