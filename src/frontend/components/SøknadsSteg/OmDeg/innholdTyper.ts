import {
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../../typer/sanity/sanity';

export interface IOmDegTekstinnhold {
    omDegTittel: LocaleRecordBlock;
    omDegGuide: LocaleRecordBlock;
    skjermetAdresse: LocaleRecordString;
    vaertINorgeITolvMaaneder: ISanitySpørsmålDokument;
}
