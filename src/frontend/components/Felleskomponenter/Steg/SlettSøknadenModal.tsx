import React from 'react';

import { BodyLong, Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import ModalContent from '../ModalContent';
import TekstBlock from '../Sanity/TekstBlock';

interface ISlettSøkadenModalProps {
    open: boolean;
    avbryt: () => void;
    startPåNytt: () => void;
}

export const SlettSøknadenModal: React.FC<ISlettSøkadenModalProps> = ({
    open,
    avbryt,
    startPåNytt,
}) => {
    const { tekster, plainTekst } = useApp();

    const startPåNyttTekster = tekster().FELLES.modaler.startPåNytt;

    return (
        <Modal
            open={open}
            onClose={avbryt}
            header={{
                heading: plainTekst(startPåNyttTekster.startPaaNyttTittel),
                size: 'medium',
            }}
        >
            <ModalContent>
                <BodyLong>
                    <TekstBlock
                        block={startPåNyttTekster.startPaaNyttInfo}
                        brukTypografiWrapper={false}
                    />
                </BodyLong>
            </ModalContent>
            <Modal.Footer>
                <Button variant={'danger'} type="button" onClick={startPåNytt}>
                    {plainTekst(startPåNyttTekster.startNySoeknadKnapp)}
                </Button>
                <Button variant={'secondary'} type="button" onClick={avbryt}>
                    {plainTekst(startPåNyttTekster.startPaaNyttAvbryt)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
