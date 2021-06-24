import React from 'react';

import ReactDOM from 'react-dom';

import { LocaleType, SprakProvider } from '@navikt/familie-sprakvelger';

import * as bokmål from './assets/lang/nb.json';
import * as nynorsk from './assets/lang/nn.json';
import { DisabledApp } from './components/Disabled/DisabledApp';
import { GlobalStyle } from './Theme';

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyle />
        <SprakProvider
            tekster={{ nb: { ...bokmål }, nn: { ...nynorsk } }}
            defaultLocale={LocaleType.nb}
        >
            <DisabledApp />
        </SprakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
