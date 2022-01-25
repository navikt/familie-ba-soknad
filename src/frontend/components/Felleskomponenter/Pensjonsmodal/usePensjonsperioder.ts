import { useEffect, useState } from 'react';

import { Avhengigheter, useFelt } from '@navikt/familie-skjema';
import { ValiderFelt } from '@navikt/familie-skjema/dist/typer';

import { IPensjonsperiode } from '../../../typer/perioder';

export const usePensjonsperioder = (
    verdi: IPensjonsperiode[],
    avhengigheter?: Avhengigheter,
    skalFeltetVises?: (avhengigheter: Avhengigheter) => boolean,
    valideringsfunksjon?: ValiderFelt<IPensjonsperiode[]>
) => {
    const [pensjonsperioder, settPensjonsperioder] = useState<IPensjonsperiode[]>(verdi);
    const leggTilPensjonsperiode = (periode: IPensjonsperiode) => {
        settPensjonsperioder(prevState => prevState.concat(periode));
    };

    const fjernPensjonsperiode = (periodeSomSkalFjernes: IPensjonsperiode) => {
        settPensjonsperioder(prevState =>
            prevState.filter(periode => periode !== periodeSomSkalFjernes)
        );
    };

    const registrertePensjonsperioder = useFelt<IPensjonsperiode[]>({
        verdi: pensjonsperioder,
        avhengigheter,
        skalFeltetVises,
        valideringsfunksjon,
    });

    useEffect(() => {
        registrertePensjonsperioder.validerOgSettFelt(pensjonsperioder);
    }, [pensjonsperioder]);

    return {
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        registrertePensjonsperioder,
    };
};
