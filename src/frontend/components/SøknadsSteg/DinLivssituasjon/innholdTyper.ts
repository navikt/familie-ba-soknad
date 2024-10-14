import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../../../typer/sanity/sanity';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    dinLivssituasjonGuide: LocaleRecordBlock;
    serparerteEllerSkilt: ISanitySpørsmålDokument;
    separertSkiltIUtlandet: ISanitySpørsmålDokument;
    harSamboerNaa: ISanitySpørsmålDokument;
    harSamboerNaaGift: ISanitySpørsmålDokument;
}
