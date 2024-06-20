import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Box } from '@navikt/ds-react';

const StyledBox = styled(Box)`
    && {
        margin-top: var(--a-spacing-2);
    }
`;

const Tilleggsinformasjon: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <StyledBox padding="4" background="surface-subtle" borderRadius="medium">
            {children}
        </StyledBox>
    );
};

export default Tilleggsinformasjon;
