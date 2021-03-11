import React from 'react';

import { FormattedMessage } from 'react-intl';
import styled from 'styled-components/macro';

import { Undertittel } from 'nav-frontend-typografi';

export interface IInformasjonsbolkProps {
    tittelId?: string;
}

const InformasjonsbolkContainer = styled.div`
    margin-top: 2.3rem;
`;

const InformasjonsbolkChildrenWrapper = styled.div`
    margin-top: 1.125rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({ tittelId, children }) => {
    return (
        <InformasjonsbolkContainer>
            {tittelId && (
                <Undertittel>
                    <FormattedMessage id={tittelId} />
                </Undertittel>
            )}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
