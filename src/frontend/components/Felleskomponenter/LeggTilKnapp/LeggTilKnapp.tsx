import React, { ReactNode } from 'react';

import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import { Feilmelding } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    språkTekst: string;
    feilmelding?: ReactNode;
    id?: string;
}

const StyledLeggTilKnapp = styled(Button)<{ feilmelding }>`
    && {
        margin: 0.5rem 0 0.5rem 0;
        border: ${props => (props.feilmelding ? `2px solid ${navFarger.redError}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({ onClick, språkTekst, feilmelding, id }) => (
    <>
        <StyledLeggTilKnapp
            id={id}
            variant="tertiary"
            feilmelding={feilmelding ? feilmelding : undefined}
            htmlType={'button'}
            onClick={onClick}
        >
            <AddCircle />
            <SpråkTekst id={språkTekst} />
        </StyledLeggTilKnapp>
        {!!feilmelding && <Feilmelding>{feilmelding}</Feilmelding>}
    </>
);
