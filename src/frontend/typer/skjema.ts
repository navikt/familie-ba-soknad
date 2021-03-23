import { IOmDegFeltTyper } from '../components/SøknadsSteg/1-OmDeg/useOmdeg';
import { ILeggTilBarnTyper } from '../components/SøknadsSteg/2-VelgBarn/LeggTilBarn/useLeggTilBarn';
import { IVelgBarnFeltTyper } from '../components/SøknadsSteg/2-VelgBarn/useVelgBarn';

export type SkjemaFeltTyper = IOmDegFeltTyper | IVelgBarnFeltTyper | ILeggTilBarnTyper;
