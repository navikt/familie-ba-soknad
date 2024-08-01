import React from 'react';

import { BodyLong, Button, Modal } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBekreftelseOgStartSoknad } from '../../SøknadsSteg/Forside/useBekreftelseOgStartSoknad';
import ModalContent from '../ModalContent';
import TekstBlock from '../Sanity/TekstBlock';

export const SlettSøknadenModal: React.FC = () => {
    const { tekster, plainTekst } = useApp();
    const { startPåNytt, visStartPåNyttModal, settVisStartPåNyttModal } =
        useBekreftelseOgStartSoknad();

    const startPåNyttTekster = tekster().FELLES.modaler.startPåNytt;

    return (
        <Modal
            open={visStartPåNyttModal}
            onClose={() => {
                settVisStartPåNyttModal(false);
            }}
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
                <Button variant={'danger'} onClick={startPåNytt}>
                    {plainTekst(startPåNyttTekster.startNySoeknadKnapp)}
                </Button>
                <Button variant={'secondary'} onClick={() => settVisStartPåNyttModal(false)}>
                    {plainTekst(startPåNyttTekster.startPaaNyttAvbryt)}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
