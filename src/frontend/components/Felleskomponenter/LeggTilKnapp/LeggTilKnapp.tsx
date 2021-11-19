import React, { ReactNode } from 'react';

import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import { Flatknapp } from 'nav-frontend-knapper';
import { Feilmelding } from 'nav-frontend-typografi';

import { AddCircle } from '@navikt/ds-icons';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    språkTekst: string;
    feilmelding?: ReactNode;
    id?: string;
}

const StyledFlatKnapp = styled(Flatknapp)<{ feilmelding }>`
    margin: 0.5rem 0 0.5rem 0;
    && {
        border: ${props => (props.feilmelding ? `2px solid ${navFarger.redError}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({
    onClick,
    språkTekst,
    feilmelding = '',
    id = '',
}) => (
    <>
        <StyledFlatKnapp
            id={id}
            feilmelding={feilmelding}
            htmlType={'button'}
            kompakt
            onClick={onClick}
        >
            <AddCircle />
            <span>
                <SpråkTekst id={språkTekst} />
            </span>
        </StyledFlatKnapp>
        {feilmelding && <Feilmelding>{feilmelding}</Feilmelding>}
    </>
);
