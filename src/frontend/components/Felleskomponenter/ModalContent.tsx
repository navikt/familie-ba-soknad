import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Modal } from '@navikt/ds-react';

const StyledModalContent = styled(Modal.Body)`
    && {
        margin-top: 1rem;
    }
`;

const ModalContent: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return <StyledModalContent>{children}</StyledModalContent>;
};

export default ModalContent;
