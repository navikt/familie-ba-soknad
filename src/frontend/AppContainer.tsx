import React from 'react';

import Alertstripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import { FeatureToggle } from './components/Felleskomponenter/FeatureToggle/FeatureToggle';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useApp } from './context/AppContext';
import { RoutesProvider } from './context/RoutesContext';
import Søknad from './Søknad';
import { EFeatureToggle } from './typer/feature-toggles';

const AppContainer = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();

    return (
        <main>
            {systemetLaster() && <SystemetLaster />}
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
            {systemetFeiler() && !systemetLaster() && <Feilside />}
            <FeatureToggle toggle={EFeatureToggle.EØS_FULL}>eøs on</FeatureToggle>
        </main>
    );
};

export default AppContainer;
