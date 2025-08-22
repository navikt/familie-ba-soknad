import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../sanity';

export interface ISvalbardOppholdTekstinnhold {
    tittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
    oppsummeringstittel: LocaleRecordBlock;
    lesMerTittel: LocaleRecordBlock;
    lesMerInnhold: LocaleRecordBlock;
    fremtidigeOppholdTittel: LocaleRecordBlock;
    fremtidigeOppholdInnhold: LocaleRecordBlock;
    meldFraOmFlyttingAlert: LocaleRecordBlock;
}
