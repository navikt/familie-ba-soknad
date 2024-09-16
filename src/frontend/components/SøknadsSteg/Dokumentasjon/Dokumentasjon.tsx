import React, { useState } from 'react';

import { add, isBefore } from 'date-fns';

import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = add(new Date(vedleggTidspunkt), { hours: 46 });
    return isBefore(new Date(), grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus, tekster, plainTekst } = useApp();
    const { sendInnSkjema } = useSendInnSkjema();
    const [slettaVedlegg, settSlettaVedlegg] = useState<IVedlegg[]>([]);

    const oppdaterDokumentasjon = (
        dokumentasjonsbehov: Dokumentasjonsbehov,
        opplastedeVedlegg: IVedlegg[],
        harSendtInn: boolean
    ) => {
        settSøknad(prevState => ({
            ...prevState,
            dokumentasjon: prevState.dokumentasjon.map(dok =>
                dok.dokumentasjonsbehov === dokumentasjonsbehov
                    ? { ...dok, opplastedeVedlegg, harSendtInn }
                    : dok
            ),
        }));
    };

    // Fjern vedlegg som evt. har blitt slettet i familie-dokument
    useFørsteRender(() => {
        søknad.dokumentasjon.forEach((dok: IDokumentasjon) => {
            if (dok.opplastedeVedlegg) {
                const gyldigeVedlegg = dok.opplastedeVedlegg.filter(vedlegg =>
                    erVedleggstidspunktGyldig(vedlegg.tidspunkt)
                );
                const ugyldigeVedlegg = dok.opplastedeVedlegg.filter(
                    vedlegg => !gyldigeVedlegg.includes(vedlegg)
                );

                if (gyldigeVedlegg.length !== dok.opplastedeVedlegg.length) {
                    settSlettaVedlegg(prevState => [prevState, ugyldigeVedlegg].flat());
                    oppdaterDokumentasjon(dok.dokumentasjonsbehov, gyldigeVedlegg, dok.harSendtInn);
                }
            }
        });
    });

    const relevateDokumentasjoner = søknad.dokumentasjon.filter(dokumentasjon =>
        erDokumentasjonRelevant(dokumentasjon)
    );

    const brukerMåSendeVedlegg =
        relevateDokumentasjoner.filter(
            dokumentasjon =>
                dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
        ).length > 0;

    const stegTekster = tekster()[ESanitySteg.DOKUMENTASJON];
    const { dokumentasjonGuide } = stegTekster;

    return (
        <Steg
            tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}
            guide={dokumentasjonGuide}
            gåVidereCallback={async () => {
                const [success, _] = await sendInnSkjema();
                return success;
            }}
        >
            <VStack gap="12">
                {slettaVedlegg.length > 0 && (
                    <Alert variant={'warning'}>
                        <BodyShort>
                            <SpråkTekst id={'dokumentasjon.forlangtid.info'} />
                        </BodyShort>
                        <ul>
                            {slettaVedlegg.map(vedlegg => (
                                <li key={vedlegg.dokumentId}>
                                    <BodyShort>{vedlegg.navn}</BodyShort>
                                </li>
                            ))}
                        </ul>
                    </Alert>
                )}

                {!brukerMåSendeVedlegg && (
                    <div>
                        <Heading level="3" size="medium" spacing>
                            {plainTekst(stegTekster.ingenVedleggskravTittel)}
                        </Heading>
                        <TekstBlock
                            block={stegTekster.ingenVedleggskrav}
                            typografi={Typografi.BodyLong}
                        />
                    </div>
                )}

                <PictureScanningGuide />

                {brukerMåSendeVedlegg && (
                    <div>
                        <Heading level="3" size="medium" spacing>
                            {plainTekst(stegTekster.manglerDokumentasjonSpoersmaalTittel)}
                        </Heading>
                        <TekstBlock
                            block={stegTekster.manglerDokumentasjonSpoersmaal}
                            typografi={Typografi.BodyLong}
                        />
                    </div>
                )}

                {relevateDokumentasjoner.map((dokumentasjon, index) => (
                    <LastOppVedlegg
                        key={index}
                        vedleggNr={index + 1}
                        dokumentasjon={dokumentasjon}
                        oppdaterDokumentasjon={oppdaterDokumentasjon}
                    />
                ))}

                {innsendingStatus.status === RessursStatus.FEILET && <Feilside />}
            </VStack>
        </Steg>
    );
};

export default Dokumentasjon;
