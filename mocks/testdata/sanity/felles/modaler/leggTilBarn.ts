import { ILeggTilBarnTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/leggTilBarn';
import { lagLocaleRecordBlock, lagSanitySpørsmålDokument } from '../../lagSanityObjekter';

export const leggTilBarnTekstinnhold: ILeggTilBarnTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    leggTilKnapp: lagLocaleRecordBlock(),
    fjernKnapp: lagLocaleRecordBlock(),
    erBarnetFoedt: lagSanitySpørsmålDokument(),
    ikkeFoedtAlert: lagLocaleRecordBlock(),
    barnetsNavnSubtittel: lagLocaleRecordBlock(),
    fornavn: lagSanitySpørsmålDokument(),
    etternavn: lagSanitySpørsmålDokument(),
    foedselsnummerEllerDNummer: lagSanitySpørsmålDokument(),
    foedselsnummerAlert: lagLocaleRecordBlock(),
    foedselsnummerFeilmelding: lagLocaleRecordBlock(),
    sammeFoedselsnummerFeilmelding: lagLocaleRecordBlock(),
    barnIkkeFoedtFeilmelding: lagLocaleRecordBlock(),
};
