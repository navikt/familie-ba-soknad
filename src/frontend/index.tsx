import React from 'react';

import { registerLocale } from 'i18n-iso-countries';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { awaitDecoratorData } from '@navikt/nav-dekoratoren-moduler';

import { LocaleType } from '../common/typer/localeType';

import App from './App';
import { SpråkProvider } from './context/SpråkContext';
import { hentDekorator } from './decorator';
import MiljøProvider from './MiljøProvider';
import { initGrafanaFaro } from './utils/grafanaFaro';
import { initSentry } from './utils/sentry';

import '@navikt/ds-css';

const polyfillLocaledata = async () => {
    for (const locale in LocaleType) {
        // Last ned land-navn for statsborgeskap
        await import(
            /* webpackInclude: /(nb|nn|en)\.json/ */
            /* webpackChunkName: "localedata" */
            /* webpackMode: "lazy-once" */
            `i18n-iso-countries/langs/${locale}.json`
        ).then(result => registerLocale(result));
    }
};

hentDekorator();

polyfillLocaledata().then(async () => {
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
