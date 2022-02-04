import { ESvar } from '@navikt/familie-form-elements';
import { useSkjema, Valideringsstatus } from '@navikt/familie-skjema';

import useDatovelgerFelt from '../../../hooks/useDatovelgerFelt';
import useInputFelt from '../../../hooks/useInputFelt';
import useJaNeiSpmFelt from '../../../hooks/useJaNeiSpmFelt';
import useLanddropdownFelt from '../../../hooks/useLanddropdownFelt';
import { IBarnetrygdperioderFeltTyper } from '../../../typer/skjema';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { barnetrygdslandFeilmelding } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

export const useBarnetrygdperiodeSkjema = () => {
    const mottarEøsBarnetrygdNå = useJaNeiSpmFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå, svar: null },
        feilmeldingSpråkId: 'modal.barnetrygdnå.feilmelding',
    });

    const tilbakeITid = mottarEøsBarnetrygdNå.verdi === ESvar.NEI;

    const barnetrygdsland = useLanddropdownFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.barnetrygdsland, svar: '' },
        feilmeldingSpråkId: barnetrygdslandFeilmelding(tilbakeITid),
        skalFeltetVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        nullstillVedAvhengighetEndring: true,
    });

    const fraDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: mottarEøsBarnetrygdNå.valideringsstatus === Valideringsstatus.OK,
        feilmeldingSpråkId: 'modal.trygdnårbegynte.feilmelding',
        sluttdatoAvgrensning: tilbakeITid ? gårsdagensDato() : dagensDato(),
        nullstillVedAvhengighetEndring: true,
    });

    const tilDatoBarnetrygdperiode = useDatovelgerFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode, svar: '' },
        skalFeltetVises: tilbakeITid,
        feilmeldingSpråkId: 'modal.trygdnåravsluttet.spm',
        sluttdatoAvgrensning: dagensDato(),
        startdatoAvgrensning: fraDatoBarnetrygdperiode.verdi,
    });

    //TODO legge inn validering for riktig input her
    const månedligBeløp = useInputFelt({
        søknadsfelt: { id: BarnetrygdperiodeSpørsmålId.månedligBeløp, svar: '' },
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
