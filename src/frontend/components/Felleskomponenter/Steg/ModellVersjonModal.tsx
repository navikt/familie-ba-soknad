import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, Heading, Modal } from '@navikt/ds-react';

import FamilieAlert from '../FamilieAlert/FamilieAlert';
import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledBodyLong = styled(BodyLong)`
    && {
        margin: 2.5rem 0;
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
                <Heading level={'1'} size={'large'}>
                    <SpråkTekst id={'felles.modal.deployfeil.tittel'} />
                </Heading>

                <FamilieAlert
                    inline={false}
                    variant={'error'}
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
