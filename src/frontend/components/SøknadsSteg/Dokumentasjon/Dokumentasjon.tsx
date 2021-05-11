import React from 'react';

import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

const Dokumentasjon: React.FC = () => {
    return (
        <Steg tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}>
            <p>hei</p>
        </Steg>
    );
};

export default Dokumentasjon;
