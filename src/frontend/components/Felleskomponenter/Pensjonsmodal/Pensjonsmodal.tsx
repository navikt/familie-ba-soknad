import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IPensjonsperiode } from '../../../typer/perioder';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    pensjonAndreForelderSpørsmålSpråkId,
    PensjonSpørsmålId,
    pensjonSøkerSpørsmålSpråkId,
} from './spørsmål';
import { IUsePensjonSkjemaParams, usePensjonSkjema } from './usePensjonSkjema';

interface Props extends ReturnType<typeof useModal>, IUsePensjonSkjemaParams {
    onLeggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtland?: boolean;
    andreForelderData?: { barn: IBarnMedISøknad; erDød: boolean };
}

export const PensjonModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilPensjonsperiode,
    gjelderUtland = false,
    andreForelderData,
}) => {
    const intl = useIntl();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        usePensjonSkjema({
            gjelderUtland,
            andreForelderData,
        });

    const { mottarPensjonNå, pensjonTilDato, pensjonFraDato, pensjonsland } = skjema.felter;
    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;
    const erAndreForelderDød = !!andreForelderData?.erDød;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }

        onLeggTilPensjonsperiode({
            mottarPensjonNå: {
                id: PensjonSpørsmålId.mottarPensjonNå,
                svar: skjema.felter.mottarPensjonNå.verdi,
            },
            ...(skjema.felter.pensjonsland.erSynlig && {
                pensjonsland: {
                    id: PensjonSpørsmålId.pensjonsland,
                    svar: skjema.felter.pensjonsland.verdi,
                },
            }),
            ...(skjema.felter.pensjonFraDato.erSynlig && {
                pensjonFra: {
                    id: PensjonSpørsmålId.fraDatoPensjon,
                    svar: skjema.felter.pensjonFraDato.verdi,
                },
            }),
            ...(skjema.felter.pensjonTilDato.erSynlig && {
                pensjonTil: {
                    id: PensjonSpørsmålId.tilDatoPensjon,
                    svar: skjema.felter.pensjonTilDato.verdi,
                },
            }),
        });

        toggleModal();
        nullstillSkjema();
    };
    const modalTittel = gjelderUtland
        ? 'felles.leggtilpensjon.utland.modal.tittel'
        : 'felles.leggtilpensjon.norge.modal.tittel';

    const tilbakeITid = mottarPensjonNå.verdi === ESvar.NEI;
    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilpensjon.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {skjema.felter.mottarPensjonNå.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.mottarPensjonNå}
                        spørsmålTekstId={
                            gjelderAndreForelder
                                ? pensjonAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[PensjonSpørsmålId.mottarPensjonNå]
                                : pensjonSøkerSpørsmålSpråkId(tilbakeITid)[
                                      PensjonSpørsmålId.mottarPensjonNå
                                  ]
                        }
                        språkValues={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                    />
                )}
                {pensjonsland.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.pensjonsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? pensjonAndreForelderSpørsmålSpråkId(
                                              tilbakeITid,
                                              erAndreForelderDød
                                          )[PensjonSpørsmålId.pensjonsland]
                                        : pensjonSøkerSpørsmålSpråkId(tilbakeITid)[
                                              PensjonSpørsmålId.pensjonsland
                                          ]
                                }
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                            />
                        }
                        dynamisk
                    />
                )}

                {pensjonFraDato.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.pensjonFraDato}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? pensjonAndreForelderSpørsmålSpråkId(
                                              tilbakeITid,
                                              erAndreForelderDød
                                          )[PensjonSpørsmålId.fraDatoPensjon]
                                        : pensjonSøkerSpørsmålSpråkId(tilbakeITid)[
                                              PensjonSpørsmålId.fraDatoPensjon
                                          ]
                                }
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                            />
                        }
                        skjema={skjema}
                        avgrensMaxDato={
                            tilbakeITid || erAndreForelderDød ? gårsdagensDato() : dagensDato()
                        }
                        calendarPosition={'fullscreen'}
                    />
                )}
                {pensjonTilDato.erSynlig && (
                    <Datovelger
                        felt={pensjonTilDato}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? pensjonAndreForelderSpørsmålSpråkId(
                                              tilbakeITid,
                                              erAndreForelderDød
                                          )[PensjonSpørsmålId.tilDatoPensjon]
                                        : pensjonSøkerSpørsmålSpråkId(tilbakeITid)[
                                              PensjonSpørsmålId.tilDatoPensjon
                                          ]
                                }
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                            />
                        }
                        skjema={skjema}
                        avgrensMaxDato={dagensDato()}
                        tilhørendeFraOgMedFelt={pensjonFraDato}
                        calendarPosition={'fullscreen'}
                        dynamisk
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
