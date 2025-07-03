import { IOppsummeringTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/Oppsummering/innholdTyper';
import { lagLocaleRecordString, lagLocaleRecordBlock } from '../lagSanityObjekter';

export const oppsummeringTekstinnhold: IOppsummeringTekstinnhold = {
    oppsummeringTittel: lagLocaleRecordBlock(),
    oppsummeringGuide: lagLocaleRecordBlock(),
    endreSvarLenkeTekst: lagLocaleRecordString(),
};
