import React from 'react';

import { shouldPolyfill } from '@formatjs/intl-numberformat/should-polyfill';
import * as Sentry from '@sentry/react';
import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';

import Modal from 'nav-frontend-modal';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import './index.less';
import App from './App';
import * as engelsk from './assets/lang/en.json';
import * as bokmål from './assets/lang/nb.json';
import * as nynorsk from './assets/lang/nn.json';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { logError } from './utils/amplitude';

const environment = window.location.hostname;

const polyfillLocaledata = async () => {
    // https://github.com/formatjs/formatjs/issues/3066
    await import('@formatjs/intl-numberformat/polyfill-force');
    await import('@formatjs/intl-datetimeformat/polyfill-force');

    for (const locale in LocaleType) {
        // Last ned land-navn for statsborgeskap

        await import(
            /* webpackInclude: /(nb|nn|en)/ */
            `i18n-iso-countries/langs/${locale}.json`
        ).then(result => registerLocale(result));

        if (shouldPolyfill(locale)) {
            await import(
                /* webpackInclude: /(nb|nn|en)/ */
                `@formatjs/intl-numberformat/locale-data/${locale}`
            );
            await import(
                /* webpackInclude: /(nb|nn|en)/ */
                `@formatjs/intl-datetimeformat/locale-data/${locale}`
            );
        }
    }
};

polyfillLocaledata().then(() => {
    Sentry.init({
        dsn: 'https://75e165345c514862b5829a724a4e8e45@sentry.gc.nav.no/71',
        environment,
        autoSessionTracking: false,
        enabled: process.env.NODE_ENV !== 'development',
    });

    if (process.env.NODE_ENV !== 'production') {
        import('@axe-core/react').then(({ default: axe }) => {
            axe(React, ReactDOM, 1000);
        });
    }

    ReactDOM.render(
        <React.StrictMode>
            <SprakProvider
                tekster={{
                    nb: bokmål,
                    nn: nynorsk,
                    en: engelsk,
                }}
                defaultLocale={LocaleType.nb}
            >
                <HttpProvider>
                    <Sentry.ErrorBoundary
                        fallback={Feilside}
                        beforeCapture={scope => scope.setTag('scope', 'familie-ba-soknad')}
                        onError={logError}
                    >
                        <App />
                    </Sentry.ErrorBoundary>
                </HttpProvider>
            </SprakProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );

    Modal.setAppElement('#root');
});
