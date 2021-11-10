import React from 'react';

import { useIntl } from 'react-intl';

import { IUtenlandsperiode } from '../../../typer/person';
import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
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
    fraDatoLabelSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    tilDatoLabelSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
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

    const {
        oppholdsland,
        utenlandsoppholdÅrsak,
        oppholdslandFraDato,
        oppholdslandTilDato,
        oppholdslandTilDatoUkjent,
    } = skjema.felter;
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
                    svar: skjema.felter.oppholdslandTilDato.verdi,
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
                {...utenlandsoppholdÅrsak.hentNavInputProps(skjema.visFeilmeldinger)}
                felt={utenlandsoppholdÅrsak}
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
                felt={oppholdsland}
                skjema={skjema}
                label={
                    landLabelSpråkIds[utenlandsoppholdÅrsak.verdi] && (
                        <SpråkTekst id={landLabelSpråkIds[utenlandsoppholdÅrsak.verdi]} />
                    )
                }
                dynamisk
            />
            <Datovelger
                felt={oppholdslandFraDato}
                labelTekstId={fraDatoLabelSpråkIds[utenlandsoppholdÅrsak.verdi]}
                skjema={skjema}
            />
            {oppholdslandTilDato.erSynlig && (
                <Datovelger
                    felt={oppholdslandTilDato}
                    labelTekstId={tilDatoLabelSpråkIds[utenlandsoppholdÅrsak.verdi]}
                    skjema={skjema}
                />
            )}
            {oppholdslandTilDatoUkjent.erSynlig && (
                <SkjemaCheckbox
                    felt={oppholdslandTilDatoUkjent}
                    labelSpråkTekstId={tilDatoUkjentLabelSpråkId}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                />
            )}
        </SkjemaModal>
    );
};
