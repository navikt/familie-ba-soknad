import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    utbetalingerAndreForelderSpørsmålSpråkId,
    UtbetalingerSpørsmålId,
    utbetalingerSøkerSpørsmålSpråkId,
} from './spørsmål';
import { useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps {
    erÅpen: boolean;
    toggleModal: () => void;
    onLeggTilUtbetalinger: () => void;
    barnetsNavn?: string;
    gjelderAndreForelder?: boolean;
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    toggleModal,
    onLeggTilUtbetalinger,
    barnetsNavn,
    gjelderAndreForelder = false,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(gjelderAndreForelder, barnetsNavn);

    const tilbakeITid = skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        // Legg til utbetalinger på søknadsobjekt
        onLeggTilUtbetalinger();

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'felles.flereytelser.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.flereytelser.tittel'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.fårUtbetalingNå}
                    spørsmålTekstId={
                        gjelderAndreForelder
                            ? utbetalingerAndreForelderSpørsmålSpråkId()[
                                  UtbetalingerSpørsmålId.fårUtbetalingNå
                              ]
                            : utbetalingerSøkerSpørsmålSpråkId()[
                                  UtbetalingerSpørsmålId.fårUtbetalingNå
                              ]
                    }
                    språkValues={{ barn: barnetsNavn }}
                />
            </KomponentGruppe>
            {skjema.felter.fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK && (
                <KomponentGruppe inline dynamisk>
                    <LandDropdown
                        felt={skjema.felter.ytelseFraHvilketLand}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? utbetalingerAndreForelderSpørsmålSpråkId(tilbakeITid)[
                                              UtbetalingerSpørsmålId.utbetalingFraHvilketLand
                                          ]
                                        : utbetalingerSøkerSpørsmålSpråkId(tilbakeITid)[
                                              UtbetalingerSpørsmålId.utbetalingFraHvilketLand
                                          ]
                                }
                                values={{ barn: barnetsNavn }}
                            />
                        }
                        dynamisk
                    />
                    <Datovelger
                        skjema={skjema}
                        felt={skjema.felter.utbetalingFraDato}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? utbetalingerAndreForelderSpørsmålSpråkId()[
                                              UtbetalingerSpørsmålId.utbetalingFraDato
                                          ]
                                        : utbetalingerSøkerSpørsmålSpråkId()[
                                              UtbetalingerSpørsmålId.utbetalingFraDato
                                          ]
                                }
                            />
                        }
                        avgrensMaxDato={
                            skjema.felter.fårUtbetalingNå.verdi === ESvar.JA
                                ? dagensDato()
                                : gårsdagensDato()
                        }
                        calendarPosition={'fullscreen'}
                    />
                    <>
                        <Datovelger
                            skjema={skjema}
                            felt={skjema.felter.utbetalingTilDato}
                            label={
                                <SpråkTekst
                                    id={
                                        gjelderAndreForelder
                                            ? utbetalingerAndreForelderSpørsmålSpråkId(tilbakeITid)[
                                                  UtbetalingerSpørsmålId.utbetalingTilDato
                                              ]
                                            : utbetalingerSøkerSpørsmålSpråkId(tilbakeITid)[
                                                  UtbetalingerSpørsmålId.utbetalingTilDato
                                              ]
                                    }
                                />
                            }
                            avgrensMaxDato={
                                skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI
                                    ? dagensDato()
                                    : undefined
                            }
                            tilhørendeFraOgMedFelt={skjema.felter.utbetalingFraDato}
                            disabled={skjema.felter.utbetalingTilDatoUkjent.verdi === ESvar.JA}
                            calendarPosition={'fullscreen'}
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                gjelderAndreForelder
                                    ? utbetalingerAndreForelderSpørsmålSpråkId()[
                                          UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke
                                      ]
                                    : utbetalingerSøkerSpørsmålSpråkId()[
                                          UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke
                                      ]
                            }
                            felt={skjema.felter.utbetalingTilDatoUkjent}
                        />
                    </>
                </KomponentGruppe>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
