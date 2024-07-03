import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    borBarnFastSammenMedDeg: ISanitySpørsmålDokument;
    deltBosted: ISanitySpørsmålDokument;
    boddMedAndreForelder: ISanitySpørsmålDokument;
    opplystFosterbarn: LocaleRecordBlock;
}
