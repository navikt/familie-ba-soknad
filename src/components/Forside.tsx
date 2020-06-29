import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import VeilederSnakkeboble from '../assets/VeilederSnakkeboble';

const Forside: React.FC = () => {
    return (
        <div className={'forside'}>
            <Systemtittel>Søknad om barnetrygd</Systemtittel>
            <VeilederSnakkeboble></VeilederSnakkeboble>
        </div>
    );
};

export default Forside;
