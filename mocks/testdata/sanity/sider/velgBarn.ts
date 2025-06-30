import { IVelgBarnTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/VelgBarn/innholdTyper';
import { lagLocaleRecordBlock } from '../lagSanityObjekter';

export const velgBarnTekstinnhold: IVelgBarnTekstinnhold = {
    velgBarnTittel: lagLocaleRecordBlock(),
    velgBarnGuide: lagLocaleRecordBlock(),
    soekeForUregistrerteBarn: lagLocaleRecordBlock(),
    alderLabel: lagLocaleRecordBlock(),
    aar: lagLocaleRecordBlock(),
    registrertBostedLabel: lagLocaleRecordBlock(),
    soekOmYtelseForBarnetSjekkboks: lagLocaleRecordBlock(),
    foedselsnummerLabel: lagLocaleRecordBlock(),
    navnErstatterForAdressesperre: lagLocaleRecordBlock(),
    maaVelgeEtBarnForAaGaaVidere: lagLocaleRecordBlock(),
    registrertMedAdressesperre: lagLocaleRecordBlock(),
    registrertPaaAdressenDin: lagLocaleRecordBlock(),
    ikkeRegistrertPaaAdressenDin: lagLocaleRecordBlock(),
};
