import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { TrashFillIcon } from '@navikt/aksel-icons';
import { Button, Heading } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const PeriodeContainer = styled.div<{ $bottomBorder: boolean }>`
    margin: 2rem 0;
    border-bottom: ${props => (props.$bottomBorder ? `1px solid ${ABorderDefault}` : 'none')};
`;

const StyledButton = styled(Button)`
    && {
        margin-bottom: 1.5rem;
    }
`;

const StyledHeading = styled(Heading)`
    && {
        margin-bottom: 1.125rem;
    }
`;

const PeriodeOppsummering: React.FC<{
    nummer: number;
    fjernPeriodeCallback?: () => void;
    fjernKnappSpråkId?: string;
    tittelSpråkId: string;
    vedleggNotis?: ReactNode;
    children?: ReactNode;
}> = ({
    nummer,
    fjernPeriodeCallback = undefined,
    fjernKnappSpråkId,
    tittelSpråkId,
    vedleggNotis,
    children,
}) => {
    const skalHaBottomBorder = !!fjernPeriodeCallback;

    return (
        <PeriodeContainer $bottomBorder={skalHaBottomBorder}>
            <StyledHeading level={'2'} size={'xsmall'}>
                <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />
            </StyledHeading>
            {children}
            {fjernPeriodeCallback !== undefined && (
                <StyledButton
                    type={'button'}
                    variant={'tertiary'}
                    onClick={() => fjernPeriodeCallback()}
                    icon={<TrashFillIcon aria-hidden />}
                >
                    <SpråkTekst id={fjernKnappSpråkId} />
                </StyledButton>
            )}
            {vedleggNotis}
        </PeriodeContainer>
    );
};

export default PeriodeOppsummering;
