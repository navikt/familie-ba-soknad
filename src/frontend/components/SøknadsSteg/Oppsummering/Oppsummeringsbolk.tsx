import React from 'react';

import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

import { IRoute, RouteEnum, useRoutes } from '../../../context/RoutesContext';
import { AppLenke } from '../../Felleskomponenter/AppLenke/AppLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import { useLocation } from 'react-router-dom';

interface Props {
    tittel: string;
    språkValues?: { [key: string]: string };
    route?: IRoute;
}

const StyledOppsummeringsbolk = styled.div`
    border-bottom: 2px solid ${navFarger.navGra60};
`;

const StyledEkspanderbartpanel = styled(Ekspanderbartpanel)`
    && button {
        box-shadow: none;
        border-radius: 0;
        :focus {
            border: solid 3px ${navFarger.fokusFarge};
            border-radius: 0.25rem;
        }
    }
`;

const Oppsummeringsbolk: React.FC<Props> = ({
    children,
    tittel,
    språkValues,
    route,
}) => {
    const { hentStegNummer, hentNåværendeRoute } = useRoutes();
    const { pathname } = useLocation();
    const inneværendeRoute = hentNåværendeRoute(pathname);

    return (
        <StyledOppsummeringsbolk>
            <StyledEkspanderbartpanel
                tittel={
                    <Undertittel>
                        {`${hentStegNummer(route?.route ?? RouteEnum.OmDeg)}. `}
                        <SpråkTekst id={tittel} values={språkValues} />
                    </Undertittel>
                }
                border={false}
                apen={true}
            >
                {children}
                {route && (
                    <AppLenke
                        route={route}
                        språkTekstId={'oppsummering.endresvar.lenketekst'}
                        returnTo={inneværendeRoute}
                    />
                )}
            </StyledEkspanderbartpanel>
        </StyledOppsummeringsbolk>
    );
};

export default Oppsummeringsbolk;
