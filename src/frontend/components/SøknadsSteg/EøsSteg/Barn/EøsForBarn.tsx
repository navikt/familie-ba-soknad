import React from 'react';

import { BarnetsId } from '../../../../typer/common';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad } =
        useEøsForBarn();

    return (
        <Steg
            tittel={'Steg for eøs barn'}
            skjema={{
                validerFelterOgVisFeilmelding,
                valideringErOk,
                skjema,
                settSøknadsdataCallback: oppdaterSøknad,
            }}
        >
            <div>Dette er et nytt steg for EØS Barn</div>
        </Steg>
    );
};

export default EøsForBarn;
