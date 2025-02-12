import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../sanity';

export interface IBarnetrygdsperiodeTekstinnhold {
    tittel: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordString;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    mottarBarnetrygdNa: ISanitySpørsmålDokument;
    barnetrygdLandFortid: ISanitySpørsmålDokument;
    barnetrygdLandNatid: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    belopPerManed: ISanitySpørsmålDokument;
    belopFormatFeilmelding: LocaleRecordBlock;
}
