import { IPensjonsperiodeTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/pensjonsperiode';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const pensjonsperiodeTekstinnhold: IPensjonsperiodeTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    faarPensjonNaa: lagSanitySpørsmålDokument(),
    pensjonLandFortid: lagSanitySpørsmålDokument(),
    pensjonLandNaatid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    startdatoFortid: lagSanitySpørsmålDokument(),
    startdatoNaatid: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
};
