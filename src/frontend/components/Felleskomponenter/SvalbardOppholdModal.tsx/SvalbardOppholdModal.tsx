import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { dagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { SvalbardOppholdSpørsmålId } from './spørsmål';
import { useSvalbardOppholdSkjema } from './useSvalbardOppholdSkjema';

interface Props {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilSvalbardOppholdPeriode: (periode: ISvalbardOppholdPeriode) => void;
    forklaring?: string;
}

export const SvalbardOppholdModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilSvalbardOppholdPeriode,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useSvalbardOppholdSkjema();

    const teksterForModal: ISvalbardOppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.svalbardOpphold;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilSvalbardOppholdPeriode({
            fraDatoSvalbardOpphold: {
                id: SvalbardOppholdSpørsmålId.fraDato,
                svar: skjema.felter.fraDatoSvalbardOpphold.verdi,
            },
            tilDatoSvalbardOpphold: {
                id: SvalbardOppholdSpørsmålId.tilDato,
                svar: skjema.felter.tilDatoSvalbardOpphold.verdi,
            },
        });

        lukkModal();
        nullstillSkjema();
    };

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
            <Datovelger
                felt={skjema.felter.fraDatoSvalbardOpphold}
                label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                skjema={skjema}
                avgrensMaxDato={dagensDato()} // FIXME:
            />
            <div>
                <Datovelger
                    felt={skjema.felter.tilDatoSvalbardOpphold}
                    label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                    skjema={skjema}
                    avgrensMinDato={dagensDato()} // FIXME:
                    avgrensMaxDato={dagensDato()} // FIXME:
                    tilhørendeFraOgMedFelt={skjema.felter.fraDatoSvalbardOpphold}
                    disabled={skjema.felter.tilDatoSvalbardOppholdUkjent.verdi === ESvar.JA}
                />
                <SkjemaCheckboxForSanity
                    felt={skjema.felter.tilDatoSvalbardOppholdUkjent}
                    label={plainTekst(teksterForModal.sluttdato.checkboxLabel)}
                />
            </div>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
