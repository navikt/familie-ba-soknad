import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useSpråk } from '../../../context/SpråkContext';
import { HeadingLevel } from '../../../typer/common';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { barnetrygdperiodeModalSpørsmålSpråkId } from './barnetrygdperiodeSpråkUtils';
import { BarnetrygdperiodeSpørsmålId } from './spørsmål';

interface BarnetrygdperiodeProps {
    barnetrygdsperiode: IEøsBarnetrygdsperiode;
    nummer: number;
    fjernPeriodeCallback?: (barnetrygdsperiode: IEøsBarnetrygdsperiode) => void;
    barnetsNavn: string;
    headingLevel?: HeadingLevel;
}

type BarnetrygdperiodeOppsummeringPersonTypeProps =
    | { personType: PersonType.Søker; erDød?: boolean }
    | { personType: PersonType.Omsorgsperson; erDød?: boolean }
    | { personType: PersonType.AndreForelder; erDød: boolean };

type Props = BarnetrygdperiodeProps & BarnetrygdperiodeOppsummeringPersonTypeProps;

export const BarnetrygdsperiodeOppsummering: React.FC<Props> = ({
    barnetrygdsperiode,
    nummer,
    fjernPeriodeCallback = undefined,
    barnetsNavn,
    erDød,
    personType,
    headingLevel = '3',
}) => {
    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = barnetrygdsperiode;

    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.svar === ESvar.NEI ||
        (personType === PersonType.AndreForelder && erDød);
    const { valgtLocale } = useSpråk();

    const hentSpørsmålTekstId = barnetrygdperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    const spørsmålSpråkTekst = (spørsmålId: BarnetrygdperiodeSpørsmålId) => (
        <SpråkTekst id={hentSpørsmålTekstId(spørsmålId)} values={{ barn: barnetsNavn }} />
    );

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnetrygdsperiode))
            }
            fjernKnappSpråkId={'felles.fjernbarnetrygd.knapp'}
            nummer={nummer}
            tittelSpråkId={'ombarnet.trygdandreperioder.periode'}
            headingLevel={headingLevel}
        >
            {mottarEøsBarnetrygdNå.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå)}
                    søknadsvar={mottarEøsBarnetrygdNå.svar}
                />
            )}
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.barnetrygdsland)}
                søknadsvar={landkodeTilSpråk(barnetrygdsland.svar, valgtLocale)}
            />
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode)}
                søknadsvar={formaterDato(fraDatoBarnetrygdperiode.svar)}
            />
            {tilDatoBarnetrygdperiode.svar && (
                <OppsummeringFelt
                    tittel={spørsmålSpråkTekst(
                        BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode
                    )}
                    søknadsvar={formaterDato(tilDatoBarnetrygdperiode.svar)}
                />
            )}
            <OppsummeringFelt
                tittel={spørsmålSpråkTekst(BarnetrygdperiodeSpørsmålId.månedligBeløp)}
                søknadsvar={månedligBeløp.svar}
            />
        </PeriodeOppsummering>
    );
};
