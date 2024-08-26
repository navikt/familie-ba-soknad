import { LocaleRecordBlock, LocaleRecordString } from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    omBarnetTittel: LocaleRecordBlock;
    omBarnetTittelUtenFlettefelt: LocaleRecordBlock;
    omBarnetGuide: LocaleRecordBlock;
    barnetsAndreForelder: LocaleRecordString;
}
