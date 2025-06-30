import { ESanitySteg } from '../../../src/frontend/typer/sanity/sanity';
import { ITekstinnhold } from '../../../src/frontend/typer/sanity/tekstInnhold';

import { fellesTekstInnhold } from './felles/felles';
import { dinLivssituasjonTekstinnhold } from './sider/dinLivssituasjon';
import { dokumentasjonTekstinnhold } from './sider/dokumentasjon';
import { eøsForBarnTekstinnhold } from './sider/eøsForBarn';
import { eøsForSøkerTekstinnhold } from './sider/eøsForSøker';
import { forsideTekstinnhold } from './sider/forside';
import { kvitteringTekstinnhold } from './sider/kvittering';
import { omBarnaTekstinnhold } from './sider/omBarna';
import { omBarnetTekstinnhold } from './sider/omBarnet';
import { omDegTekstinnhold } from './sider/omDeg';
import { oppsummeringTekstinnhold } from './sider/oppsummering';
import { velgBarnTekstinnhold } from './sider/velgBarn';

export function hentTekstInnhold(): ITekstinnhold {
    return {
        [ESanitySteg.FORSIDE]: forsideTekstinnhold,
        [ESanitySteg.OM_DEG]: omDegTekstinnhold,
        [ESanitySteg.DIN_LIVSSITUASJON]: dinLivssituasjonTekstinnhold,
        [ESanitySteg.VELG_BARN]: velgBarnTekstinnhold,
        [ESanitySteg.OM_BARNET]: omBarnetTekstinnhold,
        [ESanitySteg.OM_BARNA]: omBarnaTekstinnhold,
        [ESanitySteg.EØS_FOR_SØKER]: eøsForSøkerTekstinnhold,
        [ESanitySteg.EØS_FOR_BARN]: eøsForBarnTekstinnhold,
        [ESanitySteg.OPPSUMMERING]: oppsummeringTekstinnhold,
        [ESanitySteg.DOKUMENTASJON]: dokumentasjonTekstinnhold,
        [ESanitySteg.KVITTERING]: kvitteringTekstinnhold,
        [ESanitySteg.FELLES]: fellesTekstInnhold,
    };
}
