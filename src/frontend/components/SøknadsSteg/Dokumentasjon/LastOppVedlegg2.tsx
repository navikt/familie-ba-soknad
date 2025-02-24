import React from 'react';

import { Checkbox, FileUpload, FormSummary, Heading, VStack } from '@navikt/ds-react';

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

    const MAKS_FILSTØRRELSE = 1024 * 1024 * 10; // 10 MB
    const MAKS_ANTALL_FILER = 25;

    return (
        <FormSummary>
            <FormSummary.Header>
                <FormSummary.Heading level="3">
                    {plainTekst(tittelBlock, { barnetsNavn: barnasNavn })}
                </FormSummary.Heading>
            </FormSummary.Header>
            <VStack gap="5" paddingInline="6" paddingBlock="5 6">
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
                )}
            </VStack>
        </FormSummary>
    );
};

export default LastOppVedlegg2;
