import React from 'react';

import { shouldPolyfill } from '@formatjs/intl-numberformat/should-polyfill';
import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import App from './App';
import { SpråkProvider } from './components/Felleskomponenter/Dekoratøren/SpråkContext';
import MiljøProvider from './MiljøProvider';
import { LocaleType } from './typer/common';
import { initSentry } from './utils/sentry';
import '@navikt/ds-css';

const polyfillLocaledata = async () => {
    // https://github.com/formatjs/formatjs/issues/3066
    await import('@formatjs/intl-numberformat/polyfill-force');
    await import('@formatjs/intl-datetimeformat/polyfill-force');

    for (const locale in LocaleType) {
        // Last ned land-navn for statsborgeskap
        await import(
            /* webpackInclude: /(nb|nn|en)\.json/ */
            /* webpackChunkName: "localedata" */
            /* webpackMode: "lazy-once" */
            `i18n-iso-countries/langs/${locale}.json`
        ).then(result => registerLocale(result));

        if (shouldPolyfill(locale)) {
            await import(
                /* webpackInclude: /(nb|nn|en)\.js/ */
                /* webpackChunkName: "localedata" */
                /* webpackMode: "lazy-once" */
                `@formatjs/intl-numberformat/locale-data/${locale}`
            );
            await import(
                /* webpackInclude: /(nb|nn|en)\.js/ */
                /* webpackChunkName: "localedata" */
                /* webpackMode: "lazy-once" */
                `@formatjs/intl-datetimeformat/locale-data/${locale}`
            );
        }
    }
};

polyfillLocaledata().then(() => {
    initSentry();

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    const container = document.getElementById('root');
    const root = createRoot(container!);

    root.render(
        <React.StrictMode>
            <SpråkProvider>
                <MiljøProvider>
                    <App />
                </MiljøProvider>
            </SpråkProvider>
        </React.StrictMode>
    );
});
