import React from 'react';

import * as Sentry from '@sentry/browser';
import ReactDOM from 'react-dom';

import { version } from './../../package.json';
import './index.less';
import App from './App';

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

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
