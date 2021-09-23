import { Dokumentasjonsbehov, IDokumentasjon } from '../typer/dokumentasjon';

export const formaterFilstørrelse = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const genererInitiellDokumentasjon = (
    dokumentasjonsbehov: Dokumentasjonsbehov,
    tittelSpråkId: string,
    beskrivelseSpråkId
): IDokumentasjon => ({
    dokumentasjonsbehov,
    tittelSpråkId,
    beskrivelseSpråkId,
    gjelderForBarnId: [],
    gjelderForSøker: false,
    harSendtInn: false,
    opplastedeVedlegg: [],
});

export const erDokumentasjonRelevant = (dokumentasjon: IDokumentasjon) =>
    dokumentasjon.dokumentasjonsbehov === Dokumentasjonsbehov.ANNEN_DOKUMENTASJON ||
    dokumentasjon.gjelderForSøker ||
    dokumentasjon.gjelderForBarnId.length;

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
            return 'dokumentasjon.eøsskjema.vedleggtittel';
        case Dokumentasjonsbehov.MEKLINGSATTEST:
            return 'dokumentasjon.meklingsattest.vedleggtittel';
        case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
            return 'dokumentasjon.bekreftelseborsammen.vedleggtittel';
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return 'dokumentasjon.oppholdstillatelse.vedleggtittel';
    }
};
