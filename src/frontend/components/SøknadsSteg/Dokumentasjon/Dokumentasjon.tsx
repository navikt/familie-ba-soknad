import React from 'react';

import { useApp } from '../../../context/AppContext';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import LastOppVedlegg from './LastOppVedlegg';
import { useSendInnSkjema } from './useSendInnSkjema';

const Dokumentasjon: React.FC = () => {
    const { søknad } = useApp();
    const { sendInnSkjema } = useSendInnSkjema();

    return (
        <Steg
            tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}
            gåVidereCallback={sendInnSkjema}
        >
            {søknad.dokumentasjon
                .filter(dokumentasjon => erDokumentasjonRelevant(dokumentasjon))
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
