import { IForsideTekstinnhold } from '../../../../src/frontend/typer/sanity/tekstInnhold';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../lagSanityObjekter';

export const forsideTekstinnhold: IForsideTekstinnhold = {
    bekreftelsesboksTittel: lagLocaleRecordString(),
    bekreftelsesboksBroedtekst: lagLocaleRecordBlock(),
    bekreftelsesboksErklaering: lagLocaleRecordString(),
    bekreftelsesboksFeilmelding: lagLocaleRecordString(),
    soeknadstittelBarnetrygd: lagLocaleRecordBlock(),
    veilederHei: lagLocaleRecordBlock(),
    veilederIntro: lagLocaleRecordBlock(),
    foerDuSoekerTittel: lagLocaleRecordBlock(),
    foerDuSoeker: lagLocaleRecordBlock(),
    informasjonOmPlikter: lagLocaleRecordBlock(),
    informasjonOmPlikterTittel: lagLocaleRecordBlock(),
    informasjonOmPersonopplysninger: lagLocaleRecordBlock(),
    informasjonOmPersonopplysningerTittel: lagLocaleRecordBlock(),
    informasjonOmLagringAvSvar: lagLocaleRecordBlock(),
    informasjonOmLagringAvSvarTittel: lagLocaleRecordBlock(),
    utvidetBarnetrygdAlert: lagLocaleRecordBlock(),
    soekerDuUtvidet: lagSanitySpørsmålDokument(),
    mellomlagretAlert: lagLocaleRecordBlock(),
};
