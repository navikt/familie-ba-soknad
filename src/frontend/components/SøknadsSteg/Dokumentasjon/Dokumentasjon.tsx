import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import PictureScanningGuide from '@navikt/sif-common-core/lib/components/picture-scanning-guide/PictureScanningGuide';

import { useApp } from '../../../context/AppContext';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
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
            <KomponentGruppe>
                <Normaltekst>
                    <SpråkTekst id={'dokumentasjon.info'} />
                </Normaltekst>
                <PictureScanningGuide />
            </KomponentGruppe>
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
