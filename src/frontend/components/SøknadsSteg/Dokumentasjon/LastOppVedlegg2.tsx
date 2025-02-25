import React, { useState } from 'react';

import {
    Checkbox,
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

    const filePdf = new File(['abc'.repeat(100000)], 'document.pdf');
    const fileJpg = new File(['abc'.repeat(500000)], 'picture.jpg');
    const exampleFiles: FileObject[] = [
        { file: filePdf, error: false },
        { file: fileJpg, error: true, reasons: ['fileType'] },
    ];

    const [files, setFiles] = useState<FileObject[]>(exampleFiles);

    function removeFile(fileToRemove: FileObject) {
        setFiles(files.filter(file => file !== fileToRemove));
    }

    const acceptedFiles = files.filter(file => !file.error);
    const rejectedFiles = files.filter((f): f is FileRejected => f.error);

    const MAKS_FILSTØRRELSE_MB = 10;
    const MAKS_FILSTØRRELSE = MAKS_FILSTØRRELSE_MB * 1024 * 1024;
    const MAKS_ANTALL_FILER = 25;

    const errors: Record<FileRejectionReason, string> = {
        fileType: 'Filformatet støttes ikke',
        fileSize: `Filen er større enn ${MAKS_FILSTØRRELSE_MB} MB`,
    };

    const addFile = async (newFiles: FileObject[]) => {
        setFiles([...files, ...newFiles]);
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
                                                onClick: () => removeFile(file),
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
                                                onClick: () => removeFile(rejected),
                                            }}
                                        />
                                    ))}
                                </VStack>
                            </VStack>
                        )}
                    </>
                )}

                {/* {!dokumentasjon.harSendtInn && (
                    <FileUpload.Dropzone
                        label={'Last opp filer'}
                        accept={[EFiltyper.PNG, EFiltyper.JPG, EFiltyper.JPEG, EFiltyper.PDF].join(
                            ','
                        )}
                        maxSizeInBytes={MAKS_FILSTØRRELSE}
                        fileLimit={{
                            max: MAKS_ANTALL_FILER,
                            current: dokumentasjon.opplastedeVedlegg.length,
                        }}
                        onSelect={nyeFiler => console.log(nyeFiler)}
                    />
                )}

                {dokumentasjon.opplastedeVedlegg.length > 0 && (
                    <VStack gap="2" marginBlock={'8 0'}>
                        <Heading level="3" size="xsmall">
                            {`${plainTekst(frittståendeOrdTekster.vedlegg)} (${dokumentasjon.opplastedeVedlegg.length})`}
                        </Heading>
                        <VStack as="ul" gap="3">
                            {dokumentasjon.opplastedeVedlegg.map(vedlegg => (
                                <FileUpload.Item
                                    as="li"
                                    key={vedlegg.dokumentId}
                                    file={{
                                        name: vedlegg.navn,
                                        size: vedlegg.størrelse,
                                        lastModified: new Date(vedlegg.tidspunkt).getTime(),
                                    }}
                                    button={{
                                        action: 'delete',
                                        onClick: () => console.log(vedlegg),
                                    }}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )} */}
            </VStack>
        </FormSummary>
    );
};

export default LastOppVedlegg2;
