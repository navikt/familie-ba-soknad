import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { BodyLong, Button, Modal } from '@navikt/ds-react';

import { useAppNavigation } from '../../../context/AppNavigationContext';
import EksternLenke from '../EksternLenke/EksternLenke';
import ModalContent from '../ModalContent';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

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
            header={{
                heading: formatMessage({ id: 'felles.blokkerTilbakeKnapp.modal.tittel' }),
                size: 'medium',
            }}
        >
            <ModalContent>
                <BodyLong>
                    <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.tekst'} />
                </BodyLong>
            </ModalContent>
            <Modal.Footer>
                <Button onClick={håndterAvbryt}>
                    <SpråkTekst id={'felles.blokkerTilbakeKnapp.modal.avbrytKnapp'} />
                </Button>
                <StyledEksternLenke
                    lenkeSpråkId={'kvittering.dinesaker.lenke'}
                    lenkeTekstSpråkId={'felles.blokkerTilbakeKnapp.modal.tilDittNavKnapp'}
                    target="_blank"
                />
            </Modal.Footer>
        </Modal>
    );
};

export default BlokkerTilbakeKnappModal;
