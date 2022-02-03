import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IBarnetrygdperiode } from '../../../typer/perioder';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import { BarnetrygdperiodeSpørsmålsId, barnetrygdperiodeSøkerSpørsmålSpråkId } from './spørsmål';
import { useBarnetrygdperiodeSkjema } from './useBarnetrygdperiodeSkjema';

interface Props extends ReturnType<typeof useModal> {
    onLeggTilBarnetrygdperiode: (periode: IBarnetrygdperiode) => void;
    gjelderUtlandet: boolean;
}

export const BarnetrygdperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilBarnetrygdperiode,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnetrygdperiodeSkjema();

    const {
        mottarBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        // onLeggTilBarnetrygdperiode({});
        toggleModal();
        nullstillSkjema();
    };

    const tilbakeITid = mottarBarnetrygdNå.verdi === ESvar.JA;

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'modal.trygdandreperioder.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'modal.trygdandreperioder.tittel'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                {mottarBarnetrygdNå.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.mottarBarnetrygdNå}
                        spørsmålTekstId={
                            barnetrygdperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                BarnetrygdperiodeSpørsmålsId.mottarBarnetrygdNå
                            ]
                        }
                    />
                )}
                {barnetrygdsland.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.barnetrygdsland}
                        skjema={skjema}
                        label={
                            barnetrygdperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                BarnetrygdperiodeSpørsmålsId.barnetrygdsland
                            ]
                        }
                        dynamisk
                    />
                )}
                {fraDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={
                            barnetrygdperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                BarnetrygdperiodeSpørsmålsId.fraDatoBarnetrygdperiode
                            ]
                        }
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={
                            skjema.felter.mottarBarnetrygdNå.verdi === ESvar.JA
                                ? gårsdagensDato()
                                : dagensDato()
                        }
                    />
                )}
                {tilDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.tilDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={
                            barnetrygdperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                BarnetrygdperiodeSpørsmålsId.tilDatoBarnetrygdperiode
                            ]
                        }
                        avgrensMinDato={
                            skjema.felter.mottarBarnetrygdNå.verdi === ESvar.JA
                                ? skjema.felter.mottarBarnetrygdNå.verdi
                                : gårsdagensDato()
                        }
                        avgrensMaxDato={
                            skjema.felter.mottarBarnetrygdNå.verdi === ESvar.JA
                                ? dagensDato()
                                : undefined
                        }
                        calendarPosition={'fullscreen'}
                    />
                )}
                {månedligBeløp.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.månedligBeløp}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            barnetrygdperiodeSøkerSpørsmålSpråkId(tilbakeITid)[
                                BarnetrygdperiodeSpørsmålsId.månedligBeløp
                            ]
                        }
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
