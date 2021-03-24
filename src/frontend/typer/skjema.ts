import { IOmDegFeltTyper } from '../components/SøknadsSteg/OmDeg/useOmdeg';
import { ILeggTilBarnTyper } from '../components/SøknadsSteg/VelgBarn/LeggTilBarn/useLeggTilBarn';
import { IVelgBarnFeltTyper } from '../components/SøknadsSteg/VelgBarn/useVelgBarn';

export type SkjemaFeltTyper = IOmDegFeltTyper | IVelgBarnFeltTyper | ILeggTilBarnTyper;
