import { IAndreUtbetalingerTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/andreUtbetalinger';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const andreUtbetalingerTekstinnhold: IAndreUtbetalingerTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    faarUtbetalingerNaa: lagSanitySpørsmålDokument(),
    utbetalingLandFortid: lagSanitySpørsmålDokument(),
    utbetalingLandNaatid: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdatoFortid: lagSanitySpørsmålDokument(),
    sluttdatoFremtid: lagSanitySpørsmålDokument(),
};
