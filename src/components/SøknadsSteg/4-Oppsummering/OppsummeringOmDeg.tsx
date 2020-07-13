import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';
import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';

const OppsummeringOmDeg: React.FC = () => {
    const { søknad } = useApp();

    const søker = søknad.søker;

    return (
        <Ekspanderbartpanel tittel={<Undertittel>Om Deg</Undertittel>}>
            {visLabelOgSvar(søker.navn)}
        </Ekspanderbartpanel>
    );
};

export default OppsummeringOmDeg;
