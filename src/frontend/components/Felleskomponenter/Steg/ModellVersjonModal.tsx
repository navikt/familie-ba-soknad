import React, { useEffect } from 'react';

import { modellVersjon } from '../../../../shared-utils/modellversjon';
import { useApp } from '../../../context/AppContext';
import SkjemaModal from '../SkjemaModal/SkjemaModal';
import useModal from '../SkjemaModal/useModal';

export const ModellVersjonModal: React.FC = () => {
    const { modellVersjonOppdatert } = useApp();
    const { erÅpen, toggleModal } = useModal();

    useEffect(() => {
        console.log(modellVersjon);
        console.log(erÅpen);
        modellVersjonOppdatert && !erÅpen && toggleModal();
    }, [modellVersjonOppdatert]);

    return (
        <SkjemaModal
            erÅpen={erÅpen}
            onSubmitCallback={() => {
                alert('test');
            }}
            onAvbrytCallback={() => {
                alert('test');
            }}
            valideringErOk={() => true}
            toggleModal={toggleModal}
            modalTittelSpråkId={'test'}
            submitKnappSpråkId={'test'}
        >
            Vi må desverre refreshe siden
        </SkjemaModal>
    );
};
