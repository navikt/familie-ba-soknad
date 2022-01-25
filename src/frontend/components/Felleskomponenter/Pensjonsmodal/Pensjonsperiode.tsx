import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { IPensjonsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper, IOmBarnetUtvidetFeltTyper } from '../../../typer/skjema';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { PensjonModal } from './Pensjonsmodal';
import { PensjonsperiodeOppsummering } from './PensjonsperiodeOppsummering';
import {
    mottarEllerMottattPensjonSpråkId,
    pensjonsperiodeFeilmelding,
    pensjonFlerePerioderSpmSpråkId,
    pensjonsperiodeKnappSpråkId,
} from './språkUtils';
import { PensjonSpørsmålId } from './spørsmål';

interface PensjonsperiodeProps {
    skjema: ISkjema<IDinLivssituasjonFeltTyper | IOmBarnetUtvidetFeltTyper, string>;
    mottarEllerMottattPensjonFelt: Felt<ESvar | null>;
    registrertePensjonsperioder: Felt<IPensjonsperiode[]>;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtlandet?: boolean;
    gjelderAndreForelder?: boolean;
    barnetsNavn?: string;
}

export const Pensjonsperiode: React.FC<PensjonsperiodeProps> = ({
    skjema,
    leggTilPensjonsperiode,
    fjernPensjonsperiode,
    gjelderUtlandet = false,
    gjelderAndreForelder = false,
    barnetsNavn,
    mottarEllerMottattPensjonFelt,
    registrertePensjonsperioder,
}) => {
    const { erÅpen: pensjonsmodalErÅpen, toggleModal: togglePensjonsmodal } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={mottarEllerMottattPensjonFelt}
                spørsmålTekstId={mottarEllerMottattPensjonSpråkId()}
            />
            {mottarEllerMottattPensjonFelt.verdi === ESvar.JA && (
                <>
                    {registrertePensjonsperioder.verdi.map((pensjonsperiode, index) => (
                        <PensjonsperiodeOppsummering
                            pensjonsperiode={pensjonsperiode}
                            fjernPeriodeCallback={fjernPensjonsperiode}
                            nummer={index + 1}
                        />
                    ))}
                    {registrertePensjonsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={pensjonFlerePerioderSpmSpråkId(
                                    gjelderUtlandet,
                                    gjelderAndreForelder
                                )}
                                values={{ barn: barnetsNavn }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        onClick={togglePensjonsmodal}
                        språkTekst={pensjonsperiodeKnappSpråkId(gjelderUtlandet)}
                        id={PensjonSpørsmålId.pensjonsperioder}
                        feilmelding={
                            registrertePensjonsperioder.erSynlig &&
                            registrertePensjonsperioder.feilmelding &&
                            skjema.visFeilmeldinger && (
                                <SpråkTekst id={pensjonsperiodeFeilmelding(gjelderUtlandet)} />
                            )
                        }
                    />
                    <PensjonModal
                        erÅpen={pensjonsmodalErÅpen}
                        toggleModal={togglePensjonsmodal}
                        onLeggTilPensjonsperiode={leggTilPensjonsperiode}
                        gjelderUtland={gjelderUtlandet}
                    />
                </>
            )}
        </>
    );
};
