import React from 'react';

import styled from 'styled-components';

import { Flatknapp } from 'nav-frontend-knapper';

import { AddCircle } from '@navikt/ds-icons';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    språkTekst: string;
}

const StyledFlatKnapp = styled(Flatknapp)`
    margin-top: 0.5rem;
`;

export const LeggTilKnapp: React.FC<Props> = ({ onClick, språkTekst }) => (
    <StyledFlatKnapp htmlType={'button'} kompakt onClick={onClick}>
        <AddCircle />
        <span>
            <SpråkTekst id={språkTekst} />
        </span>
    </StyledFlatKnapp>
);
