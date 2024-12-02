import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { IArbeidsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IArbeidsperiodeTekstinnhold } from '../../../typer/sanity/modaler/arbeidsperiode';
import { dagensDato, gårsdagensDato } from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForUtbetalingEllerArbeidsperiode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInput } from '../SkjemaFeltInput/SkjemaFeltInput';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

import { arbeidsperiodeModalSpørsmålSpråkId } from './arbeidsperiodeSpråkUtils';
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
    const { tekster } = useApp();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useArbeidsperiodeSkjema(gjelderUtlandet, personType, erDød);

    const teksterForModal: IArbeidsperiodeTekstinnhold =
        tekster().FELLES.modaler.arbeidsperiode[personType];

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
                svar: arbeidsperiodeAvsluttet.erSynlig
                    ? (arbeidsperiodeAvsluttet.verdi as ESvar)
                    : null,
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
        arbeidsperiodeAvsluttet.verdi === ESvar.JA ||
        (personType === PersonType.AndreForelder && erDød);

    const hentSpørsmålTekstId = arbeidsperiodeModalSpørsmålSpråkId(personType, periodenErAvsluttet);

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
                    spørsmålTekstId={hentSpørsmålTekstId(
                        ArbeidsperiodeSpørsmålsId.arbeidsperiodeAvsluttet
                    )}
                />
            )}
            {arbeidsperiodeLand.erSynlig && (
                <LandDropdown
                    felt={skjema.felter.arbeidsperiodeLand}
                    skjema={skjema}
                    label={
                        <SpråkTekst
                            id={hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsperiodeLand)}
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
                    labelSpråkTekstId={hentSpørsmålTekstId(ArbeidsperiodeSpørsmålsId.arbeidsgiver)}
                />
            )}
            {fraDatoArbeidsperiode.erSynlig && (
                <Datovelger
                    felt={skjema.felter.fraDatoArbeidsperiode}
                    skjema={skjema}
                    label={
                        <SpråkTekst
                            id={hentSpørsmålTekstId(
                                ArbeidsperiodeSpørsmålsId.fraDatoArbeidsperiode
                            )}
                        />
                    }
                    avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                />
            )}
            {tilDatoArbeidsperiode.erSynlig && (
                <div>
                    <Datovelger
                        felt={skjema.felter.tilDatoArbeidsperiode}
                        skjema={skjema}
                        label={
                            <SpråkTekst
                                id={hentSpørsmålTekstId(
                                    ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiode
                                )}
                            />
                        }
                        avgrensMinDato={minTilDatoForUtbetalingEllerArbeidsperiode(
                            periodenErAvsluttet,
                            skjema.felter.fraDatoArbeidsperiode.verdi
                        )}
                        avgrensMaxDato={periodenErAvsluttet ? dagensDato() : undefined}
                        disabled={skjema.felter.tilDatoArbeidsperiodeUkjent.verdi === ESvar.JA}
                    />
                    <SkjemaCheckbox
                        felt={skjema.felter.tilDatoArbeidsperiodeUkjent}
                        labelSpråkTekstId={hentSpørsmålTekstId(
                            ArbeidsperiodeSpørsmålsId.tilDatoArbeidsperiodeVetIkke
                        )}
                    />
                </div>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
