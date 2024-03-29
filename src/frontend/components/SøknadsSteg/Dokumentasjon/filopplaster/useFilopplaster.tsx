import { useCallback, useState } from 'react';

import axios from 'axios';
import { FileRejection } from 'react-dropzone';

import Miljø from '../../../../../shared-utils/Miljø';
import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

enum BadRequestCode {
    IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
    IMAGE_DIMENSIONS_TOO_SMALL = 'IMAGE_DIMENSIONS_TOO_SMALL',
}

// Meldingsfeltet på respons ved BadRequest inneholder tekst på følgende format: CODE=ENUM_NAVN
const badRequestCodeFraError = (error): BadRequestCode | undefined => {
    const melding = error.response?.data?.melding;
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
    const [feilmeldinger, settFeilmeldinger] = useState<Map<string, File[]>>(new Map());
    const [harFeil, settHarFeil] = useState<boolean>(false);

    const datoTilStreng = (date: Date): string => {
        return date.toISOString();
    };
    const dagensDatoStreng = datoTilStreng(new Date());

    const onDrop = useCallback(
        async (filer: File[], filRejections: FileRejection[]) => {
            const feilmeldingMap: Map<string, File[]> = new Map();
            const nyeVedlegg: IVedlegg[] = [];
            settFeilmeldinger(new Map());
            settHarFeil(false);

            const pushFeilmelding = (tekstId: string, fil: File) => {
                if (!feilmeldingMap.has(tekstId)) {
                    feilmeldingMap.set(tekstId, []);
                }
                const filer = feilmeldingMap.get(tekstId);
                if (filer) {
                    filer.push(fil);
                    feilmeldingMap.set(tekstId, filer);
                }
            };

            if (filRejections.length > 0) {
                filRejections.map(filRejection =>
                    pushFeilmelding(
                        'dokumentasjon.last-opp-dokumentasjon.feilmeldingtype',
                        filRejection.file
                    )
                );
            }

            await Promise.all(
                filer.map((fil: File) =>
                    wrapMedSystemetLaster(async () => {
                        if (maxFilstørrelse && fil.size > maxFilstørrelse) {
                            pushFeilmelding(
                                'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor',
                                fil
                            );
                            return;
                        }

                        const requestData = new FormData();
                        requestData.append('file', fil);

                        await axios
                            .post<OpplastetVedlegg>(
                                `${Miljø().dokumentProxyUrl}/mapper/familievedlegg`,
                                requestData,
                                {
                                    withCredentials: true,
                                    headers: {
                                        'content-type': 'multipart/form-data',
                                        accept: 'application/json',
                                    },
                                }
                            )
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
                                        pushFeilmelding(
                                            'dokumentasjon.last-opp-dokumentasjon.feilmeldingstor',
                                            fil
                                        );
                                        break;
                                    case BadRequestCode.IMAGE_DIMENSIONS_TOO_SMALL:
                                        pushFeilmelding('dokumentasjon.forliten.feilmelding', fil);
                                        break;
                                    default:
                                        pushFeilmelding(
                                            'dokumentasjon.last-opp-dokumentasjon.feilmeldinggenerisk',
                                            fil
                                        );
                                }
                            });
                    })
                )
            );

            if (feilmeldingMap.size > 0) {
                settFeilmeldinger(feilmeldingMap);
                settHarFeil(true);
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

    return {
        onDrop,
        harFeil,
        feilmeldinger,
        slettVedlegg,
    };
};
