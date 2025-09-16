import React from 'react';

import { Box, Button, Modal } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { useAppNavigationContext } from '../../../context/AppNavigationContext';
import { IBlokkerTilbakeknappTekstinnhold } from '../../../typer/sanity/modaler/blokkerTilbakeknapp';
import { Typografi } from '../../../typer/sanity/sanity';
import ModalContent from '../ModalContent';
import TekstBlock from '../Sanity/TekstBlock';

export function BlokkerTilbakeKnappModal() {
    const { visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal } =
        useAppNavigationContext();
    const { tekster, plainTekst } = useAppContext();

    const teksterForModal: IBlokkerTilbakeknappTekstinnhold =
        tekster().FELLES.modaler.blokkerTilbakeknapp;
    const { tittel, tekst, tilDittNav, avbryt } = teksterForModal;

    const håndterAvbryt = () => {
        settVisBlokkerTilbakeKnappModal(false);
    };

    return (
        <Modal
            onClose={() => settVisBlokkerTilbakeKnappModal(false)}
            open={visBlokkerTilbakeKnappModal}
            header={{
                heading: plainTekst(tittel),
                size: 'medium',
            }}
        >
            <ModalContent>
                <TekstBlock block={tekst} typografi={Typografi.BodyLong} />
            </ModalContent>
            <Modal.Footer>
                <Button onClick={håndterAvbryt}>{plainTekst(avbryt)}</Button>
                <Box marginBlock="space-12 0" as="span" data-testid="blokker-tilbakeknapp-tekst">
                    <TekstBlock block={tilDittNav} typografi={Typografi.BodyShort} />
                </Box>
            </Modal.Footer>
        </Modal>
    );
}
