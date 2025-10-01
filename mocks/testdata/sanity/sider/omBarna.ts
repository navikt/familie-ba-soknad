import { IOmBarnaTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/OmBarnaDine/innholdTyper';
import { lagLocaleRecordBlock, lagSanitySpørsmålDokument } from '../lagSanityObjekter';

export const omBarnaTekstinnhold: IOmBarnaTekstinnhold = {
    omBarnaTittel: lagLocaleRecordBlock(),
    omBarnaGuide: lagLocaleRecordBlock(),
    fosterbarn: lagSanitySpørsmålDokument(),
    hvemFosterbarn: lagSanitySpørsmålDokument(),
    institusjon: lagSanitySpørsmålDokument(),
    hvemInstitusjon: lagSanitySpørsmålDokument(),
    adoptertFraUtlandet: lagSanitySpørsmålDokument(),
    hvemAdoptertFraUtlandet: lagSanitySpørsmålDokument(),
    asyl: lagSanitySpørsmålDokument(),
    hvemAsyl: lagSanitySpørsmålDokument(),
    sammenhengendeOppholdINorge: lagSanitySpørsmålDokument(),
    hvemOppholdUtenforNorge: lagSanitySpørsmålDokument(),
    soektYtelseEuEoes: lagSanitySpørsmålDokument(),
    hvemSoektYtelse: lagSanitySpørsmålDokument(),
    oppgittEnkeEnkemann: lagSanitySpørsmålDokument(),
    folkeregistrertEnkeEnkemann: lagSanitySpørsmålDokument(),
    folkeregistrertGjenlevende: lagSanitySpørsmålDokument(),
    hvemAvBarnaAvdoedPartner: lagSanitySpørsmålDokument(),
};
