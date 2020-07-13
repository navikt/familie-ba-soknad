import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';
import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';

const OppsummeringBarnaDine: React.FC = () => {
    const { søknad } = useApp();

    const barn = søknad.barn;

    return (
        <Ekspanderbartpanel tittel={<Undertittel>Barna Dine</Undertittel>}>
            {barn.map(barn => Object.values(barn).map(felt => visLabelOgSvar(felt)))}
        </Ekspanderbartpanel>
    );
};

export default OppsummeringBarnaDine;
