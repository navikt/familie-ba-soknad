import React from 'react';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { useApp } from '../../../context/AppContext';

const Steg2: React.FC = () => {
    const { søknad } = useApp();

    return (
        <Steg tittel={'Velg barn'}>
            Velg hvilke barn du vil inkludere i søknaden din
            <div className="barnekort-container">
                {søknad.barn.map(barn => (
                    <Barnekort {...barn} />
                ))}
            </div>
        </Steg>
    );
};

export default Steg2;
