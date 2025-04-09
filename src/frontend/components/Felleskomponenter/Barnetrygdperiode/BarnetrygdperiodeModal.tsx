import React from 'react';

import { Alert } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';

import { useAppContext } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureTogglesContext';
import { EFeatureToggle } from '../../../typer/feature-toggles';
import { IEøsBarnetrygdsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IBarnetrygdsperiodeTekstinnhold } from '../../../typer/sanity/modaler/barnetrygdperiode';
import {
    dagenEtterDato,
    dagensDato,
    gårsdagensDato,
    sisteDagDenneMåneden,
    stringTilDate,
} from '../../../utils/dato';
import { trimWhiteSpace, visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForPeriode } from '../../../utils/perioder';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpmForSanity from '../JaNeiSpm/JaNeiSpmForSanity';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import { SkjemaFeltInputForSanity } from '../SkjemaFeltInput/SkjemaFeltInputForSanity';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { BarnetrygdperiodeSpørsmålId } from './spørsmål';
import {
    IUsePensjonsperiodeSkjemaParams,
    useBarnetrygdperiodeSkjema,
} from './useBarnetrygdperiodeSkjema';

interface Props extends IUsePensjonsperiodeSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilBarnetrygdsperiode: (periode: IEøsBarnetrygdsperiode) => void;
    forklaring?: string;
}

export const BarnetrygdperiodeModal: React.FC<Props> = ({
    erÅpen,
    lukkModal,
    onLeggTilBarnetrygdsperiode,
    barn,
    personType,
    erDød = false,
    forklaring = undefined,
}) => {
    const { toggles } = useFeatureToggles();
    const { tekster } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useBarnetrygdperiodeSkjema(personType, barn, erDød);

    const teksterForModal: IBarnetrygdsperiodeTekstinnhold =
        tekster().FELLES.modaler.barnetrygdsperiode[personType];

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
                svar: mottarEøsBarnetrygdNå.verdi,
            },
            barnetrygdsland: {
                id: BarnetrygdperiodeSpørsmålId.barnetrygdsland,
                svar: barnetrygdsland.verdi,
            },
            fraDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.fraDatoBarnetrygdperiode,
                svar: fraDatoBarnetrygdperiode.verdi,
            },
            tilDatoBarnetrygdperiode: {
                id: BarnetrygdperiodeSpørsmålId.tilDatoBarnetrygdperiode,
                svar: tilDatoBarnetrygdperiode.erSynlig ? tilDatoBarnetrygdperiode.verdi : '',
            },
            månedligBeløp: {
                id: BarnetrygdperiodeSpørsmålId.månedligBeløp,
                svar: trimWhiteSpace(månedligBeløp.verdi),
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    const periodenErAvsluttet =
        mottarEøsBarnetrygdNå.verdi === ESvar.NEI ||
        (personType === PersonType.AndreForelder && erDød);

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
            <JaNeiSpmForSanity
                skjema={skjema}
                felt={skjema.felter.mottarEøsBarnetrygdNå}
                spørsmålDokument={teksterForModal.mottarBarnetrygdNa}
                flettefelter={{ barnetsNavn: barn.navn }}
            />
            {barnetrygdsland.erSynlig && (
                <LandDropdown
                    felt={skjema.felter.barnetrygdsland}
                    skjema={skjema}
                    label={
                        <TekstBlock
                            block={
                                periodenErAvsluttet
                                    ? teksterForModal.barnetrygdLandFortid.sporsmal
                                    : teksterForModal.barnetrygdLandNatid.sporsmal
                            }
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                    kunEøs={true}
                    dynamisk
                    ekskluderNorge
                />
            )}
            {toggles[EFeatureToggle.SPOR_OM_MANED_IKKE_DATO] ? (
                <>
                    {fraDatoBarnetrygdperiode.erSynlig && (
                        <MånedÅrVelger
                            felt={skjema.felter.fraDatoBarnetrygdperiode}
                            label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                            senesteValgbareMåned={
                                periodenErAvsluttet ? gårsdagensDato() : dagensDato()
                            }
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.FØRSTE_DAG}
                            kanIkkeVæreFremtid={true}
                        />
                    )}
                    {tilDatoBarnetrygdperiode.erSynlig && (
                        <MånedÅrVelger
                            felt={skjema.felter.tilDatoBarnetrygdperiode}
                            label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                            tidligsteValgbareMåned={minTilDatoForPeriode(
                                periodenErAvsluttet,
                                skjema.felter.fraDatoBarnetrygdperiode.verdi
                            )}
                            senesteValgbareMåned={
                                periodenErAvsluttet ? sisteDagDenneMåneden() : undefined
                            }
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.SISTE_DAG}
                            kanIkkeVæreFremtid={periodenErAvsluttet}
                            kanIkkeVæreFortid={!periodenErAvsluttet}
                        />
                    )}
                </>
            ) : (
                <>
                    {fraDatoBarnetrygdperiode.erSynlig && (
                        <Datovelger
                            felt={skjema.felter.fraDatoBarnetrygdperiode}
                            skjema={skjema}
                            label={<TekstBlock block={teksterForModal.startdato.sporsmal} />}
                            avgrensMaxDato={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                        />
                    )}
                    {tilDatoBarnetrygdperiode.erSynlig && (
                        <Datovelger
                            felt={skjema.felter.tilDatoBarnetrygdperiode}
                            skjema={skjema}
                            label={<TekstBlock block={teksterForModal.sluttdato.sporsmal} />}
                            avgrensMinDato={
                                skjema.felter.fraDatoBarnetrygdperiode.verdi
                                    ? dagenEtterDato(
                                          stringTilDate(
                                              skjema.felter.fraDatoBarnetrygdperiode.verdi
                                          )
                                      )
                                    : undefined
                            }
                            avgrensMaxDato={dagensDato()}
                        />
                    )}
                </>
            )}

            {månedligBeløp.erSynlig && (
                <SkjemaFeltInputForSanity
                    felt={skjema.felter.månedligBeløp}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                    label={
                        <TekstBlock
                            block={teksterForModal.belopPerManed.sporsmal}
                            flettefelter={{ barnetsNavn: barn.navn }}
                        />
                    }
                    description={
                        <Alert variant={'info'} inline>
                            <TekstBlock block={teksterForModal.belopPerManed.beskrivelse} />
                        </Alert>
                    }
                    fullbredde={false}
                />
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
