import React from 'react';

import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { useOmdeg } from './useOmdeg';

const OmDeg: React.FC = () => {
    const { skjema, kanSendeSkjema } = useOmdeg();

    return (
        <Steg tittel={'Om deg'} kanGåTilNesteSteg={kanSendeSkjema}>
            <Personopplysninger skjema={skjema} />
        </Steg>
    );
};

export default OmDeg;
