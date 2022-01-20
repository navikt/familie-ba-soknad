import { useEffect, useState } from 'react';

import { Avhengigheter, useFelt } from '@navikt/familie-skjema';
import { ValiderFelt } from '@navikt/familie-skjema/dist/typer';

import { IArbeidsperiode } from '../../../typer/person';

export const useArbeidsperioder = (
    verdi: IArbeidsperiode[],
    avhengigheter?: Avhengigheter,
    skalFeltetVises?: (avhengigheter: Avhengigheter) => boolean,
    valideringsfunksjon?: ValiderFelt<IArbeidsperiode[]>
) => {
    const [arbeidsperioder, settArbeidsperioder] = useState<IArbeidsperiode[]>(verdi);
    const leggTilArbeidsperiode = (periode: IArbeidsperiode) => {
        settArbeidsperioder(prevState => prevState.concat(periode));
    };

    const fjernArbeidsperiode = (periodeSomSkalFjernes: IArbeidsperiode) => {
        settArbeidsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    const registrerteArbeidsperioder = useFelt<IArbeidsperiode[]>({
        verdi: arbeidsperioder,
        avhengigheter,
        skalFeltetVises,
        valideringsfunksjon,
    });

    useEffect(() => {
        registrerteArbeidsperioder.validerOgSettFelt(arbeidsperioder);
    }, [arbeidsperioder]);

    return {
        arbeidsperioder,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        registrerteArbeidsperioder,
    };
};
