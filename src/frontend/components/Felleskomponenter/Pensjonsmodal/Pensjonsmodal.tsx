import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { pensjonsperiodeModalSpørsmålSpråkId } from './språkUtils';
import { PensjonsperiodeSpørsmålId } from './spørsmål';
import { IUsePensjonSkjemaParams, usePensjonSkjema } from './usePensjonSkjema';

interface Props extends IUsePensjonSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilPensjonsperiode: (periode: IPensjonsperiode) => void;
    gjelderUtland: boolean;
    forklaring?: string;
}

export const PensjonModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilPensjonsperiode,
    gjelderUtland,
    personType,
    barn,
    erDød,
    forklaring = undefined,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        usePensjonSkjema({
            gjelderUtland,
            personType,
            barn,
            erDød,
        });

    const { mottarPensjonNå, pensjonTilDato, pensjonFraDato, pensjonsland } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }

        onLeggTilPensjonsperiode({
            mottarPensjonNå: {
                id: PensjonsperiodeSpørsmålId.mottarPensjonNå,
                svar: mottarPensjonNå.erSynlig ? mottarPensjonNå.verdi : null,
            },
            pensjonsland: {
                id: PensjonsperiodeSpørsmålId.pensjonsland,
                svar: pensjonsland.erSynlig ? pensjonsland.verdi : '',
            },
            pensjonFra: {
                id: PensjonsperiodeSpørsmålId.fraDatoPensjon,
                svar: pensjonFraDato.erSynlig ? pensjonFraDato.verdi : '',
            },
            pensjonTil: {
                id: PensjonsperiodeSpørsmålId.tilDatoPensjon,
                svar: pensjonTilDato.erSynlig ? pensjonTilDato.verdi : '',
            },
        });

        lukkModal();
        nullstillSkjema();
    };
    const modalTittel = gjelderUtland
        ? 'felles.leggtilpensjon.utland.modal.tittel'
        : 'felles.leggtilpensjon.norge.modal.tittel';

    const periodenErAvsluttet =
        mottarPensjonNå.verdi === ESvar.NEI || (personType === PersonType.AndreForelder && !!erDød);

    const hentSpørsmålTekstId = pensjonsperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={modalTittel}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilpensjon.knapp'}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            {mottarPensjonNå.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={mottarPensjonNå}
                    spørsmålTekstId={hentSpørsmålTekstId(PensjonsperiodeSpørsmålId.mottarPensjonNå)}
                    språkValues={{ ...(barn && { barn: barn.navn }) }}
                />
            )}
            {pensjonsland.erSynlig && (
                <LandDropdown
                    felt={pensjonsland}
                    skjema={skjema}
                    label={
                        <SpråkTekst
                            id={hentSpørsmålTekstId(PensjonsperiodeSpørsmålId.pensjonsland)}
                            values={{ ...(barn && { barn: barn.navn }) }}
                        />
                    }
                    dynamisk
                    ekskluderNorge
                />
            )}
            {pensjonFraDato.erSynlig && (
                <Datovelger
                    felt={pensjonFraDato}
                    label={
                        <SpråkTekst
                            id={hentSpørsmålTekstId(PensjonsperiodeSpørsmålId.fraDatoPensjon)}
                            values={{ ...(barn && { barn: barn.navn }) }}
                        />
                    }
                    skjema={skjema}
                    avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                />
            )}
            {pensjonTilDato.erSynlig && (
                <Datovelger
                    felt={pensjonTilDato}
                    label={
                        <SpråkTekst
                            id={hentSpørsmålTekstId(PensjonsperiodeSpørsmålId.tilDatoPensjon)}
                            values={{ ...(barn && { barn: barn.navn }) }}
                        />
                    }
                    skjema={skjema}
                    avgrensMaxDato={dagensDato()}
                    tilhørendeFraOgMedFelt={pensjonFraDato}
                    dynamisk
                />
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
