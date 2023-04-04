import React from 'react';

import styled from 'styled-components';

import { Button, Ingress } from '@navikt/ds-react';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { StyledBarnekort } from '../Barnekort/Barnekort';

const StyledIngress = styled(Ingress)`
    && {
        font-size: 1rem;
        font-weight: 600;
    }
`;

const StyledButton = styled(Button)`
    && {
        margin-top: 1rem;
        width: 100%;
        box-sizing: border-box;
    }
`;

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    return (
        <StyledBarnekort>
            <StyledIngress>
                <SpråkTekst id={'hvilkebarn.leggtilbarn.kort'} />
            </StyledIngress>
            <StyledButton type={'button'} variant={'secondary'} onClick={() => onLeggTilBarn()}>
                <SpråkTekst id={'hvilkebarn.leggtilbarn.kort.knapp'} />
            </StyledButton>
        </StyledBarnekort>
    );
};
