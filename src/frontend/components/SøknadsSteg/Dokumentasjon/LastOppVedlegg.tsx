import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';

import { useApp } from '../../../context/AppContext';
import { Dokumentasjonsbehov, IVedlegg } from '../../../typer/dokumentasjon';
import Filopplaster from './filopplaster/Filopplaster';
import { EFiltyper } from './filopplaster/filtyper';

interface Props {
    dokumentasjonsbehov: Dokumentasjonsbehov;
}

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjonsbehov }) => {
    const { søknad, settSøknad } = useApp();

    const dokumentasjon = Object.values(søknad.dokumentasjon).find(
        dokumentasjon => dokumentasjon.dokumentasjonsbehov === dokumentasjonsbehov
    );

    if (!dokumentasjon) {
        return null;
    }

    const harSendtInn = dokumentasjon && dokumentasjon.harSendtInn;

    const settHarSendtInnTidligere = (event: React.ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
    };

    const oppdaterDokumentasjon = (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[] | undefined,
        harSendtInn: boolean
    ) => {
        settSøknad(prevState => ({
            ...prevState,
            dokumentasjon: [
                ...prevState.dokumentasjon,
                {
                    dokumentasjonsbehov,
                    opplastedeVedlegg,
                    harSendtInn,
                },
            ],
        }));
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
