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

const StyledButton = styled(Button)<{ className }>`
    && {
        margin: 0.5rem 0 0.5rem 0;
        border: ${props => (props.className ? `2px solid ${navFarger.redError}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({ onClick, språkTekst, feilmelding, id }) => (
    <>
        <StyledButton
            id={id}
            variant={'tertiary'}
            type={'button'}
            onClick={onClick}
            className={feilmelding ? feilmelding.toString() : ''}
        >
            <AddCircle />
            <SpråkTekst id={språkTekst} />
        </StyledButton>
        {!!feilmelding && <Feilmelding>{feilmelding}</Feilmelding>}
    </>
);
