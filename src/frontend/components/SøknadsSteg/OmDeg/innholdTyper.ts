import { LocaleRecordBlock, LocaleRecordString } from '../../../../common/typer/sanity';
import { ISanitySpørsmålDokument } from '../../../typer/sanity/sanity';

export interface IOmDegTekstinnhold {
    omDegTittel: LocaleRecordBlock;
    omDegGuide: LocaleRecordBlock;
    navn: LocaleRecordString;
    skjermetAdresse: LocaleRecordString;
    borPaaRegistrertAdresse: ISanitySpørsmålDokument;
    vaertINorgeITolvMaaneder: ISanitySpørsmålDokument;
    planleggerAaBoINorgeTolvMnd: ISanitySpørsmålDokument;
    adresse: LocaleRecordString;
    ident: LocaleRecordString;
    sivilstatus: LocaleRecordString;
    statsborgerskap: LocaleRecordString;
    ikkeRegistrertAdresse: LocaleRecordString;
    soekerAdressesperre: LocaleRecordString;
    personopplysningerAlert: LocaleRecordBlock;
}
