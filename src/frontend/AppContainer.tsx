import React from 'react';

import Alertstripe from 'nav-frontend-alertstriper';

import { RessursStatus } from '@navikt/familie-typer';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useApp } from './context/AppContext';
import { useFeatureToggles } from './context/FeatureToggleContext';
import Søknad from './Søknad';
import { EFeatureToggle } from './typer/feature-toggles';

const AppContainer = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();
    const { toggles } = useFeatureToggles();

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
            {systemetOK() && <Søknad />}
            {systemetFeiler() && !systemetLaster() && <Feilside />}
            {toggles[EFeatureToggle.EØS_KOMPLETT] && <div>EØS KOMPLETT skrudd på</div>}
        </main>
    );
};

export default AppContainer;
