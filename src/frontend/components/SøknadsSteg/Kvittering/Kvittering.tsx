import React, { useEffect, useRef, useState } from 'react';

import { format } from 'date-fns';

import { Alert, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useAppContext } from '../../../context/AppContext';
import { useStegContext } from '../../../context/StegContext';
import { useUxSignals } from '../../../hooks/useUxSignals';
import { Dokumentasjonsbehov } from '../../../typer/kontrakt/dokumentasjon';
import { ESøknadstype } from '../../../typer/kontrakt/generelle';
import { RouteEnum } from '../../../typer/routes';
import { Typografi } from '../../../typer/sanity/sanity';
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
    } = useAppContext();
    const { hentStegNummer } = useStegContext();

    const [innsendtSøknadErUtvidet, settInnsendtSøknadErUtvidet] = useState(false);

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
            settInnsendtSøknadErUtvidet(søknad.søknadstype === ESøknadstype.UTVIDET);
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
            {innsendtSøknadErUtvidet && (
                <div data-uxsignals-embed="panel-1zfoi9d7uh" style={{ maxWidth: '620px' }}></div>
            )}
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
