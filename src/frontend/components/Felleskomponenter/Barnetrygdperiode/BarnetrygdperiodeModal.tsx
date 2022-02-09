import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IBarnetrygdsperiode } from '../../../typer/perioder';
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
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { BarnetrygdperiodeSpørsmålId, barnetrygdperiodeSpørsmålSpråkId } from './spørsmål';
import { useBarnetrygdperiodeSkjema } from './useBarnetrygdperiodeSkjema';

interface Props extends ReturnType<typeof useModal> {
    onLeggTilBarnetrygdsperiode: (periode: IBarnetrygdsperiode) => void;
}

export const BarnetrygdperiodeModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilBarnetrygdsperiode,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnetrygdperiodeSkjema();

    const {
        mottarEøsBarnetrygdNå,
        barnetrygdsland,
        fraDatoBarnetrygdperiode,
        tilDatoBarnetrygdperiode,
        månedligBeløp,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilBarnetrygdsperiode({
            mottarEøsBarnetrygdNå: {
                id: BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå,
                svar: mottarEøsBarnetrygdNå.verdi as ESvar,
            },
            barnetrygdsland: {
                id: BarnetrygdperiodeSpørsmålId.barnetrygdsland,
                svar: barnetrygdsland.verdi,
            },
            fraDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode,
                svar: fraDatoBarnetrygdperiode.verdi,
            },
            ...(tilDatoBarnetrygdperiode.erSynlig && {
                tilDatoBarnetrygdperiode: {
                    id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode,
                    svar: tilDatoBarnetrygdperiode.verdi,
                },
            }),

            månedligBeløp: {
                id: BarnetrygdperiodeSpørsmålId.månedligBeløp,
                svar: månedligBeløp.verdi,
            },
        });

        toggleModal();
        nullstillSkjema();
    };

    const tilbakeITid = mottarEøsBarnetrygdNå.verdi === ESvar.NEI;
    const eøsBarnetrygdSpørsmålSpråkTekst = (spørsmålsId: BarnetrygdperiodeSpørsmålId) => (
        <SpråkTekst id={barnetrygdperiodeSpørsmålSpråkId(tilbakeITid)[spørsmålsId]} />
    );
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
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarEøsBarnetrygdNå}
                    spørsmålTekstId={
                        barnetrygdperiodeSpørsmålSpråkId(tilbakeITid)[
                            BarnetrygdperiodeSpørsmålId.mottarEøsBarnetrygdNå
                        ]
                    }
                />

                {barnetrygdsland.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.barnetrygdsland}
                        skjema={skjema}
                        label={eøsBarnetrygdSpørsmålSpråkTekst(
                            BarnetrygdperiodeSpørsmålId.barnetrygdsland
                        )}
                        dynamisk
                    />
                )}
                {fraDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.fraDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={eøsBarnetrygdSpørsmålSpråkTekst(
                            BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode
                        )}
                        calendarPosition={'fullscreen'}
                        avgrensMaxDato={tilbakeITid ? gårsdagensDato() : dagensDato()}
                    />
                )}
                {tilDatoBarnetrygdperiode.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.tilDatoBarnetrygdperiode}
                        skjema={skjema}
                        label={eøsBarnetrygdSpørsmålSpråkTekst(
                            BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode
                        )}
                        avgrensMinDato={skjema.felter.fraDatoBarnetrygdperiode.verdi}
                        avgrensMaxDato={dagensDato()}
                        calendarPosition={'fullscreen'}
                    />
                )}
                {månedligBeløp.erSynlig && (
                    <SkjemaFeltInput
                        felt={skjema.felter.månedligBeløp}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        labelSpråkTekstId={
                            barnetrygdperiodeSpørsmålSpråkId(tilbakeITid)[
                                BarnetrygdperiodeSpørsmålId.månedligBeløp
                            ]
                        }
                        //TODO fikse label
                        label={'Ikke i språkfil enda'}
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
