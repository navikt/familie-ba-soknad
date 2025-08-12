import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { SvalbardOppholdSpørsmålId } from './spørsmål';
import {
    useSvalbardOppholdSkjema,
    useSvalbardOppholdSkjemaProps,
} from './useSvalbardOppholdSkjema';

interface SvalbardOppholdModalProps extends useSvalbardOppholdSkjemaProps {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilSvalbardOppholdPeriode: (periode: ISvalbardOppholdPeriode) => void;
    forklaring?: string;
}

export const SvalbardOppholdModal: React.FC<SvalbardOppholdModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilSvalbardOppholdPeriode,
    forklaring = undefined,
    personType,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useSvalbardOppholdSkjema({ personType });

    const teksterForModal: ISvalbardOppholdTekstinnhold =
        tekster()[ESanitySteg.FELLES].modaler.svalbardOpphold[personType];

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
            <MånedÅrVelger
                felt={skjema.felter.fraDatoSvalbardOpphold}
                label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                // tidligsteValgbareMåned={dagensDato()} // FIXME:
                dagIMåneden={DagIMåneden.FØRSTE_DAG} // FIXME:
            />
            <div>
                <MånedÅrVelger
                    felt={skjema.felter.tilDatoSvalbardOpphold}
                    label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                    // senesteValgbareMåned={dagensDato()} // FIXME:
                    disabled={skjema.felter.tilDatoSvalbardOppholdUkjent.verdi === ESvar.JA}
                    dagIMåneden={DagIMåneden.SISTE_DAG} // FIXME:
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
