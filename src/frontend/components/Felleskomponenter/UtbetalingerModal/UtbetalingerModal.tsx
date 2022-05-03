import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { IBarnMedISøknad } from '../../../typer/barn';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { hentUtbetalingsperiodeSpørsmålIder, UtbetalingerSpørsmålId } from './spørsmål';
import { useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps extends ReturnType<typeof useModal> {
    onLeggTilUtbetalinger: (utbetalingsperiode: IUtbetalingsperiode) => void;
    andreForelderData?: { barn: IBarnMedISøknad; erDød: boolean };
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    toggleModal,
    onLeggTilUtbetalinger,
    andreForelderData,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(andreForelderData);

    const gjelderAndreForelder = !!andreForelderData;
    const barn = andreForelderData?.barn;
    const andreForelderErDød = !!andreForelderData?.erDød;
    const periodenErAvsluttet =
        skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI || andreForelderErDød;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtbetalinger({
            fårUtbetalingNå: {
                id: UtbetalingerSpørsmålId.fårUtbetalingNå,
                svar: skjema.felter.fårUtbetalingNå.verdi,
            },
            utbetalingLand: {
                id: UtbetalingerSpørsmålId.utbetalingLand,
                svar: skjema.felter.utbetalingLand.verdi,
            },
            utbetalingFraDato: {
                id: UtbetalingerSpørsmålId.utbetalingFraDato,
                svar: skjema.felter.utbetalingFraDato.verdi,
            },
            utbetalingTilDato: {
                id: UtbetalingerSpørsmålId.utbetalingTilDato,
                svar: svarForSpørsmålMedUkjent(
                    skjema.felter.utbetalingTilDatoUkjent,
                    skjema.felter.utbetalingTilDato
                ),
            },
        });

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
                        hentUtbetalingsperiodeSpørsmålIder(
                            gjelderAndreForelder,
                            periodenErAvsluttet
                        )[UtbetalingerSpørsmålId.fårUtbetalingNå]
                    }
                    språkValues={{ ...(barn && { barn: barn.navn }) }}
                />
            </KomponentGruppe>
            {(skjema.felter.fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK ||
                andreForelderErDød) && (
                <KomponentGruppe inline dynamisk>
                    <LandDropdown
                        felt={skjema.felter.utbetalingLand}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    hentUtbetalingsperiodeSpørsmålIder(
                                        gjelderAndreForelder,
                                        periodenErAvsluttet
                                    )[UtbetalingerSpørsmålId.utbetalingLand]
                                }
                                values={{ ...(barn && { barn: barn.navn }) }}
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
                                    hentUtbetalingsperiodeSpørsmålIder(
                                        gjelderAndreForelder,
                                        periodenErAvsluttet
                                    )[UtbetalingerSpørsmålId.utbetalingFraDato]
                                }
                            />
                        }
                        avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                        calendarPosition={'fullscreen'}
                    />
                    <>
                        <Datovelger
                            skjema={skjema}
                            felt={skjema.felter.utbetalingTilDato}
                            label={
                                <SpråkTekst
                                    id={
                                        hentUtbetalingsperiodeSpørsmålIder(
                                            gjelderAndreForelder,
                                            periodenErAvsluttet
                                        )[UtbetalingerSpørsmålId.utbetalingTilDato]
                                    }
                                />
                            }
                            avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                            avgrensMinDato={minTilDatoForUtbetalingEllerArbeidsperiode(
                                periodenErAvsluttet,
                                skjema.felter.utbetalingFraDato.verdi
                            )}
                            disabled={skjema.felter.utbetalingTilDatoUkjent.verdi === ESvar.JA}
                            calendarPosition={'fullscreen'}
                        />
                        <SkjemaCheckbox
                            labelSpråkTekstId={
                                hentUtbetalingsperiodeSpørsmålIder(
                                    gjelderAndreForelder,
                                    periodenErAvsluttet
                                )[UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke]
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
