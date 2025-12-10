import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { HeadingLevel } from '../../../typer/common';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import { formaterDatostringKunMåned } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { uppercaseFørsteBokstav } from '../../../utils/visning';
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
        mottarEøsBarnetrygdNå.svar === ESvar.NEI || (personType === PersonType.AndreForelder && erDød);
    const { valgtLocale } = useSpråkContext();
    const { tekster } = useAppContext();

    const teksterForPersonType: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(barnetrygdsperiode))}
            tittel={
                <TekstBlock
                    block={teksterForPersonType.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString() }}
                />
            }
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
                søknadsvar={uppercaseFørsteBokstav(
                    formaterDatostringKunMåned(fraDatoBarnetrygdperiode.svar, valgtLocale)
                )}
            />
            {tilDatoBarnetrygdperiode.svar && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={teksterForPersonType.sluttdato.sporsmal} />}
                    søknadsvar={uppercaseFørsteBokstav(
                        formaterDatostringKunMåned(tilDatoBarnetrygdperiode.svar, valgtLocale)
                    )}
                />
            )}
            <OppsummeringFelt
                tittel={
                    <TekstBlock block={teksterForPersonType.belopPerManed.sporsmal} flettefelter={{ barnetsNavn }} />
                }
                søknadsvar={månedligBeløp.svar}
            />
        </PeriodeOppsummering>
    );
};
