import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Undertittel } from 'nav-frontend-typografi';
import { useApp } from '../../../context/AppContext';
import { visLabelOgSvar } from '../../../utils/visning';

const OppsummeringSøknadstype: React.FC = () => {
    const { søknad } = useApp();

    const søknadstype = søknad.søknadstype;

    return (
        <Ekspanderbartpanel tittel={<Undertittel>Mer om din situasjon</Undertittel>}>
            {visLabelOgSvar(søknadstype)}
        </Ekspanderbartpanel>
    );
};

export default OppsummeringSøknadstype;
