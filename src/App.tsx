import React from 'react';
import './App.less';
import { AppProvider } from './context/AppContext';
import Søknad from './Søknad';

function App() {
    return (
        <AppProvider>
            <Søknad />
        </AppProvider>
    );
}

export default App;
