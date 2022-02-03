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
import { useBarnetrygdperiodeSkjema } from './useBarnetrygdperiodeSkjema';

interface Props extends ReturnType<typeof useModal> {
    onLeggTilBarnetrygdperiode: (periode: IBarnetrygdperiode) => void;
    gjelderUtlandet: boolean;
}

export const BarnetrygdperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilBarnetrygdperiode,
    gjelderUtlandet = false,
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
        onLeggTilBarnetrygdperiode({});
        console.log('barnetrygdperioder');
        toggleModal();
        nullstillSkjema();
    };

    const modalTittel = gjelderUtlandet ? 'TODO' : 'fTODO ';

    const tilbakeITid = mottarBarnetrygdNå.verdi === ESvar.JA;

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
                {mottarBarnetrygdNå.erSynlig && (
                    <JaNeiSpm
                        skjema={skjema}
                        felt={skjema.felter.mottarBarnetrygdNå}
                        spørsmålTekstId={'modal.barnetrygdnå.spm'}
                    />
                )}
                {barnetrygdsland.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.barnetrygdsland}
                        skjema={skjema}
                        label={'todo'}
                        dynamisk
                    />
                )}
                {fraDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={'todo'}
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
                        label={'todd'}
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
                        labelSpråkTekstId={'todod'}
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
