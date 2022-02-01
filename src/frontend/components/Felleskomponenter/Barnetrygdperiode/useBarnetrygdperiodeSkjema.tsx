import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnetrygdperioderFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import {
    barnetrygdslandFeilmelding,
    tilDatoBarnetrygdFeilmelding,
} from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålsId } from './spørsmål';

export const useArbeidsperiodeSkjema = () => {
    const mottarBarnetrygdNå = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.mottarBarnetrygdNå, svar: null },
        feilmeldingSpråkId: 'todo',
    });

    const tilbakeITid = mottarBarnetrygdNå.verdi === ESvar.JA;

    const barnetrygdsland = useLanddropdownFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.barnetrygdsland, svar: '' },
        feilmeldingSpråkId: barnetrygdslandFeilmelding(tilbakeITid),
        skalFeltetVises: mottarBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        nullstillVedAvhengighetEndring: true,
    });

    const fraDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.fraDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: mottarBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'jføafj',
        sluttdatoAvgrensning: tilbakeITid ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
    });

    const tilDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.tilDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: mottarBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: tilDatoBarnetrygdFeilmelding(tilbakeITid),
        sluttdatoAvgrensning: mottarBarnetrygdNå.verdi === ESvar.JA ? dagensDato() : undefined,
        startdatoAvgrensning: fraDatoBarnetrygdperiode.verdi,
    });

    const månedligBeløp = useInputFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.månedligBeløp, svar: '' },
        feilmeldingSpråkId: 'økaøjajt',
        skalVises: mottarBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
    });

    const skjema = useSkjema<IBarnetrygdperioderFeltTyper, 'string'>({
        felter: {
            mottarBarnetrygdNå,
            barnetrygdsland,
            fraDatoBarnetrygdperiode,
            tilDatoBarnetrygdperiode,
            månedligBeløp,
        },

        skjemanavn: 'barnetrygdperioder',
    });

    return {
        ...skjema,
        validerFelterOgVisFeilmelding: skjema.kanSendeSkjema,
    };
};
