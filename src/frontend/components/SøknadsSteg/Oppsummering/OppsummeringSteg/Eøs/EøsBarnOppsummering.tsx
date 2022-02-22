import React from 'react';

import { useIntl } from 'react-intl';

import { useSteg } from '../../../../../context/StegContext';
import { IBarnMedISøknad } from '../../../../../typer/barn';
import { barnetsNavnValue } from '../../../../../utils/barn';
import { useEøsForBarn } from '../../../EøsSteg/Barn/useEøsForBarn';
import Oppsummeringsbolk from '../../Oppsummeringsbolk';
import EøsAndreForelderOppsummering from './EøsAndreForelderOppsummering';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
    barn: IBarnMedISøknad;
    nummer: string;
}

const EøsBarnOppsummering: React.FC<Props> = ({ settFeilAnchors, nummer, barn }) => {
    const { hentStegObjektForBarnEøs } = useSteg();
    const eøsForBarnHook = useEøsForBarn(barn.id);

    const intl = useIntl();
    const barnetsNavn = barnetsNavnValue(barn, intl);

    return (
        <Oppsummeringsbolk
            tittel={'eøs-om-barn.oppsummering.tittel'}
            språkValues={{ nummer, barn: barnetsNavn }}
            steg={hentStegObjektForBarnEøs(barn)}
            skjemaHook={eøsForBarnHook}
            settFeilAnchors={settFeilAnchors}
        >
            {barn.andreForelder && (
                <EøsAndreForelderOppsummering barn={barn} andreForelder={barn.andreForelder} />
            )}
        </Oppsummeringsbolk>
    );
};

export default EøsBarnOppsummering;
