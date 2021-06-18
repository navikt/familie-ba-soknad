import React from 'react';

import * as Sentry from '@sentry/react';
import { registerLocale } from 'i18n-iso-countries';
import ReactDOM from 'react-dom';

import Modal from 'nav-frontend-modal';

import { HttpProvider } from '@navikt/familie-http';
import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';
import * as bokmålPSG from '@navikt/sif-common-core/lib/components/picture-scanning-guide/picturescanningguide.nb.json';
import * as nynorskPSG from '@navikt/sif-common-core/lib/components/picture-scanning-guide/picturescanningguide.nn.json';

import packageJson from './../../package.json';
import './index.less';
import App from './App';
import * as bokmål from './assets/lang/nb.json';
import * as nynorsk from './assets/lang/nn.json';
import { Feilside } from './components/Felleskomponenter/Feilside/Feilside';
import { GlobalStyle } from './Theme';
import { labelWithFamilieBaSoknad } from './utils/sentry';

const environment = window.location.hostname;

Sentry.init({
    dsn: 'https://75e165345c514862b5829a724a4e8e45@sentry.gc.nav.no/71',
    release: packageJson.version,
    environment,
    autoSessionTracking: false,
    enabled: process.env.NODE_ENV !== 'development',
    ignoreErrors: ['NetworkError when attempting to fetch resource.'],
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
        <button
            onClick={() => {
                throw new Error('outside error boundary');
            }}
        >
            Test: Shouldn't get tagget
        </button>
        <SprakProvider
            tekster={{ nb: { ...bokmål, ...bokmålPSG }, nn: { ...nynorsk, ...nynorskPSG } }}
            defaultLocale={LocaleType.nb}
        >
            <HttpProvider>
                <Sentry.ErrorBoundary fallback={Feilside} beforeCapture={labelWithFamilieBaSoknad}>
                    <button
                        onClick={() => {
                            throw new Error('inside error boundary. should be tagged');
                        }}
                    >
                        Test: tag it!
                    </button>
                    <App />
                </Sentry.ErrorBoundary>
            </HttpProvider>
        </SprakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

Modal.setAppElement('#root');
