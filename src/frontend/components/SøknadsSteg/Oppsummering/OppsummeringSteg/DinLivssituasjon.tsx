import React from 'react';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import {
    DinLivssituasjonSpørsmålId,
    dinLivssituasjonSpørsmålSpråkId,
} from '../../Utvidet-DinLivssituasjon/spørsmål';
import { useDinLivssituasjon } from '../../Utvidet-DinLivssituasjon/useDinLivssituasjon';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const DinLivssituasjonOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { hentStegObjektForRoute } = useRoutes();
    const { søknad } = useApp();

    return (
        <Oppsummeringsbolk
            route={hentStegObjektForRoute(RouteEnum.DinLivssituasjon)}
            tittel={'dinlivssituasjon.sidetittel'}
            skjemaHook={useDinLivssituasjon}
            settFeilAnchors={settFeilAnchors}
        >
            <StyledOppsummeringsFeltGruppe>
                <OppsummeringFelt
                    tittel={
                        <SpråkTekst
                            id={dinLivssituasjonSpørsmålSpråkId[DinLivssituasjonSpørsmålId.årsak]}
                        />
                    }
                    søknadsvar={søknad.søker.utvidet.spørsmål.årsak.svar}
                />
            </StyledOppsummeringsFeltGruppe>
        </Oppsummeringsbolk>
    );
};

export default DinLivssituasjonOppsummering;
