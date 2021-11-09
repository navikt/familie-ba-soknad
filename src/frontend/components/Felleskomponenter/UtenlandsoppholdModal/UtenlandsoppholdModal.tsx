import React from 'react';

import { useIntl } from 'react-intl';

import { EUtenlandsoppholdÅrsak } from '../../../typer/utenlandsopphold';
import Datovelger from '../Datovelger/Datovelger';
import { LandDropdown } from '../Dropdowns/LandDropdown';
import StyledDropdown from '../Dropdowns/StyledDropdown';
import { SkjemaCheckbox } from '../SkjemaCheckbox/SkjemaCheckbox';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';
import SpråkTekst from '../SpråkTekst/SpråkTekst';
import {
    useUtenlandsoppholdSkjema,
    IUseUtenlandsoppholdSkjemaParams,
} from './useUtenlandsoppholdSkjema';

interface Props extends ReturnType<typeof useModal>, IUseUtenlandsoppholdSkjemaParams {
    årsakLabelSpråkId: string;
    årsakSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    landLabelSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    fraDatoLabelSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    tilDatoLabelSpråkIds: Record<EUtenlandsoppholdÅrsak, string>;
    tilDatoUkjentLabelSpråkId: string;
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
}) => {
    const { skjema, valideringErOk, nullstillSkjema, validerFelterOgVisFeilmelding } =
        useUtenlandsoppholdSkjema({
            landFeilmeldingSpråkIds,
            årsakFeilmeldingSpråkId,
            fraDatoFeilmeldingSpråkIds,
            tilDatoFeilmeldingSpråkIds,
        });

    const { land, årsak, fraDato, tilDato, tilDatoUkjent } = skjema.felter;
    const intl = useIntl();

    const onSubmit = () => {
        if (!validerFelterOgVisFeilmelding()) {
            return false;
        }

        toggleModal();
        nullstillSkjema();
    };

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            modalTittelSpråkId={'modal.endaflereutenlandsopphold.tittel'}
            onSubmitCallback={onSubmit}
            submitKnappSpråkId={'felles.leggtilutenlands.knapp'}
            toggleModal={toggleModal}
            valideringErOk={valideringErOk}
            onAvbrytCallback={nullstillSkjema}
        >
            <StyledDropdown<EUtenlandsoppholdÅrsak | ''>
                {...årsak.hentNavInputProps(skjema.visFeilmeldinger)}
                felt={årsak}
                label={<SpråkTekst id={årsakLabelSpråkId} />}
                skjema={skjema}
                placeholder={intl.formatMessage({ id: 'MANGLER' })}
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
                felt={land}
                skjema={skjema}
                label={
                    landLabelSpråkIds[årsak.verdi] && (
                        <SpråkTekst id={landLabelSpråkIds[årsak.verdi]} />
                    )
                }
                dynamisk
            />
            <Datovelger
                felt={fraDato}
                labelTekstId={fraDatoLabelSpråkIds[årsak.verdi]}
                skjema={skjema}
            />
            {tilDato.erSynlig && (
                <Datovelger
                    felt={tilDato}
                    labelTekstId={tilDatoLabelSpråkIds[årsak.verdi]}
                    skjema={skjema}
                />
            )}
            {tilDatoUkjent.erSynlig && (
                <SkjemaCheckbox
                    felt={tilDatoUkjent}
                    labelSpråkTekstId={tilDatoUkjentLabelSpråkId}
                    visFeilmeldinger={skjema.visFeilmeldinger}
                />
            )}
        </SkjemaModal>
    );
};
