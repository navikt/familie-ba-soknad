import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { dagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import {
    harTilhørendeFomFelt,
    hentMaxAvgrensningPåFraDato,
    hentMaxAvgrensningPåTilDato,
    hentMinAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import { OmBarnetSpørsmålsId, omBarnetSpørsmålSpråkId } from '../../SøknadsSteg/OmBarnet/spørsmål';
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
    gjelderUtlandet: boolean;
    gjelderAndreForelder: boolean;
}

export const ArbeidsperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    gjelderUtlandet = false,
    gjelderAndreForelder = false,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, gjelderAndreForelder);

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={arbeidsperiodeTittelSpråkId(gjelderUtlandet)}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilutenlands.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {skjema.felter.arbeidsperiodeAvsluttet.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.arbeidsperiodeAvsluttet}
                        spørsmålTekstId={'felles.erarbeidsperiodenavsluttet.spm'}
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
                        avgrensMinDato={skjema.felter.fraDatoArbeidsperiode.verdi}
                        avgrensMaxDato={dagensDato()}
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
