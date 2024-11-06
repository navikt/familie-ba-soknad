import { ISanitySpørsmålDokument, LocaleRecordBlock } from '../sanity';

export interface ILeggTilBarnTekstinnhold {
    leggTilKnapp: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    erBarnetFoedt: ISanitySpørsmålDokument;
    ikkeFoedtAlert: LocaleRecordBlock;
    barnetsNavnSubtittel: LocaleRecordBlock;
    fornavn: ISanitySpørsmålDokument;
    etternavn: ISanitySpørsmålDokument;
    foedselsnummerEllerDNummer: ISanitySpørsmålDokument;
    foedselsnummerAlert: LocaleRecordBlock;
}
