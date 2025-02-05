import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../sanity';

export interface IUtenlandsoppholdTekstinnhold {
    tittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordBlock;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    valgalternativPermanentIUtland: LocaleRecordString;
    valgalternativPermanentINorge: LocaleRecordString;
    valgalternativOppholdUtenforNorgeTidligere: LocaleRecordString;
    valgalternativOppholdUtenforNorgeNaa: LocaleRecordString;
    valgalternativPlaceholder: LocaleRecordString;
    landFlyttetTil: ISanitySpørsmålDokument;
    landFlyttetFra: ISanitySpørsmålDokument;
    tidligereOpphold: ISanitySpørsmålDokument;
    naavaerendeOpphold: ISanitySpørsmålDokument;
}
