import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, Modal } from '@navikt/ds-react';

import FamilieAlert from '../FamilieAlert/FamilieAlert';
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
                <FamilieAlert
                    inline={false}
                    variant={'error'}
                    children={<SpråkTekst id={'felles.modal.deployfeil.error'} />}
                />
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
