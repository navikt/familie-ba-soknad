import { BeskrivelseSanityApiNavn } from '../../../typer/dokumentasjon';
import { LocaleRecordBlock } from '../../../typer/sanity/sanity';

export type IDokumentasjonTekstinnhold = {
    dokumentasjonTittel: LocaleRecordBlock;
    dokumentasjonGuide: LocaleRecordBlock;
} & {
    [BeskrivelseSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.vedtakOmOppholdstillatelse]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonBarnetrygd]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.meklingsattest]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelseFraBarnevernetBarnetrygd]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.lastOppSenereISoknad]: LocaleRecordBlock;
};
