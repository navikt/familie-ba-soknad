import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../sanity';

export interface IArbeidsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    arbeidsgiver: ISanitySpørsmålDokument;
    arbeidsperiodenAvsluttet: ISanitySpørsmålDokument;
    hvilketLandFortid: ISanitySpørsmålDokument;
    hvilketLandNaatid: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordString;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
}
