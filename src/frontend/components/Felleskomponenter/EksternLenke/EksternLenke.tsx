import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Link } from '@navikt/ds-react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledLink = styled(Link)`
    && {
        display: inline-block;
        margin-top: 0.5rem;
    }
`;

const StyledLenkeTekst = styled.span`
    padding-right: 0.2rem;
`;

const EksternLenke: React.FC<{
    lenkeTekstSpråkId: string;
    lenkeSpråkId: string;
    target?: string;
    className?: string;
}> = ({ lenkeTekstSpråkId, lenkeSpråkId, target, className }) => {
    const intl = useIntl();
    return (
        <StyledLink
            href={intl.formatMessage({ id: lenkeSpråkId })}
            target={target}
            rel="noopener noreferrer"
            className={className}
        >
            <StyledLenkeTekst>
                <SpråkTekst id={lenkeTekstSpråkId} />
            </StyledLenkeTekst>
        </StyledLink>
    );
};

export default EksternLenke;
