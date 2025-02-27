import { useState } from 'react';

import axios from 'axios';

import { FileAccepted, FileObject, FileRejected, FileRejectionReason } from '@navikt/ds-react';

import Miljø from '../../../../../shared-utils/Miljø';
import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import { EFiltyper, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { PlainTekst } from '../../../../typer/sanity/sanity';
import { ITekstinnhold } from '../../../../typer/sanity/tekstInnhold';
import { IDokumentasjonTekstinnhold } from '../innholdTyper';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

enum ECustomFileRejectionReasons {
    MAKS_ANTALL_FILER_NÅDD = 'maksAntallFilerNådd',
}

export const useFilopplaster2 = (
    dokumentasjon: IDokumentasjon,
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void,
    dokumentasjonTekster: IDokumentasjonTekstinnhold,
    plainTekst: PlainTekst
) => {
    const { wrapMedSystemetLaster } = useLastRessurserContext();

    const [avvisteFiler, setAvvsiteFiler] = useState<FileRejected[]>([]);

    const MAKS_FILSTØRRELSE_MB = 10;
    const MAKS_FILSTØRRELSE_BYTES = MAKS_FILSTØRRELSE_MB * 1024 * 1024;
    const MAKS_ANTALL_FILER = 4;
    const STØTTEDE_FILTYPER = [EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG, EFiltyper.PDF];

    const feilmeldinger: Record<FileRejectionReason | ECustomFileRejectionReasons, string> = {
        fileType: plainTekst(dokumentasjonTekster.stottedeFiltyper),
        fileSize: `${plainTekst(dokumentasjonTekster.maksFilstorrelse)} ${MAKS_FILSTØRRELSE_MB} MB`,
        [ECustomFileRejectionReasons.MAKS_ANTALL_FILER_NÅDD]: `${plainTekst(dokumentasjonTekster.antallFilerFeilmelding)} ${MAKS_ANTALL_FILER}`,
    };

    const dagensDatoStreng = new Date().toISOString();

    const leggTilVedlegg = async (nyeFiler: FileObject[]) => {
        const ledigePlasser = MAKS_ANTALL_FILER - dokumentasjon.opplastedeVedlegg.length;

        const gyldigeFiler: FileAccepted[] = nyeFiler.filter(file => !file.error);
        const feilendeFiler: FileRejected[] = nyeFiler.filter(file => file.error);

        const aksepterteFiler = gyldigeFiler.slice(0, ledigePlasser);
        const filerOverMaksAntall = gyldigeFiler.slice(aksepterteFiler.length);
        const filerOverMaksAntallMedFeilmelding: FileRejected[] = filerOverMaksAntall.map(fil => {
            return {
                file: fil.file,
                error: true,
                reasons: [ECustomFileRejectionReasons.MAKS_ANTALL_FILER_NÅDD],
            };
        });

        const nyeAvvisteFiler = [...feilendeFiler, ...filerOverMaksAntallMedFeilmelding];

        setAvvsiteFiler([...avvisteFiler, ...nyeAvvisteFiler]);

        const nyeVedlegg: IVedlegg[] = [];

        await Promise.all(
            aksepterteFiler.map(fil => {
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
        STØTTEDE_FILTYPER,
        feilmeldinger,
        leggTilVedlegg,
        fjernVedlegg,
        fjernAvvistFil,
        fjernAlleAvvisteFiler,
    };
};
