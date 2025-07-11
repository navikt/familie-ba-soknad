import React from 'react';

import { ESvar } from '@navikt/familie-form-elements';
import { Valideringsstatus } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { IUtbetalingsperiode } from '../../../typer/perioder';
import { PersonType } from '../../../typer/personType';
import { IAndreUtbetalingerTekstinnhold } from '../../../typer/sanity/modaler/andreUtbetalinger';
import { dagensDato, gårsdagensDato, sisteDagDenneMåneden } from '../../../utils/dato';
import { visFeiloppsummering } from '../../../utils/hjelpefunksjoner';
import { minTilDatoForPeriode } from '../../../utils/perioder';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import JaNeiSpm from '../JaNeiSpm/JaNeiSpm';
import { DagIMåneden, MånedÅrVelger } from '../MånedÅrVelger/MånedÅrVelger';
import TekstBlock from '../Sanity/TekstBlock';
import { SkjemaCheckboxForSanity } from '../SkjemaCheckbox/SkjemaCheckboxForSanity';
import { SkjemaFeiloppsummering } from '../SkjemaFeiloppsummering/SkjemaFeiloppsummering';
import SkjemaModal from '../SkjemaModal/SkjemaModal';

import { UtbetalingerSpørsmålId } from './spørsmål';
import { IUseUtbetalingerSkjemaParams, useUtbetalingerSkjema } from './useUtbetalingerSkjema';

interface UtbetalingerModalProps extends IUseUtbetalingerSkjemaParams {
    erÅpen: boolean;
    lukkModal: () => void;
    onLeggTilUtbetalinger: (utbetalingsperiode: IUtbetalingsperiode) => void;
    forklaring?: string;
}

export const UtbetalingerModal: React.FC<UtbetalingerModalProps> = ({
    erÅpen,
    lukkModal,
    onLeggTilUtbetalinger,
    personType,
    barn,
    erDød,
    forklaring = undefined,
}) => {
    const { tekster, plainTekst } = useAppContext();
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtbetalingerSkjema(personType, barn, erDød);

    const teksterForPersonType: IAndreUtbetalingerTekstinnhold =
        tekster().FELLES.modaler.andreUtbetalinger[personType];

    const andreForelderErDød: boolean = personType === PersonType.AndreForelder && !!erDød;
    const periodenErAvsluttet: boolean =
        skjema.felter.fårUtbetalingNå.verdi === ESvar.NEI || andreForelderErDød;

    const {
        fårUtbetalingNå,
        utbetalingLand,
        utbetalingFraDato,
        utbetalingTilDato,
        utbetalingTilDatoUkjent,
    } = skjema.felter;

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtbetalinger({
            fårUtbetalingNå: {
                id: UtbetalingerSpørsmålId.fårUtbetalingNå,
                svar: fårUtbetalingNå.erSynlig ? fårUtbetalingNå.verdi : null,
            },
            utbetalingLand: {
                id: UtbetalingerSpørsmålId.utbetalingLand,
                svar: utbetalingLand.verdi,
            },
            utbetalingFraDato: {
                id: UtbetalingerSpørsmålId.utbetalingFraDato,
                svar: utbetalingFraDato.verdi,
            },
            utbetalingTilDato: {
                id: UtbetalingerSpørsmålId.utbetalingTilDato,
                svar: svarForSpørsmålMedUkjent(utbetalingTilDatoUkjent, utbetalingTilDato),
            },
        });

        lukkModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            tittel={teksterForPersonType.tittel}
            forklaring={forklaring}
            onSubmitCallback={onLeggTil}
            submitKnappTekst={<TekstBlock block={teksterForPersonType.leggTilKnapp} />}
            lukkModal={lukkModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <JaNeiSpm
                skjema={skjema}
                felt={fårUtbetalingNå}
                spørsmålDokument={teksterForPersonType.faarUtbetalingerNaa}
                flettefelter={{ barnetsNavn: barn?.navn }}
            />
            {(fårUtbetalingNå.valideringsstatus === Valideringsstatus.OK || andreForelderErDød) && (
                <>
                    <LandDropdown
                        felt={utbetalingLand}
                        skjema={skjema}
                        label={
                            <TekstBlock
                                block={
                                    periodenErAvsluttet
                                        ? teksterForPersonType.utbetalingLandFortid.sporsmal
                                        : teksterForPersonType.utbetalingLandNaatid.sporsmal
                                }
                                flettefelter={{ barnetsNavn: barn?.navn }}
                            />
                        }
                        dynamisk
                    />
                    <MånedÅrVelger
                        label={<TekstBlock block={teksterForPersonType.startdato.sporsmal} />}
                        senesteValgbareMåned={periodenErAvsluttet ? gårsdagensDato() : dagensDato()}
                        felt={utbetalingFraDato}
                        visFeilmeldinger={skjema.visFeilmeldinger}
                        dagIMåneden={DagIMåneden.FØRSTE_DAG}
                        kanIkkeVæreFremtid={true}
                    />
                    <div>
                        <MånedÅrVelger
                            label={
                                <TekstBlock
                                    block={
                                        periodenErAvsluttet
                                            ? teksterForPersonType.sluttdatoFortid.sporsmal
                                            : teksterForPersonType.sluttdatoFremtid.sporsmal
                                    }
                                />
                            }
                            tidligsteValgbareMåned={minTilDatoForPeriode(
                                periodenErAvsluttet,
                                utbetalingFraDato.verdi
                            )}
                            senesteValgbareMåned={
                                periodenErAvsluttet ? sisteDagDenneMåneden() : undefined
                            }
                            felt={utbetalingTilDato}
                            visFeilmeldinger={skjema.visFeilmeldinger}
                            dagIMåneden={DagIMåneden.SISTE_DAG}
                            kanIkkeVæreFremtid={periodenErAvsluttet}
                            kanIkkeVæreFortid={!periodenErAvsluttet}
                            disabled={utbetalingTilDatoUkjent.verdi === ESvar.JA}
                        />
                        <SkjemaCheckboxForSanity
                            label={plainTekst(teksterForPersonType.sluttdatoFremtid.checkboxLabel)}
                            felt={utbetalingTilDatoUkjent}
                        />
                    </div>
                </>
            )}
            {visFeiloppsummering(skjema) && <SkjemaFeiloppsummering skjema={skjema} />}
        </SkjemaModal>
    );
};
