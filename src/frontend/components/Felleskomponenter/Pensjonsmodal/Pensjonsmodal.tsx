import React from 'react';

import { formatISO, parseISO } from 'date-fns';

import { ESvar } from '@navikt/familie-form-elements';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { pensjonsperiodeModalSpørsmålSpråkId } from './språkUtils';
import { PensjonsperiodeSpørsmålId } from './spørsmål';
import { IUsePensjonSkjemaParams, usePensjonSkjema } from './usePensjonSkjema';

interface Props extends IUsePensjonSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtland: boolean;
}

export const PensjonModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilPensjonsperiode,
    gjelderUtland,
    personType,
    barn,
    erDød,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        usePensjonSkjema({
            gjelderUtland,
            personType,
            barn,
            erDød,
        });

    const { toggles } = useFeatureToggles();

    const { mottarPensjonNå, pensjonTilDato, pensjonFraDato, pensjonsland } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }

        onLeggTilPensjonsperiode({
            mottarPensjonNå: {
                id: PensjonsperiodeSpørsmålId.mottarPensjonNå,
                svar: mottarPensjonNå.erSynlig ? mottarPensjonNå.verdi : null,
            },
            pensjonsland: {
                id: PensjonsperiodeSpørsmålId.pensjonsland,
                svar: pensjonsland.erSynlig ? pensjonsland.verdi : '',
            },
            pensjonFra: {
                id: PensjonsperiodeSpørsmålId.fraDatoPensjon,
                svar: pensjonFraDato.erSynlig ? pensjonFraDato.verdi : '',
            },
            pensjonTil: {
                id: PensjonsperiodeSpørsmålId.tilDatoPensjon,
                svar: pensjonTilDato.erSynlig ? pensjonTilDato.verdi : '',
            },
        });

        lukkModal();
        nullstillSkjema();
    };
    const modalTittel = gjelderUtland
        ? 'felles.leggtilpensjon.utland.modal.tittel'
        : 'felles.leggtilpensjon.norge.modal.tittel';

    const periodenErAvsluttet =
        mottarPensjonNå.verdi === ESvar.NEI || (personType === PersonType.AndreForelder && !!erDød);

    const hentSpørsmålTekstId = pensjonsperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilpensjon.knapp'}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {mottarPensjonNå.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={mottarPensjonNå}
                        spørsmålTekstId={hentSpørsmålTekstId(
                            PensjonsperiodeSpørsmålId.mottarPensjonNå
                        )}
                        språkValues={{ ...(barn && { barn: barn.navn }) }}
                    />
                )}
                {pensjonsland.erSynlig && (
                    <LandDropdown
                        felt={pensjonsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={hentSpørsmålTekstId(PensjonsperiodeSpørsmålId.pensjonsland)}
                                values={{ ...(barn && { barn: barn.navn }) }}
                            />
                        }
                        dynamisk
                        ekskluderNorge
                    />
                )}

                {pensjonFraDato.erSynlig &&
                    (toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO] ? (
                        <MånedÅrVelger
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        PensjonsperiodeSpørsmålId.fraDatoPensjon
                                    )}
                                    values={{ ...(barn && { barn: barn.navn }) }}
                                />
                            }
                            avgrensMaxMåned={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                            onChange={dato =>
                                pensjonFraDato.validerOgSettFelt(
                                    formatISO(dato, { representation: 'date' })
                                )
                            }
                        />
                    ) : (
                        <Datovelger
                            felt={pensjonFraDato}
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        PensjonsperiodeSpørsmålId.fraDatoPensjon
                                    )}
                                    values={{ ...(barn && { barn: barn.navn }) }}
                                />
                            }
                            skjema={skjema}
                            avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                        />
                    ))}
                {pensjonTilDato.erSynlig &&
                    (toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO] ? (
                        <MånedÅrVelger
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        PensjonsperiodeSpørsmålId.tilDatoPensjon
                                    )}
                                    values={{ ...(barn && { barn: barn.navn }) }}
                                />
                            }
                            avgrensMinMåned={parseISO(pensjonFraDato.verdi)}
                            avgrensMaxMåned={dagensDato()}
                            onChange={dato =>
                                pensjonTilDato.validerOgSettFelt(
                                    formatISO(dato, { representation: 'date' })
                                )
                            }
                        />
                    ) : (
                        <Datovelger
                            felt={pensjonTilDato}
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        PensjonsperiodeSpørsmålId.tilDatoPensjon
                                    )}
                                    values={{ ...(barn && { barn: barn.navn }) }}
                                />
                            }
                            skjema={skjema}
                            avgrensMaxDato={dagensDato()}
                            tilhørendeFraOgMedFelt={pensjonFraDato}
                            dynamisk
                        />
                    ))}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
