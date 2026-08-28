import { ApmErrorBoundary } from '@nais/apm/react';
import { HttpProvider } from '@navikt/familie-http';

import type { FC, PropsWithChildren } from 'react';

import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';

const MiljøProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <HttpProvider>
            <ApmErrorBoundary fallback={<Feilside />}>
                <LastRessurserProvider>
                    <InnloggetProvider>{children}</InnloggetProvider>
                </LastRessurserProvider>
            </ApmErrorBoundary>
        </HttpProvider>
    );
};

export default MiljøProvider;
