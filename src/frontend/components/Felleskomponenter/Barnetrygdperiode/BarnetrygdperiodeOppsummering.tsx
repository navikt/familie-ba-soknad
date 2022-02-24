import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import { eøsBarnetrygdSpørsmålSpråkTekst } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

export const BarnetrygdsperiodeOppsummering: React.FC<{
    barnetrygdsperiode: IEøsBarnetrygdsperiode;
    nummer: number;
    fjernPeriodeCallback?: (barnetrygdsperiode: IEøsBarnetrygdsperiode) => void;
    barnetsNavn: string;
}> = ({ barnetrygdsperiode, nummer, fjernPeriodeCallback = undefined, barnetsNavn }) => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = barnetrygdsperiode;

    const tilbakeITid = mottarEøsBarnetrygdNå.svar === ESvar.NEI;
    const [valgtLocale] = useSprakContext();

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnetrygdsperiode))
            }
            fjernKnappSpråkId={'felles.fjernarbeidsperiode.knapp'}
            nummer={nummer}
            tittelSpråkId={'ombarnet.trygdandreperioder.periode'}
        >
            {mottarEøsBarnetrygdNå.svar && (
                <OppsummeringFelt
                    tittel={eøsBarnetrygdSpørsmålSpråkTekst(
                        tilbakeITid,
                        BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå
                    )}
                    søknadsvar={mottarEøsBarnetrygdNå.svar}
                />
            )}
            {barnetrygdsland.svar && (
                <OppsummeringFelt
                    tittel={eøsBarnetrygdSpørsmålSpråkTekst(
                        tilbakeITid,
                        BarnetrygdperiodeSpørsmålId.barnetrygdsland
                    )}
                    søknadsvar={landkodeTilSpråk(barnetrygdsland.svar, valgtLocale)}
                />
            )}
            {fraDatoBarnetrygdperiode.svar && (
                <OppsummeringFelt
                    tittel={eøsBarnetrygdSpørsmålSpråkTekst(
                        tilbakeITid,
                        BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode
                    )}
                    søknadsvar={formaterDato(fraDatoBarnetrygdperiode.svar)}
                />
            )}
            {tilDatoBarnetrygdperiode?.svar && (
                <OppsummeringFelt
                    tittel={eøsBarnetrygdSpørsmålSpråkTekst(
                        tilbakeITid,
                        BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode
                    )}
                    søknadsvar={formaterDato(tilDatoBarnetrygdperiode.svar)}
                />
            )}
            {månedligBeløp.svar && (
                <OppsummeringFelt
                    tittel={eøsBarnetrygdSpørsmålSpråkTekst(
                        tilbakeITid,
                        BarnetrygdperiodeSpørsmålId.månedligBeløp,
                        { barn: barnetsNavn }
                    )}
                    søknadsvar={månedligBeløp.svar}
                />
            )}
        </PeriodeOppsummering>
    );
};
