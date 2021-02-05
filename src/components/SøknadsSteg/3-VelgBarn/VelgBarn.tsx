import React from 'react';

import { css } from 'styled-components';
import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';

const BarnekortContainer = styled.div<{ kunEttBarn: boolean }>`
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    margin: 0 auto;
    margin-top: 1rem;
    width: 38.75rem;
    ${props =>
        props.kunEttBarn &&
        css`
            justify-content: center;
            width: auto;
        `}
`;

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();

    const erSpørsmålBesvart = søknad.barn.verdi.some(barn => barn.verdi.medISøknad.verdi);
    const kunEttBarn = søknad.barn.verdi.length === 1;

    return (
        <Steg tittel={'Velg barn'} erSpørsmålBesvart={erSpørsmålBesvart}>
            Velg hvilke barn du vil inkludere i søknaden din
            <BarnekortContainer kunEttBarn={kunEttBarn}>
                {søknad.barn.verdi.map(barn => (
                    <Barnekort key={barn.verdi.ident.verdi} {...barn.verdi} />
                ))}
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
