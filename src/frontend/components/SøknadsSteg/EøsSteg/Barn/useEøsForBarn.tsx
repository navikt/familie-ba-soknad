import React from 'react';

import { FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { IEøsForBarnFeltTyper } from '../../../../typer/skjema';

export const useEøsForBarn = (): {
    skjema: ISkjema<IEøsForBarnFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    oppdaterSøknad: () => void;
} => {
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
    };
};
