import { IKvitteringTekstinnhold } from '../../../../src/frontend/components/SøknadsSteg/Kvittering/innholdTyper';
import { lagLocaleRecordBlock } from '../lagSanityObjekter';

export const kvitteringTekstinnhold: IKvitteringTekstinnhold = {
    kvitteringTittel: lagLocaleRecordBlock(),
    soeknadMottatt: lagLocaleRecordBlock(),
    trengerIkkeEttersendeVedlegg: lagLocaleRecordBlock(),
    maaEttersendeVedleggAlert: lagLocaleRecordBlock(),
    infoTilSoker: lagLocaleRecordBlock(),
    manglerKontonummerTittel: lagLocaleRecordBlock(),
    kontonummerTittel: lagLocaleRecordBlock(),
    redigerKontonummerLenke: lagLocaleRecordBlock(),
    henterKontonummer: lagLocaleRecordBlock(),
    finnerIngenKontonummerAdvarsel: lagLocaleRecordBlock(),
    finnerIngenKontonummerBeskrivelse: lagLocaleRecordBlock(),
};
