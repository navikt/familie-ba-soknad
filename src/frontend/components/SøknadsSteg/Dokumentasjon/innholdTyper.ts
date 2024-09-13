import { BeskrivelseSanityApiNavn, TittelSanityApiNavn } from '../../../typer/dokumentasjon';
import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/sanity/sanity';

export type IDokumentasjonTekstinnhold = {
    dokumentasjonTittel: LocaleRecordBlock;
    dokumentasjonGuide: LocaleRecordBlock;
    sendtInnTidligere: LocaleRecordBlock;
    vedleggXavY: LocaleRecordBlock;
    ingenVedleggskravTittel: LocaleRecordBlock;
    ingenVedleggskrav: LocaleRecordBlock;
    manglerDokumentasjonSpoersmaalTittel: LocaleRecordBlock;
    manglerDokumentasjonSpoersmaal: LocaleRecordBlock;
} & {
    [TittelSanityApiNavn.bekreftelsePaaAdopsjonTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.annenDokumentasjon]: LocaleRecordBlock;
    [TittelSanityApiNavn.avtaleOmDeltBostedTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelseFraBarnevernetTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDegTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.meklingsattestTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfallTittel]: LocaleRecordBlock;
    [TittelSanityApiNavn.vedtakOmOppholdstillatelseTittel]: LocaleRecordBlock;
} & {
    [BeskrivelseSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonBarnetrygd]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.meklingsattest]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.lastOppSenereISoknad]: LocaleRecordBlock;
} & {
    forMange: LocaleRecordString;
    feilFiltype: LocaleRecordString;
    forStor: LocaleRecordString;
    bildetForLite: LocaleRecordString;
    noeGikkFeil: LocaleRecordString;
};
