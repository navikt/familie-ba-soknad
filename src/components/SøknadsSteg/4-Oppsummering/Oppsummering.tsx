import React from 'react';
import Steg from '../Steg/Steg';
import OppsummeringSøknadstype from './OppsummeringSøknadstype';

const Oppsummering: React.FC = () => {
    return (
        <Steg tittel={'Oppsummering'}>
            <OppsummeringSøknadstype />
        </Steg>
    );
};

export default Oppsummering;
