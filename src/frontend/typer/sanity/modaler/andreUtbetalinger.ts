import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../sanity';

export interface IAndreUtbetalingerTekstinnhold {
    tittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordString;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    faarUtbetalingerNaa: ISanitySpørsmålDokument;
    utbetalingLandFortid: ISanitySpørsmålDokument;
    utbetalingLandNaatid: ISanitySpørsmålDokument;
}
