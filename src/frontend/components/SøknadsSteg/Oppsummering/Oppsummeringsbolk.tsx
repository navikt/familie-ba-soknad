import React from 'react';

import { useHistory } from 'react-router';

import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';

import { useRoutes, RouteEnum } from '../../../routing/RoutesContext';
import LenkeMedIkon from '../../Felleskomponenter/LenkeMedIkon/LenkeMedIkon';

interface Props {
    tittel: string;
    lenke?: RouteEnum;
}

const Oppsummeringsbolk: React.FC<Props> = ({ children, tittel, lenke }) => {
    const history = useHistory();
    const { hentPath } = useRoutes();

    return (
        <div className="oppsummeringsbolk">
            <Ekspanderbartpanel tittel={<Undertittel>{tittel}</Undertittel>}>
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
        </div>
    );
};

export default Oppsummeringsbolk;
