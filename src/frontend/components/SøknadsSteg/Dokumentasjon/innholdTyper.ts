import { BeskrivelseSanityApiNavn } from '../../../typer/dokumentasjon';
import { LocaleRecordBlock } from '../../../typer/sanity/sanity';

export type IDokumentasjonTekstinnhold = {
    [BeskrivelseSanityApiNavn.dokumentasjonPaaSeparasjonSkilsmisseEllerDoedsfall]: LocaleRecordBlock;
    // TODO: Legg til i Sanity: DIN_LIVSSITUASJON - asylsoeker
    [BeskrivelseSanityApiNavn.bekreftelsePaaAdopsjonBarnetrygd]: LocaleRecordBlock;
    // TODO: Legg til i Sanity: OM_BARNA - asyl
    [BeskrivelseSanityApiNavn.bekreftelsePaaAtBarnBorSammenMedDeg]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.avtaleOmDeltBosted]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.meklingsattest]: LocaleRecordBlock;
    [BeskrivelseSanityApiNavn.bekreftelseFraBarnevernet]: LocaleRecordBlock;
};
