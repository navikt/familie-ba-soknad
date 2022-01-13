import React from 'react';

import { useIntl } from 'react-intl';

import { BarnetsId } from '../../../../typer/common';
import { barnetsNavnValue } from '../../../../utils/barn';
import Steg from '../../../Felleskomponenter/Steg/Steg';
import { useEøsForBarn } from './useEøsForBarn';

const EøsForBarn: React.FC<{ barnetsId: BarnetsId }> = ({ barnetsId }) => {
    const { skjema, validerFelterOgVisFeilmelding, valideringErOk, oppdaterSøknad, barn } =
        useEøsForBarn(barnetsId);
    const intl = useIntl();

    return (
        <Steg
            tittel={'Steg for eøs: ' + barnetsNavnValue(barn, intl)}
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
