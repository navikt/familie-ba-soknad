import React from 'react';
import './App.less';
import { Systemtittel } from 'nav-frontend-typografi';
import { AppProvider } from './context/AppContext';
import Helse from './components/Helse/Helse';

function App() {
    return (
        <AppProvider>
            <div className="App">
                <Systemtittel>Søknad om barnetrygd</Systemtittel>
                <Helse />
            </div>
        </AppProvider>
    );
}

export default App;
