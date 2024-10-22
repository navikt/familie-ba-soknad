import {
    ISanitySpørsmålDokument,
    LocaleRecordBlock,
    LocaleRecordString,
} from '../../../typer/sanity/sanity';

export interface IOmDegTekstinnhold {
    omDegTittel: LocaleRecordBlock;
    omDegGuide: LocaleRecordBlock;
    skjermetAdresse: LocaleRecordString;
    borPaaRegistrertAdresse: ISanitySpørsmålDokument;
    vaertINorgeITolvMaaneder: ISanitySpørsmålDokument;
    planleggerAaBoINorgeTolvMnd: ISanitySpørsmålDokument;
    personopplysningerFoedselsEllerDNummer: LocaleRecordBlock;
    personopplysningerStatsborgerskap: LocaleRecordBlock;
    personopplysningerSivilstatus: LocaleRecordBlock;
    personopplysningerAdresse: LocaleRecordBlock;
}
