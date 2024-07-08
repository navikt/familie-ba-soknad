import React, { useState } from 'react';

import { add, isBefore } from 'date-fns';

import { Alert, BodyLong, BodyShort } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useFeatureToggles } from '../../../context/FeatureToggleContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { useSendInnSkjema } from '../../../hooks/useSendInnSkjema';
import { IDokumentasjon, IVedlegg } from '../../../typer/dokumentasjon';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESanitySteg } from '../../../typer/sanity/sanity';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import { Feilside } from '../../Felleskomponenter/Feilside/Feilside';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import PictureScanningGuide from '../../Felleskomponenter/PictureScanningGuide/PictureScanningGuide';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

import LastOppVedlegg from './LastOppVedlegg';

// Vedlegg er lagret 48 timer
export const erVedleggstidspunktGyldig = (vedleggTidspunkt: string): boolean => {
    const grenseTidForVedlegg = add(new Date(vedleggTidspunkt), { hours: 46 });
    return isBefore(new Date(), grenseTidForVedlegg);
};

const Dokumentasjon: React.FC = () => {
    const { søknad, settSøknad, innsendingStatus, tekster } = useApp();
    const { sendInnSkjemaV8 } = useSendInnSkjema();
    const { toggles } = useFeatureToggles();
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

    const { dokumentasjonGuide } = stegTekster;

    return (
        <Steg
            tittel={<SpråkTekst id={'dokumentasjon.sidetittel'} />}
            guide={dokumentasjonGuide}
            gåVidereCallback={async () => {
                const [success, _] = await sendInnSkjemaV8();
                return success;
            }}
        >
            {slettaVedlegg.length > 0 && (
                <KomponentGruppe>
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
                </KomponentGruppe>
            )}
            {!toggles.VIS_GUIDE_I_STEG ? (
                <KomponentGruppe>
                    <Alert variant={'info'}>
                        <SpråkTekst id={'dokumentasjon.nudge'} />
                    </Alert>

                    <BodyLong>
                        <SpråkTekst id={'dokumentasjon.info'} />
                    </BodyLong>

                    <PictureScanningGuide />
                </KomponentGruppe>
            ) : (
                <KomponentGruppe>
                    <PictureScanningGuide />
                </KomponentGruppe>
            )}
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
        </Steg>
    );
};

export default Dokumentasjon;
