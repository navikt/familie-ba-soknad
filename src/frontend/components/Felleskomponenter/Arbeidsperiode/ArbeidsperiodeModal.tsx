import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagensDato, gårsdagensDato, sisteDagDenneMåneden } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { arbeidsperiodeModalSpørsmålSpråkId } from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface ArbeidsperiodeModalProps extends IUseArbeidsperiodeSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
}

export const ArbeidsperiodeModal: React.FC<ArbeidsperiodeModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    personType,
    erDød = false,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, personType, erDød);

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        tilDatoArbeidsperiodeUkjent,
    } = skjema.felter;

    const { toggles } = useFeatureToggles();

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilArbeidsperiode({
            arbeidsperiodeAvsluttet: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
                svar: arbeidsperiodeAvsluttet.erSynlig
                    ? (arbeidsperiodeAvsluttet.verdi as ESvar)
                    : null,
            },
            arbeidsperiodeland: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                svar: arbeidsperiodeLand.erSynlig ? arbeidsperiodeLand.verdi : '',
            },
            arbeidsgiver: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsgiver,
                svar: arbeidsgiver.erSynlig ? trimWhiteSpace(arbeidsgiver.verdi) : '',
            },
            fraDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode,
                svar: fraDatoArbeidsperiode.erSynlig ? fraDatoArbeidsperiode.verdi : '',
            },
            tilDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
                svar: tilDatoArbeidsperiode.erSynlig
                    ? svarForSpørsmålMedUkjent(tilDatoArbeidsperiodeUkjent, tilDatoArbeidsperiode)
                    : '',
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    const modalTittel = gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet.verdi === ESvar.JA ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = arbeidsperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilarbeidsperiode.knapp'}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {arbeidsperiodeAvsluttet.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.arbeidsperiodeAvsluttet}
                        spørsmålTekstId={hentSpørsmålTekstId(
                            ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                        )}
                    />
                )}
                {arbeidsperiodeLand.erSynlig && (
                    <KomponentGruppe inline>
                        <LandDropdown
                            felt={skjema.felter.arbeidsperiodeLand}
                            skjema={skjema}
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand
                                    )}
                                />
                            }
                            dynamisk
                            ekskluderNorge
                        />
                    </KomponentGruppe>
                )}
                {arbeidsgiver.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.arbeidsgiver}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={hentSpørsmålTekstId(
                            ArbeidsperiodeSpørsmålsId.arbeidsgiver
                        )}
                    />
                )}
                {fraDatoArbeidsperiode.erSynlig &&
                    (toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO] ? (
                        <MånedÅrVelger
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode
                                    )}
                                />
                            }
                            senesteValgbareMåned={
                                periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                            }
                            felt={skjema.felter.fraDatoArbeidsperiode}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.FØRSTE_DAG}
                            kanIkkeVæreFremtid={true}
                        />
                    ) : (
                        <Datovelger
                            felt={skjema.felter.fraDatoArbeidsperiode}
                            skjema={skjema}
                            label={
                                <SpråkTekst
                                    id={hentSpørsmålTekstId(
                                        ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode
                                    )}
                                />
                            }
                            avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                        />
                    ))}
                {tilDatoArbeidsperiode.erSynlig &&
                    (toggles[EFeatureToggle.BE_OM_MÅNED_IKKE_DATO] ? (
                        <>
                            <MånedÅrVelger
                                label={
                                    <SpråkTekst
                                        id={hentSpørsmålTekstId(
                                            ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode
                                        )}
                                    />
                                }
                                tidligsteValgbareMåned={minTilDatoForUtbetalingEllerArbeidsperiode(
                                    periodenErAvsluttet,
                                    skjema.felter.fraDatoArbeidsperiode.verdi
                                )}
                                senesteValgbareMåned={
                                    periodenErAvsluttet ? sisteDagDenneMåneden() : undefined
                                }
                                felt={skjema.felter.tilDatoArbeidsperiode}
                                visFeilmeldinger={skjema.visFeilmeldinger}
                                dagIMåneden={DagIMåneden.SISTE_DAG}
                                kanIkkeVæreFremtid={periodenErAvsluttet}
                                kanIkkeVæreFortid={!periodenErAvsluttet}
                            />

                            <SkjemaCheckbox
                                felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                                labelSpråkTekstId={hentSpørsmålTekstId(
                                    ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                                )}
                            />
                        </>
                    ) : (
                        <>
                            <Datovelger
                                felt={skjema.felter.tilDatoArbeidsperiode}
                                skjema={skjema}
                                label={
                                    <SpråkTekst
                                        id={hentSpørsmålTekstId(
                                            ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode
                                        )}
                                    />
                                }
                                avgrensMinDato={minTilDatoForUtbetalingEllerArbeidsperiode(
                                    periodenErAvsluttet,
                                    skjema.felter.fraDatoArbeidsperiode.verdi
                                )}
                                avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                                disabled={
                                    skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA
                                }
                            />

                            <SkjemaCheckbox
                                felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                                labelSpråkTekstId={hentSpørsmålTekstId(
                                    ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                                )}
                            />
                        </>
                    ))}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
