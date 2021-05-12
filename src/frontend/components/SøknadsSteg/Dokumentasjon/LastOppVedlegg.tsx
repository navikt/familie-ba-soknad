import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { useApp } from '../../../context/AppContext';
import { DokumentasjonsBehov, IVedlegg } from '../../../typer/søknad';
import Filopplaster from './filopplaster/Filopplaster';
import { EFiltyper } from './filopplaster/filtyper';

interface Props {
    dokumentasjonsid: DokumentasjonsBehov;
}

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjonsid }) => {
    const { søknad, settSøknad } = useApp();

    const dokumentasjon = Object.values(søknad.dokumentasjon).find(
        dokumentasjon => dokumentasjon.id === dokumentasjonsid
    );

    if (!dokumentasjon) {
        return null;
    }

    const harSendtInn = dokumentasjon && dokumentasjon.harSendtInn;

    const settHarSendtInnTidligere = (e: any) => {
        const huketAv = e.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.id, vedlegg, huketAv);
    };

    const oppdaterDokumentasjon = (
        id: DokumentasjonsBehov,
        opplastedeVedlegg: IVedlegg[] | undefined,
        harSendtInn: boolean
    ) => {
        settSøknad({
            ...søknad,
            dokumentasjon: [
                ...søknad.dokumentasjon,
                {
                    id,
                    opplastedeVedlegg,
                    harSendtInn,
                },
            ],
        });
    };

    return (
        <div>
            <Checkbox
                label={'Har sendt inn'}
                checked={harSendtInn}
                onChange={settHarSendtInnTidligere}
            />
            {!harSendtInn && (
                <Filopplaster
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                    dokumentasjon={dokumentasjon}
                    maxFilstørrelse={1024 * 1024 * 10}
                    tillatteFiltyper={[EFiltyper.PNG, EFiltyper.PDF, EFiltyper.JPG, EFiltyper.JPEG]}
                />
            )}
        </div>
    );
};

export default LastOppVedlegg;
