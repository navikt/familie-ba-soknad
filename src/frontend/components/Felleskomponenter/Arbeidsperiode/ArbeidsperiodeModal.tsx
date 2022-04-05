import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode } from '../../../typer/perioder';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { arbeidsperiodeSpørsmålSpråkId, ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';
import { minAvgrensningArbeidsperiodeTilDato } from './utils';

interface Props extends ReturnType<typeof useModal>, IUseArbeidsperiodeSkjemaParams {
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
    andreForelderData?: { erDød: boolean };
}

export const ArbeidsperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    andreForelderData,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, andreForelderData);

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        tilDatoArbeidsperiodeUkjent,
    } = skjema.felter;

    const gjelderAndreForelder = !!andreForelderData;
    const erAndreForelderDød = !!andreForelderData?.erDød;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilArbeidsperiode({
            ...(arbeidsperiodeAvsluttet.erSynlig && {
                arbeidsperiodeAvsluttet: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
                    svar: arbeidsperiodeAvsluttet.verdi as ESvar,
                },
            }),
            ...(skjema.felter.arbeidsperiodeLand.erSynlig && {
                arbeidsperiodeland: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                    svar: arbeidsperiodeLand.verdi,
                },
            }),
            ...(arbeidsgiver.erSynlig && {
                arbeidsgiver: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsgiver,
                    svar: trimWhiteSpace(arbeidsgiver.verdi),
                },
            }),
            ...(fraDatoArbeidsperiode.erSynlig && {
                fraDatoArbeidsperiode: {
                    id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode,
                    svar: fraDatoArbeidsperiode.verdi,
                },
            }),
            ...(tilDatoArbeidsperiode.erSynlig && {
                tilDatoArbeidsperiode: {
                    id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
                    svar: svarForSpørsmålMedUkjent(
                        tilDatoArbeidsperiodeUkjent,
                        tilDatoArbeidsperiode
                    ),
                },
            }),
        });

        toggleModal();
        nullstillSkjema();
    };

    const modalTittel = gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

    const tilbakeITid = arbeidsperiodeAvsluttet.verdi === ESvar.JA || erAndreForelderDød;

    const hentSpørsmålTekstId = arbeidsperiodeSpørsmålSpråkId(gjelderAndreForelder, tilbakeITid);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilarbeidsperiode.knapp'}
            toggleModal={toggleModal}
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
                {fraDatoArbeidsperiode.erSynlig && (
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
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={tilbakeITid ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {tilDatoArbeidsperiode.erSynlig && (
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
                            avgrensMinDato={minAvgrensningArbeidsperiodeTilDato(
                                tilbakeITid,
                                skjema.felter.fraDatoArbeidsperiode
                            )}
                            avgrensMaxDato={tilbakeITid ? dagensDato() : undefined}
                            disabled={skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA}
                            calendarPosition={'fullscreen'}
                        />

                        <SkjemaCheckbox
                            felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                            labelSpråkTekstId={hentSpørsmålTekstId(
                                ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                            )}
                        />
                    </>
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
