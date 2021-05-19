import React from 'react';

import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

import { useRoutes, RouteEnum } from '../../../context/RoutesContext';
import LenkeMedIkon from '../../Felleskomponenter/LenkeMedIkon/LenkeMedIkon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    tittel: string;
    lenke?: RouteEnum;
    språkValues?: { [key: string]: string };
    route?: RouteEnum;
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

const Oppsummeringsbolk: React.FC<Props> = ({ children, tittel, lenke, språkValues, route }) => {
    const history = useHistory();
    const { hentPath, hentStegNummer } = useRoutes();

    return (
        <StyledOppsummeringsbolk>
            <StyledEkspanderbartpanel
                tittel={
                    <Undertittel>
                        {route && `${hentStegNummer(route)}. `}
                        <SpråkTekst id={tittel} values={språkValues} />
                    </Undertittel>
                }
                border={false}
                apen={true}
            >
                {children}
                {lenke && (
                    <LenkeMedIkon
                        onClick={() =>
                            history.replace({
                                pathname: hentPath(lenke),
                                state: { kommerFraOppsummering: true },
                            })
                        }
                    />
                )}
            </StyledEkspanderbartpanel>
        </StyledOppsummeringsbolk>
    );
};

export default Oppsummeringsbolk;
