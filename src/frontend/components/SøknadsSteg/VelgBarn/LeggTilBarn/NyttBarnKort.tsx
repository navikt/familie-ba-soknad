import React from 'react';

import styled from 'styled-components';

import { Knapp } from 'nav-frontend-knapper';
import { Ingress } from 'nav-frontend-typografi';

import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { StyledBarnekort } from '../Barnekort/Barnekort';

const StyledIngress = styled(Ingress)`
    && {
        font-size: 1rem;
        font-weight: 600;
    }
`;

const StyledKnapp = styled(Knapp)`
    margin-top: 1rem;
    width: 100%;
    box-sizing: border-box;
`;

export const NyttBarnKort: React.FC<{ onLeggTilBarn: () => void }> = ({ onLeggTilBarn }) => {
    return (
        <StyledBarnekort>
            <StyledIngress>
                <SpråkTekst id={'hvilkebarn.leggtilbarn.kort'} />
            </StyledIngress>
            <StyledKnapp htmlType={'button'} onClick={() => onLeggTilBarn()}>
                <SpråkTekst id={'hvilkebarn.leggtilbarn.kort.knapp'} />
            </StyledKnapp>
        </StyledBarnekort>
    );
};
