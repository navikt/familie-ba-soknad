import { IBarnetrygdsperiodeTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/barnetrygdperiode';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const barnetrygdsperiodeTekstinnhold: IBarnetrygdsperiodeTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    mottarBarnetrygdNa: lagSanitySpørsmålDokument(),
    barnetrygdLandFortid: lagSanitySpørsmålDokument(),
    barnetrygdLandNatid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
    belopPerManed: lagSanitySpørsmålDokument(),
    belopFormatFeilmelding: lagLocaleRecordBlock(),
};
