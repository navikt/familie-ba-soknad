import React, { useEffect, useState } from 'react';

import { format } from 'date-fns';

import { BodyLong } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import { useSteg } from '../../../context/StegContext';
import { RouteEnum } from '../../../typer/routes';
import { setUserProperty, UserProperty } from '../../../utils/amplitude';
import BlokkerTilbakeKnappModal from '../../Felleskomponenter/BlokkerTilbakeKnappModal/BlokkerTilbakeKnappModal';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
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
        innsendingStatus,
    } = useApp();
    const { barnInkludertISøknaden, erEøs } = søknad;
    const { hentStegNummer } = useSteg();

    const innsendtDato: Date =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : new Date();

    const klokkeslett = format(innsendtDato, 'HH:mm');
    const dato = format(innsendtDato, 'dd.MM.yy');
    const [varEøsSøknad] = useState(erEøs);

    useEffect(() => {
        if (sisteUtfylteStegIndex === hentStegNummer(RouteEnum.Dokumentasjon)) {
            settFåttGyldigKvittering(true);

            // I tilfelle vi kommer via mellomlagring og ikke har satt denne fra før, sett den her før vi nullstiller søknaden
            setUserProperty(UserProperty.ANTALL_VALGTE_BARN, barnInkludertISøknaden.length);

            avbrytOgSlettSøknad();
        }
    }, []);

    return (
        <Steg tittel={<SpråkTekst id={'kvittering.sidetittel'} />}>
            <KomponentGruppe>
                <FamilieAlert variant={'success'} inline={false}>
                    <SpråkTekst
                        id={'kvittering.mottatt'}
                        values={{
                            tidspunkt: klokkeslett,
                            dato: dato,
                        }}
                    />
                </FamilieAlert>
            </KomponentGruppe>
            <KomponentGruppe>
                <BodyLong>
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
                </BodyLong>
            </KomponentGruppe>

            {varEøsSøknad && (
                <KomponentGruppe>
                    <KontonummerInfo />
                </KomponentGruppe>
            )}

            <Informasjonsbolk tittelId={'kvittering.ikke-lastet-opp'}>
                <BodyLong>
                    <SpråkTekst id={'kvittering.ettersend-dokumentasjon.info'} />
                </BodyLong>
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
