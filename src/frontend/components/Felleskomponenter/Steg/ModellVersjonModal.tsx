import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Alert, BodyLong, Button, Modal } from '@navikt/ds-react';

import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledBodyLong = styled(BodyLong)`
    && {
        margin-top: 2.5rem;
    }
`;

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { formatMessage } = useIntl();

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            onClose={refresh}
            header={{
                heading: formatMessage({ id: 'felles.modal.deployfeil.tittel' }),
                size: 'medium',
            }}
        >
            <ModalContent>
                <Alert variant={'error'}>
                    <SpråkTekst id={'felles.modal.deployfeil.error'} />
                </Alert>
                <StyledBodyLong>
                    <SpråkTekst id={'felles.modal.deployfeil.info'} />
                </StyledBodyLong>
            </ModalContent>
            <Modal.Footer>
                <Button onClick={refresh}>
                    <SpråkTekst id={'felles.modal.deployfeil.knapp'} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModellVersjonModal;
