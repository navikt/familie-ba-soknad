import React from 'react';
import Steg from '../Steg/Steg';
import { useApp } from '../../../context/AppContext';

const Steg2: React.FC = () => {
    const { søknad } = useApp();

    console.log(søknad);

    return <Steg tittel={'Steg 2'}>Dette er Steg 2</Steg>;
};

export default Steg2;
