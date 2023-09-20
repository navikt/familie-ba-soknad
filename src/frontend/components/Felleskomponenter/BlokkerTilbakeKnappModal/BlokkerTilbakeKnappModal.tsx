import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, Heading, Modal } from '@navikt/ds-react';

import { useAppNavigation } from '../../../context/AppNavigationContext';
import EksternLenke from '../EksternLenke/EksternLenke';
import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

const Flex = styled.div`
    padding-top: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
`;
const StyledEksternLenke = styled(EksternLenke)`
    margin-right: 1rem;
`;

const BlokkerTilbakeKnappModal = () => {
    const { visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal } = useAppNavigation();
    const { formatMessage } = useIntl();

    const håndterAvbryt = () => {
        settVisBlokkerTilbakeKnappModal(false);
    };

    return (
        <Modal
            onClose={() => settVisBlokkerTilbakeKnappModal(false)}
            open={visBlokkerTilbakeKnappModal}
            aria-label={formatMessage({ id: 'felles.blokkerTilbakeKnapp.modal.tittel' })}
        >
            <Modal.Header>
                <Heading level={'1'} size={'large'}>
                    <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tittel'} />
                </Heading>
            </Modal.Header>
            <ModalContent>
                <BodyLong>
                    <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tekst'} />
                </BodyLong>
            </ModalContent>
            <Modal.Footer>
                <Flex>
                    <StyledEksternLenke
                        lenkeSpråkId={'kvittering.dinesaker.lenke'}
                        lenkeTekstSpråkId={'felles.blokkerTilbakeKnapp.modal.tilDittNavKnapp'}
                        target="_blank"
                    />
                    <Button onClick={håndterAvbryt}>
                        <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.avbrytKnapp'} />
                    </Button>
                </Flex>
            </Modal.Footer>
        </Modal>
    );
};

export default BlokkerTilbakeKnappModal;
