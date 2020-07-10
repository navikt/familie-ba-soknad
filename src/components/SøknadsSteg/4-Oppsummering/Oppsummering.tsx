import React from 'react';
import Steg from '../Steg/Steg';
import OppsummeringSøknadstype from './OppsummeringSøknadstype';
import OppsummeringBarnaDine from './OppsummeringBarnaDine';

const Oppsummering: React.FC = () => {
    return (
        <Steg tittel={'Oppsummering'}>
            <OppsummeringSøknadstype />
            <OppsummeringBarnaDine />
        </Steg>
    );
};

export default Oppsummering;
