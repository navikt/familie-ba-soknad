import React from 'react';

import { useAppContext } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps } from '../../../typer/personType';
import { formaterDatostringKunMåned } from '../../../utils/dato';
import { formaterMånedMedUkjent, uppercaseFørsteBokstav } from '../../../utils/visning';
import { OppsummeringFelt } from '../../SøknadsSteg/Oppsummering/OppsummeringFelt';
import PeriodeOppsummering from '../PeriodeOppsummering/PeriodeOppsummering';
import TekstBlock from '../Sanity/TekstBlock';

interface Props {
    svalbardOppholdPeriode: ISvalbardOppholdPeriode;
    nummer: number;
    fjernPeriodeCallback?: (svalbardOppholdPeriode: ISvalbardOppholdPeriode) => void;
}

type SvalbardOppholdPeriodeOppsummeringProps = Props & PeriodePersonTypeMedBarnProps;

export const SvalbardOppholdPeriodeOppsummering: React.FC<SvalbardOppholdPeriodeOppsummeringProps> = ({
    svalbardOppholdPeriode,
    nummer,
    fjernPeriodeCallback = undefined,
    personType,
    barn,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { valgtLocale } = useSpråkContext();
    const { fraDatoSvalbardOpphold, tilDatoSvalbardOpphold } = svalbardOppholdPeriode;

    const teksterForModal = tekster().FELLES.modaler.svalbardOpphold[personType];

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={fjernPeriodeCallback && (() => fjernPeriodeCallback(svalbardOppholdPeriode))}
            fjernKnappSpråkId={'felles.fjernpensjon.knapp'}
            fjernKnappTekst={teksterForModal.fjernKnapp}
            nummer={nummer}
            tittelSpråkId={''}
            tittel={
                <TekstBlock
                    block={teksterForModal.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString(), barnetsNavn: barn?.navn }}
                />
            }
        >
            <OppsummeringFelt
                tittel={
                    <TekstBlock block={teksterForModal.startdato.sporsmal} flettefelter={{ barnetsNavn: barn?.navn }} />
                }
                søknadsvar={uppercaseFørsteBokstav(
                    formaterDatostringKunMåned(fraDatoSvalbardOpphold.svar, valgtLocale)
                )}
            />
            <OppsummeringFelt
                tittel={
                    <TekstBlock block={teksterForModal.sluttdato.sporsmal} flettefelter={{ barnetsNavn: barn?.navn }} />
                }
                søknadsvar={formaterMånedMedUkjent(
                    tilDatoSvalbardOpphold.svar,
                    plainTekst(teksterForModal.sluttdato.checkboxLabel),
                    valgtLocale
                )}
            />
        </PeriodeOppsummering>
    );
};
