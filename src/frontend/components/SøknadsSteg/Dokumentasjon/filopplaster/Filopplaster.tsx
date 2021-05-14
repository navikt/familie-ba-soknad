import React, { useCallback, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { injectIntl, IntlShape } from 'react-intl';
import styled from 'styled-components/macro';

import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import navFarger from 'nav-frontend-core';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';

import { Upload } from '@navikt/ds-icons';

import Miljø from '../../../../Miljø';
import { Dokumentasjonsbehov, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import OpplastedeFiler from './OpplastedeFiler';
import { formaterFilstørrelse } from './utils';

interface Props {
    intl: IntlShape;
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[] | undefined,
        harSendtInn: boolean
    ) => void;
    dokumentasjon: IDokumentasjon;
    beskrivelsesListe?: string[];
    tillatteFiltyper?: string[];
    maxFilstørrelse?: number;
}

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

const FilopplastningBoks = styled.div`
    text-align: center;
    font-weight: bold;
    border: 2px dashed #59514b;
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    height: 64px;
    max-width: 575px;
    color: ${navFarger.navBla};
    margin: 0 auto;

    .tekst {
        line-height: 64px;
        display: inline-block;
        margin-left: 10px;
    }

    .feilmelding {
        margin: 1rem 0 0 0;
        text-align: left;
    }
`;

const Filopplaster: React.FC<Props> = ({
    oppdaterDokumentasjon,
    dokumentasjon,
    tillatteFiltyper,
    maxFilstørrelse,
}) => {
    const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
    const [åpenModal, settÅpenModal] = useState<boolean>(false);

    const lukkModal = () => {
        settÅpenModal(false);
    };

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        filer => {
            const feilmeldingsliste: string[] = [];
            const nyeVedlegg: IVedlegg[] = [];
            filer.forEach((fil: File) => {
                if (maxFilstørrelse && fil.size > maxFilstørrelse) {
                    const maks = formaterFilstørrelse(maxFilstørrelse);
                    feilmeldingsliste.push(`Lastet opp for stor fil: ${fil.name} ${maks}`);

                    settFeilmeldinger(feilmeldingsliste);
                    settÅpenModal(true);
                    return;
                }

                if (tillatteFiltyper && !tillatteFiltyper.includes(fil.type)) {
                    feilmeldingsliste.push(`Lastet opp feil filtype: ${fil.name}`);
                    settFeilmeldinger(feilmeldingsliste);
                    settÅpenModal(true);
                    return;
                }

                const requestData = new FormData();
                requestData.append('file', fil);

                axios
                    .post<OpplastetVedlegg>(`${Miljø().dokumentUrl}`, requestData, {
                        withCredentials: true,
                        headers: {
                            'content-type': 'multipart/form-data',
                            accept: 'application/json',
                        },
                    })
                    .then((response: { data: OpplastetVedlegg }) => {
                        const { data } = response;
                        nyeVedlegg.push({
                            dokumentId: data.dokumentId,
                            navn: fil.name,
                            størrelse: fil.size,
                            tidspunkt: dagensDatoStreng,
                        });

                        const opplastedeVedlegg = dokumentasjon.opplastedeVedlegg || [];
                        oppdaterDokumentasjon(
                            dokumentasjon.dokumentasjonsbehov,
                            [...opplastedeVedlegg, ...nyeVedlegg],
                            dokumentasjon.harSendtInn
                        );
                    })
                    .catch(_error => {
                        feilmeldingsliste.push('filopplaster.feilmelding.generisk');
                        settFeilmeldinger(feilmeldingsliste);
                        settÅpenModal(true);
                    });
            });
        },
        [dokumentasjon.opplastedeVedlegg]
    );
    const slettVedlegg = (fil: IVedlegg) => {
        const opplastedeVedlegg = dokumentasjon.opplastedeVedlegg || [];
        const nyVedleggsliste = opplastedeVedlegg.filter((obj: IVedlegg) => {
            return obj.dokumentId !== fil.dokumentId;
        });
        oppdaterDokumentasjon(
            dokumentasjon.dokumentasjonsbehov,
            nyVedleggsliste,
            dokumentasjon.harSendtInn
        );
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className="filopplaster-wrapper">
            <FilopplastningBoks>
                <Modal
                    isOpen={åpenModal}
                    onRequestClose={() => lukkModal()}
                    closeButton={true}
                    contentLabel="Modal"
                >
                    <div className="feilmelding">
                        {feilmeldinger.map(feilmelding => (
                            <AlertStripeFeil key={feilmelding} className="feilmelding-alert">
                                {feilmelding}
                            </AlertStripeFeil>
                        ))}
                    </div>
                </Modal>
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <>
                            <Upload />
                            <Normaltekst>Slipp</Normaltekst>
                        </>
                    ) : (
                        <>
                            <Upload />
                            <Normaltekst>Dra</Normaltekst>
                        </>
                    )}
                </div>
            </FilopplastningBoks>
            <OpplastedeFiler
                filliste={dokumentasjon.opplastedeVedlegg || []}
                slettVedlegg={slettVedlegg}
            />
        </div>
    );
};

export default injectIntl(Filopplaster);
