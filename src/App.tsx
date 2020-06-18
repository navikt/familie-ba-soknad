import React from 'react';
import './App.less';
import { Systemtittel } from 'nav-frontend-typografi';
import { AppProvider } from './context/AppContext';

function App() {
    return (
        <AppProvider>
            <div className="App">
                <Systemtittel>Søknad om barnetrygd</Systemtittel>
            </div>
        </AppProvider>
    );
}

export default App;
