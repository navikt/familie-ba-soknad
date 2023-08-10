import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Fieldset } from '@navikt/ds-react';

import SpråkTekst from './SpråkTekst/SpråkTekst';

const Container = styled(Fieldset)`
    border: none;
    padding: 0;

    && {
        margin-bottom: 4rem;
    }

    > div :not(:last-child) {
        margin-bottom: 1.5rem;
    }
`;

const SkjemaFieldset: React.FC<{
    tittelId: string;
    språkValues?: { [key: string]: ReactNode };
    dynamisk?: boolean;
    children?: ReactNode;
}> = ({ tittelId, språkValues, dynamisk = false, children }) => {
    return (
        <Container
            aria-live={dynamisk ? 'polite' : 'off'}
            legend={<SpråkTekst id={tittelId} values={språkValues} />}
        >
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default SkjemaFieldset;
