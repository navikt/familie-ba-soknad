import React, { useEffect, useRef } from 'react';

import { format } from 'date-fns';

import { Alert, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import useUxSignals from '../../../hooks/useUxSignals';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { RouteEnum } from '../../../typer/routes';
import { Typografi } from '../../../typer/sanity/sanity';
import { setUserProperty, UserProperty } from '../../../utils/amplitude';
import { erDokumentasjonRelevant } from '../../../utils/dokumentasjon';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import TekstBlock from '../../Felleskomponenter/Sanity/TekstBlock';
import Steg from '../../Felleskomponenter/Steg/Steg';
import Kontoinformasjon from '../../Kontoinformasjon/Kontoinformasjon';

const Kvittering: React.FC = () => {
    const {
        avbrytOgSlettSøknad,
        sisteUtfylteStegIndex,
        settFåttGyldigKvittering,
        søknad,
        innsendingStatus,
        tekster,
        plainTekst,
    } = useApp();
    const { barnInkludertISøknaden } = søknad;
    const { hentStegNummer } = useSteg();

    const innsendtDato: Date =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : new Date();

    const klokkeslett = format(innsendtDato, 'HH:mm');
    const dato = format(innsendtDato, 'dd.MM.yy');

    const allNødvendigDokumentasjonErLastetOpp = useRef(
        !søknad.dokumentasjon.find(
            dokumentasjon =>
                dokumentasjon.dokumentasjonsbehov !== Dokumentasjonsbehov.ANNEN_DOKUMENTASJON &&
                erDokumentasjonRelevant(dokumentasjon) &&
                !(dokumentasjon.harSendtInn || dokumentasjon.opplastedeVedlegg.length > 0)
        )
    );

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);

            // I tilfelle vi kommer via mellomlagring og ikke har satt denne fra før, sett den her før vi nullstiller søknaden
            setUserProperty(UserProperty.ANTALL_VALGTE_BARN, barnInkludertISøknaden.length);

            avbrytOgSlettSøknad();
        }
    }, []);

    const kvitteringTekster = tekster().KVITTERING;

    useUxSignals(true);

    return (
        <Steg tittel={plainTekst(kvitteringTekster.kvitteringTittel)}>
            <Alert variant={'success'}>
                {plainTekst(kvitteringTekster.soeknadMottatt, {
                    klokkeslett: klokkeslett,
                    dato: dato,
                })}
            </Alert>
            <VStack gap="6">
                {allNødvendigDokumentasjonErLastetOpp.current ? (
                    <TekstBlock
                        block={kvitteringTekster.trengerIkkeEttersendeVedlegg}
                        typografi={Typografi.BodyLong}
                    />
                ) : (
                    <Alert variant="warning">
                        <TekstBlock block={kvitteringTekster.maaEttersendeVedleggAlert} />
                    </Alert>
                )}
                <TekstBlock block={kvitteringTekster.infoTilSoker} typografi={Typografi.BodyLong} />
            </VStack>
            <Kontoinformasjon />
            <div data-uxsignals-embed="panel-8zpbns6bc" style={{ maxWidth: '620px' }}></div>
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
