import React, { PropsWithChildren } from 'react';

import { ApmErrorBoundary } from '@nais/apm/react';

import { HttpProvider } from '@navikt/familie-http';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { FeatureTogglesProvider } from './context/FeatureTogglesContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { SanityProvider } from './context/SanityContext';

const MiljøProvider: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <HttpProvider>
            <ApmErrorBoundary fallback={<Feilside />}>
                <LastRessurserProvider>
                    <SanityProvider>
                        <InnloggetProvider>
                            <FeatureTogglesProvider>{children}</FeatureTogglesProvider>
                        </InnloggetProvider>
                    </SanityProvider>
                </LastRessurserProvider>
            </ApmErrorBoundary>
        </HttpProvider>
    );
};

export default MiljøProvider;
