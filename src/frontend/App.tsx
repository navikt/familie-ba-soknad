import { GlobalAlert } from '@navikt/ds-react';
import { BrowserRouter as Router } from 'react-router';

import { BASE_PATH, erProd } from '../common/miljø';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { RoutesProvider } from './context/RoutesContext';
import { StegProvider } from './context/StegContext';

import './index.css';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import { loggFeil } from './context/axios';
import { SanityProvider } from './context/SanityContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
    queryCache: new QueryCache({
        onError: error => {
            loggFeil(error instanceof AxiosError ? error : new AxiosError(error.message));
        },
    }),
    mutationCache: new MutationCache({
        onError: error => {
            loggFeil(error instanceof AxiosError ? error : new AxiosError(error.message));
        },
    }),
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            {!erProd() && <ReactQueryDevtools position={'right'} initialIsOpen={false} />}
            <SanityProvider>
                <AppProvider>
                    <EøsProvider>
                        <RoutesProvider>
                            <Router basename={BASE_PATH}>
                                <StegProvider>
                                    {process.env.NODE_ENV !== 'production' && (
                                        <GlobalAlert status={'warning'}>
                                            <GlobalAlert.Header>
                                                <GlobalAlert.Title>Denne siden er under utvikling.</GlobalAlert.Title>
                                            </GlobalAlert.Header>
                                            <GlobalAlert.Content>
                                                <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                                    Klikk her for å gå til våre sider for barnetrygd
                                                </a>
                                            </GlobalAlert.Content>
                                        </GlobalAlert>
                                    )}
                                    <AppNavigationProvider>
                                        <AppContainer />
                                    </AppNavigationProvider>
                                </StegProvider>
                            </Router>
                        </RoutesProvider>
                    </EøsProvider>
                </AppProvider>
            </SanityProvider>
        </QueryClientProvider>
    );
}

export default App;
