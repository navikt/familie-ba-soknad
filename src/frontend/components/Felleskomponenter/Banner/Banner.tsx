import React from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';
import { APurple200, APurple400 } from '@navikt/ds-tokens/dist/tokens';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

const Section = styled.section`
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: ${APurple200};
    border-bottom: 4px solid ${APurple400};
    text-align: center;
    margin-bottom: 1rem;
`;

const Banner: React.FC<{ språkTekstId: string }> = ({ språkTekstId }) => {
    return (
        <Section>
            <Heading size="large">
                <SpråkTekst id={språkTekstId} />
            </Heading>
        </Section>
    );
};

export default Banner;
