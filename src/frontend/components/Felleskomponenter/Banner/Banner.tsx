import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';
import { APurple200, APurple400 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../context/AppContext';
import { ESanitySteg } from '../../../typer/sanity/sanity';

const Section = styled.section`
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: ${APurple200};
    border-bottom: 4px solid ${APurple400};
    text-align: center;
    margin-bottom: 1rem;
`;

const Banner: React.FC = () => {
    const { tekster, plainTekst } = useApp();
    return (
        <Section>
            <Heading size="large">
                {plainTekst(tekster()[ESanitySteg.FORSIDE].soeknadstittelBarnetrygd)}
            </Heading>
        </Section>
    );
};

export default Banner;
