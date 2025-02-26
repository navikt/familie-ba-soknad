import React from 'react';

import { Checkbox, FileUpload, FormSummary, Heading, List, VStack } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import {
    dokumentasjonsbehovTilBeskrivelseSanityApiNavn,
    dokumentasjonsbehovTilTittelSanityApiNavn,
    IDokumentasjon,
    IVedlegg,
} from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { LocaleRecordBlock, Typografi } from '../../../typer/sanity/sanity';
import { slåSammen } from '../../../utils/slåSammen';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import { useFilopplaster2 } from './filopplaster/useFilopplaster2';

interface Props {
    dokumentasjon: IDokumentasjon;
    oppdaterDokumentasjon: (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => void;
}

const LastOppVedlegg2: React.FC<Props> = ({ dokumentasjon, oppdaterDokumentasjon }) => {
    const {
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
    } = useFilopplaster2(dokumentasjon, oppdaterDokumentasjon);

    const { søknad, tekster, plainTekst } = useApp();

    const dokumentasjonstekster = tekster().DOKUMENTASJON;
    const frittståendeOrdTekster = tekster().FELLES.frittståendeOrd;

    const settHarSendtInnTidligere = (event: React.ChangeEvent<HTMLInputElement>) => {
        const huketAv = event.target.checked;
        const vedlegg = huketAv ? [] : dokumentasjon.opplastedeVedlegg;
        oppdaterDokumentasjon(dokumentasjon.dokumentasjonsbehov, vedlegg, huketAv);
        if (huketAv) {
            fjernAlleAvvisteFiler();
        }
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
