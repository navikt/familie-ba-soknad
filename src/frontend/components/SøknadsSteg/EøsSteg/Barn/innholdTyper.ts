import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../../../../typer/sanity/sanity';

export interface IEøsForBarnTekstinnhold {
    eoesForBarnTittel: LocaleRecordBlock;
    eoesForBarnTittelUtenFlettefelt: LocaleRecordBlock;
    eosForBarnGuide: LocaleRecordBlock;
    idNummerBarn: ISanitySpørsmålDokument;
}
