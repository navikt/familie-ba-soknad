import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IArbeidsperiode } from '../../../typer/person';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
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
import {
    arbeidsperiodeAndreForelderSpørsmålSpråkId,
    ArbeidsperiodeSpørsmålsId,
    arbeidsperiodeSøkerSpørsmålSpråkId,
} from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface Props extends ReturnType<typeof useModal>, IUseArbeidsperiodeSkjemaParams {
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
    andreForelderData?: { erDød: boolean };
}

export const ArbeidsperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    //onLeggTilArbeidsperiode,
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
    } = skjema.felter;

    const gjelderAndreForelder = !!andreForelderData;
    const erAndreForelderDød = !!andreForelderData?.erDød;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
            //TODO legg til denne når vi skal sette søknadsdata
            /* onLeggTilArbeidsperiode({
            ...(arbeidsperiodeAvsluttet.erSynlig && {
                arbeidsperiodeAvsluttet: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
                    svar: arbeidsperiodeAvsluttet.verdi as ESvar,
                },
            }),
            arbeidsperiodeland: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                svar: arbeidsperiodeLand.verdi,
            },
            ...(arbeidsgiver.erSynlig && {
                arbeidsgiver: {
                    id: ArbeidsperiodeSpørsmålsId.arbeidsgiver,
                    svar: arbeidsgiver.verdi,
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
                    svar: tilDatoArbeidsperiode.verdi,
                },
            }),*/
        }

        toggleModal();
        nullstillSkjema();
    };
    const modalTittel = gjelderUtlandet
        ? 'felles.flerearbeidsperioderutland.tittel'
        : 'felles.flerearbeidsperiodernorge.tittel';

    const tilbakeITid = arbeidsperiodeAvsluttet.verdi === ESvar.JA;

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
                        spørsmålTekstId={
                            gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                      ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                                  ]
                        }
                    />
                )}
                {arbeidsperiodeLand.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.arbeidsperiodeLand}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                              tilbakeITid,
                                              erAndreForelderDød
                                          )[ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand]
                                        : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                              ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand
                                          ]
                                }
                            />
                        }
                        dynamisk
                    />
                )}
                {arbeidsgiver.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.arbeidsgiver}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            gjelderAndreForelder
                                ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                      tilbakeITid,
                                      erAndreForelderDød
                                  )[ArbeidsperiodeSpørsmålsId.arbeidsgiver]
                                : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                      ArbeidsperiodeSpørsmålsId.arbeidsgiver
                                  ]
                        }
                    />
                )}
                {fraDatoArbeidsperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoArbeidsperiode}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={
                                    gjelderAndreForelder
                                        ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                              tilbakeITid,
                                              erAndreForelderDød
                                          )[ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode]
                                        : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                              ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode
                                          ]
                                }
                            />
                        }
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={
                            skjema.felter.arbeidsperiodeAvsluttet.verdi === ESvar.JA
                                ? gårsdagensDato()
                                : dagensDato()
                        }
                    />
                )}
                {tilDatoArbeidsperiode.erSynlig && (
                    <>
                        <Datovelger
                            felt={skjema.felter.tilDatoArbeidsperiode}
                            skjema={skjema}
                            label={
                                <SpråkTekst
                                    id={
                                        gjelderAndreForelder
                                            ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                                  tilbakeITid,
                                                  erAndreForelderDød
                                              )[ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode]
                                            : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                                  ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode
                                              ]
                                    }
                                />
                            }
                            avgrensMinDato={
                                skjema.felter.arbeidsperiodeAvsluttet.verdi === ESvar.JA
                                    ? skjema.felter.fraDatoArbeidsperiode.verdi
                                    : gårsdagensDato()
                            }
                            avgrensMaxDato={
                                skjema.felter.arbeidsperiodeAvsluttet.verdi === ESvar.JA
                                    ? dagensDato()
                                    : undefined
                            }
                            disabled={skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA}
                            calendarPosition={'fullscreen'}
                        />

                        <SkjemaCheckbox
                            felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                            labelSpråkTekstId={
                                gjelderAndreForelder
                                    ? arbeidsperiodeAndreForelderSpørsmålSpråkId(
                                          tilbakeITid,
                                          erAndreForelderDød
                                      )[ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke]
                                    : arbeidsperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                          ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                                      ]
                            }
                        />
                    </>
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
