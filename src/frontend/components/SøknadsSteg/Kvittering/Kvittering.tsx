import { Typografi } from '@common/sanity';
import { Dokumentasjonsbehov } from '@common/typer/kontrakt/dokumentasjon';
import { ESøknadstype } from '@common/typer/kontrakt/generelle';
import { BlokkerTilbakeKnappModal } from '@components/Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import TekstBlock from '@components/Felleskomponenter/Sanity/TekstBlock';
import Steg from '@components/Felleskomponenter/Steg/Steg';
import Kontoinformasjon from '@components/Kontoinformasjon/Kontoinformasjon';
import { useAppContext } from '@context/AppContext';
import { useStegContext } from '@context/StegContext';
import { useUxSignals } from '@hooks/useUxSignals';
import { CheckmarkCircleIcon, ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { InfoCard, VStack } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import { RouteEnum } from '@typer/routes';
import { erDokumentasjonRelevant } from '@utils/dokumentasjon';
import { format } from 'date-fns';
import { type FC, useEffect, useRef, useState } from 'react';

const Kvittering: FC = () => {
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
        innsendingStatus.status === RessursStatus.SUKSESS ? new Date(innsendingStatus.data.mottattDato) : new Date();

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
            <InfoCard data-color={'success'}>
                <InfoCard.Message icon={<CheckmarkCircleIcon aria-hidden />}>
                    {plainTekst(kvitteringTekster.soeknadMottatt, {
                        klokkeslett: klokkeslett,
                        dato: dato,
                    })}
                </InfoCard.Message>
            </InfoCard>
            <VStack gap="space-24">
                {allNødvendigDokumentasjonErLastetOpp.current ? (
                    <TekstBlock block={kvitteringTekster.trengerIkkeEttersendeVedlegg} typografi={Typografi.BodyLong} />
                ) : (
                    <InfoCard data-color={'warning'}>
                        <InfoCard.Message icon={<ExclamationmarkTriangleIcon aria-hidden />}>
                            <TekstBlock block={kvitteringTekster.maaEttersendeVedleggAlert} />
                        </InfoCard.Message>
                    </InfoCard>
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
