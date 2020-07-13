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
                    <Barnekort
                        navn={barn.navn}
                        alder={barn.alder}
                        borMedSøker={barn.borMedSøker}
                        ident={barn.ident}
                        fødselsdato={barn.fødselsdato}
                        medISøknad={barn.medISøknad}
                    />
                ))}
            </div>
        </Steg>
    );
};

export default Steg2;
