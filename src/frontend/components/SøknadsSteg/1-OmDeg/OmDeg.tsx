import React from 'react';

import Steg from '../Steg/Steg';
import { Personopplysninger } from './Personopplysninger';
import { useStegEn } from './useStegEn';

const OmDeg: React.FC = () => {
    const { skjema, kanSendeSkjema } = useStegEn();

    return (
        <Steg tittel={'Om deg'} kanGåTilNesteSteg={kanSendeSkjema}>
            <Personopplysninger skjema={skjema} />
        </Steg>
    );
};

export default OmDeg;
