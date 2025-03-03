import { BeskrivelseSanityApiNavn, TittelSanityApiNavn } from '../../../typer/dokumentasjon';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/sanity/sanity';

export type IDokumentasjonTekstinnhold = {
    dokumentasjonTittel: LocaleRecordBlock;
    dokumentasjonGuide: LocaleRecordBlock;
    dokumentasjonGuideVedleggskrav: LocaleRecordBlock;
    dokumentasjonGuideIngenVedleggskrav: LocaleRecordBlock;
} & {
    // Info innledning
    forLangTidDokumentasjon: LocaleRecordBlock;
    vedleggskravTittel: LocaleRecordBlock;
    vedleggskrav: LocaleRecordBlock;
    ingenVedleggskravTittel: LocaleRecordBlock;
    ingenVedleggskrav: LocaleRecordBlock;
    manglerDokumentasjonSpoersmaalTittel: LocaleRecordBlock;
    manglerDokumentasjonSpoersmaal: LocaleRecordBlock;
} & {
    // Bilde scanning guide
    slikTarDuEtGodtBildeExpand: LocaleRecordString;
    slikTarDuEtGodtBildeTittel: LocaleRecordBlock;
    slikTarDuEtGodtBilde: LocaleRecordBlock;
    etterDuHarTattBildetTittel: LocaleRecordBlock;
    etterDuHarTattBildet: LocaleRecordBlock;
    vaerTryggNaarDuTarBildeTittel: LocaleRecordBlock;
    vaerTryggNaarDuTarBilde: LocaleRecordBlock;
    // Bra og dårlige eksempler
    braOgDaarligeTittel: LocaleRecordBlock;
    bra: LocaleRecordBlock;
    daarlig: LocaleRecordBlock;
    fyllerHeleBildet: LocaleRecordBlock;
    ikkeTattOvenfra: LocaleRecordBlock;
    ikkeRiktigRetning: LocaleRecordBlock;
    skyggePaaDokumentet: LocaleRecordBlock;
} & {
    // Knapper og checkbox
    sendtInnTidligere: LocaleRecordBlock;
    forMange: LocaleRecordString;
    feilFiltype: LocaleRecordString;
    forStor: LocaleRecordString;
    bildetForLite: LocaleRecordString;
    noeGikkFeil: LocaleRecordString;
    lastOppKnapp: LocaleRecordString;
    slippFilenHer: LocaleRecordString;
    slett: LocaleRecordString;
    stottedeFiltyper: LocaleRecordString;
    maksFilstorrelse: LocaleRecordString;
    maksAntallFiler: LocaleRecordString;
    lastOppFiler: LocaleRecordString;
    filtypeFeilmelding: LocaleRecordString;
    filstorrelseFeilmelding: LocaleRecordString;
    antallFilerFeilmelding: LocaleRecordString;
    velgFil: LocaleRecordString;
    velgFiler: LocaleRecordString;
    draOgSlippFilenHer: LocaleRecordString;
    draOgSlippFilerHer: LocaleRecordString;
    filopplastingDeaktivert: LocaleRecordString;
    filopplastingDeaktivertMaksAntallFiler: LocaleRecordString;
    lastOppFilenPaNytt: LocaleRecordString;
    slettFilen: LocaleRecordString;
    lasterNed: LocaleRecordString;
    lasterOpp: LocaleRecordString;
} & {
    // Vedlegg - titler
    [TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.annenDokumentasjon]: LocaleRecordBlock;
    [TittelSanityApiNavn.avtaleOmDeltBostedTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelseFraBarnevernetTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.meklingsattestTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfallTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel]: LocaleRecordBlock;
} & {
    // Vedlegg - beskrivelser
    [BeskrivelseSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonBarnetrygd]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.meklingsattest]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.lastOppSenereISoknad]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.annenDokumentasjonBeskrivelse]: LocaleRecordBlock;
};
