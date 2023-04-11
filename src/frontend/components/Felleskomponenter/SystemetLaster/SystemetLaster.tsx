import React from 'react';

import styled from 'styled-components';

import NavFrontendSpinner from 'nav-frontend-spinner';

import { Heading } from '@navikt/ds-react';

const StyledSpinner = styled(NavFrontendSpinner)`
    margin-top: 3rem;
    height: 10rem;
    width: 10rem;
`;

const SystemetLaster = () => {
    return (
        <main className={'systemet-laster'}>
            <div className={'systemet-laster__content'}>
                <Heading
                    size={'medium'}
                    className={'systemet-laster__content--tekst'}
                    children={'Søknaden laster'}
                />
                <StyledSpinner transparent={true} />
            </div>
        </main>
    );
};

export default SystemetLaster;
