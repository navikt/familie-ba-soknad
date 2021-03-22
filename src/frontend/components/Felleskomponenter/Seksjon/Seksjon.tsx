import React from 'react';

import styled from 'styled-components/macro';

const Container = styled.div`
    && {
        margin-bottom: 4rem;
    }

    > div :not(:last-child) {
        margin-bottom: 2rem;
    }
`;

const Seksjon: React.FC<{ className?: string; tekst?: string }> = ({ className, children }) => {
    return (
        <Container className={className}>
            {React.Children.map(children, child => {
                return <div>{child}</div>;
            })}
        </Container>
    );
};

export default Seksjon;
