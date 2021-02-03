import React from 'react';

import styled from 'styled-components';

export interface IInformasjonsbolkProps {
    tittel: React.ReactNode;
}

const InformasjonsbolkWrapper = styled.div`
    margin-top: 4rem;
`;

const InformasjonsbolkChild = styled.div`
    margin-top: 0.75 rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({ tittel, children }) => {
    return (
        <InformasjonsbolkWrapper>
            {tittel}
            <InformasjonsbolkChild>{children}</InformasjonsbolkChild>
        </InformasjonsbolkWrapper>
    );
};

export default Informasjonsbolk;
