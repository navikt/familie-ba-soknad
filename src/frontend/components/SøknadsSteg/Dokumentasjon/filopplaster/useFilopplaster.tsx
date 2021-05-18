import React, { ReactNode, useCallback, useState } from 'react';

import axios from 'axios';

import Miljø from '../../../../Miljø';
import { Dokumentasjonsbehov, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { formaterFilstørrelse } from '../../../../utils/dokumentasjon';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

export const useFilopplaster = (
    maxFilstørrelse: number,
    tillatteFiltyper: string[],
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[] | undefined,
        harSendtInn: boolean
    ) => void
) => {
    const [feilmeldinger, settFeilmeldinger] = useState<ReactNode[]>([]);
    const [åpenModal, settÅpenModal] = useState<boolean>(false);

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        filer => {
            const feilmeldingsliste: ReactNode[] = [];
            const nyeVedlegg: IVedlegg[] = [];
            filer.forEach((fil: File) => {
                if (maxFilstørrelse && fil.size > maxFilstørrelse) {
                    const maks = formaterFilstørrelse(maxFilstørrelse);
                    feilmeldingsliste.push(
                        <SpråkTekst
                            id={'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor'}
                            values={{ maks, filnavn: fil.name }}
                        />
                    );

                    settFeilmeldinger(feilmeldingsliste);
                    settÅpenModal(true);
                    return;
                }

                if (tillatteFiltyper && !tillatteFiltyper.includes(fil.type)) {
                    feilmeldingsliste.push(
                        <SpråkTekst
                            id={'dokumentasjon.last-opp-dokumentasjon.feilmeldingtype'}
                            values={{ filnavn: fil.name }}
                        />
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
                            <SpråkTekst
                                id={'dokumentasjon.last-opp-dokumentasjon.feilmeldinggenerisk'}
                                values={{ filnavn: fil.name }}
                            />
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

    const lukkModal = () => {
        settÅpenModal(false);
    };

    return {
        onDrop,
        åpenModal,
        settÅpenModal,
        feilmeldinger,
        slettVedlegg,
        lukkModal,
    };
};
