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
    tittelSpråkId: string;
    beskrivelseSpråkId: string | null;
}

export enum EFiltyper {
    PDF = '.pdf',
    PNG = '.png',
    JPG = '.jpg',
    JPEG = '.jpeg',
}

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
