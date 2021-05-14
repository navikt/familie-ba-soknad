import React, { useCallback, useState } from 'react';

import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';

import { Upload } from '@navikt/ds-icons';

import Miljø from '../../../../Miljø';
import { Dokumentasjonsbehov, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import AlertStripe from '../../../Felleskomponenter/AlertStripe/AlertStripe';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';
import OpplastedeFiler from './OpplastedeFiler';
import { formaterFilstørrelse } from './utils';

interface Props {
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[] | undefined,
        harSendtInn: boolean
    ) => void;
    dokumentasjon: IDokumentasjon;
    tillatteFiltyper?: string[];
    maxFilstørrelse?: number;
}

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

const FilopplastningBoks = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed ${navFarger.navGra80};
    border-radius: 4px;
    background-color: rgba(204, 222, 230, 0.5);
    width: 100%;
    padding: 1rem;
    margin: 2rem 0;
    color: ${navFarger.navBla};
`;

const StyledUpload = styled(Upload)`
    margin-right: 1rem;
    min-width: 1rem;
`;

const FeilmeldingWrapper = styled.div`
    margin-right: 3rem;
`;

const Filopplaster: React.FC<Props> = ({
    oppdaterDokumentasjon,
    dokumentasjon,
    tillatteFiltyper,
    maxFilstørrelse,
}) => {
    const [feilmeldinger, settFeilmeldinger] = useState<string[]>([]);
    const [åpenModal, settÅpenModal] = useState<boolean>(false);
    const { formatMessage } = useIntl();

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
                    feilmeldingsliste.push(
                        formatMessage(
                            {
                                id: 'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor',
                            },
                            { maks, filnavn: fil.name }
                        )
                    );

                    settFeilmeldinger(feilmeldingsliste);
                    settÅpenModal(true);
                    return;
                }

                if (tillatteFiltyper && !tillatteFiltyper.includes(fil.type)) {
                    feilmeldingsliste.push(
                        formatMessage(
                            {
                                id: 'dokumentasjon.last-opp-dokumentasjon.feilmeldingtype',
                            },
                            { filnavn: fil.name }
                        )
                    );
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
                        feilmeldingsliste.push(
                            formatMessage(
                                {
                                    id: 'dokumentasjon.last-opp-dokumentasjon.feilmeldinggenerisk',
                                },
                                { filnavn: fil.name }
                            )
                        );
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
        <div>
            <Modal
                isOpen={åpenModal}
                onRequestClose={() => lukkModal()}
                closeButton={true}
                contentLabel="Modal"
            >
                <FeilmeldingWrapper>
                    {feilmeldinger.map(feilmelding => (
                        <AlertStripe type={'feil'} form={'default'} key={feilmelding}>
                            {feilmelding}
                        </AlertStripe>
                    ))}
                </FeilmeldingWrapper>
            </Modal>
            <FilopplastningBoks type={'button'} {...getRootProps()}>
                <input {...getInputProps()} />
                <StyledUpload />
                <Normaltekst>
                    <SpråkTekst
                        id={
                            isDragActive
                                ? 'dokumentasjon.last-opp-dokumentasjon.aktivknapp'
                                : 'dokumentasjon.last-opp-dokumentasjon.knapp'
                        }
                    />
                </Normaltekst>
            </FilopplastningBoks>
            <OpplastedeFiler
                filliste={dokumentasjon.opplastedeVedlegg || []}
                slettVedlegg={slettVedlegg}
            />
        </div>
    );
};

export default Filopplaster;
