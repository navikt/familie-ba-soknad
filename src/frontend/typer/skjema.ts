import { IStegEnFeltTyper } from '../components/SøknadsSteg/1-OmDeg/useOmdeg';
import { IStegToFeltTyper } from '../components/SøknadsSteg/2-VelgBarn/useVelgBarn';

export type SkjemaFeltTyper = IStegEnFeltTyper | IStegToFeltTyper;
