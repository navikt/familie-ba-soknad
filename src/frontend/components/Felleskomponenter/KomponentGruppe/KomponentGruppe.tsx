import React from 'react';

import styled from 'styled-components/macro';

const Container = styled.div<{ inline: boolean }>`
    && {
        margin-bottom: ${props => (props.inline ? '2rem' : '4rem')};
    }

    > div :not(:last-child) {
        margin-bottom: 2rem;
    }
`;

const KomponentGruppe: React.FC<{
    className?: string;
    inline?: boolean;
}> = ({ className, children }) => {
    return (
        <Container inline className={className} aria-live={'polite'}>
            {React.Children.map(children, child => {
                return child && <div>{child}</div>;
            })}
        </Container>
    );
};

export default KomponentGruppe;
