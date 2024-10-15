import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../../../typer/sanity/sanity';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    dinLivssituasjonGuide: LocaleRecordBlock;
    hvorforSoekerUtvidet: ISanitySpørsmålDokument;
    serparerteEllerSkilt: ISanitySpørsmålDokument;
    separertSkiltIUtlandet: ISanitySpørsmålDokument;
    harSamboerNaa: ISanitySpørsmålDokument;
    harSamboerNaaGift: ISanitySpørsmålDokument;
    asylsoeker: ISanitySpørsmålDokument;
}
