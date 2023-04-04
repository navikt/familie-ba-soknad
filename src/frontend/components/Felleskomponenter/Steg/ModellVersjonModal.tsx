import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Sidetittel } from 'nav-frontend-typografi';

import { BodyLong, Button, Modal } from '@navikt/ds-react';

import AlertStripe from '../AlertStripe/AlertStripe';
import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledBodyLong = styled(BodyLong)`
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

const StyledButton = styled(Button)`
    && {
        width: fit-content;
    }
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { formatMessage } = useIntl();

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            aria-label={formatMessage({ id: 'felles.modal.deployfeil.tittel' })}
            onClose={refresh}
        >
            <ModalContent>
                <StyledSideTittel>
                    <SpråkTekst id={'felles.modal.deployfeil.tittel'} />
                </StyledSideTittel>

                <AlertStripe
                    form={'default'}
                    type={'feil'}
                    children={<SpråkTekst id={'felles.modal.deployfeil.error'} />}
                />
                <StyledBodyLong>
                    <SpråkTekst id={'felles.modal.deployfeil.info'} />
                </StyledBodyLong>

                <StyledButton onClick={refresh}>
                    <SpråkTekst id={'felles.modal.deployfeil.knapp'} />
                </StyledButton>
            </ModalContent>
        </Modal>
    );
};

export default ModellVersjonModal;
