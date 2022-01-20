import React, { ReactNode } from 'react';

import styled from 'styled-components';

import navFarger from 'nav-frontend-core';
import { Flatknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';

import { DeleteFilled } from '@navikt/ds-icons';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const PeriodeContainer = styled.div<{ bottomBorder: boolean }>`
    margin: 2rem 0;
    border-bottom: ${props => (props.bottomBorder ? `1px solid ${navFarger.navGra60}` : 'none')};
`;

const SlettKnapp = styled(Flatknapp)`
    margin-bottom: 1.5rem;
`;

const StyledElement = styled(Element)`
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
            <StyledElement>
                <SpråkTekst id={tittelSpråkId} values={{ x: nummer }} />
            </StyledElement>
            {children}
            {fjernPeriodeCallback !== undefined && (
                <SlettKnapp htmlType={'button'} kompakt onClick={() => fjernPeriodeCallback()}>
                    <DeleteFilled />
                    <span>
                        <SpråkTekst id={fjernKnappSpråkId} />
                    </span>
                </SlettKnapp>
            )}
            {vedleggNotis}
        </PeriodeContainer>
    );
};

export default PeriodeOppsummering;
