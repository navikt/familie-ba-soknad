import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../sanity';

export interface IPensjonsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordString;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    faarPensjonNaa: ISanitySpørsmålDokument;
    pensjonLandFortid: ISanitySpørsmålDokument;
    pensjonLandNaatid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    startdatoFortid: ISanitySpørsmålDokument;
    startdatoNaatid: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
}
