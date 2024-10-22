import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

import { useFeatureToggles } from '../../../context/FeatureToggleContext';

interface Props {
    onClick: () => void | Promise<void>;
    children: ReactNode;
    leggTilFlereTekst?: ReactNode;
    feilmelding?: ReactNode;
    id?: string;
}

const StyledButton = styled(Button)`
    && {
        outline: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
        outline-offset: ${props => (props.$feilmelding ? '-2px' : 'none')};
    }
`;

export const LeggTilKnappForSanity: React.FC<Props> = ({
    onClick,
    children,
    leggTilFlereTekst,
    feilmelding,
    id,
}) => {
    const { toggles } = useFeatureToggles();

    return (
        <>
            {toggles.NYE_MODAL_TEKSTER && leggTilFlereTekst && (
                <BodyShort spacing>{leggTilFlereTekst}</BodyShort>
            )}
            <StyledButton
                id={id}
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
