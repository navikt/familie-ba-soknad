import React, { useState } from 'react';

import { add, isBefore } from 'date-fns';

import { Alert, BodyShort, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { slåSammen } from '../../../utils/slåSammen';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import {
    IVedleggOppsummeringProps,
    VedleggOppsummering,
} from '../../Felleskomponenter/VedleggOppsummering';

import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = add(new Date(vedleggTidspunkt), { hours: 46 });
    return isBefore(new Date(), grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus, tekster } = useApp();
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

    const vedleggOppsummering: IVedleggOppsummeringProps['vedlegg'] = søknad.dokumentasjon
        .filter(
            dokumentasjon =>
                dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON &&
                erDokumentasjonRelevant(dokumentasjon)
        )
        .map(dokumentasjon => {
            const barnDokGjelderFor = søknad.barnInkludertISøknaden.filter(barn =>
                dokumentasjon.gjelderForBarnId.find(id => id === barn.id)
            );
            const barnasNavn = slåSammen(barnDokGjelderFor.map(barn => barn.navn));

            return {
                skalVises: true,
                dokumentasjonsbehov: dokumentasjon.dokumentasjonsbehov,
                flettefeltVerdier: { barnetsNavn: barnasNavn },
            };
        });

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

                <VedleggOppsummering vedlegg={vedleggOppsummering} />

                <PictureScanningGuide />

                {søknad.dokumentasjon
                    .filter(dokumentasjon => erDokumentasjonRelevant(dokumentasjon))
                    .map((dokumentasjon, index) => (
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
