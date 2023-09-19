import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Modal } from '@navikt/ds-react';

import { device } from '../../Theme';

const StyledModalContent = styled(Modal.Body)`
    && {
        padding: 2rem;
    }

    @media all and ${device.tablet} {
        width: auto;
    }
`;

const ModalContent: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return <StyledModalContent>{children}</StyledModalContent>;
};

export default ModalContent;
