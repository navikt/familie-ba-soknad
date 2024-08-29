import { Dokumentasjonsbehov } from './kontrakt/dokumentasjon';

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
}

export enum EFiltyper {
    PDF = '.pdf',
    PNG = '.png',
    JPG = '.jpg',
    JPEG = '.jpeg',
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
        case Dokumentasjonsbehov.MEKLINGSATTEST:
            return 'dokumentasjon.meklingsattest.vedleggtittel';
        case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
            return 'dokumentasjon.separasjonskilsmissedødsfall.vedleggtittel';
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return 'dokumentasjon.oppholdstillatelse.vedleggtittel';
    }
};

export enum TittelSanityApiNavn {
    bekreftelsePaaAdopsjonTittel = 'bekreftelsePaaAdopsjonTittel',
    annenDokumentasjon = 'annenDokumentasjon',
    avtaleOmDeltBostedTittel = 'avtaleOmDeltBostedTittel',
    bekreftelseFraBarnevernetTittel = 'bekreftelseFraBarnevernetTittel',
    bekreftelsePaaAtBarnBorSammenMedDegTittel = 'bekreftelsePaaAtBarnBorSammenMedDegTittel',
    meklingsattestTittel = 'meklingsattestTittel',
    dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfallTittel = 'dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfallTittel',
    vedtakOmOppholdstillatelseTittel = 'vedtakOmOppholdstillatelseTittel',
}

export const dokumentasjonsbehovTilTittelSanityApiNavn = (
    dokumentasjonsbehov: Dokumentasjonsbehov
): string => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel;
        case Dokumentasjonsbehov.ANNEN_DOKUMENTASJON:
            return TittelSanityApiNavn.annenDokumentasjon;
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return TittelSanityApiNavn.avtaleOmDeltBostedTittel;
        case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
            return TittelSanityApiNavn.bekreftelseFraBarnevernetTittel;
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel;
        case Dokumentasjonsbehov.MEKLINGSATTEST:
            return TittelSanityApiNavn.meklingsattestTittel;
        case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
            return TittelSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfallTittel;
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel;
    }
};

export enum BeskrivelseSanityApiNavn {
    dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall = 'dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall',
    vedtakOmOppholdstillatelse = 'vedtakOmOppholdstillatelse',
    bekreftelsePaaAdopsjonBarnetrygd = 'bekreftelsePaaAdopsjonBarnetrygd',
    bekreftelsePaaAtBarnBorSammenMedDeg = 'bekreftelsePaaAtBarnBorSammenMedDeg',
    avtaleOmDeltBosted = 'avtaleOmDeltBosted',
    meklingsattest = 'meklingsattest',
    bekreftelseFraBarnevernetBarnetrygd = 'bekreftelseFraBarnevernetBarnetrygd',
    lastOppSenereISoknad = 'lastOppSenereISoknad',
}

export const dokumentasjonsbehovTilBeskrivelseSanityApiNavn = (
    dokumentasjonsbehov: Dokumentasjonsbehov
): string | null => {
    switch (dokumentasjonsbehov) {
        case Dokumentasjonsbehov.ADOPSJON_DATO:
            return BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonBarnetrygd;
        case Dokumentasjonsbehov.ANNEN_DOKUMENTASJON:
            return null;
        case Dokumentasjonsbehov.AVTALE_DELT_BOSTED:
            return BeskrivelseSanityApiNavn.avtaleOmDeltBosted;
        case Dokumentasjonsbehov.BEKREFTELSE_FRA_BARNEVERN:
            return BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd;
        case Dokumentasjonsbehov.BOR_FAST_MED_SØKER:
            return BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg;
        case Dokumentasjonsbehov.MEKLINGSATTEST:
            return BeskrivelseSanityApiNavn.meklingsattest;
        case Dokumentasjonsbehov.SEPARERT_SKILT_ENKE:
            return BeskrivelseSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall;
        case Dokumentasjonsbehov.VEDTAK_OPPHOLDSTILLATELSE:
            return BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse;
    }
};
