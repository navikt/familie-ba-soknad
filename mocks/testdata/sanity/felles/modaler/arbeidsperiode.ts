import { IArbeidsperiodeTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/arbeidsperiode';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const arbeidsperiodeTekstinnhold: IArbeidsperiodeTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    arbeidsgiver: lagSanitySpørsmålDokument(),
    arbeidsperiodenAvsluttet: lagSanitySpørsmålDokument(),
    hvilketLandFortid: lagSanitySpørsmålDokument(),
    hvilketLandNaatid: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    fjernKnapp: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
};
