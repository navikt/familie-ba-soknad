import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledLenke = styled(Lenke)`
    display: inline-block;
    margin-top: 0.5rem;
`;

const StyledLenkeTekst = styled.span`
    padding-right: 0.2rem;
`;

const EksternLenke: React.FC<{
    lenkeTekstSpråkId: string;
    lenkeSpråkId: string;
    target?: string;
}> = ({ lenkeTekstSpråkId, lenkeSpråkId, target }) => {
    const intl = useIntl();
    return (
        <Normaltekst>
            <StyledLenke
                href={intl.formatMessage({ id: lenkeSpråkId })}
                target={target}
                rel="noopener noreferrer"
            >
                <StyledLenkeTekst>
                    <SpråkTekst id={lenkeTekstSpråkId} />
                </StyledLenkeTekst>
            </StyledLenke>
        </Normaltekst>
    );
};

export default EksternLenke;
