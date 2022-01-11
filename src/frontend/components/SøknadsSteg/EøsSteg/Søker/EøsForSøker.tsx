import React from 'react';

import Steg from '../../../Felleskomponenter/Steg/Steg';
import { useEøsForSøker } from './useEøsForSøker';

const EøsForSøker: React.FC = () => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useEøsForSøker();

    return (
        <Steg
            tittel={'Steg for eøs søker'}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <div>Dette er et nytt steg for EØS Søker</div>
        </Steg>
    );
};

export default EøsForSøker;
