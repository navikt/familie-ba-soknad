import React from 'react';

import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { awaitDecoratorData } from '@navikt/nav-dekoratoren-moduler';

import App from './App';
import { SpråkProvider } from './context/SpråkContext';
import { hentDekorator } from './decorator';
import MiljøProvider from './MiljøProvider';
import { polyfillLocaleData } from './polyfillLocaleData';
import { initGrafanaFaro } from './utils/grafanaFaro';
import { initSentry } from './utils/sentry';

import '@navikt/ds-css';

hentDekorator();

polyfillLocaleData().then(async () => {
    initSentry();
    initGrafanaFaro();

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    await awaitDecoratorData();

    const container = document.getElementById('root');
    const root = createRoot(container!);

    root.render(
        <React.StrictMode>
            <CookiesProvider>
                <SpråkProvider>
                    <MiljøProvider>
                        <App />
                    </MiljøProvider>
                </SpråkProvider>
            </CookiesProvider>
        </React.StrictMode>
    );
});
