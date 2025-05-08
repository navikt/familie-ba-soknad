import React from 'react';

import { createRoot } from 'react-dom/client';

import { DisabledApp } from './components/Disabled/DisabledApp';
import InnholdContainer from './components/Felleskomponenter/InnholdContainer/InnholdContainer';
import { SpråkProvider } from './context/SpråkContext';
import { hentDekorator } from './decorator';
import { GlobalStyle } from './Theme';

hentDekorator();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <InnholdContainer>
            <GlobalStyle />
            <SpråkProvider>
                <DisabledApp />
            </SpråkProvider>
        </InnholdContainer>
    </React.StrictMode>
);
