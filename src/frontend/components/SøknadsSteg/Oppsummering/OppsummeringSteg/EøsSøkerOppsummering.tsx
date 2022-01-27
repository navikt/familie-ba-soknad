import React from 'react';

import { useRoutes } from '../../../../context/RoutesContext';
import { RouteEnum } from '../../../../typer/routes';
import { useEøsForSøker } from '../../EøsSteg/Søker/useEøsForSøker';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const EøsSøkerOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentRouteObjektForRouteEnum } = useRoutes();

    return (
        <Oppsummeringsbolk
            steg={hentRouteObjektForRouteEnum(RouteEnum.EøsForSøker)}
            tittel={'eøs-om-deg.sidetittel'}
            skjemaHook={useEøsForSøker}
            settFeilAnchors={settFeilAnchors}
        />
    );
};

export default EøsSøkerOppsummering;
