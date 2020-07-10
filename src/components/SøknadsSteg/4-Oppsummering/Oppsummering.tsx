import React from 'react';
import Steg from '../Steg/Steg';
import { useApp } from '../../../context/AppContext';
import OppsummeringSøknadstype from './OppsummeringSøknadstype';

const Oppsummering: React.FC = () => {
    const { søknad, settSøknad } = useApp();

    return (
        <Steg tittel={'Oppsummering'}>
            <OppsummeringSøknadstype />
        </Steg>
    );
};

export default Oppsummering;
