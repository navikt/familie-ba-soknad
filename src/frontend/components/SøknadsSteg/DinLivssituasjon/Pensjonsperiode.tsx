import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import { PensjonModal } from '../../Felleskomponenter/Pensjonsmodal/Pensjonsmodal';
import { PensjonsperiodeOppsummering } from '../../Felleskomponenter/Pensjonsmodal/PensjonsperiodeOppsummering';
import {
    pensjonsperiodeFeilmelding,
    pensjonsperiodeFlereSpørsmål,
    pensjonsperiodeLeggTilFlereKnapp,
} from '../../Felleskomponenter/Pensjonsmodal/språkUtils';
import { PensjonSpørsmålId } from '../../Felleskomponenter/Pensjonsmodal/spørsmål';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

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
    const { erEøsLand } = useEøs();
    const { toggles } = useFeatureToggles();
    const { erÅpen: pensjonsmodalErÅpen, toggleModal: togglePensjonsmodal } = useModal();

    return toggles.EØS_KOMPLETT ? (
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
    ) : (
        <KomponentGruppe inline>
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.mottarUtenlandspensjon}
                spørsmålTekstId={
                    dinLivssituasjonSpørsmålSpråkId[
                        DinLivssituasjonSpørsmålId.mottarUtenlandspensjon
                    ]
                }
            />
            <LandDropdown
                felt={skjema.felter.pensjonsland}
                skjema={skjema}
                label={
                    <SpråkTekst
                        id={
                            dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.pensjonsland]
                        }
                    />
                }
                dynamisk
            />
            {erEøsLand(skjema.felter.pensjonsland.verdi) && (
                <VedleggNotisTilleggsskjema
                    språkTekstId={'omdeg.utenlandspensjon.eøs-info'}
                    dynamisk
                />
            )}
        </KomponentGruppe>
    );
};
