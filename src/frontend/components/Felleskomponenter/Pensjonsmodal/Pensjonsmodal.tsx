import React from 'react';

import { parseISO } from 'date-fns';

import { ESvar } from '@navikt/familie-form-elements';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IPensjonsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IPensjonsperiodeTekstinnhold } from '../../../typer/sanity/modaler/pensjonsperiode';
import { dagensDato, gårsdagensDato, sisteDagDenneMåneden } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpmForSanity from '../JaNeiSpm/JaNeiSpmForSanity';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

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
    const { toggles } = useFeatureToggles();
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
                <JaNeiSpmForSanity
                    skjema={skjema}
                    felt={mottarPensjonNå}
                    spørsmålDokument={teksterForModal.faarPensjonNaa}
                    flettefelter={{ barnetsNavn: barn?.navn }}
                />
            )}
            {pensjonsland.erSynlig && (
                <LandDropdown
                    felt={pensjonsland}
                    skjema={skjema}
                    label={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.pensjonLandFortid.sporsmal
                                    : teksterForModal.pensjonLandNaatid.sporsmal
                            }
                            flettefelter={{ barnetsNavn: barn?.navn }}
                        />
                    }
                    dynamisk
                    ekskluderNorge
                />
            )}
            {toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO] ? (
                <>
                    {pensjonFraDato.erSynlig && (
                        <MånedÅrVelger
                            label={
                                <TekstBlock
                                    block={
                                        periodenErAvsluttet
                                            ? teksterForModal.startdatoFortid.sporsmal
                                            : teksterForModal.startdatoNaatid.sporsmal
                                    }
                                    flettefelter={{
                                        barnetsNavn: barn?.navn,
                                    }}
                                />
                            }
                            senesteValgbareMåned={
                                periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                            }
                            felt={pensjonFraDato}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.FØRSTE_DAG}
                            kanIkkeVæreFremtid={true}
                        />
                    )}

                    {pensjonTilDato.erSynlig && (
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
                            tidligsteValgbareMåned={
                                pensjonFraDato.verdi !== ''
                                    ? parseISO(pensjonFraDato.verdi)
                                    : undefined
                            }
                            senesteValgbareMåned={sisteDagDenneMåneden()}
                            felt={pensjonTilDato}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.SISTE_DAG}
                            kanIkkeVæreFremtid={periodenErAvsluttet}
                            kanIkkeVæreFortid={!periodenErAvsluttet}
                        />
                    )}
                </>
            ) : (
                <>
                    {pensjonFraDato.erSynlig && (
                        <Datovelger
                            felt={pensjonFraDato}
                            label={
                                <TekstBlock
                                    block={
                                        periodenErAvsluttet
                                            ? teksterForModal.startdatoFortid.sporsmal
                                            : teksterForModal.startdatoNaatid.sporsmal
                                    }
                                    flettefelter={{
                                        barnetsNavn: barn?.navn,
                                    }}
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
                                <TekstBlock
                                    block={
                                        periodenErAvsluttet
                                            ? teksterForModal.sluttdatoFortid.sporsmal
                                            : teksterForModal.sluttdatoFremtid.sporsmal
                                    }
                                />
                            }
                            skjema={skjema}
                            avgrensMaxDato={dagensDato()}
                            tilhørendeFraOgMedFelt={pensjonFraDato}
                            dynamisk
                        />
                    )}
                </>
            )}
            {pensjonFraDato.erSynlig && (
                <Datovelger
                    felt={pensjonFraDato}
                    label={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.startdatoFortid.sporsmal
                                    : teksterForModal.startdatoNaatid.sporsmal
                            }
                            flettefelter={{
                                barnetsNavn: barn?.navn,
                            }}
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
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.sluttdatoFortid.sporsmal
                                    : teksterForModal.sluttdatoFremtid.sporsmal
                            }
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
