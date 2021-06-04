import React from 'react';

import * as Sentry from '@sentry/react';
import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';

import Modal from 'nav-frontend-modal';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import packageJson from './../../package.json';
import './index.less';
import App from './App';
import * as bokmål from './assets/lang/nb.json';
import * as nynorsk from './assets/lang/nn.json';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { GlobalStyle } from './Theme';

const environment = window.location.hostname;

Sentry.init({
    dsn: 'https://75e165345c514862b5829a724a4e8e45@sentry.gc.nav.no/71',
    release: packageJson.version,
    environment,
    autoSessionTracking: false,
    enabled: process.env.NODE_ENV !== 'development',
});

if (process.env.NODE_ENV !== 'production') {
    import('@axe-core/react').then(({ default: axe }) => {
        axe(React, ReactDOM, 1000);
    });
}

// Last ned land-navn for statsborgeskap
import(`i18n-iso-countries/langs/nb.json`).then(result => registerLocale(result));
import(`i18n-iso-countries/langs/nn.json`).then(result => registerLocale(result));

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyle />
        <SprakProvider tekster={{ nb: bokmål, nn: nynorsk }} defaultLocale={LocaleType.nb}>
            <HttpProvider>
                <Sentry.ErrorBoundary fallback={Feilside}>
                    <App />
                </Sentry.ErrorBoundary>
            </HttpProvider>
        </SprakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

Modal.setAppElement('#root');
