import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Hovedknapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Normaltekst, Sidetittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import AlertStripe from '../AlertStripe/AlertStripe';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledNormalTekst = styled(Normaltekst)`
    && {
        margin: 2.5rem 0;
    }
`;

export const StyledSideTittel = styled(Sidetittel)`
    && {
        font-size: 1.25rem;
        margin: 1rem auto;
    }
`;

const StyledHovedknapp = styled(Hovedknapp)`
    width: fit-content;
`;

const ModalInnholdContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    max-width: 35rem;
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean; toggleModal: () => void }> = ({
    erÅpen,
    toggleModal,
}) => {
    const { modellVersjonOppdatert } = useApp();
    const { formatMessage } = useIntl();

    useEffect(() => {
        modellVersjonOppdatert && !erÅpen && toggleModal();
    }, [modellVersjonOppdatert]);

    return (
        <Modal
            isOpen={erÅpen}
            contentLabel={formatMessage({ id: 'felles.modal.deployfeil.tittel' })}
            onRequestClose={toggleModal}
        >
            <ModalInnholdContainer>
                <StyledSideTittel>
                    <SpråkTekst id={'felles.modal.deployfeil.tittel'} />
                </StyledSideTittel>

                <AlertStripe
                    form={'default'}
                    type={'feil'}
                    children={<SpråkTekst id={'felles.modal.deployfeil.error'} />}
                />
                <StyledNormalTekst>
                    <SpråkTekst id={'felles.modal.deployfeil.info'} />
                </StyledNormalTekst>

                <StyledHovedknapp onClick={() => alert('todo')}>
                    <SpråkTekst id={'felles.modal.deployfeil.knapp'} />
                </StyledHovedknapp>
            </ModalInnholdContainer>
        </Modal>
    );
};

export default ModellVersjonModal;
