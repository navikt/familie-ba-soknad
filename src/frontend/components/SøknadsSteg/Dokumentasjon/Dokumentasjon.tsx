import React, { useEffect } from 'react';

import { DokumentasjonsBehov } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';
import { useApp } from '../../../context/AppContext';

const Dokumentasjon: React.FC = () => {
    const { søknad } = useApp();

    useEffect(() => {
        console.log(søknad);
    }, [søknad]);

    return (
        <Steg tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}>
            <LastOppVedlegg dokumentasjonsid={DokumentasjonsBehov.DELT_BOSTED} />
        </Steg>
    );
};

export default Dokumentasjon;
