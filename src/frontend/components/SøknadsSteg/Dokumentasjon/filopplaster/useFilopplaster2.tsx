import { useState } from 'react';

import axios, { AxiosError } from 'axios';

import {
    type FileAccepted,
    type FileObject,
    type FileRejected,
    type FileRejectionReason,
} from '@navikt/ds-react';

import Miljø from '../../../../../shared-utils/Miljø';
import { useLastRessurserContext } from '../../../../context/LastRessurserContext';
import { EFiltyper, IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { PlainTekst } from '../../../../typer/sanity/sanity';
import { IDokumentasjonTekstinnhold } from '../innholdTyper';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

enum EStandardFileRejectionReasons {
    FIL_TYPE = 'fileType',
    FIL_STØRRELSE_FOR_STOR = 'fileSize',
}

enum ECustomFileRejectionReasons {
    FIL_STØRRELSE_FOR_LITEN = 'filStørrelseForLiten',
    MAKS_ANTALL_FILER_NÅDD = 'maksAntallFilerNådd',
    NOE_GIKK_FEIL = 'noeGikkFeil',
}

enum BadRequestCode {
    IMAGE_TOO_LARGE = 'IMAGE_TOO_LARGE',
    IMAGE_DIMENSIONS_TOO_SMALL = 'IMAGE_DIMENSIONS_TOO_SMALL',
    INVALID_DOCUMENT_FORMAT = 'INVALID_DOCUMENT_FORMAT',
}

// Meldingsfeltet på respons ved BadRequest inneholder tekst på følgende format: CODE=ENUM_NAVN
const badRequestCodeFraError = (error): BadRequestCode | undefined => {
    const melding = error.response?.data?.melding;
    if (melding) {
        return BadRequestCode[melding.split('=')[1]];
    }
    return;
};

const feilmeldingFraError = (error: AxiosError): string => {
    const badRequestCode = badRequestCodeFraError(error);
    switch (badRequestCode) {
        case BadRequestCode.IMAGE_DIMENSIONS_TOO_SMALL:
            return ECustomFileRejectionReasons.FIL_STØRRELSE_FOR_LITEN;
        case BadRequestCode.IMAGE_TOO_LARGE:
            return EStandardFileRejectionReasons.FIL_STØRRELSE_FOR_STOR;
        case BadRequestCode.INVALID_DOCUMENT_FORMAT:
            return EStandardFileRejectionReasons.FIL_TYPE;
        default:
            return ECustomFileRejectionReasons.NOE_GIKK_FEIL;
    }
};

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
    const MAKS_ANTALL_FILER = 25;
    const STØTTEDE_FILTYPER = [EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG, EFiltyper.PDF];

    const feilmeldinger: Record<FileRejectionReason | ECustomFileRejectionReasons, string> = {
        [EStandardFileRejectionReasons.FIL_TYPE]: plainTekst(
            dokumentasjonTekster.filtypeFeilmelding
        ),
        [EStandardFileRejectionReasons.FIL_STØRRELSE_FOR_STOR]: `${plainTekst(dokumentasjonTekster.filstorrelseFeilmelding)} ${MAKS_FILSTØRRELSE_MB} MB`,
        [ECustomFileRejectionReasons.FIL_STØRRELSE_FOR_LITEN]: plainTekst(
            dokumentasjonTekster.bildetForLite
        ),
        [ECustomFileRejectionReasons.MAKS_ANTALL_FILER_NÅDD]: `${plainTekst(dokumentasjonTekster.antallFilerFeilmelding)} ${MAKS_ANTALL_FILER}`,
        [ECustomFileRejectionReasons.NOE_GIKK_FEIL]: plainTekst(dokumentasjonTekster.noeGikkFeil),
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
                            });
                        })
                        .catch((error: AxiosError) => {
                            const oppfangetFeil: FileRejected = {
                                file: fil.file,
                                error: true,
                                reasons: [feilmeldingFraError(error)],
                            };

                            setAvvsiteFiler([...avvisteFiler, oppfangetFeil]);
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
