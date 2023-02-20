import React, { ReactNode, useCallback, useState } from 'react';

import axios from 'axios';
import { FileRejection } from 'react-dropzone';

import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import Miljø from '../../../../Miljø';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { formaterFilstørrelse } from '../../../../utils/dokumentasjon';
import SpråkTekst from '../../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

enum BadRequestCode {
    IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
    IMAGE_DIMENSIONS_TOO_SMALL = 'IMAGE_DIMENSIONS_TOO_SMALL',
}

// Meldingsfeltet på respons ved BadRequest inneholder tekst på følgende format: CODE=ENUM_NAVN
const badRequestCodeFraError = (_error): BadRequestCode | undefined => {
    const melding = _error.response?.data?.melding;
    if (melding) {
        return BadRequestCode[melding.split('=')[1]];
    }
    return;
};

export const useFilopplaster = (
    maxFilstørrelse: number,
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void
) => {
    const { wrapMedSystemetLaster } = useLastRessurserContext();
    const [feilmeldinger, settFeilmeldinger] = useState<ReactNode[]>([]);
    const [åpenModal, settÅpenModal] = useState<boolean>(false);

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        async (filer: File[], filRejections: FileRejection[]) => {
            const feilmeldingsliste: ReactNode[] = [];
            const nyeVedlegg: IVedlegg[] = [];

            const pushFeilmelding = (tekstId: string, values: Record<string, ReactNode>) => {
                feilmeldingsliste.push(<SpråkTekst id={tekstId} values={values} />);
            };

            if (filRejections.length > 0) {
                filRejections.map(filRejection =>
                    pushFeilmelding('dokumentasjon.last-opp-dokumentasjon.feilmeldingtype', {
                        filnavn: filRejection.file.name,
                    })
                );
            }

            await Promise.all(
                filer.map((fil: File) =>
                    wrapMedSystemetLaster(async () => {
                        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
                            const maks = formaterFilstørrelse(maxFilstørrelse);
                            pushFeilmelding(
                                'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor',
                                { maks, filnavn: fil.name }
                            );
                            return;
                        }

                        const requestData = new FormData();
                        requestData.append('file', fil);

                        await axios
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
                            })
                            .catch(error => {
                                const badRequestCode = badRequestCodeFraError(error);
                                switch (badRequestCode) {
                                    case BadRequestCode.IMAGE_TOO_LARGE:
                                        const maks = formaterFilstørrelse(maxFilstørrelse);
                                        pushFeilmelding(
                                            'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor',
                                            { maks, filnavn: fil.name }
                                        );
                                        break;
                                    case BadRequestCode.IMAGE_DIMENSIONS_TOO_SMALL:
                                        pushFeilmelding('dokumentasjon.forliten.feilmelding', {
                                            filnavn: fil.name,
                                        });
                                        break;
                                    default:
                                        pushFeilmelding(
                                            'dokumentasjon.last-opp-dokumentasjon.feilmeldinggenerisk',
                                            { filnavn: fil.name }
                                        );
                                }
                            });
                    })
                )
            );

            if (feilmeldingsliste.length > 0) {
                settFeilmeldinger(feilmeldingsliste);
                settÅpenModal(true);
            }

            oppdaterDokumentasjon(
                dokumentasjon.dokumentasjonsbehov,
                [...dokumentasjon.opplastedeVedlegg, ...nyeVedlegg],
                dokumentasjon.harSendtInn
            );
        },
        [dokumentasjon.opplastedeVedlegg]
    );

    const slettVedlegg = (fil: IVedlegg) => {
        const nyVedleggsliste = dokumentasjon.opplastedeVedlegg.filter((obj: IVedlegg) => {
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
