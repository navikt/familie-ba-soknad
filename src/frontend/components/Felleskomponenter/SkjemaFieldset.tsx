import React from 'react';

import styled from 'styled-components/macro';

import { Undertittel } from 'nav-frontend-typografi';

import SpråkTekst from './SpråkTekst/SpråkTekst';

const Container = styled.fieldset`
    border: none;
    padding: 0;

    && {
        margin-bottom: 4rem;
    }

    > div :not(:last-child) {
        margin-bottom: 1.5rem;
    }
`;

const StyledLegend = styled.legend`
    margin-bottom: 1.5rem;
`;

const SkjemaFieldset: React.FC<{
    tittelId: string;
    språkValues: { [key: string]: string };
}> = ({ tittelId, språkValues, children }) => {
    return (
        <Container>
            <StyledLegend>
                <Undertittel>
                    <SpråkTekst id={tittelId} values={språkValues} />
                </Undertittel>
            </StyledLegend>
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default SkjemaFieldset;
