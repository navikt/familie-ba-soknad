import {
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../../../typer/sanity/sanity';

export interface IEøsForBarnTekstinnhold {
    eoesForBarnTittel: LocaleRecordBlock;
    eoesForBarnTittelUtenFlettefelt: LocaleRecordBlock;
    eosForBarnGuide: LocaleRecordBlock;
    idNummerBarn: ISanitySpørsmålDokument;
    valgalternativSlektsforholdPlaceholder: LocaleRecordString;
    slektsforhold: ISanitySpørsmålDokument;
    hvilkenRelasjon: ISanitySpørsmålDokument;
    borMedAndreForelder: ISanitySpørsmålDokument;
    borMedOmsorgsperson: ISanitySpørsmålDokument;
    hvorBorBarnet: ISanitySpørsmålDokument;
    subtittelAndreForelder: LocaleRecordBlock;
    idNummerAndreForelder: ISanitySpørsmålDokument;
    hvorBorAndreForelder: ISanitySpørsmålDokument;
    paagaaendeSoeknadYtelseAndreForelder: ISanitySpørsmålDokument;
    hvilketLandSoektYtelseAndreForelder: ISanitySpørsmålDokument;
    oppgittIkkeBorFastSammenMedDeg: LocaleRecordBlock;
    hvaHeterOmsorgspersonen: ISanitySpørsmålDokument;
    slektsforholdOmsorgsperson: ISanitySpørsmålDokument;
    hvilkenRelasjonOmsorgsperson: ISanitySpørsmålDokument;
    idNummerOmsorgsperson: ISanitySpørsmålDokument;
    hvorBorOmsorgsperson: ISanitySpørsmålDokument;
    paagaaendeSoeknadYtelseOmsorgsperson: ISanitySpørsmålDokument;
    hvilketLandSoektYtelseOmsorgsperson: ISanitySpørsmålDokument;
    arbeidNorgeAndreForelder: ISanitySpørsmålDokument;
    arbeidNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelder: ISanitySpørsmålDokument;
    pensjonNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
    utbetalingerAndreForelder: ISanitySpørsmålDokument;
    utbetalingerAndreForelderGjenlevende: ISanitySpørsmålDokument;
    ytelseFraAnnetLandAndreForelder: ISanitySpørsmålDokument;
    ytelseFraAnnetLandAndreForelderGjenlevende: ISanitySpørsmålDokument;
}
