import React from 'react';

import { shouldPolyfill } from '@formatjs/intl-numberformat/should-polyfill.js';
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

const importerIntlNumberFormatLocaleData = async (locale: string) => {
    switch (locale) {
        case LocaleType.nb:
            await import('@formatjs/intl-numberformat/locale-data/nb.js');
            return;
        case LocaleType.nn:
            await import('@formatjs/intl-numberformat/locale-data/nn.js');
            return;
        case LocaleType.en:
            await import('@formatjs/intl-numberformat/locale-data/en.js');
            return;
        default:
            return;
    }
};

const importerIntlDateTimeFormatLocaleData = async (locale: string) => {
    switch (locale) {
        case LocaleType.nb:
            await import('@formatjs/intl-datetimeformat/locale-data/nb.js');
            return;
        case LocaleType.nn:
            await import('@formatjs/intl-datetimeformat/locale-data/nn.js');
            return;
        case LocaleType.en:
            await import('@formatjs/intl-datetimeformat/locale-data/en.js');
            return;
        default:
            return;
    }
};

const polyfillLocaledata = async () => {
    // https://github.com/formatjs/formatjs/issues/3066
    await import('@formatjs/intl-numberformat/polyfill-force.js');
    await import('@formatjs/intl-datetimeformat/polyfill-force.js');

    for (const locale in LocaleType) {
        // Last ned land-navn for statsborgeskap
        await import(
            /* webpackInclude: /(nb|nn|en)\.json/ */
            /* webpackChunkName: "localedata" */
            /* webpackMode: "lazy-once" */
            `i18n-iso-countries/langs/${locale}.json`
        ).then(result => registerLocale(result));

        if (shouldPolyfill(locale)) {
            await importerIntlNumberFormatLocaleData(locale);
            await importerIntlDateTimeFormatLocaleData(locale);
        }
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
