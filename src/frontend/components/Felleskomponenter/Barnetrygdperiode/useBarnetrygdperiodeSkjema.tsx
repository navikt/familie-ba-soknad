import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnetrygdperioderFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { barnetrygdslandFeilmelding } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålsId } from './spørsmål';

export const useBarnetrygdperiodeSkjema = () => {
    const mottarEøsBarnetrygdNå = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.mottarBarnetrygdNå, svar: null },
        feilmeldingSpråkId: 'modal.barnetrygdnå.feilmelding',
    });

    const tilbakeITid = mottarEøsBarnetrygdNå.verdi === ESvar.JA;

    const barnetrygdsland = useLanddropdownFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.barnetrygdsland, svar: '' },
        feilmeldingSpråkId: barnetrygdslandFeilmelding(tilbakeITid),
        skalFeltetVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        nullstillVedAvhengighetEndring: true,
    });

    const fraDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.fraDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'modal.trygdnårbegynte.feilmelding',
        sluttdatoAvgrensning: tilbakeITid ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
    });

    const tilDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.tilDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises:
            mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK &&
            mottarEøsBarnetrygdNå.verdi === ESvar.NEI,
        feilmeldingSpråkId: 'modal.trygdnåravsluttet.spm',
        sluttdatoAvgrensning: mottarEøsBarnetrygdNå.verdi === ESvar.JA ? dagensDato() : undefined,
        startdatoAvgrensning: fraDatoBarnetrygdperiode.verdi,
    });

    const månedligBeløp = useInputFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålsId.månedligBeløp, svar: '' },
        feilmeldingSpråkId: 'ombarnet.trygdbeløp.feilmelding',
        skalVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
    });

    const skjema = useSkjema<IBarnetrygdperioderFeltTyper, 'string'>({
        felter: {
            mottarEøsBarnetrygdNå,
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
