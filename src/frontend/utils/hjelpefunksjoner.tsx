import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IOmDegFeltTyper } from '../components/SøknadsSteg/1-OmDeg/useOmdeg';

export const hentTilfeldigElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
};

// eslint-disable-next-line
export const hentFeltNavn = (skjema: ISkjema<IOmDegFeltTyper, string>, felt: Felt<any>) => {
    const feltIndexISkjema = Object.entries(skjema.felter).findIndex(
        feltEntry => feltEntry[1] === felt
    );
    return Object.keys(skjema.felter)[feltIndexISkjema];
};
