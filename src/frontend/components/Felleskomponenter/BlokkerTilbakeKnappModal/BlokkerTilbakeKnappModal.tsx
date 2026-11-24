import { Typografi } from '@common/sanity';
import ModalContent from '@components/Felleskomponenter/ModalContent';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import { useAppContext } from '@context/AppContext';
import { useAppNavigationContext } from '@context/AppNavigationContext';
import { Box, Button, Modal } from '@navikt/ds-react';
import type { IBlokkerTilbakeknappTekstinnhold } from '@typer/sanity/modaler/blokkerTilbakeknapp';

export function BlokkerTilbakeKnappModal() {
    const { visBlokkerTilbakeKnappModal, settVisBlokkerTilbakeKnappModal } = useAppNavigationContext();
    const { tekster, plainTekst } = useAppContext();

    const teksterForModal: IBlokkerTilbakeknappTekstinnhold = tekster().FELLES.modaler.blokkerTilbakeknapp;
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
                <Box marginBlock="space-12 space-0" as="span">
                    <TekstBlock block={tilDittNav} typografi={Typografi.BodyShort} />
                </Box>
            </Modal.Footer>
        </Modal>
    );
}
