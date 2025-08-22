import React from 'react';

import { Alert, ReadMore } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { ISvalbardOppholdPeriode } from '../../../typer/perioder';
import { ISvalbardOppholdTekstinnhold } from '../../../typer/sanity/modaler/svalbardOpphold';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { dagensDato } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForPeriode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
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

    const { fraDatoSvalbardOpphold, tilDatoSvalbardOpphold, tilDatoSvalbardOppholdUkjent } =
        skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilSvalbardOppholdPeriode({
            fraDatoSvalbardOpphold: {
                id: SvalbardOppholdSpørsmålId.fraDatoSvalbardOpphold,
                svar: fraDatoSvalbardOpphold.erSynlig ? fraDatoSvalbardOpphold.verdi : '',
            },
            tilDatoSvalbardOpphold: {
                id: SvalbardOppholdSpørsmålId.tilDatoSvalbardOpphold,
                svar: tilDatoSvalbardOpphold.erSynlig
                    ? svarForSpørsmålMedUkjent(tilDatoSvalbardOppholdUkjent, tilDatoSvalbardOpphold)
                    : '',
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
            <ReadMore header={<TekstBlock block={teksterForModal.lesMerTittel} />}>
                <TekstBlock block={teksterForModal.lesMerInnhold} />
            </ReadMore>
            <MånedÅrVelger
                felt={skjema.felter.fraDatoSvalbardOpphold}
                label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                senesteValgbareMåned={dagensDato()}
                visFeilmeldinger={skjema.visFeilmeldinger}
                dagIMåneden={DagIMåneden.FØRSTE_DAG}
            />
            <div>
                <MånedÅrVelger
                    felt={skjema.felter.tilDatoSvalbardOpphold}
                    label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                    tidligsteValgbareMåned={minTilDatoForPeriode(
                        false,
                        skjema.felter.fraDatoSvalbardOpphold.verdi
                    )}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    dagIMåneden={DagIMåneden.SISTE_DAG}
                    disabled={skjema.felter.tilDatoSvalbardOppholdUkjent.verdi === ESvar.JA}
                />
                <SkjemaCheckboxForSanity
                    felt={skjema.felter.tilDatoSvalbardOppholdUkjent}
                    label={plainTekst(teksterForModal.sluttdato.checkboxLabel)}
                />
            </div>
            <Alert variant="warning">
                <TekstBlock block={teksterForModal.meldFraOmFlyttingAlert} />
            </Alert>
            <ReadMore header={<TekstBlock block={teksterForModal.fremtidigeOppholdTittel} />}>
                <TekstBlock block={teksterForModal.fremtidigeOppholdInnhold} />
            </ReadMore>
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
