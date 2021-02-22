import React from 'react';

import ReactDOM from 'react-dom';

import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import './index.less';
import App from './App';
import * as norskeTekster from './assets/lang/nb.json';

if (process.env.NODE_ENV !== 'production') {
    import('@axe-core/react').then(({ default: axe }) => {
        axe(React, ReactDOM, 1000);
    });
}

ReactDOM.render(
    <React.StrictMode>
        <SprakProvider
            tekster={{ nb: norskeTekster }}
            defaultSprak={{ tittel: 'Bokmål', locale: LocaleType.nb }}
        >
            <App />
        </SprakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
