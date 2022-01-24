import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { IPensjonsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
} from '../../SøknadsSteg/DinLivssituasjon/spørsmål';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { LeggTilKnapp } from '../LeggTilKnapp/LeggTilKnapp';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { PensjonModal } from './Pensjonsmodal';
import { PensjonsperiodeOppsummering } from './PensjonsperiodeOppsummering';
import {
    pensjonsperiodeFeilmelding,
    pensjonsperiodeFlereSpørsmål,
    pensjonsperiodeLeggTilFlereKnapp,
} from './språkUtils';
import { PensjonSpørsmålId } from './spørsmål';

interface Props {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    leggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    fjernPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtlandet?: boolean;
    gjelderAndreForelder?: boolean;
    barnetsNavn?: string;
}

export const Pensjonsperiode: React.FC<Props> = props => {
    const {
        skjema,
        leggTilPensjonsperiode,
        fjernPensjonsperiode,
        gjelderUtlandet = false,
        gjelderAndreForelder = false,
        barnetsNavn,
    } = props;
    const { erÅpen: pensjonsmodalErÅpen, toggleModal: togglePensjonsmodal } = useModal();

    return (
        <>
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.mottarUtenlandspensjon}
                spørsmålTekstId={
                    dinLivssituasjonSpørsmålSpråkId[
                        DinLivssituasjonSpørsmålId.mottarUtenlandspensjon
                    ]
                }
            />
            {skjema.felter.mottarUtenlandspensjon.verdi === ESvar.JA && (
                <>
                    {skjema.felter.registrertePensjonsperioder.verdi.map(
                        (pensjonsperiode, index) => (
                            <PensjonsperiodeOppsummering
                                pensjonsperiode={pensjonsperiode}
                                fjernPeriodeCallback={fjernPensjonsperiode}
                                nummer={index + 1}
                                gjelderUtlandet={gjelderUtlandet}
                            />
                        )
                    )}
                    {skjema.felter.registrertePensjonsperioder.verdi.length > 0 && (
                        <Element>
                            <SpråkTekst
                                id={pensjonsperiodeFlereSpørsmål(
                                    gjelderUtlandet,
                                    gjelderAndreForelder
                                )}
                                values={{ barn: barnetsNavn }}
                            />
                        </Element>
                    )}
                    <LeggTilKnapp
                        onClick={togglePensjonsmodal}
                        språkTekst={pensjonsperiodeLeggTilFlereKnapp(gjelderUtlandet)}
                        id={PensjonSpørsmålId.pensjonsperioder}
                        feilmelding={
                            skjema.felter.registrertePensjonsperioder.erSynlig &&
                            skjema.felter.registrertePensjonsperioder.feilmelding &&
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
