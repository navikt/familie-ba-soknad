import React from 'react';

import {
    fraDatoFeilmeldingSpråkIdsSøker,
    fraDatoLabelSpråkIdsSøker,
    landFeilmeldingSpråkIdsSøker,
    landLabelSpråkIdsSøker,
    tilDatoFeilmeldingSpråkIdsSøker,
    tilDatoLabelSpråkIdsSøker,
    tilDatoUkjentLabelSpråkIdSøker,
    årsakFeilmeldingSpråkIdSøker,
    årsakSpråkIdsSøker,
} from '../../Felleskomponenter/UtenlandsoppholdModal/spørsmål';
import { UtenlandsoppholdModal } from '../../Felleskomponenter/UtenlandsoppholdModal/UtenlandsoppholdModal';

interface UtenlandsoppholdModalForSøkerProps {
    erÅpen: boolean;
    toggleModal: () => void;
}

export const UtenlandsoppholdModalForSøker: React.FC<UtenlandsoppholdModalForSøkerProps> = ({
    erÅpen,
    toggleModal,
}) => (
    <UtenlandsoppholdModal
        erÅpen={erÅpen}
        toggleModal={toggleModal}
        årsakLabelSpråkId={'modal.beskriveopphold.spm'}
        årsakFeilmeldingSpråkId={årsakFeilmeldingSpråkIdSøker}
        årsakSpråkIds={årsakSpråkIdsSøker}
        landLabelSpråkIds={landLabelSpråkIdsSøker}
        landFeilmeldingSpråkIds={landFeilmeldingSpråkIdsSøker}
        fraDatoLabelSpråkIds={fraDatoLabelSpråkIdsSøker}
        fraDatoFeilmeldingSpråkIds={fraDatoFeilmeldingSpråkIdsSøker}
        tilDatoLabelSpråkIds={tilDatoLabelSpråkIdsSøker}
        tilDatoFeilmeldingSpråkIds={tilDatoFeilmeldingSpråkIdsSøker}
        tilDatoUkjentLabelSpråkId={tilDatoUkjentLabelSpråkIdSøker}
    />
);
