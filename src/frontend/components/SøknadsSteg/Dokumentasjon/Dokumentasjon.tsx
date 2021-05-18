import React from 'react';

import { useApp } from '../../../context/AppContext';
import { Dokumentasjonsbehov } from '../../../typer/dokumentasjon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';

const Dokumentasjon: React.FC = () => {
    const { søknad } = useApp();

    console.log(søknad);

    return (
        <Steg tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}>
            {søknad.dokumentasjon
                .filter(
                    dokumentasjon =>
                        dokumentasjon.dokumentasjonsbehov ===
                            Dokumentasjonsbehov.ANNEN_DOKUMENTASJON ||
                        dokumentasjon.barnDetGjelderFor.length
                )
                .map((dokumentasjon, index) => (
                    <LastOppVedlegg
                        key={index}
                        vedleggNr={index + 1}
                        dokumentasjon={dokumentasjon}
                    />
                ))}
        </Steg>
    );
};

export default Dokumentasjon;
