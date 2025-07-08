import { IEøsForSøkerTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/EøsSteg/Søker/innholdTyper';
import { lagLocaleRecordBlock, lagSanitySpørsmålDokument } from '../lagSanityObjekter';

export const eøsForSøkerTekstinnhold: IEøsForSøkerTekstinnhold = {
    eoesForSoekerTittel: lagLocaleRecordBlock(),
    eosForSokerGuide: lagLocaleRecordBlock(),
    idNummer: lagSanitySpørsmålDokument(),
    hvorBor: lagSanitySpørsmålDokument(),
    arbeidNorge: lagSanitySpørsmålDokument(),
    pensjonNorge: lagSanitySpørsmålDokument(),
    utbetalinger: lagSanitySpørsmålDokument(),
};
