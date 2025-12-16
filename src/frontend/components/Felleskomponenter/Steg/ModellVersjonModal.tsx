import React from 'react';

import { Alert, Box, Button, Modal } from '@navikt/ds-react';

import { useAppContext } from '../../../context/AppContext';
import { Typografi } from '../../../typer/sanity/sanity';
import ModalContent from '../ModalContent';
import TekstBlock from '../Sanity/TekstBlock';

const ModellVersjonModal: React.FC<{ erÅpen: boolean }> = ({ erÅpen }) => {
    const { tekster, plainTekst } = useAppContext();

    const mistetInformasjonenDinTekster = tekster().FELLES.modaler.mistetInformasjonenDin;

    const refresh = () => window.location.reload();

    return (
        <Modal
            open={erÅpen}
            onClose={refresh}
            header={{
                heading: plainTekst(mistetInformasjonenDinTekster.tittel),
                size: 'medium',
            }}
        >
            <ModalContent>
                <Alert variant={'error'}>{plainTekst(mistetInformasjonenDinTekster.tittel)}</Alert>
                <Box marginBlock="10">
                    <TekstBlock block={mistetInformasjonenDinTekster.info} typografi={Typografi.BodyLong} />
                </Box>
            </ModalContent>
            <Modal.Footer>
                <Button onClick={refresh}>
                    <TekstBlock block={mistetInformasjonenDinTekster.knapp} typografi={Typografi.BodyShort} />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModellVersjonModal;
