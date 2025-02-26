import { useState } from 'react';
import { EFiltyper, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { FileAccepted, FileObject, FileRejected, FileRejectionReason } from '@navikt/ds-react';
import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import axios from 'axios';
import Miljø from '../../../../../shared-utils/Miljø';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

export const useFilopplaster2 = (
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void
) => {
    const { wrapMedSystemetLaster } = useLastRessurserContext();

    const [avvisteFiler, setAvvsiteFiler] = useState<FileRejected[]>([]);

    const MAKS_FILSTØRRELSE_MB = 10;
    const MAKS_FILSTØRRELSE_BYTES = MAKS_FILSTØRRELSE_MB * 1024 * 1024;
    const MAKS_ANTALL_FILER = 25;

    const støttedeFiltyper = [EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG, EFiltyper.PDF];

    const feilMeldinger: Record<FileRejectionReason, string> = {
        fileType: 'Filformatet støttes ikke',
        fileSize: `Filen er større enn ${MAKS_FILSTØRRELSE_MB} MB`,
    };

    const dagensDatoStreng = new Date().toISOString();

    const leggTilVedlegg = async (nyeFiler: FileObject[]) => {
        const nyeAksepterteFiler = nyeFiler.filter(file => !file.error);
        const nyeAvvisteFiler = nyeFiler.filter(file => file.error);

        setAvvsiteFiler([...avvisteFiler, ...nyeAvvisteFiler]);

        const nyeVedlegg: IVedlegg[] = [];

        await Promise.all(
            nyeAksepterteFiler.map((fil: FileAccepted) => {
                return wrapMedSystemetLaster(async () => {
                    const requestData = new FormData();
                    requestData.append('file', fil.file);

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
                                navn: fil.file.name,
                                størrelse: fil.file.size,
                                tidspunkt: dagensDatoStreng,
                                fil: fil.file,
                            });
                        });
                });
            })
        );

        if (nyeVedlegg.length > 0) {
            oppdaterDokumentasjon(
                dokumentasjon.dokumentasjonsbehov,
                [...dokumentasjon.opplastedeVedlegg, ...nyeVedlegg],
                dokumentasjon.harSendtInn
            );
        }
    };

    const fjernVedlegg = (vedleggSomSkalFjernes: IVedlegg) => {
        const nyVedleggsliste = dokumentasjon.opplastedeVedlegg.filter(
            (opplastetVedlegg: IVedlegg) => {
                return opplastetVedlegg.dokumentId !== vedleggSomSkalFjernes.dokumentId;
            }
        );

        oppdaterDokumentasjon(
            dokumentasjon.dokumentasjonsbehov,
            nyVedleggsliste,
            dokumentasjon.harSendtInn
        );
    };

    const fjernAvvistFil = (fil: FileRejected) => {
        setAvvsiteFiler(avvisteFiler.filter(file => file !== fil));
    };

    const fjernAlleAvvisteFiler = () => {
        setAvvsiteFiler([]);
    };

    return {
        avvisteFiler,
        MAKS_FILSTØRRELSE_MB,
        MAKS_FILSTØRRELSE_BYTES,
        MAKS_ANTALL_FILER,
        støttedeFiltyper,
        feilMeldinger,
        leggTilVedlegg,
        fjernVedlegg,
        fjernAvvistFil,
        fjernAlleAvvisteFiler,
    };
};
