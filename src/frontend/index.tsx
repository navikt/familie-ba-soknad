import React from 'react';

import * as Sentry from '@sentry/browser';
import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import { version } from './../../package.json';
import './index.less';
import App from './App';
import * as norskeTekster from './assets/lang/nb.json';

const environment = window.location.hostname;

Sentry.init({
    dsn: 'https://75e165345c514862b5829a724a4e8e45@sentry.gc.nav.no/71',
    release: version,
    environment,
    //enabled: process.env.NODE_ENV !== 'development', - TODO legge til denne når vi går live
});

if (process.env.NODE_ENV !== 'production') {
    import('@axe-core/react').then(({ default: axe }) => {
        axe(React, ReactDOM, 1000);
    });
}

// Last ned land-navn for statsborgeskap
import(`i18n-iso-countries/langs/nb.json`).then(result => registerLocale(result));

ReactDOM.render(
    <React.StrictMode>
        <SprakProvider tekster={{ nb: norskeTekster }} defaultLocale={LocaleType.nb}>
            <HttpProvider>
                <App />
            </HttpProvider>
        </SprakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
