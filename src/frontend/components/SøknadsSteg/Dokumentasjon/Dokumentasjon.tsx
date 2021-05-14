import React, { useEffect } from 'react';

import { useApp } from '../../../context/AppContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';

const Dokumentasjon: React.FC = () => {
    const { søknad } = useApp();

    useEffect(() => {
        console.log(søknad);
    }, [søknad]);

    return (
        <Steg tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}>
            {søknad.dokumentasjon.map((dokumentasjon, index) => (
                <LastOppVedlegg
                    key={index}
                    dokumentasjonsbehov={dokumentasjon.dokumentasjonsbehov}
                />
            ))}
        </Steg>
    );
};

export default Dokumentasjon;
