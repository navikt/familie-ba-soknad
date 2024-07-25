import React, { FC } from 'react';

import { useIntl } from 'react-intl';

import { Alert, BodyLong, Box, Button, Modal, VStack } from '@navikt/ds-react';

import ModalContent from '../../Felleskomponenter/ModalContent';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import { useBekreftelseOgStartSoknad } from './useBekreftelseOgStartSoknad';

const FortsettPåSøknad: FC = () => {
    const { fortsettPåSøknaden, startPåNytt, visStartPåNyttModal, settVisStartPåNyttModal } =
        useBekreftelseOgStartSoknad();
    const { formatMessage } = useIntl();
    return (
        <VStack role={'navigation'} gap="6">
            <Alert variant={'info'}>
                <BodyLong>
                    <SpråkTekst id={'mellomlagring.info'} />
                </BodyLong>
            </Alert>
            <Box marginInline="auto">
                <Button onClick={fortsettPåSøknaden}>
                    <SpråkTekst id={'mellomlagring.knapp.fortsett'} />
                </Button>
            </Box>
            <Box marginInline="auto">
                <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(true)}>
                    <SpråkTekst id={'mellomlagring.knapp.startpånytt'} />
                </Button>
            </Box>
            <Modal
                open={visStartPåNyttModal}
                onClose={() => {
                    settVisStartPåNyttModal(false);
                }}
                header={{
                    heading: formatMessage({ id: 'felles.startpånytt.modal.startpånyttknapp' }),
                    size: 'medium',
                }}
            >
                <ModalContent>
                    <BodyLong>
                        <SpråkTekst id={'felles.startpånytt.modal.tekst'} />
                    </BodyLong>
                </ModalContent>
                <Modal.Footer>
                    <Button variant={'primary'} onClick={startPåNytt}>
                        <SpråkTekst id={'felles.startpånytt.modal.startpånyttknapp'} />{' '}
                    </Button>
                    <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(false)}>
                        <SpråkTekst id={'felles.startpånytt.modal.avbrytknapp'} />
                    </Button>
                </Modal.Footer>
            </Modal>
        </VStack>
    );
};
export default FortsettPåSøknad;
