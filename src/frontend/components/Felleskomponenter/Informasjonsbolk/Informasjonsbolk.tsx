import React, { ReactNode } from 'react';

import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import SpråkTekst from '../SpråkTekst/SpråkTekst';

export interface IInformasjonsbolkProps {
    tittelId?: string;
    språkValues?: { [key: string]: ReactNode };
    children?: ReactNode;
    headingLevel?: '1' | '2' | '3' | '4' | '5' | '6';
}

const InformasjonsbolkContainer = styled.div`
    margin-top: 2rem;
`;

const InformasjonsbolkChildrenWrapper = styled.div`
    margin-top: 1.125rem;
`;

const Informasjonsbolk: React.FC<IInformasjonsbolkProps> = ({
    tittelId,
    språkValues,
    children,
    headingLevel = '3',
    ...props
}) => {
    return (
        <InformasjonsbolkContainer {...props}>
            {tittelId && (
                <Heading level={headingLevel} size={'xsmall'}>
                    <SpråkTekst id={tittelId} values={språkValues} />
                </Heading>
            )}
            <InformasjonsbolkChildrenWrapper>{children}</InformasjonsbolkChildrenWrapper>
        </InformasjonsbolkContainer>
    );
};

export default Informasjonsbolk;
