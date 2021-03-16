import React from 'react';

import styled from 'styled-components/macro';

import { useApp } from '../../../context/AppContext';
import { hentAlder } from '../../../utils/person';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';

const BarnekortContainer = styled.div<{ kunEttBarn: boolean }>`
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    margin-top: 1rem;
    justify-content: ${props => (props.kunEttBarn ? 'center' : 'flex-start')};
    width: ${props => (props.kunEttBarn ? 'auto' : '38.75rem')};
`;

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();

    const kunEttBarn = søknad.søker.barn.length === 1;

    return (
        <Steg tittel={'Velg barn'} kanGåTilNesteSteg={() => søknad.barn.length > 0}>
            Velg hvilke barn du vil inkludere i søknaden din
            <BarnekortContainer kunEttBarn={kunEttBarn}>
                {søknad.søker.barn.map(barn => (
                    <Barnekort key={barn.ident} {...barn} alder={hentAlder(barn.fødselsdato)} />
                ))}
            </BarnekortContainer>
        </Steg>
    );
};

export default VelgBarn;
