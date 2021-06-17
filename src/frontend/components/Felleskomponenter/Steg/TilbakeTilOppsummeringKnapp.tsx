import React from 'react';
import styled from 'styled-components/macro';
import { Hovedknapp, KnappBaseProps } from 'nav-frontend-knapper';

const StyledHovedknapp = styled(Hovedknapp)`
    margin: auto;
`;

const KnappWrapper = styled.div`
    display: flex;
`;

export const TilbakeTilOppsummeringKnapp: React.FC<KnappBaseProps> = (knappProps) => {
    return (
        <KnappWrapper>
            <StyledHovedknapp {...knappProps} />
        </KnappWrapper>
    )
}