import {
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../../typer/sanity/sanity';

export interface IOmBarnetTekstinnhold {
    omBarnetTittel: LocaleRecordBlock;
    omBarnetTittelUtenFlettefelt: LocaleRecordBlock;
    omBarnetGuide: LocaleRecordBlock;
    barnetsAndreForelder: LocaleRecordString;
    opplystFosterbarn: LocaleRecordBlock;
    opplystInstitusjon: LocaleRecordBlock;
    institusjonIUtlandetCheckbox: LocaleRecordBlock;
    institusjonNavn: ISanitySpørsmålDokument;
    institusjonAdresse: ISanitySpørsmålDokument;
    institusjonPostnummer: ISanitySpørsmålDokument;
    institusjonStartdato: ISanitySpørsmålDokument;
    institusjonSluttdato: ISanitySpørsmålDokument;
    institusjonUkjentSluttCheckbox: LocaleRecordBlock;
    opplystBarnOppholdUtenforNorge: LocaleRecordBlock;
    planlagtBoSammenhengendeINorge: ISanitySpørsmålDokument;
    opplystFaarHarFaattEllerSoektYtelse: LocaleRecordBlock;
    paagaaendeSoeknadYtelse: ISanitySpørsmålDokument;
    hvilketLandYtelse: ISanitySpørsmålDokument;
    svaralternativSammeSomAnnenForelder: LocaleRecordBlock;
    svaralternativAnnenForelder: LocaleRecordBlock;
    hvemErBarnSinAndreForelder: ISanitySpørsmålDokument;
    navnAndreForelder: ISanitySpørsmålDokument;
    foedselsnummerDnummerAndreForelder: ISanitySpørsmålDokument;
    foedselsdatoAndreForelder: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelder: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelderGjenlevende: ISanitySpørsmålDokument;
    pensjonUtlandAndreForelder: ISanitySpørsmålDokument;
    boddSammenMedAndreForelder: ISanitySpørsmålDokument;
    naarFlyttetFraAndreForelder: ISanitySpørsmålDokument;
    bosted: LocaleRecordString;
    bostedInfo: LocaleRecordBlock;
    borBarnFastSammenMedDeg: ISanitySpørsmålDokument;
    deltBosted: ISanitySpørsmålDokument;
    faarEllerHarFaattYtelseFraAnnetLand: ISanitySpørsmålDokument;
    arbeidUtenforNorgeAndreForelderGjenlevende: ISanitySpørsmålDokument;
}
