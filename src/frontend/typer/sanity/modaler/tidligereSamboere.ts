import { ISanitySpørsmålDokument, LocaleRecordBlock, LocaleRecordString } from '../../../../common/sanity';

export interface ITidligereSamoboereTekstinnhold {
    tittel: LocaleRecordBlock;
    oppsummeringstittel: LocaleRecordBlock;
    leggTilPeriodeForklaring: LocaleRecordString;
    flerePerioder: LocaleRecordString;
    leggTilKnapp: LocaleRecordBlock;
    leggTilFeilmelding: LocaleRecordBlock;
    fjernKnapp: LocaleRecordBlock;
    samboerNavn: ISanitySpørsmålDokument;
    foedselsnummerEllerDNummer: ISanitySpørsmålDokument;
    foedselsdato: ISanitySpørsmålDokument;
    startdato: ISanitySpørsmålDokument;
    sluttdato: ISanitySpørsmålDokument;
}
