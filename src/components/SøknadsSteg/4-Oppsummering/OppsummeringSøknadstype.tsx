import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';
import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';
import LenkeMedIkon from '../../Felleskomponenter/LenkeMedIkon/LenkeMedIkon';
import { useHistory } from 'react-router';
import { StegRoutes, RouteEnum, hentPath } from '../../../routing/Routes';

const OppsummeringSøknadstype: React.FC = () => {
    const { søknad } = useApp();
    const history = useHistory();

    const søknadstype = søknad.søknadstype;

    return (
        <Ekspanderbartpanel tittel={<Undertittel>Søknadstype</Undertittel>}>
            {visLabelOgSvar(søknadstype)}
            <LenkeMedIkon
                onClick={() =>
                    history.replace({
                        pathname: hentPath(StegRoutes, RouteEnum.Søknadstype),
                        state: { kommerFraOppsummering: true },
                    })
                }
            />
        </Ekspanderbartpanel>
    );
};

export default OppsummeringSøknadstype;
