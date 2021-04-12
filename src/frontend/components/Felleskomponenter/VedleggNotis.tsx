import React from 'react';

import styled from 'styled-components/macro';

import { FileContent } from '@navikt/ds-icons';

const NotisWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const StyledFileContent = styled(FileContent)`
    --vedleggsikon-base-størrelse: 2rem;
    width: var(--vedleggsikon-base-størrelse);
    height: var(--vedleggsikon-base-størrelse);
    margin-right: 1rem;
`;

const NotisInnhold = styled.section`
    ul {
        margin: 0;
        padding-left: 1rem; // For kulepunkt
    }
`;

export const VedleggNotis: React.FC = ({ children }) => {
    return (
        <NotisWrapper>
            <StyledFileContent />
            <NotisInnhold>{children}</NotisInnhold>
        </NotisWrapper>
    );
};
