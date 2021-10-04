import React from 'react';

import Alertstripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useApp } from './context/AppContext';
import { RoutesProvider } from './context/RoutesContext';
import Søknad from './Søknad';

const AppContainer = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();

    const systemetLaster1 = systemetLaster();
    return (
        <main>
            {systemetLaster1 && <SystemetLaster />}
            {sluttbruker.status === RessursStatus.IKKE_TILGANG && (
                <div>
                    <Alertstripe type="advarsel">
                        {'Du må søke på papir. '}
                        <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                            Klikk her for å gå til våre sider for barnetrygd
                        </a>
                    </Alertstripe>
                </div>
            )}
            {systemetOK() && (
                <RoutesProvider>
                    <Søknad />
                </RoutesProvider>
            )}
            {systemetFeiler() && !systemetLaster1 && <Feilside />}
        </main>
    );
};

export default AppContainer;
