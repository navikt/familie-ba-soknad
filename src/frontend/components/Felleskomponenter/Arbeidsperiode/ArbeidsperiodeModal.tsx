import React from 'react';

import { useIntl } from 'react-intl';

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
    arbeidslandLabelSpråkId,
    arbeidsperiodeTittelSpråkId,
    tilDatoSpørsmålstekst,
} from './arbeidsperiodeSpråkUtils';
import { ArbeidsperiodeSpørsmålsId, arbeidsperiodeSpørsmålSpråkId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface Props extends ReturnType<typeof useModal>, IUseArbeidsperiodeSkjemaParams {
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
    gjelderAndreForelder: boolean;
    erAndreForelderDød?: boolean;
}

export const ArbeidsperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    gjelderAndreForelder = false,
    erAndreForelderDød,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, gjelderAndreForelder, erAndreForelderDød);

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
    } = skjema.felter;

    const intl = useIntl();

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
            }),
        });

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={arbeidsperiodeTittelSpråkId(gjelderUtlandet)}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilarbeidsperiode.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {skjema.felter.arbeidsperiodeAvsluttet.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.arbeidsperiodeAvsluttet}
                        spørsmålTekstId={
                            arbeidsperiodeSpørsmålSpråkId[
                                ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                            ]
                        }
                    />
                )}
                {skjema.felter.arbeidsperiodeLand.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.arbeidsperiodeLand}
                        skjema={skjema}
                        label={
                            arbeidslandLabelSpråkId(
                                gjelderAndreForelder,
                                skjema.felter.arbeidsperiodeAvsluttet.verdi
                            ) && (
                                <SpråkTekst
                                    id={arbeidslandLabelSpråkId(
                                        gjelderAndreForelder,
                                        skjema.felter.arbeidsperiodeAvsluttet.verdi
                                    )}
                                />
                            )
                        }
                        dynamisk
                    />
                )}
                {skjema.felter.arbeidsgiver.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.arbeidsgiver}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            arbeidsperiodeSpørsmålSpråkId[ArbeidsperiodeSpørsmålsId.arbeidsgiver]
                        }
                    />
                )}
                {skjema.felter.fraDatoArbeidsperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoArbeidsperiode}
                        skjema={skjema}
                        label={<SpråkTekst id={'felles.nårbegyntearbeidsperiode.spm'} />}
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={
                            skjema.felter.arbeidsperiodeAvsluttet.verdi === ESvar.JA
                                ? gårsdagensDato()
                                : dagensDato()
                        }
                    />
                )}
                {skjema.felter.tilDatoArbeidsperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.tilDatoArbeidsperiode}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={tilDatoSpørsmålstekst(
                                    skjema.felter.arbeidsperiodeAvsluttet.verdi
                                )}
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
                )}
                {skjema.felter.tilDatoArbeidsperiodeUkjent.erSynlig && (
                    <SkjemaCheckbox
                        felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                        labelSpråkTekstId={'felles.nåravsluttesarbeidsperiode.sjekkboks'}
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
