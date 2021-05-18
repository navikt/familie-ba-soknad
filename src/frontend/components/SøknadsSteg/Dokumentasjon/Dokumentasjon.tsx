import React from 'react';

import { useApp } from '../../../context/AppContext';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';

const Dokumentasjon: React.FC = () => {
    const { søknad } = useApp();

    console.log(søknad);

    return (
        <Steg tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}>
            {søknad.dokumentasjon.map((dokumentasjon, index) => {
                return dokumentasjon.barnDetGjelderFor.length ? (
                    <LastOppVedlegg
                        key={index}
                        vedleggNr={index + 1}
                        dokumentasjon={dokumentasjon}
                    />
                ) : null;
            })}
        </Steg>
    );
};

export default Dokumentasjon;
