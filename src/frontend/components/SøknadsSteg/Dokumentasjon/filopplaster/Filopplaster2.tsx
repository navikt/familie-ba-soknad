import React from 'react';

import { FileUpload, Heading, List, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';
import { uppercaseFørsteBokstav } from '../../../../utils/visning';

import { useFilopplaster2 } from './useFilopplaster2';

interface IFilopplasterProps {
    dokumentasjon: IDokumentasjon;
    oppdaterDokumentasjon: (
        dokumentasjonsBehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const Filopplaster2: React.FC<IFilopplasterProps> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
    const { tekster, plainTekst } = useApp();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const {
        filerUnderOpplastning,
        avvisteFiler,
        MAKS_FILSTØRRELSE_MB,
        MAKS_FILSTØRRELSE_BYTES,
        MAKS_ANTALL_FILER,
        STØTTEDE_FILTYPER,
        feilmeldinger,
        leggTilVedlegg,
        fjernVedlegg,
        fjernAvvistFil,
    } = useFilopplaster2(dokumentasjon, oppdaterDokumentasjon, dokumentasjonTekster, plainTekst);

    return (
        <FileUpload
            translations={{
                dropzone: {
                    button: plainTekst(dokumentasjonTekster.velgFil),
                    buttonMultiple: plainTekst(dokumentasjonTekster.velgFiler),
                    dragAndDrop: plainTekst(dokumentasjonTekster.draOgSlippFilenHer),
                    dragAndDropMultiple: plainTekst(dokumentasjonTekster.draOgSlippFilerHer),
                    drop: uppercaseFørsteBokstav(plainTekst(frittståendeOrdTekster.slipp)),
                    or: plainTekst(frittståendeOrdTekster.eller),
                    disabled: plainTekst(
                        filerUnderOpplastning.length > 0
                            ? dokumentasjonTekster.filopplastingDeaktivertFilerErUnderOpplastning
                            : dokumentasjonTekster.filopplastingDeaktivert
                    ),
                    disabledFilelimit: plainTekst(
                        dokumentasjonTekster.filopplastingDeaktivertMaksAntallFiler
                    ),
                },
                item: {
                    retryButtonTitle: plainTekst(dokumentasjonTekster.lastOppFilenPaNytt),
                    deleteButtonTitle: plainTekst(dokumentasjonTekster.slettFilen),
                    uploading: plainTekst(dokumentasjonTekster.lasterOpp),
                    downloading: plainTekst(dokumentasjonTekster.lasterNed),
                },
            }}
        >
            <VStack gap="6">
                <FileUpload.Dropzone
                    label={plainTekst(dokumentasjonTekster.lastOppFiler)}
                    description={
                        <List as="ul" size="small">
                            <List.Item>{`${plainTekst(dokumentasjonTekster.stottedeFiltyper)} ${STØTTEDE_FILTYPER.join(' ')}`}</List.Item>
                            <List.Item>{`${plainTekst(dokumentasjonTekster.maksFilstorrelse)} ${MAKS_FILSTØRRELSE_MB} MB`}</List.Item>
                            <List.Item>{`${plainTekst(dokumentasjonTekster.maksAntallFiler)} ${MAKS_ANTALL_FILER}`}</List.Item>
                        </List>
                    }
                    accept={STØTTEDE_FILTYPER.join(',')}
                    maxSizeInBytes={MAKS_FILSTØRRELSE_BYTES}
                    fileLimit={{
                        max: MAKS_ANTALL_FILER,
                        current: dokumentasjon.opplastedeVedlegg.length,
                    }}
                    disabled={filerUnderOpplastning.length > 0 ? true : undefined}
                    onSelect={nyeFiler => leggTilVedlegg(nyeFiler)}
                />

                {(dokumentasjon.opplastedeVedlegg.length > 0 ||
                    filerUnderOpplastning.length > 0) && (
                    <VStack gap="2">
                        <Heading level="4" size="xsmall">
                            {`${plainTekst(frittståendeOrdTekster.vedlegg)} (${dokumentasjon.opplastedeVedlegg.length + filerUnderOpplastning.length})`}
                        </Heading>
                        <VStack as="ul" gap="3">
                            {dokumentasjon.opplastedeVedlegg.map((opplastetVedlegg, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={{
                                        name: opplastetVedlegg.navn,
                                        size: opplastetVedlegg.størrelse,
                                    }}
                                    button={{
                                        action: 'delete',
                                        onClick: () => fjernVedlegg(opplastetVedlegg),
                                    }}
                                />
                            ))}
                            {filerUnderOpplastning.map((filUnderOpplastning, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={{
                                        name: filUnderOpplastning.file.name,
                                        size: filUnderOpplastning.file.size,
                                    }}
                                    status="uploading"
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}

                {avvisteFiler.length > 0 && (
                    <VStack gap="2">
                        <Heading level="4" size="xsmall">
                            {`${plainTekst(frittståendeOrdTekster.vedleggMedFeil)} (${avvisteFiler.length})`}
                        </Heading>
                        <VStack as="ul" gap="3">
                            {avvisteFiler.map((fil, index) => (
                                <FileUpload.Item
                                    as="li"
                                    key={index}
                                    file={{
                                        name: fil.file.name,
                                        size: fil.file.size,
                                    }}
                                    error={feilmeldinger[fil.reasons[0]]}
                                    button={{
                                        action: 'delete',
                                        onClick: () => fjernAvvistFil(fil),
                                    }}
                                />
                            ))}
                        </VStack>
                    </VStack>
                )}
            </VStack>
        </FileUpload>
    );
};

export default Filopplaster2;
