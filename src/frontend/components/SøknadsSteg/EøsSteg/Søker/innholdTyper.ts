import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../../../../typer/sanity/sanity';

export interface IEøsForSøkerTekstinnhold {
    eoesForSoekerTittel: LocaleRecordBlock;
    eosForSokerGuide: LocaleRecordBlock;
    idNummer: ISanitySpørsmålDokument;
    hvorBor: ISanitySpørsmålDokument;
    arbeidNorge: ISanitySpørsmålDokument;
    pensjonNorge: ISanitySpørsmålDokument;
    utbetalinger: ISanitySpørsmålDokument;
}
