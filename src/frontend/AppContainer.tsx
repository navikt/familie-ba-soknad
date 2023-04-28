import React from 'react';

import { RessursStatus } from '@navikt/familie-typer';

import FamilieAlert from './components/Felleskomponenter/FamilieAlert/FamilieAlert';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import SystemetLaster from './components/Felleskomponenter/SystemetLaster/SystemetLaster';
import { useApp } from './context/AppContext';
import Søknad from './Søknad';
const AppContainer = () => {
    const { systemetLaster, systemetFeiler, sluttbruker, systemetOK } = useApp();

    return (
        <main>
            {systemetLaster() && <SystemetLaster />}
            {sluttbruker.status === RessursStatus.IKKE_TILGANG && (
                <div>
                    <FamilieAlert variant={'warning'}>
                        {'Du må søke på papir. '}
                        <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                            Klikk her for å gå til våre sider for barnetrygd
                        </a>
                    </FamilieAlert>
                </div>
            )}
            {systemetOK() && <Søknad />}
            {systemetFeiler() && !systemetLaster() && <Feilside />}
        </main>
    );
};

export default AppContainer;
