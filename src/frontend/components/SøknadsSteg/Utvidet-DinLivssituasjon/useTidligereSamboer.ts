import { ISkjema, useFelt, useSkjema } from '@navikt/familie-skjema';

export interface ITidligereSamboerFeltTyper {
    tidligereSamboerNavn: string;
}

const useTidligereSamboer = (
    index: number
): {
    skjema: ISkjema<ITidligereSamboerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
} => {
    const tidligereSamboerNavn = useFelt({ feltId: `navn-${index}`, verdi: '' });

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        ITidligereSamboerFeltTyper,
        string
    >({
        felter: {
            tidligereSamboerNavn,
        },
        skjemanavn: `tidligereSamboer-${index}`,
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
    };
};

export default useTidligereSamboer;
