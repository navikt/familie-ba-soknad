import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagensDato, gårsdagensDato, sisteDagDenneMåneden } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { utbetalingsperiodeModalSpørsmålSpråkIder } from './språkUtils';
import { UtbetalingerSpørsmålId } from './spørsmål';
import { IUseUtbetalingerSkjemaParams, useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps extends IUseUtbetalingerSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilUtbetalinger: (utbetalingsperiode: IUtbetalingsperiode) => void;
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilUtbetalinger,
    personType,
    barn,
    erDød,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(personType, barn, erDød);

    const { toggles } = useFeatureToggles();

    const andreForelderErDød: boolean = personType === PersonType.AndreForelder && !!erDød;
    const periodenErAvsluttet: boolean =
        skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI || andreForelderErDød;

    const {
        fårUtbetalingNå,
        utbetalingLand,
        utbetalingFraDato,
        utbetalingTilDato,
        utbetalingTilDatoUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtbetalinger({
            fårUtbetalingNå: {
                id: UtbetalingerSpørsmålId.fårUtbetalingNå,
                svar: fårUtbetalingNå.erSynlig ? fårUtbetalingNå.verdi : null,
            },
            utbetalingLand: {
                id: UtbetalingerSpørsmålId.utbetalingLand,
                svar: utbetalingLand.verdi,
            },
            utbetalingFraDato: {
                id: UtbetalingerSpørsmålId.utbetalingFraDato,
                svar: utbetalingFraDato.verdi,
            },
            utbetalingTilDato: {
                id: UtbetalingerSpørsmålId.utbetalingTilDato,
                svar: svarForSpørsmålMedUkjent(utbetalingTilDatoUkjent, utbetalingTilDato),
            },
        });

        lukkModal();
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
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <JaNeiSpm
                    skjema={skjema}
                    felt={fårUtbetalingNå}
                    spørsmålTekstId={hentSpørsmålTekstId(UtbetalingerSpørsmålId.fårUtbetalingNå)}
                    språkValues={{ ...(barn && { barn: barn.navn }) }}
                />
            </KomponentGruppe>
            {(fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød) && (
                <KomponentGruppe inline dynamisk>
                    <LandDropdown
                        felt={utbetalingLand}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={hentSpørsmålTekstId(UtbetalingerSpørsmålId.utbetalingLand)}
                                values={{ ...(barn && { barn: barn.navn }) }}
                            />
                        }
                        dynamisk
                    />

                    {toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO] ? (
                        <>
                            <MånedÅrVelger
                                label={
                                    <SpråkTekst
                                        id={hentSpørsmålTekstId(
                                            UtbetalingerSpørsmålId.utbetalingFraDato
                                        )}
                                    />
                                }
                                senesteValgbareMåned={
                                    periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                                }
                                felt={utbetalingFraDato}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                dagIMåneden={DagIMåneden.FØRSTE_DAG}
                                kanIkkeVæreFremtid={true}
                            />

                            <MånedÅrVelger
                                label={
                                    <SpråkTekst
                                        id={hentSpørsmålTekstId(
                                            UtbetalingerSpørsmålId.utbetalingTilDato
                                        )}
                                        values={{ ...(barn && { barn: barn.navn }) }}
                                    />
                                }
                                tidligsteValgbareMåned={minTilDatoForUtbetalingEllerArbeidsperiode(
                                    periodenErAvsluttet,
                                    utbetalingFraDato.verdi
                                )}
                                senesteValgbareMåned={
                                    periodenErAvsluttet ? sisteDagDenneMåneden() : undefined
                                }
                                felt={utbetalingTilDato}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                dagIMåneden={DagIMåneden.SISTE_DAG}
                                kanIkkeVæreFremtid={periodenErAvsluttet}
                                kanIkkeVæreFortid={!periodenErAvsluttet}
                                disabled={utbetalingTilDatoUkjent.verdi === ESvar.JA}
                            />
                        </>
                    ) : (
                        <>
                            <Datovelger
                                skjema={skjema}
                                felt={utbetalingFraDato}
                                label={
                                    <SpråkTekst
                                        id={hentSpørsmålTekstId(
                                            UtbetalingerSpørsmålId.utbetalingFraDato
                                        )}
                                    />
                                }
                                avgrensMaxDato={
                                    periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                                }
                            />

                            <Datovelger
                                skjema={skjema}
                                felt={utbetalingTilDato}
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
                                    utbetalingFraDato.verdi
                                )}
                                disabled={utbetalingTilDatoUkjent.verdi === ESvar.JA}
                            />
                        </>
                    )}

                    <SkjemaCheckbox
                        labelSpråkTekstId={hentSpørsmålTekstId(
                            UtbetalingerSpørsmålId.utbetalingTilDatoVetIkke
                        )}
                        felt={utbetalingTilDatoUkjent}
                    />
                </KomponentGruppe>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
