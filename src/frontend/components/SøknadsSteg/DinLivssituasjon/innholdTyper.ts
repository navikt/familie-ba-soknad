import {
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../../typer/sanity/sanity';

export interface IDinLivssituasjonTekstinnhold {
    dinLivssituasjonTittel: LocaleRecordBlock;
    dinLivssituasjonGuide: LocaleRecordBlock;
    hvorforSoekerUtvidet: ISanitySpørsmålDokument;
    serparerteEllerSkilt: ISanitySpørsmålDokument;
    separertSkiltIUtlandet: ISanitySpørsmålDokument;
    separertEnkeSkiltDato: ISanitySpørsmålDokument;
    harSamboerNaa: ISanitySpørsmålDokument;
    harSamboerNaaGift: ISanitySpørsmålDokument;
    asylsoeker: ISanitySpørsmålDokument;

    /* Årsak valgalternativ */
    valgalternativAarsakPlaceholder: LocaleRecordString;
    valgalternativSeparert: LocaleRecordString;
    valgalternativSkilt: LocaleRecordString;
    valgalternativBruddSamboer: LocaleRecordString;
    valgalternativBoddAlene: LocaleRecordString;
    valgalternativEnkeEnkemann: LocaleRecordString;
    valgalternativFengselVaretekt: LocaleRecordString;
    valgalternativBruddGift: LocaleRecordString;
    valgalternativForsvunnet: LocaleRecordString;
    valgalternativForvaring: LocaleRecordString;
    valgalternativPsykiskHelsevern: LocaleRecordString;
}
