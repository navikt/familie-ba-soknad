import React from 'react';

import { useSkjema } from '@navikt/familie-skjema';

import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import { IUtbetalingerFeltTyper } from '../../../typer/skjema';
import { UtbetalingerSpørsmålId } from './spørsmål';

export interface IUseUtenlandsoppholdSkjemaParams {
    gjelderAndreForelder: boolean;
}

export const useUtbetalingerSkjema = gjelderAndreForelder => {
    const fårUtbetalingNå = useJaNeiSpmFelt({
        søknadsfelt: { id: UtbetalingerSpørsmålId.fårUtbetalingNå, svar: null },
        feilmeldingSpråkId: gjelderAndreForelder
            ? 'eøs.andreforelderutbetalinger.feilmelding'
            : 'eøs.utbetalinger.feilmelding',
    });

    const skjema = useSkjema<IUtbetalingerFeltTyper, 'string'>({
        felter: {
            fårUtbetalingNå,
        },
        skjemanavn: 'utbetalinger',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
