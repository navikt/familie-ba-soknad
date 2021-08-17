import React from 'react';

import { useIntl } from 'react-intl';

import { useApp } from '../../../../context/AppContext';
import { RouteEnum, useRoutes } from '../../../../context/RoutesContext';
import { hentBostedSpråkId } from '../../../../utils/person';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useVelgBarn } from '../../VelgBarn/useVelgBarn';
import { StyledOppsummeringsFeltGruppe } from '../Oppsummering';
import { OppsummeringFelt } from '../OppsummeringFelt';
import Oppsummeringsbolk from '../Oppsummeringsbolk';

interface Props {
    settFeilAnchors: React.Dispatch<React.SetStateAction<string[]>>;
}

const VelgBarnOppsummering: React.FC<Props> = ({ settFeilAnchors }) => {
    const { formatMessage } = useIntl();
    const { søknad } = useApp();
    const { hentStegObjektForRoute } = useRoutes();

    return (
        <Oppsummeringsbolk
            route={hentStegObjektForRoute(RouteEnum.VelgBarn)}
            tittel={'hvilkebarn.sidetittel'}
            skjemaHook={useVelgBarn}
            settFeilAnchors={settFeilAnchors}
        >
            {søknad.barnInkludertISøknaden.map((barn, index) => (
                <StyledOppsummeringsFeltGruppe key={index}>
                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'hvilkebarn.leggtilbarn.barnets-navn'} />}
                        søknadsvar={
                            barn.adressebeskyttelse
                                ? formatMessage({
                                      id: 'hvilkebarn.barn.bosted.adressesperre',
                                  })
                                : barn.navn
                        }
                    />

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'hvilkebarn.barn.fødselsnummer'} />}
                        søknadsvar={barn.ident}
                    />

                    <OppsummeringFelt
                        tittel={<SpråkTekst id={'hvilkebarn.barn.bosted'} />}
                        søknadsvar={formatMessage({
                            id: hentBostedSpråkId(barn),
                        })}
                    />
                </StyledOppsummeringsFeltGruppe>
            ))}
        </Oppsummeringsbolk>
    );
};

export default VelgBarnOppsummering;
