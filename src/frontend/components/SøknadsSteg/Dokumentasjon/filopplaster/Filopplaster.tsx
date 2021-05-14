import React, { useCallback, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { injectIntl, IntlShape } from 'react-intl';

import { AlertStripeFeil } from 'nav-frontend-alertstriper';
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

const Filopplaster: React.FC<Props> = ({
    oppdaterDokumentasjon,
    dokumentasjon,
    beskrivelsesListe,
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
            <div className="tittel-wrapper">
                {beskrivelsesListe ? (
                    <ul className="opplasting-liste">
                        {beskrivelsesListe.map(el => (
                            <li>
                                <Normaltekst>{el}</Normaltekst>
                            </li>
                        ))}
                    </ul>
                ) : null}

                <div className="opplastede-filer">
                    <OpplastedeFiler
                        filliste={dokumentasjon.opplastedeVedlegg || []}
                        slettVedlegg={slettVedlegg}
                    />
                </div>
            </div>

            <div className="filopplaster">
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
            </div>
        </div>
    );
};

export default injectIntl(Filopplaster);
