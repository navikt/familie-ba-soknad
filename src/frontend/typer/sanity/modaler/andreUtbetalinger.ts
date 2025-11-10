import { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/sanity';
import { ISanitySpørsmålDokument } from '../sanity';

export interface IAndreUtbetalingerTekstinnhold {
    tittel: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordString;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    faarUtbetalingerNaa: ISanitySpørsmålDokument;
    utbetalingLandFortid: ISanitySpørsmålDokument;
    utbetalingLandNaatid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
}
