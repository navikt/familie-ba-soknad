import {
    IAlternativeTeksterTekstinnhold,
    IFellesTekstInnhold,
    IHjelpeteksterForInputTekstInnhold,
    IKanIkkeBrukeSoeknadTekstinnhold,
} from '../../../../src/frontend/typer/sanity/tekstInnhold';
import { lagLocaleRecordBlock } from '../lagSanityObjekter';

import { formateringsfeilmeldingerTekstinnhold } from './formateringsfeilmeldinger';
import { frittståendeOrdTekstinnhold } from './frittståendeOrd';
import { modalerTekstinnhold } from './modaler/modaler';
import { navigasjonTekstinnhold } from './navigasjon';

const vedlikeholdsarbeidTekstinnhold = {
    vedlikeholdTittel: lagLocaleRecordBlock(),
    vedlikeholdBroedtekst: lagLocaleRecordBlock(),
    vedlikeholdVeileder: lagLocaleRecordBlock(),
};

const kanIkkeBrukeSoeknadTekstinnhold: IKanIkkeBrukeSoeknadTekstinnhold = {
    brukPDFKontantstoette: lagLocaleRecordBlock(),
};

const hjelpeteksterForInputTekstInnhold: IHjelpeteksterForInputTekstInnhold = {
    datoformatHjelpetekst: lagLocaleRecordBlock(),
    datoformatPlaceholder: lagLocaleRecordBlock(),
    manedformatHjelpetekst: lagLocaleRecordBlock(),
    manedformatPlaceholder: lagLocaleRecordBlock(),
    velgLandPlaceholder: lagLocaleRecordBlock(),
};

const alternativeTeksterTekstInnhold: IAlternativeTeksterTekstinnhold = {
    barneillustrajonAltTekst: lagLocaleRecordBlock(),
};

export const fellesTekstInnhold: IFellesTekstInnhold = {
    frittståendeOrd: frittståendeOrdTekstinnhold,
    modaler: modalerTekstinnhold,
    navigasjon: navigasjonTekstinnhold,
    formateringsfeilmeldinger: formateringsfeilmeldingerTekstinnhold,
    vedlikeholdsarbeid: vedlikeholdsarbeidTekstinnhold,
    kanIkkeBrukeSoeknad: kanIkkeBrukeSoeknadTekstinnhold,
    hjelpeteksterForInput: hjelpeteksterForInputTekstInnhold,
    alternativeTekster: alternativeTeksterTekstInnhold,
};
