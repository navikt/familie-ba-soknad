import { useEffect, useState } from 'react';

import { Avhengigheter, useFelt } from '@navikt/familie-skjema';
import { ValiderFelt } from '@navikt/familie-skjema/dist/typer';

import { BarnetsId } from '../typer/common';
import { PersonType } from '../typer/personType';
import { SpørsmålId } from '../typer/spørsmål';

export const usePerioder = <T>({
    feltId,
    verdi,
    avhengigheter,
    skalFeltetVises,
    valideringsfunksjon,
}: {
    feltId:
        | `${SpørsmålId}-${PersonType.Søker}`
        | `${SpørsmålId}-${PersonType.Søker}-${BarnetsId}`
        | `${SpørsmålId}-${PersonType.AndreForelder}-${BarnetsId}`
        | `${SpørsmålId}-${PersonType.Omsorgsperson}-${BarnetsId}`
        | `${SpørsmålId}-${BarnetsId}`;
    verdi: T[];
    avhengigheter?: Avhengigheter;
    skalFeltetVises?: (avhengigheter: Avhengigheter) => boolean;
    valideringsfunksjon?: ValiderFelt<T[]>;
}) => {
    const [perioder, settPerioder] = useState<T[]>(verdi);

    const leggTilPeriode = (periode: T) => {
        settPerioder(prevState => prevState.concat(periode));
    };

    const fjernPeriode = (periodeSomSkalFjernes: T) => {
        settPerioder(prevState => prevState.filter(periode => periode !== periodeSomSkalFjernes));
    };

    const registrertePerioder = useFelt<T[]>({
        feltId,
        verdi: perioder,
        avhengigheter,
        skalFeltetVises,
        valideringsfunksjon,
    });

    const [harRendretEnGang, settHarRendretEnGang] = useState<boolean>(false);

    useEffect(() => {
        if (harRendretEnGang) {
            registrertePerioder.validerOgSettFelt(perioder);
        } else {
            settHarRendretEnGang(true);
        }
    }, [perioder]);

    return {
        leggTilPeriode,
        fjernPeriode,
        registrertePerioder,
    };
};
