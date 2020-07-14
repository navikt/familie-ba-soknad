import React from 'react';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { useApp } from '../../../context/AppContext';

const Steg2: React.FC = () => {
    const { søknad } = useApp();

    return (
        <Steg tittel={'Steg 2'}>
            Dette er Steg 2
            <div className="barnekort-wrapper">
                {søknad.barn.map(barn => (
                    <Barnekort {...barn} />
                ))}
            </div>
        </Steg>
    );
};

export default Steg2;
