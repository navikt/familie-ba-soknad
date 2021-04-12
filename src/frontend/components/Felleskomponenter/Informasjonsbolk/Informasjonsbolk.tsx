import React from 'react';

import styled from 'styled-components/macro';

import { Undertittel } from 'nav-frontend-typografi';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

export interface IInformasjonsbolkProps {
    tittelId?: string;
    className?: string;
}

const InformasjonsbolkContainer = styled.div`
    margin-top: 2rem;
`;

const InformasjonsbolkChildrenWrapper = styled.div`
    margin-top: 1.125rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({ tittelId, children, className }) => {
    return (
        <InformasjonsbolkContainer className={className}>
            {tittelId && (
                <Undertittel>
                    <SpråkTekst id={tittelId} />
                </Undertittel>
            )}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
