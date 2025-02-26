import React, { useState } from 'react';

import {
    Checkbox,
    FileAccepted,
    FileObject,
    FileRejected,
    FileRejectionReason,
    FileUpload,
    FormSummary,
    Heading,
    VStack,
} from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import {
    dokumentasjonsbehovTilBeskrivelseSanityApiNavn,
    dokumentasjonsbehovTilTittelSanityApiNavn,
    EFiltyper,
    IDokumentasjon,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { Typografi } from '../../../typer/sanity/sanity';
import { slåSammen } from '../../../utils/slåSammen';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { useLastRessurserContext } from '../../../context/LastRessurserContext';
import axios from 'axios';
import Miljø from '../../../../shared-utils/Miljø';

interface OpplastetVedlegg {
    dokumentId: string;
    filnavn: string;
}

interface Props {
    dokumentasjon: IDokumentasjon;
    oppdaterDokumentasjon: (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const LastOppVedlegg2: React.FC<Props> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
    const { søknad, tekster, plainTekst } = useApp();
    const { wrapMedSystemetLaster } = useLastRessurserContext();

    const dokumentasjonstekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const settHarSendtInnTidligere = (event: React.ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
    };

    const tittelBlock =
        dokumentasjonstekster[
            dokumentasjonsbehovTilTittelSanityApiNavn(dokumentasjon.dokumentasjonsbehov)
        ];

    const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
        dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
    );
    const barnasNavn = slåSammen(barnDokGjelderFor.map(barn => barn.navn));

    const dokumentasjonsbeskrivelse = dokumentasjonsbehovTilBeskrivelseSanityApiNavn(
        dokumentasjon.dokumentasjonsbehov
    );

    // const filePdf = new File(['abc'.repeat(100000)], 'document.pdf');
    // const fileJpg = new File(['abc'.repeat(500000)], 'picture.jpg');

    const [acceptedFiles, setAcceptedFiles] = useState<FileAccepted[]>([
        // { file: filePdf, error: false },
    ]);
    const [rejectedFiles, setRejectedFiles] = useState<FileRejected[]>([
        // { file: fileJpg, error: true, reasons: ['fileType'] },
    ]);

    const MAKS_FILSTØRRELSE_MB = 10;
    const MAKS_FILSTØRRELSE = MAKS_FILSTØRRELSE_MB * 1024 * 1024;
    const MAKS_ANTALL_FILER = 25;

    const errors: Record<FileRejectionReason, string> = {
        fileType: 'Filformatet støttes ikke',
        fileSize: `Filen er større enn ${MAKS_FILSTØRRELSE_MB} MB`,
    };

    const dagensDatoStreng = new Date().toISOString();

    const addFile = async (newFiles: FileObject[]) => {
        const acceptedNewFiles = newFiles.filter(file => !file.error);
        const rejectedNewFiles = newFiles.filter(file => file.error);

        const nyeVedlegg: IVedlegg[] = [];

        await Promise.all(
            acceptedNewFiles.map((acceptedNewFile: FileAccepted) => {
                return wrapMedSystemetLaster(async () => {
                    const requestData = new FormData();
                    requestData.append('file', acceptedNewFile.file);

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
                                navn: acceptedNewFile.file.name,
                                størrelse: acceptedNewFile.file.size,
                                tidspunkt: dagensDatoStreng,
                            });
                        });
                });
            })
        );

        setAcceptedFiles([...acceptedFiles, ...acceptedNewFiles]);
        setRejectedFiles([...rejectedFiles, ...rejectedNewFiles]);

        oppdaterDokumentasjon(
            dokumentasjon.dokumentasjonsbehov,
            [...dokumentasjon.opplastedeVedlegg, ...nyeVedlegg],
            dokumentasjon.harSendtInn
        );
    };

    const removeAcceptedFile = (fileToRemove: FileAccepted) => {
        setAcceptedFiles(acceptedFiles.filter(file => file !== fileToRemove));
    };
    const removeRejectedFile = (fileToRemove: FileRejected) => {
        setRejectedFiles(rejectedFiles.filter(file => file !== fileToRemove));
    };

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">
                    {plainTekst(tittelBlock, { barnetsNavn: barnasNavn })}
                </FormSummary.Heading>
            </FormSummary.Header>
            <VStack gap="6" paddingInline="6" paddingBlock="5 6">
                {dokumentasjonsbeskrivelse && (
                    <div>
                        <TekstBlock
                            data-testid={'dokumentasjonsbeskrivelse'}
                            block={dokumentasjonstekster[dokumentasjonsbeskrivelse]}
                            flettefelter={{ barnetsNavn: barnasNavn }}
                            typografi={Typografi.BodyLong}
                        />
                    </div>
                )}

                {dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON && (
                    <Checkbox
                        data-testid={'dokumentasjon-er-sendt-inn-checkboks'}
                        aria-label={`${plainTekst(
                            dokumentasjonstekster.sendtInnTidligere
                        )} (${plainTekst(tittelBlock, { barnetsNavn: barnasNavn })})`}
                        checked={dokumentasjon.harSendtInn}
                        onChange={settHarSendtInnTidligere}
                    >
                        {plainTekst(dokumentasjonstekster.sendtInnTidligere)}
                    </Checkbox>
                )}

                {!dokumentasjon.harSendtInn && (
                    <>
                        <FileUpload.Dropzone
                            label={'Last opp filer'}
                            accept={[
                                EFiltyper.PNG,
                                EFiltyper.JPG,
                                EFiltyper.JPEG,
                                EFiltyper.PDF,
                            ].join(',')}
                            maxSizeInBytes={MAKS_FILSTØRRELSE}
                            fileLimit={{
                                max: MAKS_ANTALL_FILER,
                                current: acceptedFiles.length,
                            }}
                            onSelect={newFiles => addFile(newFiles)}
                        />

                        {acceptedFiles.length > 0 && (
                            <VStack gap="2">
                                <Heading level="4" size="xsmall">
                                    {`${plainTekst(frittståendeOrdTekster.vedlegg)} (${acceptedFiles.length})`}
                                </Heading>
                                <VStack as="ul" gap="3">
                                    {acceptedFiles.map((file, index) => (
                                        <FileUpload.Item
                                            as="li"
                                            key={index}
                                            file={file.file}
                                            button={{
                                                action: 'delete',
                                                onClick: () => removeAcceptedFile(file),
                                            }}
                                        />
                                    ))}
                                </VStack>
                            </VStack>
                        )}

                        {rejectedFiles.length > 0 && (
                            <VStack gap="2">
                                <Heading level="4" size="xsmall">
                                    Vedlegg med feil
                                </Heading>
                                <VStack as="ul" gap="3">
                                    {rejectedFiles.map((rejected, index) => (
                                        <FileUpload.Item
                                            as="li"
                                            key={index}
                                            file={rejected.file}
                                            error={errors[rejected.reasons[0]]}
                                            button={{
                                                action: 'delete',
                                                onClick: () => removeRejectedFile(rejected),
                                            }}
                                        />
                                    ))}
                                </VStack>
                            </VStack>
                        )}

                        <VStack gap="2">
                            <Heading level="4" size="xsmall">
                                dokumentasjon.opplastedeVedlegg
                            </Heading>
                            <VStack gap="3">
                                {dokumentasjon.opplastedeVedlegg.map((vedlegg, index) => (
                                    <div key={index}>
                                        <div>{vedlegg.dokumentId}</div>
                                        <div>{vedlegg.navn}</div>
                                        <div>{vedlegg.størrelse}</div>
                                        <div>{vedlegg.tidspunkt}</div>
                                        <hr></hr>
                                    </div>
                                ))}
                            </VStack>
                        </VStack>
                    </>
                )}
            </VStack>
        </FormSummary>
    );
};

export default LastOppVedlegg2;
