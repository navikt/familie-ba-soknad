import { IOmDegTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/OmDeg/innholdTyper';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../lagSanityObjekter';

export const omDegTekstinnhold: IOmDegTekstinnhold = {
    omDegTittel: lagLocaleRecordBlock(),
    omDegGuide: lagLocaleRecordBlock(),
    navn: lagLocaleRecordString(),
    skjermetAdresse: lagLocaleRecordString(),
    borPaaRegistrertAdresse: lagSanitySpørsmålDokument(),
    borPaaSvalbard: lagSanitySpørsmålDokument(),
    vaertINorgeITolvMaaneder: lagSanitySpørsmålDokument(),
    planleggerAaBoINorgeTolvMnd: lagSanitySpørsmålDokument(),
    adresse: lagLocaleRecordString(),
    ident: lagLocaleRecordString(),
    sivilstatus: lagLocaleRecordString(),
    statsborgerskap: lagLocaleRecordString(),
    ikkeRegistrertAdresse: lagLocaleRecordString(),
    soekerAdressesperre: lagLocaleRecordString(),
    personopplysningerAlert: lagLocaleRecordBlock(),
};
