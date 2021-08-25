import { ESvar, ISODateString } from '@navikt/familie-form-elements';
import { ISkjema, useFelt, useSkjema } from '@navikt/familie-skjema';

import useInputFelt from '../../../hooks/useInputFelt';
import { DatoMedUkjent } from '../../../typer/person';
import useDatovelgerFelt from '../OmBarnet/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../OmBarnet/useDatovelgerFeltMedUkjent';
import useInputFeltMedUkjent from '../OmBarnet/useInputFeltMedUkjent';
import { TidligereSamboerSpørsmålId } from './spørsmål';

export interface ITidligereSamboerFeltTyper {
    tidligereSamboerNavn: string;
    tidligereSamboerFnr: string;
    tidligereSamboerFnrUkjent: ESvar;
    tidligereSamboerFødselsdato: DatoMedUkjent;
    tidligereSamboerFødselsdatoUkjent: ESvar;
    tidligereSamboerFraDato: ISODateString;
}

export const useTidligereSamboer = (): {
    skjema: ISkjema<ITidligereSamboerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    validerAlleSynligeFelter: () => void;
} => {
    const tidligereSamboerNavn = useInputFelt(
        {
            id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
            svar: '',
        },
        'omdeg.samboernå.feilmelding'
    );

    const tidligereSamboerFnrUkjent = useFelt<ESvar>({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFnrUkjent,
        verdi: ESvar.NEI,
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerFnr = useInputFeltMedUkjent(
        {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
            svar: '',
        },
        tidligereSamboerFnrUkjent,
        'omdeg.tidligereSamboer.ident.ikkebesvart.feilmelding',
        true
    );

    const tidligereSamboerFødselsdatoUkjent = useFelt<ESvar>({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdatoUkjent,
        verdi: ESvar.NEI,
        avhengigheter: { fnrUkjent: tidligereSamboerFnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerFødselsdato = useDatovelgerFeltMedUkjent(
        TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
        '',
        tidligereSamboerFødselsdatoUkjent,
        tidligereSamboerFnrUkjent.verdi === ESvar.JA
    );

    const tidligereSamboerFraDato = useDatovelgerFelt(
        {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
            svar: '',
        },
        true
    );

    const { skjema, kanSendeSkjema, valideringErOk, validerAlleSynligeFelter } = useSkjema<
        ITidligereSamboerFeltTyper,
        string
    >({
        felter: {
            tidligereSamboerNavn,
            tidligereSamboerFnr,
            tidligereSamboerFnrUkjent,
            tidligereSamboerFødselsdato,
            tidligereSamboerFødselsdatoUkjent,
            tidligereSamboerFraDato,
        },
        skjemanavn: 'tidligereSamboer',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        validerAlleSynligeFelter,
        valideringErOk,
    };
};
