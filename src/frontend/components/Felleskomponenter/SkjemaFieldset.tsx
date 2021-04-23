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

const StyledUndertittel = styled(Undertittel)`
    margin-bottom: 1.5rem;
`;

const SkjemaFieldset: React.FC<{
    tittelId: string;
    språkValues: { [key: string]: string };
}> = ({ tittelId, språkValues, children }) => {
    return (
        <Container>
            <legend>
                <StyledUndertittel>
                    <SpråkTekst id={tittelId} values={språkValues} />
                </StyledUndertittel>
            </legend>
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default SkjemaFieldset;
