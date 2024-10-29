import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import TekstBlock from '../Sanity/TekstBlock';
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
    const { tekster } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        usePensjonSkjema({
            gjelderUtland,
            personType,
            barn,
            erDød,
        });

    const teksterForModal: IPensjonsperiodeTekstinnhold =
        tekster().FELLES.modaler.pensjonsperiode[personType];

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

    const periodenErAvsluttet =
        mottarPensjonNå.verdi === ESvar.NEI || (personType === PersonType.AndreForelder && !!erDød);

    const hentSpørsmålTekstId = pensjonsperiodeModalSpørsmålSpråkId(
        personType,
        periodenErAvsluttet
    );

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForModal.tittel}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForModal.leggTilKnapp} />}
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
