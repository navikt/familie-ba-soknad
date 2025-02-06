import React from 'react';

import { useApp } from '../../../context/AppContext';
import { useSpråk } from '../../../context/SpråkContext';
import { IUtenlandsperiode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps } from '../../../typer/personType';
import { IUtenlandsoppholdTekstinnhold } from '../../../typer/sanity/modaler/utenlandsopphold';
import { formaterDato } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
import { formaterDatoMedUkjent } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../Sanity/TekstBlock';

import {
    hentFraDatoSpørsmål,
    hentLandSpørsmål,
    hentTilDatoSpørsmål,
    hentUtenlandsoppholdÅrsak,
} from './utenlandsoppholdSpråkUtils';

type Props = {
    periode: IUtenlandsperiode;
    nummer: number;
    fjernPeriodeCallback?: (periode: IUtenlandsperiode) => void;
};

type UtenlandsperiodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const UtenlandsperiodeOppsummering: React.FC<UtenlandsperiodeOppsummeringProps> = ({
    periode,
    nummer,
    fjernPeriodeCallback,
    personType,
    barn,
}) => {
    const { valgtLocale } = useSpråk();
    const { plainTekst, tekster } = useApp();
    const { oppholdsland, utenlandsoppholdÅrsak, oppholdslandFraDato, oppholdslandTilDato } =
        periode;
    const årsak = utenlandsoppholdÅrsak.svar;
    const teksterForPersonType: IUtenlandsoppholdTekstinnhold =
        tekster().FELLES.modaler.utenlandsopphold[personType];

    return (
        <PeriodeOppsummering
            nummer={nummer}
            tittelSpråkId={'felles.leggtilutenlands.opphold'}
            fjernKnappSpråkId={'felles.fjernutenlandsopphold.knapp'}
            fjernKnappTekst={teksterForPersonType.fjernKnapp}
            tittel={
                <TekstBlock
                    block={teksterForPersonType.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString() }}
                />
            }
            fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(periode))}
        >
            <OppsummeringFelt
                tittel={<TekstBlock block={teksterForPersonType.periodeBeskrivelse.sporsmal} />}
                søknadsvar={plainTekst(hentUtenlandsoppholdÅrsak(årsak, teksterForPersonType))}
            />
            <OppsummeringFelt
                tittel={
                    <TekstBlock
                        block={hentLandSpørsmål(årsak, teksterForPersonType)}
                        flettefelter={{ barnetsNavn: barn?.navn }}
                    />
                }
                søknadsvar={landkodeTilSpråk(oppholdsland.svar, valgtLocale)}
            />
            {oppholdslandFraDato && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={hentFraDatoSpørsmål(årsak, teksterForPersonType)} />}
                    søknadsvar={formaterDato(oppholdslandFraDato.svar)}
                />
            )}
            {oppholdslandTilDato && (
                <OppsummeringFelt
                    tittel={<TekstBlock block={hentTilDatoSpørsmål(årsak, teksterForPersonType)} />}
                    søknadsvar={formaterDatoMedUkjent(
                        oppholdslandTilDato.svar,
                        plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)
                    )}
                />
            )}
        </PeriodeOppsummering>
    );
};
