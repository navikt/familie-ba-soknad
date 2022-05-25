import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
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
import { utbetalingsperiodeModalSpørsmålSpråkIder } from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';
import { IUseUtbetalingerSkjemaParams, useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps extends ReturnType<typeof useModal>, IUseUtbetalingerSkjemaParams {
    onLeggTilUtbetalinger: (utbetalingsperiode: IUtbetalingsperiode) => void;
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    toggleModal,
    onLeggTilUtbetalinger,
    personType,
    barn,
    erDød,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(personType, barn, erDød);

    const andreForelderErDød: boolean = personType === PersonType.AndreForelder && !!erDød;
    const periodenErAvsluttet: boolean =
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

    const hentSpørsmålTekstId = utbetalingsperiodeModalSpørsmålSpråkIder(
        personType,
        periodenErAvsluttet
    );

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
                    spørsmålTekstId={hentSpørsmålTekstId(UtbetalingerSpørsmålId.fårUtbetalingNå)}
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
                                id={hentSpørsmålTekstId(UtbetalingerSpørsmålId.utbetalingLand)}
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
                                id={hentSpørsmålTekstId(UtbetalingerSpørsmålId.utbetalingFraDato)}
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
                                    id={hentSpørsmålTekstId(
                                        UtbetalingerSpørsmålId.utbetalingTilDato
                                    )}
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
                            labelSpråkTekstId={hentSpørsmålTekstId(
                                UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke
                            )}
                            felt={skjema.felter.utbetalingTilDatoUkjent}
                        />
                    </>
                </KomponentGruppe>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
