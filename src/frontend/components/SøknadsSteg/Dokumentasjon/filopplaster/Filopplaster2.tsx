import React from 'react';

import { FileUpload, Heading, List, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../context/AppContext';
import { IDokumentasjon, IVedlegg } from '../../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../../typer/kontrakt/dokumentasjon';

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
    const {
        avvisteFiler,
        MAKS_FILSTØRRELSE_MB,
        MAKS_FILSTØRRELSE_BYTES,
        MAKS_ANTALL_FILER,
        STØTTEDE_FILTYPER,
        feilmeldinger,
        leggTilVedlegg,
        fjernVedlegg,
        fjernAvvistFil,
    } = useFilopplaster2(dokumentasjon, oppdaterDokumentasjon);
    const { tekster, plainTekst } = useApp();

    const dokumentasjonTekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    return (
        <>
            <FileUpload.Dropzone
                label={'Last opp filer'}
                description={
                    <List as="ul" size="small">
                        <List.Item>{`${dokumentasjonTekster.stottedeFiltyper} ${STØTTEDE_FILTYPER.join(' ')}`}</List.Item>
                        <List.Item>{`${dokumentasjonTekster.maksFilstorrelse} ${MAKS_FILSTØRRELSE_MB} MB`}</List.Item>
                        <List.Item>{`${dokumentasjonTekster.maksAntallFiler} ${MAKS_ANTALL_FILER}`}</List.Item>
                    </List>
                }
                accept={STØTTEDE_FILTYPER.join(',')}
                maxSizeInBytes={MAKS_FILSTØRRELSE_BYTES}
                fileLimit={{
                    max: MAKS_ANTALL_FILER,
                    current: dokumentasjon.opplastedeVedlegg.length,
                }}
                onSelect={nyeFiler => leggTilVedlegg(nyeFiler)}
            />

            {dokumentasjon.opplastedeVedlegg.length > 0 && (
                <VStack gap="2">
                    <Heading level="4" size="xsmall">
                        {`${plainTekst(frittståendeOrdTekster.vedlegg)} (${dokumentasjon.opplastedeVedlegg.length})`}
                    </Heading>
                    <VStack as="ul" gap="3">
                        {dokumentasjon.opplastedeVedlegg.map(opplastetVedlegg => (
                            <FileUpload.Item
                                as="li"
                                key={opplastetVedlegg.dokumentId}
                                file={opplastetVedlegg.fil}
                                button={{
                                    action: 'delete',
                                    onClick: () => fjernVedlegg(opplastetVedlegg),
                                }}
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
                                file={fil.file}
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
        </>
    );
};

export default Filopplaster2;
