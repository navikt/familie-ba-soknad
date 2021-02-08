import React from 'react';

import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';

const BarnekortContainer = styled.div<{ kunEttBarn: boolean }>`
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    margin-top: 1rem;
    justify-content: ${props => (props.kunEttBarn ? 'center' : 'flex-start')}
    width: ${props => (props.kunEttBarn ? 'auto' : '38.75rem')}
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
