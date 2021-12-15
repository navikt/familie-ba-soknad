import React, { useState } from 'react';

import { FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { useApp } from '../../../../context/AppContext';
import { BarnetsId } from '../../../../typer/common';
import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';
import { IBarnMedISøknad } from '../../../../typer/søknad';

export const useEøsForBarn = (
    barnetsUuid: BarnetsId
): {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
    barn: IBarnMedISøknad;
} => {
    const { søknad } = useApp();

    const [barn] = useState<IBarnMedISøknad | undefined>(
        søknad.barnInkludertISøknaden.find(barn => barn.id === barnetsUuid)
    );

    if (!barn) {
        throw new TypeError('Kunne ikke finne barn som skulle være her');
    }

    const placeholderForFeltSomKommer = useFelt<string>({
        feltId: 'todo',
        verdi: '',
        valideringsfunksjon: (felt: FeltState<string>) => {
            return ok(felt);
        },
    });

    const oppdaterSøknad = () => {
        //TODO
    };

    const { skjema, kanSendeSkjema, valideringErOk } = useSkjema<IEøsForBarnFeltTyper, string>({
        felter: { placeholderForFeltSomKommer },
        skjemanavn: 'eøsForBarn',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        oppdaterSøknad,
        barn,
    };
};
