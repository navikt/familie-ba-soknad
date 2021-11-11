import React from 'react';

import { useIntl } from 'react-intl';

import { ESvar } from '@navikt/familie-form-elements';

import { IUtenlandsperiode } from '../../../typer/person';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import { svarForSpørsmålMedUkjent } from '../../../utils/spørsmål';
import {
    harTilhørendeFomFelt,
    hentFomAvgrensningPåTilDato,
    hentTomAvgrensningPåFraDato,
    hentTomAvgrensningPåTilDato,
} from '../../../utils/utenlandsopphold';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import { UtenlandsoppholdSpørsmålId } from './spørsmål';
import {
    IUseUtenlandsoppholdSkjemaParams,
    useUtenlandsoppholdSkjema,
} from './useUtenlandsoppholdSkjema';

interface Props extends ReturnType<typeof useModal>, IUseUtenlandsoppholdSkjemaParams {
    årsakLabelSpråkId: string;
    årsakSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    landLabelSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    fraDatoLabelSpråkIds: Record<
        Exclude<EUtenlandsoppholdÅrsak, EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_TIL_NORGE>,
        string
    >;
    tilDatoLabelSpråkIds: Record<
        Exclude<EUtenlandsoppholdÅrsak, EUtenlandsoppholdÅrsak.FLYTTET_PERMANENT_FRA_NORGE>,
        string
    >;
    tilDatoUkjentLabelSpråkId: string;
    onLeggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
}

export const UtenlandsoppholdModal: React.FC<Props> = ({
    landFeilmeldingSpråkIds,
    årsakFeilmeldingSpråkId,
    erÅpen,
    toggleModal,
    årsakLabelSpråkId,
    årsakSpråkIds,
    landLabelSpråkIds,
    fraDatoFeilmeldingSpråkIds,
    tilDatoFeilmeldingSpråkIds,
    fraDatoLabelSpråkIds,
    tilDatoLabelSpråkIds,
    tilDatoUkjentLabelSpråkId,
    onLeggTilUtenlandsperiode,
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtenlandsoppholdSkjema({
            landFeilmeldingSpråkIds,
            årsakFeilmeldingSpråkId,
            fraDatoFeilmeldingSpråkIds,
            tilDatoFeilmeldingSpråkIds,
        });

    const intl = useIntl();

    const onLeggTil = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }
        onLeggTilUtenlandsperiode({
            utenlandsoppholdÅrsak: {
                id: UtenlandsoppholdSpørsmålId.årsakUtenlandsopphold,
                svar: skjema.felter.utenlandsoppholdÅrsak.verdi as EUtenlandsoppholdÅrsak,
            },
            oppholdsland: {
                id: UtenlandsoppholdSpørsmålId.landUtenlandsopphold,
                svar: skjema.felter.oppholdsland.verdi,
            },
            ...(skjema.felter.oppholdslandFraDato.erSynlig && {
                oppholdslandFraDato: {
                    id: UtenlandsoppholdSpørsmålId.fraDatoUtenlandsopphold,
                    svar: skjema.felter.oppholdslandFraDato.verdi,
                },
            }),
            ...(skjema.felter.oppholdslandTilDato.erSynlig && {
                oppholdslandTilDato: {
                    id: UtenlandsoppholdSpørsmålId.tilDatoUtenlandsopphold,
                    svar: svarForSpørsmålMedUkjent(
                        skjema.felter.oppholdslandTilDatoUkjent,
                        skjema.felter.oppholdslandTilDato
                    ),
                },
            }),
        });

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'modal.endaflereutenlandsopphold.tittel'}
            onSubmitCallback={onLeggTil}
            submitKnappSpråkId={'felles.leggtilutenlands.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <StyledDropdown<EUtenlandsoppholdÅrsak | ''>
                {...skjema.felter.utenlandsoppholdÅrsak.hentNavInputProps(skjema.visFeilmeldinger)}
                felt={skjema.felter.utenlandsoppholdÅrsak}
                label={<SpråkTekst id={årsakLabelSpråkId} />}
                skjema={skjema}
                placeholder={intl.formatMessage({ id: 'felles.velg-årsak.placeholder' })}
            >
                {Object.keys(EUtenlandsoppholdÅrsak).map((årsak, number) => (
                    <option key={number} value={årsak}>
                        {intl.formatMessage({
                            id: årsakSpråkIds[årsak],
                        })}
                    </option>
                ))}
            </StyledDropdown>
            <LandDropdown
                felt={skjema.felter.oppholdsland}
                skjema={skjema}
                label={
                    landLabelSpråkIds[skjema.felter.utenlandsoppholdÅrsak.verdi] && (
                        <SpråkTekst
                            id={landLabelSpråkIds[skjema.felter.utenlandsoppholdÅrsak.verdi]}
                        />
                    )
                }
                dynamisk
            />

            {skjema.felter.oppholdslandFraDato.erSynlig && (
                <Datovelger
                    felt={skjema.felter.oppholdslandFraDato}
                    labelTekstId={fraDatoLabelSpråkIds[skjema.felter.utenlandsoppholdÅrsak.verdi]}
                    skjema={skjema}
                    avgrensMaxDato={hentTomAvgrensningPåFraDato(
                        skjema.felter.utenlandsoppholdÅrsak.verdi
                    )}
                />
            )}
            {skjema.felter.oppholdslandTilDato.erSynlig && (
                <Datovelger
                    felt={skjema.felter.oppholdslandTilDato}
                    labelTekstId={tilDatoLabelSpråkIds[skjema.felter.utenlandsoppholdÅrsak.verdi]}
                    skjema={skjema}
                    avgrensMinDato={hentFomAvgrensningPåTilDato(
                        skjema.felter.utenlandsoppholdÅrsak.verdi
                    )}
                    avgrensMaxDato={hentTomAvgrensningPåTilDato(
                        skjema.felter.utenlandsoppholdÅrsak.verdi
                    )}
                    tilhørendeFraOgMedFelt={
                        harTilhørendeFomFelt(skjema.felter.utenlandsoppholdÅrsak.verdi)
                            ? skjema.felter.oppholdslandFraDato
                            : undefined
                    }
                    disabled={skjema.felter.oppholdslandTilDatoUkjent.verdi === ESvar.JA}
                />
            )}
            {skjema.felter.oppholdslandTilDatoUkjent.erSynlig && (
                <SkjemaCheckbox
                    felt={skjema.felter.oppholdslandTilDatoUkjent}
                    labelSpråkTekstId={tilDatoUkjentLabelSpråkId}
                />
            )}
        </SkjemaModal>
    );
};
