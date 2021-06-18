import React, { useEffect, useState } from 'react';

import AlertStripe from 'nav-frontend-alertstriper';

import AppContainer from './AppContainer';
import { AppProvider } from './context/AppContext';
import { RoutesProvider } from './context/RoutesContext';

function App() {
    const [go, setGo] = useState(false);

    useEffect(() => {
        if (go) {
            const a = {};
            console.warn('Lager feil');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            console.warn(a.b.c);
        }
    });

    return (
        <AppProvider>
            <button onClick={() => setGo(true)}>
                Få en feil i Sentry med tags: scope = "familie-ba-soknad"
            </button>
            {process.env.NODE_ENV !== 'production' && (
                <AlertStripe type="advarsel">
                    {`Denne siden er under utvikling. `}
                    <a href="https://www.nav.no/no/person/familie/barnetrygd-og-kontantstotte/barnetrygd">
                        Klikk her for å gå til våre sider for barnetrygd
                    </a>
                </AlertStripe>
            )}
            <RoutesProvider>
                <AppContainer />
            </RoutesProvider>
        </AppProvider>
    );
}

export default App;
