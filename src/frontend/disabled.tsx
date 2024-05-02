import React from 'react';

import ReactDOM from 'react-dom';

import { DisabledApp } from './components/Disabled/DisabledApp';
import InnholdContainer from './components/Felleskomponenter/InnholdContainer/InnholdContainer';
import { SpråkProvider } from './context/SpråkContext';
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
