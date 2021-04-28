import React from 'react';

import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

import { useRoutes, RouteEnum } from '../../../context/RoutesContext';
import LenkeMedIkon from '../../Felleskomponenter/LenkeMedIkon/LenkeMedIkon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    tittel: string;
    lenke?: RouteEnum;
}

const StyledOppsummeringsbolk = styled.div`
    border-bottom: 1px solid #78706a;
`;

const Oppsummeringsbolk: React.FC<Props> = ({ children, tittel, lenke }) => {
    const history = useHistory();
    const { hentPath } = useRoutes();

    return (
        <StyledOppsummeringsbolk>
            <Ekspanderbartpanel
                tittel={
                    <Undertittel>
                        <SpråkTekst id={tittel} />
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
            </Ekspanderbartpanel>
        </StyledOppsummeringsbolk>
    );
};

export default Oppsummeringsbolk;
