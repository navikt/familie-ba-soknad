import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { HeadingLevel } from '../../../typer/common';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../Sanity/TekstBlock';

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
    const { tekster } = useApp();

    const teksterForPersonType: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(barnetrygdsperiode))
            }
            tittelSpråkId={'ombarnet.trygdandreperioder.periode'}
            fjernKnappSpråkId={'felles.fjernbarnetrygd.knapp'}
            tittel={
                <TekstBlock
                    block={teksterForPersonType.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString() }}
                />
            }
            nummer={nummer}
            headingLevel={headingLevel}
        >
            {mottarEøsBarnetrygdNå.svar && (
                <OppsummeringFelt
                    tittel={
                        <TekstBlock
                            block={teksterForPersonType.mottarBarnetrygdNa.sporsmal}
                            flettefelter={{ barnetsNavn }}
                        />
                    }
                    søknadsvar={mottarEøsBarnetrygdNå.svar}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={
                            periodenErAvsluttet
                                ? teksterForPersonType.barnetrygdLandFortid.sporsmal
                                : teksterForPersonType.barnetrygdLandNatid.sporsmal
                        }
                        flettefelter={{ barnetsNavn }}
                    />
                }
                søknadsvar={landkodeTilSpråk(barnetrygdsland.svar, valgtLocale)}
            />
            <OppsummeringFelt
                tittel={<TekstBlock block={teksterForPersonType.startdato.sporsmal} />}
                søknadsvar={formaterDato(fraDatoBarnetrygdperiode.svar)}
            />
            {tilDatoBarnetrygdperiode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForPersonType.sluttdato.sporsmal} />}
                    søknadsvar={formaterDato(tilDatoBarnetrygdperiode.svar)}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={teksterForPersonType.belopPerManed.sporsmal}
                        flettefelter={{ barnetsNavn }}
                    />
                }
                søknadsvar={månedligBeløp.svar}
            />
        </PeriodeOppsummering>
    );
};
