import React from 'react';

import { Element } from 'nav-frontend-typografi';

import { ESvar } from '@navikt/familie-form-elements';
import { ISkjema } from '@navikt/familie-skjema';

import { useEøs } from '../../../context/EøsContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { IArbeidsperiode } from '../../../typer/perioder';
import { IDinLivssituasjonFeltTyper } from '../../../typer/skjema';
import { ArbeidsperiodeModal } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeModal';
import { ArbeidsperiodeOppsummering } from '../../Felleskomponenter/Arbeidsperiode/ArbeidsperiodeOppsummering';
import {
    arbeidsperiodeFeilmelding,
    arbeidsperiodeFlereSpørsmål,
    arbeidsperiodeLeggTilFlereKnapp,
} from '../../Felleskomponenter/Arbeidsperiode/arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from '../../Felleskomponenter/Arbeidsperiode/spørsmål';
import { LandDropdown } from '../../Felleskomponenter/Dropdowns/LandDropdown';
import JaNeiSpm from '../../Felleskomponenter/JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { LeggTilKnapp } from '../../Felleskomponenter/LeggTilKnapp/LeggTilKnapp';
import useModal from '../../Felleskomponenter/SkjemaModal/useModal';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { VedleggNotisTilleggsskjema } from '../../Felleskomponenter/VedleggNotis';
import { DinLivssituasjonSpørsmålId, dinLivssituasjonSpørsmålSpråkId } from './spørsmål';

interface Props {
    skjema: ISkjema<IDinLivssituasjonFeltTyper, string>;
    leggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    fjernArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet?: boolean;
    gjelderAndreForelder?: boolean;
    barnetsNavn?: string;
}

export const Arbeidsperiode: React.FC<Props> = props => {
    const {
        skjema,
        leggTilArbeidsperiode,
        fjernArbeidsperiode,
        gjelderUtlandet = false,
        gjelderAndreForelder = false,
        barnetsNavn,
    } = props;
    const { erEøsLand } = useEøs();
    const { toggles } = useFeatureToggles();
    const { erÅpen: arbeidsmodalErÅpen, toggleModal: toggleArbeidsmodal } = useModal();

    return (
        <KomponentGruppe inline>
            <JaNeiSpm
                skjema={skjema}
                felt={skjema.felter.jobberPåBåt}
                spørsmålTekstId={
                    dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.jobberPåBåt]
                }
            />
            {toggles.EØS_KOMPLETT ? (
                <>
                    {skjema.felter.jobberPåBåt.verdi === ESvar.JA && (
                        <>
                            {skjema.felter.registrerteArbeidsperioder.verdi.map(
                                (periode, index) => (
                                    <ArbeidsperiodeOppsummering
                                        arbeidsperiode={periode}
                                        fjernPeriodeCallback={fjernArbeidsperiode}
                                        nummer={index + 1}
                                        gjelderUtlandet={true}
                                    />
                                )
                            )}
                            {skjema.felter.registrerteArbeidsperioder.verdi.length > 0 && (
                                <Element>
                                    <SpråkTekst
                                        id={arbeidsperiodeFlereSpørsmål(
                                            gjelderUtlandet,
                                            gjelderAndreForelder
                                        )}
                                        values={{ barn: barnetsNavn }}
                                    />
                                </Element>
                            )}
                            <LeggTilKnapp
                                onClick={toggleArbeidsmodal}
                                språkTekst={arbeidsperiodeLeggTilFlereKnapp(gjelderUtlandet)}
                                id={ArbeidsperiodeSpørsmålsId.arbeidsperioder}
                                feilmelding={
                                    skjema.felter.registrerteArbeidsperioder.erSynlig &&
                                    skjema.felter.registrerteArbeidsperioder.feilmelding &&
                                    skjema.visFeilmeldinger && (
                                        <SpråkTekst
                                            id={arbeidsperiodeFeilmelding(gjelderUtlandet)}
                                        />
                                    )
                                }
                            />
                            <ArbeidsperiodeModal
                                erÅpen={arbeidsmodalErÅpen}
                                toggleModal={toggleArbeidsmodal}
                                onLeggTilArbeidsperiode={leggTilArbeidsperiode}
                                gjelderUtlandet
                            />
                        </>
                    )}
                </>
            ) : (
                <KomponentGruppe inline>
                    <LandDropdown
                        felt={skjema.felter.arbeidsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    dinLivssituasjonSpørsmålSpråkId[
                                        DinLivssituasjonSpørsmålId.arbeidsland
                                    ]
                                }
                            />
                        }
                        dynamisk
                    />
                    {erEøsLand(skjema.felter.arbeidsland.verdi) && (
                        <VedleggNotisTilleggsskjema
                            språkTekstId={'omdeg.arbeid-utland.eøs-info'}
                            dynamisk
                        />
                    )}
                </KomponentGruppe>
            )}
        </KomponentGruppe>
    );
};
