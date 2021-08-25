import React from 'react';

import SkjemaModal from '../../Felleskomponenter/SkjemaModal/SkjemaModal';

interface Props {
    leggTilTidligereSamboer: () => void;
    toggleModal: () => void;
    erÅpen: boolean;
}

const LeggTilSamboerModal: React.FC<Props> = ({ leggTilTidligereSamboer, toggleModal, erÅpen }) => {
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
            valideringErOk={() => true} //TODO
        >
            <p>HER KOMMER DET EN FORM</p>
        </SkjemaModal>
    );
};
export default LeggTilSamboerModal;
