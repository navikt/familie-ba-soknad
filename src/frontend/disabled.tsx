import React from 'react';

import ReactDOM from 'react-dom';

import { DisabledApp } from './components/Disabled/DisabledApp';
import { SpråkProvider } from './components/Felleskomponenter/Dekoratøren/SpråkContext';
import InnholdContainer from './components/Felleskomponenter/InnholdContainer/InnholdContainer';
import { GlobalStyle } from './Theme';

ReactDOM.render(
    <React.StrictMode>
        <InnholdContainer>
            <GlobalStyle />
            <SpråkProvider>
                <DisabledApp />
            </SpråkProvider>
        </InnholdContainer>
    </React.StrictMode>,
    document.getElementById('root')
);
