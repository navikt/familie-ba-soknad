import React, { useState } from 'react';

import { add, isBefore } from 'date-fns';

import { Alert, BodyShort, Heading, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useAppContext } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg, Typografi } from '../../../typer/sanity/sanity';
import { hentRelevateDokumentasjoner } from '../../../utils/dokumentasjon';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { VedleggOppsummering } from '../../Felleskomponenter/VedleggOppsummering/VedleggOppsummering';
import { hentVedleggOppsummering } from '../../Felleskomponenter/VedleggOppsummering/vedleggOppsummering.domene';

import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = add(new Date(vedleggTidspunkt), { hours: 46 });
    return isBefore(new Date(), grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const {
        søknad,
        settSøknad,
        innsendingStatus,
        tekster,
        plainTekst,
        tvingKjøringAvDebouncedMellomlagre,
    } = useAppContext();
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

    const stegTekster = tekster()[ESanitySteg.DOKUMENTASJON];
    const frittståendeOrdTekster = tekster()[ESanitySteg.FELLES].frittståendeOrd;

    const relevateDokumentasjoner = hentRelevateDokumentasjoner(søknad.dokumentasjon);

    const relevateDokumentasjonerUtenAnnenDokumentasjon = relevateDokumentasjoner.filter(
        dokumentasjon =>
            dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON
    );

    const brukerHarVedleggskrav = relevateDokumentasjonerUtenAnnenDokumentasjon.length > 0;

    const vedleggOppsummering = hentVedleggOppsummering(
        relevateDokumentasjonerUtenAnnenDokumentasjon,
        søknad,
        plainTekst,
        frittståendeOrdTekster
    );

    return (
        <Steg
            tittel={<TekstBlock block={stegTekster.dokumentasjonTittel} />}
            guide={
                brukerHarVedleggskrav
                    ? stegTekster.dokumentasjonGuideVedleggskrav
                    : stegTekster.dokumentasjonGuideIngenVedleggskrav
            }
            gåVidereCallback={async () => {
                tvingKjøringAvDebouncedMellomlagre();
                const [success, _] = await sendInnSkjema();
                return success;
            }}
        >
            <VStack gap="12">
                {slettaVedlegg.length > 0 && (
                    <Alert variant={'warning'}>
                        <TekstBlock
                            block={stegTekster.forLangTidDokumentasjon}
                            typografi={Typografi.BodyLong}
                        />
                        <ul>
                            {slettaVedlegg.map(vedlegg => (
                                <li key={vedlegg.dokumentId}>
                                    <BodyShort>{vedlegg.navn}</BodyShort>
                                </li>
                            ))}
                        </ul>
                    </Alert>
                )}
                {brukerHarVedleggskrav ? (
                    <>
                        <div>
                            <Heading level="3" size="small" spacing>
                                {plainTekst(stegTekster.vedleggskravTittel)}
                            </Heading>
                            <VedleggOppsummering vedlegg={vedleggOppsummering} />
                            <TekstBlock
                                block={stegTekster.vedleggskrav}
                                typografi={Typografi.BodyLong}
                            />
                        </div>
                        <PictureScanningGuide />
                        <div>
                            <Heading level="3" size="small" spacing>
                                {plainTekst(stegTekster.manglerDokumentasjonSpoersmaalTittel)}
                            </Heading>
                            <TekstBlock
                                block={stegTekster.manglerDokumentasjonSpoersmaal}
                                typografi={Typografi.BodyLong}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <Heading level="3" size="small" spacing>
                                {plainTekst(stegTekster.ingenVedleggskravTittel)}
                            </Heading>
                            <TekstBlock
                                block={stegTekster.ingenVedleggskrav}
                                typografi={Typografi.BodyLong}
                            />
                        </div>
                        <PictureScanningGuide />
                    </>
                )}
                {relevateDokumentasjoner.map((dokumentasjon, index) => (
                    <LastOppVedlegg
                        key={index}
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
