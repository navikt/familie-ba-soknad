import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../../../typer/sanity/sanity';

export interface IOmBarnaTekstinnhold {
    omBarnaTittel: LocaleRecordBlock;
    omBarnaGuide: LocaleRecordBlock;
    fosterbarn: ISanitySpørsmålDokument;
    hvemFosterbarn: ISanitySpørsmålDokument;
    institusjon: ISanitySpørsmålDokument;
    hvemInstitusjon: ISanitySpørsmålDokument;
    adoptertFraUtlandet: ISanitySpørsmålDokument;
    hvemAdoptertFraUtlandet: ISanitySpørsmålDokument;
    asyl: ISanitySpørsmålDokument;
    hvemAsyl: ISanitySpørsmålDokument;
    sammenhengendeOppholdINorge: ISanitySpørsmålDokument;
    hvemOppholdUtenforNorge: ISanitySpørsmålDokument;
    soektYtelseEuEoes: ISanitySpørsmålDokument;
    hvemSoektYtelse: ISanitySpørsmålDokument;
    oppgittEnkeEnkemann: ISanitySpørsmålDokument;
    folkeregistrertEnkeEnkemann: ISanitySpørsmålDokument;
    folkeregistrertGjenlevende: ISanitySpørsmålDokument;
    hvemAvBarnaAvdoedPartner: ISanitySpørsmålDokument;
}
