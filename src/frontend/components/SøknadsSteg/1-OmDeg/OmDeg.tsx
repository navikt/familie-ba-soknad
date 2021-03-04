import React from 'react';

import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';

const OmDeg: React.FC = () => {
    return (
        <Steg tittel={'Om deg'} erSpørsmålBesvart={true}>
            <Personopplysninger />
        </Steg>
    );
};

export default OmDeg;
