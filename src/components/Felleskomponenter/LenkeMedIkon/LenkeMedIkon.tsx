import React from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import { Normaltekst } from 'nav-frontend-typografi';

import endreIkon from '../../../assets/endre-ikon.svg';

interface Props {
    onClick: () => void;
}

const StyledNormaltekst = styled(Normaltekst)`
    margin-left: 1rem;
`;

const LenkeKnapp = styled.button`
    display: flex;
    margin-top: 2rem;
    color: ${navFarger.navBla};
    text-decoration: underline;
    border: none;
    background-color: white;
    outline: none;
    :hover {
        text-decoration: none;
        cursor: pointer;
    }
`;

const LenkeMedIkon: React.FC<Props> = ({ onClick }) => {
    return (
        <LenkeKnapp onClick={onClick}>
            <img alt="Endre" src={endreIkon} />
            <StyledNormaltekst>Endre informasjon</StyledNormaltekst>
        </LenkeKnapp>
    );
};

export default LenkeMedIkon;
