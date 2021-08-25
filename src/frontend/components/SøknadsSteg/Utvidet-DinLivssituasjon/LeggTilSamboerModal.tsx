import React from 'react';

import SkjemaModal from '../../Felleskomponenter/SkjemaModal/SkjemaModal';
import SamboerSkjema from './SamboerSkjema';
import { useTidligereSamboer } from './useTidligereSamboer';

interface Props {
    leggTilTidligereSamboer: () => void;
    toggleModal: () => void;
    erÅpen: boolean;
}

const LeggTilSamboerModal: React.FC<Props> = ({ leggTilTidligereSamboer, toggleModal, erÅpen }) => {
    const { skjema, valideringErOk } = useTidligereSamboer();

    return (
        <SkjemaModal
            modalTittelSpråkId={'Her kommer en tittel på å legge til samboer'}
            submitKnappSpråkId={'Her kommer en tekst'}
            erÅpen={erÅpen}
            toggleModal={toggleModal}
            onSubmitCallback={() => {
                leggTilTidligereSamboer();
                toggleModal();
            }}
            valideringErOk={valideringErOk}
        >
            <SamboerSkjema
                skjema={skjema}
                samboerFelter={{
                    navn: skjema.felter.tidligereSamboerNavn,
                    fnr: skjema.felter.tidligereSamboerFnr,
                    fnrUkjent: skjema.felter.tidligereSamboerFnrUkjent,
                    fødselsdato: skjema.felter.tidligereSamboerFødselsdato,
                    fødselsdatoUkjent: skjema.felter.tidligereSamboerFødselsdatoUkjent,
                    samboerFraDato: skjema.felter.tidligereSamboerFraDato,
                }}
            />
        </SkjemaModal>
    );
};
export default LeggTilSamboerModal;
