import { ESanitySteg } from '../../../src/common/sanity';
import type { ITekstinnhold } from '../../../src/frontend/typer/sanity/tekstInnhold';
import { brukNøkkelSomTekst } from './brukNøkkelSomTekst';
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

const lagTekstInnhold = (): ITekstinnhold => {
    const innhold: ITekstinnhold = {
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

    // Gir hver forekomst av delte objekter en egen kopi, slik at de får hver sin tekst.
    return brukNøkkelSomTekst(JSON.parse(JSON.stringify(innhold)));
};

const tekstInnhold = lagTekstInnhold();

export function mockTekstInnhold(): ITekstinnhold {
    return { ...tekstInnhold };
}
