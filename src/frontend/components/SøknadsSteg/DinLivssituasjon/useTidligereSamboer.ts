import dayjs from 'dayjs';

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
    const tidligereSamboerNavn = useInputFelt({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerNavn,
            svar: '',
        },
        feilmeldingSpråkId: 'omdeg.samboerNavn.feilmelding',
    });

    const tidligereSamboerFnrUkjent = useFelt<ESvar>({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFnrUkjent,
        verdi: ESvar.NEI,
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerFnr = useInputFeltMedUkjent({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFnr,
            svar: '',
        },
        avhengighet: tidligereSamboerFnrUkjent,
        feilmeldingSpråkId: 'omdeg.samboer.ident.ikkebesvart.feilmelding',
        erFnrInput: true,
    });

    const tidligereSamboerFødselsdatoUkjent = useFelt<ESvar>({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdatoUkjent,
        verdi: ESvar.NEI,
        avhengigheter: { fnrUkjent: tidligereSamboerFnrUkjent },
        skalFeltetVises: avhengigheter => avhengigheter.fnrUkjent.verdi === ESvar.JA,
        nullstillVedAvhengighetEndring: false,
    });

    const tidligereSamboerFødselsdato = useDatovelgerFeltMedUkjent({
        feltId: TidligereSamboerSpørsmålId.tidligereSamboerFødselsdato,
        initiellVerdi: '',
        vetIkkeCheckbox: tidligereSamboerFødselsdatoUkjent,
        feilmeldingSpråkId: 'omdeg.nåværendesamboer.fødselsdato.ukjent',
        skalFeltetVises: tidligereSamboerFnrUkjent.verdi === ESvar.JA,
    });

    const tidligereSamboerFraDato = useDatovelgerFelt({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerFraDato,
            svar: '',
        },
        skalFeltetVises: true,
        feilmeldingSpråkId: 'omdeg.nårstartetsamboerforhold.feilmelding',
        sluttdatoAvgrensning: gårsdagensDato(),
    });

    const tidligereSamboerTilDato = useDatovelgerFelt({
        søknadsfelt: {
            id: TidligereSamboerSpørsmålId.tidligereSamboerTilDato,
            svar: '',
        },
        skalFeltetVises: true,
        feilmeldingSpråkId: 'omdeg.nårsamboerforholdavsluttet.feilmelding',
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: dayjs(tidligereSamboerFraDato.verdi)
            .add(1, 'day')
            .format('YYYY-MM-DD'),
    });

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
