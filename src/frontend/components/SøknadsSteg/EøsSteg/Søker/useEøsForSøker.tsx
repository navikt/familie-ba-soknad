import { FeltState, ISkjema, ok, useFelt, useSkjema } from '@navikt/familie-skjema';

import { IEøsForSøkerFeltTyper } from '../../../../typer/skjema';

export const useEøsForSøker = (): {
    skjema: ISkjema<IEøsForSøkerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    validerAlleSynligeFelter: () => void;
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

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        IEøsForSøkerFeltTyper,
        string
    >({
        felter: { placeholderForFeltSomKommer },
        skjemanavn: 'eøsForSøker',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        validerAlleSynligeFelter,
        oppdaterSøknad,
    };
};
