import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { DeleteFilled } from '@navikt/ds-icons';
import { Button, Label } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const PeriodeContainer = styled.div<{ bottomBorder: boolean }>`
    margin: 2rem 0;
    border-bottom: ${props => (props.bottomBorder ? `1px solid ${ABorderDefault}` : 'none')};
`;

const StyledButton = styled(Button)`
    && {
        margin-bottom: 1.5rem;
    }
`;

const StyledLabel = styled(Label)`
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
        <PeriodeContainer bottomBorder={skalHaBottomBorder}>
            <StyledLabel>
                <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />
            </StyledLabel>
            {children}
            {fjernPeriodeCallback !== undefined && (
                <StyledButton
                    type={'button'}
                    variant={'tertiary'}
                    onClick={() => fjernPeriodeCallback()}
                    icon={<DeleteFilled />}
                >
                    <SpråkTekst id={fjernKnappSpråkId} />
                </StyledButton>
            )}
            {vedleggNotis}
        </PeriodeContainer>
    );
};

export default PeriodeOppsummering;
