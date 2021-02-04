import React from 'react';

import styled from 'styled-components/macro';

export interface IInformasjonsbolkProps {
    tittel: React.ReactNode;
}

const InformasjonsbolkContainer = styled.div`
    margin-top: 4rem;
`;

const InformasjonsbolkChildrenWrapper = styled.div`
    margin-top: 0.75 rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({ tittel, children }) => {
    return (
        <InformasjonsbolkContainer>
            {tittel}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
