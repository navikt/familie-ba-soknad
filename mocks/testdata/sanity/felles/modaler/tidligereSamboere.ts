import { ITidligereSamoboereTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/tidligereSamboere';
import {
    lagLocaleRecordString,
    lagLocaleRecordBlock,
    lagSanitySpørsmålDokument,
} from '../../lagSanityObjekter';

export const tidligereSamoboereTekstinnhold: ITidligereSamoboereTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    oppsummeringstittel: lagLocaleRecordBlock(),
    leggTilPeriodeForklaring: lagLocaleRecordString(),
    flerePerioder: lagLocaleRecordString(),
    leggTilKnapp: lagLocaleRecordBlock(),
    leggTilFeilmelding: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    samboerNavn: lagSanitySpørsmålDokument(),
    foedselsnummerEllerDNummer: lagSanitySpørsmålDokument(),
    foedselsdato: lagSanitySpørsmålDokument(),
    startdato: lagSanitySpørsmålDokument(),
    sluttdato: lagSanitySpørsmålDokument(),
};
