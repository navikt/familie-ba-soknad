import { Box, Modal } from '@navikt/ds-react';

import type { FC, ReactNode } from 'react';

const ModalContent: FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Modal.Body>
            <Box marginBlock={'space-16 space-0'}>{children}</Box>
        </Modal.Body>
    );
};

export default ModalContent;
