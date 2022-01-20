import { useState } from 'react';

import { IArbeidsperiode } from '../../../typer/person';

export const useArbeidsperioder = (initialArbeidsperioder: IArbeidsperiode[]) => {
    const [arbeidsperioder, settArbeidsperioder] =
        useState<IArbeidsperiode[]>(initialArbeidsperioder);
    const leggTilArbeidsperiode = (periode: IArbeidsperiode) => {
        settArbeidsperioder(prevState => prevState.concat(periode));
    };

    const fjernArbeidsperiode = (periodeSomSkalFjernes: IArbeidsperiode) => {
        settArbeidsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };
    return {
        arbeidsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
    };
};
