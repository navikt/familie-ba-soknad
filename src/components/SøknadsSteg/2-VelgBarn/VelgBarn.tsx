import React from 'react';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';
import { useApp } from '../../../context/AppContext';

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();

    const erSpørsmålBesvart = søknad.barn.some(barn => barn.medISøknad.verdi);

    return (
        <Steg tittel={'Velg barn'} erSpørsmålBesvart={erSpørsmålBesvart}>
            Velg hvilke barn du vil inkludere i søknaden din
            <div className="barnekort-wrapper">
                {søknad.barn.map(barn => (
                    <Barnekort {...barn} />
                ))}
            </div>
        </Steg>
    );
};

export default VelgBarn;
