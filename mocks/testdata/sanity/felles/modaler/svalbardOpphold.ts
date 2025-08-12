import { ISvalbardOppholdTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/svalbardOpphold';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const svalbardOppholdTekstinnhold: ISvalbardOppholdTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    lesMerTittel: lagLocaleRecordBlock(),
    lesMerInnhold: lagLocaleRecordBlock(),
};
