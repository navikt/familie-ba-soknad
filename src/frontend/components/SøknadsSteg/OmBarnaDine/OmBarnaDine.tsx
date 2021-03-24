import React from 'react';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../Steg/Steg';
import { useOmBarnaDine } from './useOmBarnaDine';

const OmBarnaDine: React.FC = () => {
    const {
        skjema,
        validerFelterOgVisFeilmelding,
        valideringErOk,
        oppdaterSøknad,
    } = useOmBarnaDine();
    return (
        <Steg
            tittel={<SpråkTekst id={'ombarnadine.tittel'} />}
            validerFelterOgVisFeilmelding={validerFelterOgVisFeilmelding}
            valideringErOk={valideringErOk}
            skjema={skjema}
            gåVidereOnClickCallback={oppdaterSøknad}
        >
            <span>hei</span>
        </Steg>
    );
};

export default OmBarnaDine;
