import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema, useFelt, useSkjema } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useDatovelgerFeltMedUkjent from '../../../hooks/useDatovelgerFeltMedUkjent';
import useInputFelt from '../../../hooks/useInputFelt';
import useInputFeltMedUkjent from '../../../hooks/useInputFeltMedUkjent';
import { ITidligereSamboerFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { TidligereSamboerSpørsmålId } from './spørsmål';

export const useTidligereSamboer = (): {
    skjema: ISkjema<ITidligereSamboerFeltTyper, string>;
    validerFelterOgVisFeilmelding: () => boolean;
    valideringErOk: () => boolean;
    nullstillSkjema: () => void;
} => {
    const tidligereSamboerNavn = useInputFelt(
        {
            id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
            svar: '',
        },
        'omdeg.samboerNavn.feilmelding'
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
        'omdeg.samboer.ident.ikkebesvart.feilmelding',
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
        'omdeg.nåværendesamboer.fødselsdato.ukjent',
        tidligereSamboerFnrUkjent.verdi === ESvar.JA
    );

    const tidligereSamboerFraDato = useDatovelgerFelt(
        {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
            svar: '',
        },
        true,
        'omdeg.nårstartetsamboerforhold.feilmelding',
        gårsdagensDato()
    );

    const tidligereSamboerTilDato = useDatovelgerFelt(
        {
            id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
            svar: '',
        },
        true,
        'omdeg.nårsamboerforholdavsluttet.feilmelding',
        dagensDato(),
        tidligereSamboerFraDato.verdi
    );

    const { skjema, kanSendeSkjema, valideringErOk, nullstillSkjema } = useSkjema<
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
            tidligereSamboerTilDato,
        },
        skjemanavn: 'tidligereSamboer',
    });

    return {
        skjema,
        validerFelterOgVisFeilmelding: kanSendeSkjema,
        valideringErOk,
        nullstillSkjema,
    };
};
