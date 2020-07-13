import React from 'react';
import Steg from '../Steg/Steg';
import OppsummeringSøknadstype from './OppsummeringSøknadstype';
import OppsummeringBarnaDine from './OppsummeringBarnaDine';
import OppsummeringOmDeg from './OppsummeringOmDeg';

const Oppsummering: React.FC = () => {
    return (
        <Steg tittel={'Oppsummering'}>
            <OppsummeringSøknadstype />
            <OppsummeringOmDeg />
            <OppsummeringBarnaDine />
        </Steg>
    );
};

export default Oppsummering;
