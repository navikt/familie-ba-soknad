import React from 'react';

import styled from 'styled-components/macro';

import { FileContent } from '@navikt/ds-icons';

import SpråkTekst from './SpråkTekst/SpråkTekst';

const NotisWrapper = styled.div`
    display: flex;
`;

const StyledFileContent = styled(FileContent)`
    max-width: 1.125rem;
    min-width: 1.125rem;
    height: fit-content;
    margin-right: 1rem;
`;

const NotisInnhold = styled.div`
    ul {
        margin: 0;
        padding-left: 1.3rem; // For kulepunkt
    }

    p {
        margin: 0;
    }
`;

export const VedleggNotis: React.FC<{ språkTekstId: string }> = ({ språkTekstId }) => {
    return (
        <NotisWrapper>
            <StyledFileContent />
            <NotisInnhold>
                <SpråkTekst id={språkTekstId} />
            </NotisInnhold>
        </NotisWrapper>
    );
};
