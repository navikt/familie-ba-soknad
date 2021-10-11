import React, { useEffect } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useEøs } from '../../../context/EøsContext';
import { RouteEnum, useRoutes } from '../../../context/RoutesContext';
import { setUserProperty, UserProperty } from '../../../utils/amplitude';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { KontonummerInfo } from './KontonummerInfo';

const Kvittering: React.FC = () => {
    const {
        avbrytOgSlettSøknad,
        sisteUtfylteStegIndex,
        settFåttGyldigKvittering,
        søknad,
    } = useApp();
    const { hentStegNummer } = useRoutes();
    const { eøsSkruddAv } = useEøs();

    const { innsendingStatus } = useApp();
    const innsendtDato: Dayjs =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? dayjs(innsendingStatus.data.mottattDato)
            : dayjs();

    const klokkeslett = innsendtDato.format('HH:mm');
    const dato = innsendtDato.format('DD.MM.YY');

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);

            // I tilfelle vi kommer via mellomlagring og ikke har satt denne fra før, sett den her før vi nullstiller søknaden
            setUserProperty(UserProperty.ANTALL_VALGTE_BARN, søknad.barnInkludertISøknaden.length);

            avbrytOgSlettSøknad();
        }
    }, []);

    return (
        <Steg tittel={<SpråkTekst id={'kvittering.sidetittel'} />}>
            <KomponentGruppe>
                <AlertStripe type="suksess">
                    <SpråkTekst
                        id={'kvittering.mottatt'}
                        values={{
                            tidspunkt: klokkeslett,
                            dato: dato,
                        }}
                    />
                </AlertStripe>
            </KomponentGruppe>
            <KomponentGruppe>
                <Normaltekst>
                    <SpråkTekst
                        id={'kvittering.info'}
                        values={{
                            lenkeDineSaker: (
                                <EksternLenke
                                    lenkeSpråkId={'kvittering.dinesaker.lenke'}
                                    lenkeTekstSpråkId={'kvittering.dinesaker.lenketekst'}
                                />
                            ),
                            lenkeFinnSaksbehandlingstid: (
                                <EksternLenke
                                    lenkeTekstSpråkId={'kvittering.saksbehandlingstid.lenketekst'}
                                    lenkeSpråkId={'kvittering.saksbehandlingstid.lenke'}
                                />
                            ),
                        }}
                    />
                </Normaltekst>
            </KomponentGruppe>

            {!eøsSkruddAv && (
                <KomponentGruppe>
                    <KontonummerInfo />
                </KomponentGruppe>
            )}

            <Informasjonsbolk tittelId={'kvittering.ikke-lastet-opp'}>
                <Normaltekst>
                    <SpråkTekst id={'kvittering.ettersend-dokumentasjon.info'} />
                </Normaltekst>
            </Informasjonsbolk>
            <EksternLenke
                lenkeTekstSpråkId={'kvittering.ettersend-dokumentasjon.lenketekst'}
                lenkeSpråkId={'kvittering.ettersend-dokumentasjon.lenke'}
            />
            <BlokkerTilbakeKnappModal />
        </Steg>
    );
};

export default Kvittering;
