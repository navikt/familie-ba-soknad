import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { IUsePensjonSkjemaParams } from '../Pensjonsmodal/usePensjonSkjema';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    utbetalingerAndreForelderSpørsmålSpråkId,
    UtbetalingerSpørsmålId,
    utbetalingerSøkerSpørsmålSpråkId,
} from './spørsmål';
import { useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps extends ReturnType<typeof useModal>, IUsePensjonSkjemaParams {
    //TODO: legg til denne når vi skal sett søknadsdata  onLeggTilUtbetalinger: (utbetalingsperiode: IUtbetalingPeriode) => void;
    andreForelderData?: { barn: IBarnMedISøknad; erDød: boolean };
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    toggleModal,
    //TODO: legg til når vi skal sette søknadsdata: onLeggTilUtbetalinger,
    andreForelderData,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(andreForelderData);
    const intl = useIntl();

    const tilbakeITid = skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI;
    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;
    const andreForelderErDød = !!andreForelderData?.erDød;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        //TODO: legg til når vi skal sette søknadsdata: onLeggTilUtbetalinger();

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'felles.flereytelser.knapp'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.flereytelser.knapp'}
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
                    språkValues={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                />
            </KomponentGruppe>
            {(skjema.felter.fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK ||
                andreForelderErDød) && (
                <KomponentGruppe inline dynamisk>
                    <LandDropdown
                        felt={skjema.felter.ytelseFraHvilketLand}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? utbetalingerAndreForelderSpørsmålSpråkId(
                                              tilbakeITid,
                                              andreForelderErDød
                                          )[UtbetalingerSpørsmålId.utbetalingFraHvilketLand]
                                        : utbetalingerSøkerSpørsmålSpråkId(tilbakeITid)[
                                              UtbetalingerSpørsmålId.utbetalingFraHvilketLand
                                          ]
                                }
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
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
                                            ? utbetalingerAndreForelderSpørsmålSpråkId(
                                                  tilbakeITid,
                                                  andreForelderErDød
                                              )[UtbetalingerSpørsmålId.utbetalingTilDato]
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
