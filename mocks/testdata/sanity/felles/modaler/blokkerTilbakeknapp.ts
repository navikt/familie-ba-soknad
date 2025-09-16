import { IBlokkerTilbakeknappTekstinnhold } from '../../../../../src/frontend/typer/sanity/modaler/blokkerTilbakeknapp';
import { lagLocaleRecordBlock } from '../../lagSanityObjekter';

export const blokkerTilbakeknapp: IBlokkerTilbakeknappTekstinnhold = {
    tittel: lagLocaleRecordBlock(),
    tekst: lagLocaleRecordBlock(),
    tilDittNav: lagLocaleRecordBlock(),
    avbryt: lagLocaleRecordBlock(),
};
