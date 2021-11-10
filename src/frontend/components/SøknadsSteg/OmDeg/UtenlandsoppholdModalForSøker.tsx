import React from 'react';

import { IUtenlandsperiode } from '../../../typer/person';
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
    leggTilUtenlandsperiode: (periode: IUtenlandsperiode) => void;
}

export const UtenlandsoppholdModalForSøker: React.FC<UtenlandsoppholdModalForSøkerProps> = ({
    erÅpen,
    toggleModal,
    leggTilUtenlandsperiode,
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
        onLeggTilUtenlandsperiode={leggTilUtenlandsperiode}
    />
);
