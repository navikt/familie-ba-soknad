import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { IPensjonsperiode } from '../../../typer/person';
import { IBarnMedISøknad } from '../../../typer/søknad';
import { barnetsNavnValue } from '../../../utils/barn';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import KomponentGruppe from '../KomponentGruppe/KomponentGruppe';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    fraDatoSpmSpråkId,
    mottarNåSpmSpråkId,
    pensjonslandSpmSpråkId,
    tilDatoSpørsmålSpråkId,
} from './pensjonSpråkUtils';
import { PensjonSpørsmålId } from './spørsmål';
import { IUsePensjonSkjemaParams, usePensjonSkjema } from './usePensjonSkjema';

interface Props extends ReturnType<typeof useModal>, IUsePensjonSkjemaParams {
    onLeggTilPensjonsPeriode: (periode: IPensjonsperiode) => void;
    barn?: IBarnMedISøknad;
    utland?: boolean;
}

export const PensjonModal: React.FC<Props> = ({
    erÅpen,
    toggleModal,
    onLeggTilPensjonsPeriode,
    barn,
    utland = true,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding, eøsPensjon } =
        usePensjonSkjema({
            barn,
            utland,
        });

    const { mottarPensjonNå, pensjonTilDato, pensjonFraDato, pensjonsland } = skjema.felter;

    const intl = useIntl();

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilPensjonsPeriode({
            mottarPensjonNå: {
                id: PensjonSpørsmålId.fårPensjonNå,
                svar: mottarPensjonNå.verdi as ESvar,
            },
            pensjonFra: {
                id: PensjonSpørsmålId.fraDatoPensjon,
                svar: pensjonFraDato.verdi,
            },
            pensjonTil: {
                id: PensjonSpørsmålId.tilDatoPensjon,
                svar: pensjonTilDato.verdi,
            },
            eøs: eøsPensjon,
            pensjonsland: {
                id: PensjonSpørsmålId.pensjonsland,
                svar: pensjonsland.verdi,
            },
        });

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'felles.modal.leggtilpensjonutland.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilpensjon.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <KomponentGruppe inline>
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.mottarPensjonNå}
                    spørsmålTekstId={mottarNåSpmSpråkId(barn)}
                    språkValues={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                />
                {pensjonsland.erSynlig && (
                    <LandDropdown
                        felt={skjema.felter.pensjonsland}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={pensjonslandSpmSpråkId(
                                    mottarPensjonNå.verdi === ESvar.JA,
                                    barn
                                )}
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                            />
                        }
                        dynamisk
                    />
                )}

                {pensjonFraDato.erSynlig && (
                    <Datovelger
                        felt={skjema.felter.pensjonFraDato}
                        label={
                            <SpråkTekst
                                id={fraDatoSpmSpråkId(mottarPensjonNå.verdi === ESvar.JA, barn)}
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                            />
                        }
                        skjema={skjema}
                        avgrensMaxDato={gårsdagensDato()}
                        calendarPosition={'fullscreen'}
                    />
                )}
                {pensjonTilDato.erSynlig && (
                    <Datovelger
                        felt={pensjonTilDato}
                        label={
                            <SpråkTekst
                                id={tilDatoSpørsmålSpråkId}
                                values={{ ...(barn && { barn: barnetsNavnValue(barn, intl) }) }}
                            />
                        }
                        skjema={skjema}
                        avgrensMinDato={pensjonFraDato.verdi}
                        avgrensMaxDato={dagensDato()}
                        tilhørendeFraOgMedFelt={pensjonFraDato}
                        calendarPosition={'fullscreen'}
                        dynamisk
                    />
                )}
            </KomponentGruppe>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
