import React from 'react';

import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';

import { DisabledApp } from './components/Disabled/DisabledApp';
import { GlobalStyle } from './Theme';

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyle />
        <IntlProvider locale={'nb'}>
            <DisabledApp />
        </IntlProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
