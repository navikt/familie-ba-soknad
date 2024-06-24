import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button, ErrorMessage, Label } from '@navikt/ds-react';
import { ARed500 } from '@navikt/ds-tokens/dist/tokens';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

interface Props {
    onClick: () => void | Promise<void>;
    språkTekst: string;
    hjelpeTekst?: string;
    feilmelding?: ReactNode;
    id?: string;
}

const StyledButton = styled(Button)`
    && {
        border: ${props => (props.$feilmelding ? `2px solid ${ARed500}` : 'none')};
    }
`;

export const LeggTilKnapp: React.FC<Props> = ({
    onClick,
    språkTekst,
    hjelpeTekst,
    feilmelding,
    id,
}) => (
    <>
        {/* TODO: Se på semantikk på hjelpeTekst. Skal Label brukes eller bør det byttes ut med noe annet? */}
        {hjelpeTekst && (
            <Label as="p" spacing>
                {hjelpeTekst}
            </Label>
        )}
        <StyledButton
            id={id}
            variant={'tertiary'}
            type={'button'}
            onClick={onClick}
            $feilmelding={!!feilmelding}
            icon={<PlusCircleIcon aria-hidden />}
        >
            <SpråkTekst id={språkTekst} />
        </StyledButton>
        {!!feilmelding && <ErrorMessage>{feilmelding}</ErrorMessage>}
    </>
);
