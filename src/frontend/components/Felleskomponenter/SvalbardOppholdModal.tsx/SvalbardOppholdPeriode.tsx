import React from 'react';

import type { Felt, ISkjema } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { PeriodePersonTypeMedBarnProps } from '../../../typer/personType';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { IOmDegFeltTyper } from '../../../typer/skjema';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import PerioderContainer from '../PerioderContainer';
import TekstBlock from '../Sanity/TekstBlock';
import useModal from '../SkjemaModal/useModal';

import { SvalbardOppholdModal } from './SvalbardOppholdModal';
import { SvalbardOppholdPeriodeOppsummering } from './SvalbardOppholdPeriodeOppsummering';

interface SvalbardOppholdPeriodeProps {
    skjema: ISkjema<IOmDegFeltTyper, string>;
    leggTilSvalbardOppholdPeriode: (periode: ISvalbardOppholdPeriode) => void;
    fjernSvalbardOppholdPeriode: (periode: ISvalbardOppholdPeriode) => void;
    registrerteSvalbardOppholdPerioder: Felt<ISvalbardOppholdPeriode[]>;
}

type Props = SvalbardOppholdPeriodeProps & PeriodePersonTypeMedBarnProps;

export const SvalbardOppholdPeriode: React.FC<Props> = ({
    skjema,
    leggTilSvalbardOppholdPeriode,
    fjernSvalbardOppholdPeriode,
    registrerteSvalbardOppholdPerioder,
    personType,
    barn,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { erÅpen, lukkModal, åpneModal } = useModal();

    const teksterForModal: ISvalbardOppholdTekstinnhold =
        tekster().FELLES.modaler.svalbardOpphold[personType];
    const { flerePerioder, leggTilKnapp, leggTilPeriodeForklaring } = teksterForModal;

    return (
        <PerioderContainer tittel={'Tittel test'}>
            {registrerteSvalbardOppholdPerioder.verdi.map((periode, index) => (
                <SvalbardOppholdPeriodeOppsummering
                    key={`svalbardOppholdPeriode-${index}`}
                    svalbardOppholdPeriode={periode}
                    fjernPeriodeCallback={fjernSvalbardOppholdPeriode}
                    nummer={index + 1}
                    personType={personType}
                    barn={barn}
                />
            ))}
            <LeggTilKnapp
                onClick={åpneModal}
                leggTilFlereTekst={
                    registrerteSvalbardOppholdPerioder.verdi.length > 0 && plainTekst(flerePerioder)
                }
                feilmelding={
                    registrerteSvalbardOppholdPerioder.erSynlig &&
                    skjema.visFeilmeldinger &&
                    registrerteSvalbardOppholdPerioder.feilmelding
                }
            >
                <TekstBlock block={leggTilKnapp} />
            </LeggTilKnapp>
            {erÅpen && (
                <SvalbardOppholdModal
                    erÅpen={erÅpen}
                    lukkModal={lukkModal}
                    onLeggTilSvalbardOppholdPeriode={leggTilSvalbardOppholdPeriode}
                    forklaring={plainTekst(leggTilPeriodeForklaring)}
                    personType={personType}
                    barn={barn}
                />
            )}
        </PerioderContainer>
    );
};
