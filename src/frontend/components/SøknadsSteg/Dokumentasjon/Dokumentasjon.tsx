import React from 'react';

import { DokumentasjonsBehov } from '../../../typer/søknad';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';

const Dokumentasjon: React.FC = () => {
    return (
        <Steg tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}>
            <LastOppVedlegg dokumentasjonsid={DokumentasjonsBehov.DELT_BOSTED} />
        </Steg>
    );
};

export default Dokumentasjon;
