import React from 'react';

import { Checkbox } from 'nav-frontend-skjema';
import { Undertittel } from 'nav-frontend-typografi';

import { useApp } from '../../../context/AppContext';
import { Dokumentasjonsbehov, IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Filopplaster from './filopplaster/Filopplaster';
import { EFiltyper } from './filopplaster/filtyper';

interface Props {
    dokumentasjon: IDokumentasjon;
    vedleggNr: number;
}

const LastOppVedlegg: React.FC<Props> = ({ dokumentasjon, vedleggNr }) => {
    const { søknad, settSøknad } = useApp();

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
            dokumentasjon: prevState.dokumentasjon.map(dok =>
                dok.dokumentasjonsbehov === dokumentasjonsbehov
                    ? { ...dok, opplastedeVedlegg, harSendtInn }
                    : dok
            ),
        }));
    };

    const formatertListeMedBarn = () => {
        const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
            dokumentasjon.barnDetGjelderFor.find(id => id === barn.id)
        );
        return barnDokGjelderFor.map((barn, index) =>
            index === barnDokGjelderFor.length - 1 ? `og ${barn.navn}` : `${barn.navn}`
        );
    };

    return (
        <div>
            <Undertittel>
                <SpråkTekst
                    id={'dokumentasjon.vedleggsnummer'}
                    values={{
                        vedleggsnummer: vedleggNr,
                        antallvedlegg: søknad.dokumentasjon.length,
                    }}
                />
                &nbsp;
                <SpråkTekst id={dokumentasjon.tittelSpråkId} />
            </Undertittel>
            <SpråkTekst
                id={dokumentasjon.beskrivelseSpråkId}
                values={{
                    barn: formatertListeMedBarn(),
                }}
            />
            {!dokumentasjon.harSendtInn && (
                <Filopplaster
                    oppdaterDokumentasjon={oppdaterDokumentasjon}
                    dokumentasjon={dokumentasjon}
                    maxFilstørrelse={1024 * 1024 * 10}
                    tillatteFiltyper={[EFiltyper.PNG, EFiltyper.PDF, EFiltyper.JPG, EFiltyper.JPEG]}
                />
            )}
            <br />
            <Checkbox
                label={<SpråkTekst id={'dokumentasjon.har-sendt-inn.spm'} />}
                checked={dokumentasjon.harSendtInn}
                onChange={settHarSendtInnTidligere}
            />
        </div>
    );
};

export default LastOppVedlegg;
