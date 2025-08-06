import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { useSpråkContext } from '../../../context/SpråkContext';
import { IPensjonsperiode, ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps, PersonType } from '../../../typer/personType';
import { formaterDatostringKunMåned } from '../../../utils/dato';
import { landkodeTilSpråk } from '../../../utils/språk';
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

export const SvalbardOppholdPeriodeOppsummering: React.FC<
    SvalbardOppholdPeriodeOppsummeringProps
> = ({ svalbardOppholdPeriode, nummer, fjernPeriodeCallback = undefined }) => {
    const { tekster, plainTekst } = useAppContext();
    const { valgtLocale } = useSpråkContext();
    const teksterForModal = tekster().FELLES.modaler.svalbardOpphold;

    return (
        <PeriodeOppsummering
            fjernPeriodeCallback={
                fjernPeriodeCallback && (() => fjernPeriodeCallback(svalbardOppholdPeriode))
            }
            fjernKnappSpråkId={'felles.fjernpensjon.knapp'}
            fjernKnappTekst={teksterForModal.fjernKnapp}
            nummer={nummer}
            tittelSpråkId={''}
            tittel={
                <TekstBlock
                    block={teksterForModal.oppsummeringstittel}
                    flettefelter={{ antall: nummer.toString() }}
                />
            }
        >
            <OppsummeringFelt
                tittel={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                søknadsvar={svalbardOppholdPeriode.fraDatoSvalbardOpphold.svar}
            />
            <OppsummeringFelt
                tittel={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                søknadsvar={formaterMånedMedUkjent(
                    svalbardOppholdPeriode.tilDatoSvalbardOpphold.svar,
                    plainTekst(teksterForModal.sluttdato.checkboxLabel),
                    valgtLocale
                )}
            />
        </PeriodeOppsummering>
    );
};
