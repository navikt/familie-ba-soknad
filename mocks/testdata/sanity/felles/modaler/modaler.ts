import { IModalerTekstinnhold } from '../../../../../src/frontend/typer/sanity/tekstInnhold';

import { andreUtbetalingerTekstinnhold } from './andreUtbetalinger';
import { arbeidsperiodeTekstinnhold } from './arbeidsperiode';
import { barnetrygdsperiodeTekstinnhold } from './barnetrygdperiode';
import { blokkerTilbakeknapp } from './blokkerTilbakeknapp';
import { leggTilBarnTekstinnhold } from './leggTilBarn';
import { pensjonsperiodeTekstinnhold } from './pensjonsperiode';
import { startPåNytt } from './startPåNytt';
import { tidligereSamoboereTekstinnhold } from './tidligereSamboere';
import { utenlandsoppholdTekstinnhold } from './utenlandsopphold';

export const modalerTekstinnhold: IModalerTekstinnhold = {
    arbeidsperiode: {
        søker: arbeidsperiodeTekstinnhold,
        andreForelder: arbeidsperiodeTekstinnhold,
        omsorgsperson: arbeidsperiodeTekstinnhold,
    },
    barnetrygdsperiode: {
        søker: barnetrygdsperiodeTekstinnhold,
        andreForelder: barnetrygdsperiodeTekstinnhold,
        omsorgsperson: barnetrygdsperiodeTekstinnhold,
    },
    pensjonsperiode: {
        søker: pensjonsperiodeTekstinnhold,
        andreForelder: pensjonsperiodeTekstinnhold,
        omsorgsperson: pensjonsperiodeTekstinnhold,
    },
    andreUtbetalinger: {
        søker: andreUtbetalingerTekstinnhold,
        andreForelder: andreUtbetalingerTekstinnhold,
        omsorgsperson: andreUtbetalingerTekstinnhold,
    },
    tidligereSamboere: {
        søker: tidligereSamoboereTekstinnhold,
    },
    utenlandsopphold: {
        søker: utenlandsoppholdTekstinnhold,
        barn: utenlandsoppholdTekstinnhold,
        andreForelder: utenlandsoppholdTekstinnhold,
    },
    startPåNytt: startPåNytt,
    leggTilBarn: leggTilBarnTekstinnhold,
    blokkerTilbakeknapp: blokkerTilbakeknapp,
};
