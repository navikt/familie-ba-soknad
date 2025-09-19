import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

interface Props {
    onClick: () => void | Promise<void>;
    leggTilFlereTekst?: ReactNode;
    feilmelding: ReactNode;
    id?: string;
    children?: ReactNode;
}

const StyledButton = styled(Button)`
    && {
        outline: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
        outline-offset: ${props => (props.$feilmelding ? '-2px' : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({ onClick, children, leggTilFlereTekst, feilmelding, id }) => {
    return (
        <>
            {leggTilFlereTekst && <BodyShort spacing>{leggTilFlereTekst}</BodyShort>}
            <StyledButton
                id={id}
                data-testid={id}
                variant={'tertiary'}
                type={'button'}
                onClick={onClick}
                $feilmelding={!!feilmelding}
                icon={<PlusCircleIcon aria-hidden />}
            >
                {children}
            </StyledButton>
            {!!feilmelding && (
                <Box marginBlock="2 0">
                    <ErrorMessage>{feilmelding}</ErrorMessage>
                </Box>
            )}
        </>
    );
};
