import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { dagensDato, gårsdagensDato, sisteDagDenneMåneden } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForPeriode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { ArbeidsperiodeSpørsmålsId } from './spørsmål';
import { IUseArbeidsperiodeSkjemaParams, useArbeidsperiodeSkjema } from './useArbeidsperiodeSkjema';

interface ArbeidsperiodeModalProps extends IUseArbeidsperiodeSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilArbeidsperiode: (periode: IArbeidsperiode) => void;
    gjelderUtlandet: boolean;
    forklaring?: string;
}

export const ArbeidsperiodeModal: React.FC<ArbeidsperiodeModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilArbeidsperiode,
    gjelderUtlandet = false,
    personType,
    erDød = false,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } = useArbeidsperiodeSkjema(
        gjelderUtlandet,
        personType,
        erDød
    );

    const teksterForModal: IArbeidsperiodeTekstinnhold = tekster().FELLES.modaler.arbeidsperiode[personType];

    const {
        arbeidsperiodeAvsluttet,
        arbeidsperiodeLand,
        arbeidsgiver,
        fraDatoArbeidsperiode,
        tilDatoArbeidsperiode,
        tilDatoArbeidsperiodeUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilArbeidsperiode({
            arbeidsperiodeAvsluttet: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet,
                svar: arbeidsperiodeAvsluttet.erSynlig ? (arbeidsperiodeAvsluttet.verdi as ESvar) : null,
            },
            arbeidsperiodeland: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand,
                svar: arbeidsperiodeLand.erSynlig ? arbeidsperiodeLand.verdi : '',
            },
            arbeidsgiver: {
                id: ArbeidsperiodeSpørsmålsId.arbeidsgiver,
                svar: arbeidsgiver.erSynlig ? trimWhiteSpace(arbeidsgiver.verdi) : '',
            },
            fraDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode,
                svar: fraDatoArbeidsperiode.erSynlig ? fraDatoArbeidsperiode.verdi : '',
            },
            tilDatoArbeidsperiode: {
                id: ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode,
                svar: tilDatoArbeidsperiode.erSynlig
                    ? svarForSpørsmålMedUkjent(tilDatoArbeidsperiodeUkjent, tilDatoArbeidsperiode)
                    : '',
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        arbeidsperiodeAvsluttet.verdi === ESvar.JA || (personType === PersonType.AndreForelder && erDød);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForModal.tittel}
            flettefelter={{ gjelderUtland: gjelderUtlandet }}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForModal.leggTilKnapp} />}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            {arbeidsperiodeAvsluttet.erSynlig && (
                <JaNeiSpm
                    skjema={skjema}
                    felt={skjema.felter.arbeidsperiodeAvsluttet}
                    spørsmålDokument={teksterForModal.arbeidsperiodenAvsluttet}
                />
            )}
            {arbeidsperiodeLand.erSynlig && (
                <LandDropdown
                    felt={skjema.felter.arbeidsperiodeLand}
                    skjema={skjema}
                    label={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.hvilketLandFortid.sporsmal
                                    : teksterForModal.hvilketLandNaatid.sporsmal
                            }
                        />
                    }
                    dynamisk
                    ekskluderNorge
                />
            )}
            {arbeidsgiver.erSynlig && (
                <SkjemaFeltInput
                    felt={skjema.felter.arbeidsgiver}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={<TekstBlock block={teksterForModal.arbeidsgiver.sporsmal} />}
                />
            )}
            {fraDatoArbeidsperiode.erSynlig && (
                <MånedÅrVelger
                    label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                    senesteValgbareMåned={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                    felt={skjema.felter.fraDatoArbeidsperiode}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    dagIMåneden={DagIMåneden.FØRSTE_DAG}
                    kanIkkeVæreFremtid={true}
                />
            )}
            {tilDatoArbeidsperiode.erSynlig && (
                <div>
                    <MånedÅrVelger
                        label={
                            <TekstBlock
                                block={
                                    periodenErAvsluttet
                                        ? teksterForModal.sluttdatoFortid.sporsmal
                                        : teksterForModal.sluttdatoFremtid.sporsmal
                                }
                            />
                        }
                        tidligsteValgbareMåned={minTilDatoForPeriode(
                            periodenErAvsluttet,
                            skjema.felter.fraDatoArbeidsperiode.verdi
                        )}
                        senesteValgbareMåned={periodenErAvsluttet ? sisteDagDenneMåneden() : undefined}
                        felt={skjema.felter.tilDatoArbeidsperiode}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        dagIMåneden={DagIMåneden.SISTE_DAG}
                        kanIkkeVæreFremtid={periodenErAvsluttet}
                        kanIkkeVæreFortid={!periodenErAvsluttet}
                        disabled={skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA}
                    />
                    <SkjemaCheckboxForSanity
                        felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                        label={plainTekst(teksterForModal.sluttdatoFremtid.checkboxLabel)}
                    />
                </div>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
