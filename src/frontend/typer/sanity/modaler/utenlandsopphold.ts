import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../../../../common/sanity';

export interface IUtenlandsoppholdTekstinnhold {
    tittel: LocaleRecordBlock;
    flyttetTilNorgeDato: ISanitySpørsmålDokument;
    sluttdatoFortid: ISanitySpørsmålDokument;
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
    periodeBeskrivelse: ISanitySpørsmålDokument;
    tidligereOpphold: ISanitySpørsmålDokument;
    fjernKnapp: LocaleRecordBlock;
    naavaerendeOpphold: ISanitySpørsmålDokument;
    flyttetFraNorgeDato: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdatoFremtid: ISanitySpørsmålDokument;
    oppsummeringstittel: LocaleRecordBlock;
    adresseFortid: ISanitySpørsmålDokument;
    adresseNaatid: ISanitySpørsmålDokument;
}
