import React, { useState } from 'react';

import {
    Checkbox,
    Detail,
    FileAccepted,
    FileObject,
    FileRejected,
    FileRejectionReason,
    FileUpload,
    FormSummary,
    Heading,
    List,
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
import { LocaleRecordBlock, Typografi } from '../../../typer/sanity/sanity';
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

    const tittel: LocaleRecordBlock =
        dokumentasjonstekster[
            dokumentasjonsbehovTilTittelSanityApiNavn(dokumentasjon.dokumentasjonsbehov)
        ];

    const barnDokumentasjonenGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
        dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
    );
    const barnasNavn = slåSammen(barnDokumentasjonenGjelderFor.map(barn => barn.navn));

    const dokumentasjonsbeskrivelse = dokumentasjonsbehovTilBeskrivelseSanityApiNavn(
        dokumentasjon.dokumentasjonsbehov
    );

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

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">
                    {plainTekst(tittel, { barnetsNavn: barnasNavn })}
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
                        )} (${plainTekst(tittel, { barnetsNavn: barnasNavn })})`}
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
                            description={
                                <List as="ul" size="small">
                                    <List.Item>
                                        {`Støttede filtyper: ${støttedeFiltyper.join(' ')}`}
                                    </List.Item>
                                    <List.Item>
                                        {`Maks filstørrelse: ${MAKS_FILSTØRRELSE_MB} MB`}
                                    </List.Item>
                                    <List.Item>
                                        {`Maks antall filer: ${MAKS_ANTALL_FILER}`}
                                    </List.Item>
                                </List>
                            }
                            accept={støttedeFiltyper.join(',')}
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
                                    {dokumentasjon.opplastedeVedlegg.map(
                                        (opplastetVedlegg, index) => (
                                            <FileUpload.Item
                                                as="li"
                                                key={index}
                                                file={opplastetVedlegg.fil}
                                                button={{
                                                    action: 'delete',
                                                    onClick: () => fjernVedlegg(opplastetVedlegg),
                                                }}
                                            />
                                        )
                                    )}
                                </VStack>
                            </VStack>
                        )}

                        {avvisteFiler.length > 0 && (
                            <VStack gap="2">
                                <Heading level="4" size="xsmall">
                                    Vedlegg med feil ({avvisteFiler.length})
                                </Heading>
                                <VStack as="ul" gap="3">
                                    {avvisteFiler.map((fil, index) => (
                                        <FileUpload.Item
                                            as="li"
                                            key={index}
                                            file={fil.file}
                                            error={feilMeldinger[fil.reasons[0]]}
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
                )}
            </VStack>
        </FormSummary>
    );
};

export default LastOppVedlegg2;
