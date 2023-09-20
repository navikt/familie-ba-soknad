import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, Heading, Modal } from '@navikt/ds-react';

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
            aria-label={formatMessage({ id: 'felles.modal.deployfeil.tittel' })}
            onClose={refresh}
        >
            <Modal.Header>
                <Heading level={'1'} size={'large'}>
                    <SpråkTekst id={'felles.modal.deployfeil.tittel'} />
                </Heading>
            </Modal.Header>
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
