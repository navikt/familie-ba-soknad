import React from 'react';

import { IBarnetrygdsperiode } from '../../../typer/perioder';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';

export const BarnetrygdsperiodeOppsummering: React.FC<{
    barnetrygdsperiode: IBarnetrygdsperiode;
    nummer: number;
    fjernPeriodeCallback?: (barnetrygdsperiode: IBarnetrygdsperiode) => void;
}> = ({ barnetrygdsperiode, nummer, fjernPeriodeCallback = undefined }) => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = barnetrygdsperiode;

    //TODO sette inn riktige tekster
    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnetrygdsperiode))
            }
            fjernKnappSpråkId={'felles.fjernarbeidsperiode.knapp'}
            nummer={nummer}
            tittelSpråkId={'felles.fjernarbeidsperiode.knapp'}
        >
            {mottarEøsBarnetrygdNå && (
                <OppsummeringFelt
                    tittel={'felles.fjernarbeidsperiode.knapp'}
                    søknadsvar={mottarEøsBarnetrygdNå.svar}
                />
            )}
            {barnetrygdsland && (
                <OppsummeringFelt
                    tittel={'felles.fjernarbeidsperiode.knapp'}
                    søknadsvar={barnetrygdsland.svar}
                />
            )}
            {fraDatoBarnetrygdperiode && (
                <OppsummeringFelt
                    tittel={'felles.fjernarbeidsperiode.knapp'}
                    søknadsvar={fraDatoBarnetrygdperiode.svar}
                />
            )}
            {tilDatoBarnetrygdperiode && (
                <OppsummeringFelt
                    tittel={'felles.fjernarbeidsperiode.knapp'}
                    søknadsvar={tilDatoBarnetrygdperiode.svar}
                />
            )}
            {månedligBeløp && (
                <OppsummeringFelt
                    tittel={'felles.fjernarbeidsperiode.knapp'}
                    søknadsvar={månedligBeløp.svar}
                />
            )}
        </PeriodeOppsummering>
    );
};
