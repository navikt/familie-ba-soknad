import React from 'react';

import styled from 'styled-components/macro';

import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

import { ExternalLink } from '@navikt/ds-icons';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const StyledLenke = styled(Lenke)`
    margin-top: 1.125rem;
    display: inline-block;
`;

const StyledLenkeTekst = styled.span`
    padding-right: 0.2rem;
`;

const EksternLenke: React.FC<{ lenkeTekstSpråkId: string; lenkeSpråkId: string }> = ({
    lenkeTekstSpråkId,
    lenkeSpråkId,
}) => {
    return (
        <Normaltekst>
            <StyledLenke href={lenkeSpråkId}>
                <StyledLenkeTekst>
                    <SpråkTekst id={lenkeTekstSpråkId} />
                </StyledLenkeTekst>
                <ExternalLink strokeWidth={0.5} />
            </StyledLenke>
        </Normaltekst>
    );
};

export default EksternLenke;
