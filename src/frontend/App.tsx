import React from 'react';

import * as Sentry from '@sentry/react';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';

import { HttpProvider } from '@navikt/familie-http';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { tekster } from '../shared-utils/tekster';

import AppContainer from './AppContainer';
import FamilieAlert from './components/Felleskomponenter/FamilieAlert/FamilieAlert';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { AppProvider } from './context/AppContext';
import { AppNavigationProvider } from './context/AppNavigationContext';
import { EøsProvider } from './context/EøsContext';
import { FeatureTogglesProvider } from './context/FeatureToggleContext';
import { InnloggetProvider } from './context/InnloggetContext';
import { LastRessurserProvider } from './context/LastRessurserContext';
import { RoutesProvider } from './context/RoutesContext';
import { SanityProvider } from './context/SanityContext';
import { StegProvider } from './context/StegContext';
import { GlobalStyle } from './Theme';
import { logError } from './utils/amplitude';
import { routerBasePath } from './utils/hjelpefunksjoner';

function App() {
    const [valgtLocale] = useSprakContext();
    return (
        <IntlProvider locale={valgtLocale} messages={tekster[valgtLocale]}>
            <HttpProvider>
                <Sentry.ErrorBoundary
                    fallback={() => <Feilside />}
                    beforeCapture={scope => scope.setTag('scope', 'familie-ba-soknad')}
                    onError={logError}
                >
                    <LastRessurserProvider>
                        <SanityProvider>
                            <InnloggetProvider>
                                <FeatureTogglesProvider>
                                    <AppProvider>
                                        <EøsProvider>
                                            <RoutesProvider>
                                                <Router basename={routerBasePath}>
                                                    <StegProvider>
                                                        <GlobalStyle />
                                                        {process.env.NODE_ENV !== 'production' && (
                                                            <FamilieAlert
                                                                variant={'warning'}
                                                                inline={false}
                                                            >
                                                                {`Denne siden er under utvikling. `}
                                                                <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                                                                    Klikk her for å gå til våre
                                                                    sider for barnetrygd
                                                                </a>
                                                            </FamilieAlert>
                                                        )}
                                                        <AppNavigationProvider>
                                                            <AppContainer />
                                                        </AppNavigationProvider>
                                                    </StegProvider>
                                                </Router>
                                            </RoutesProvider>
                                        </EøsProvider>
                                    </AppProvider>
                                </FeatureTogglesProvider>
                            </InnloggetProvider>
                        </SanityProvider>
                    </LastRessurserProvider>
                </Sentry.ErrorBoundary>
            </HttpProvider>
        </IntlProvider>
    );
}

export default App;
