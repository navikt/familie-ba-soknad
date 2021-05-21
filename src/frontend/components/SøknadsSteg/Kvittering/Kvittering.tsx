import React, { useEffect } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import AlertStripe from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import { SpråkLenke } from '../../Felleskomponenter/SpråkLenke/SpråkLenke';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';

const Kvittering: React.FC = () => {
    const { settSisteUtfylteStegIndex } = useApp();

    const { innsendingStatus } = useApp();
    const innsendtDato: Dayjs =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? dayjs(innsendingStatus.data.mottattDato)
            : dayjs();

    const klokkeslett = innsendtDato.format('HH:mm');
    const dato = innsendtDato.format('DD.MM.YY');

    useEffect(() => {
        return () => {
            // TODO: Vurder å nulle ut hele søknaden
            settSisteUtfylteStegIndex(-1);
        };
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
                                <SpråkLenke
                                    hrefId={'kvittering.dinesaker.lenke'}
                                    lenkeTekstId={'kvittering.dinesaker.lenketekst'}
                                />
                            ),
                            lenkeFinnSaksbehandlingstid: (
                                <SpråkLenke
                                    hrefId={'kvittering.saksbehandlingstid.lenketekst'}
                                    lenkeTekstId={'kvittering.saksbehandlingstid.lenketekst'}
                                />
                            ),
                        }}
                    />
                </Normaltekst>
            </KomponentGruppe>

            <Informasjonsbolk tittelId={'kvittering.ikke-lastet-opp'}>
                <Normaltekst>
                    <SpråkTekst id={'kvittering.ettersend-dokumentasjon.info'} />
                </Normaltekst>
            </Informasjonsbolk>
            <EksternLenke
                lenkeTekstSpråkId={'kvittering.ettersend-dokumentasjon.lenketekst'}
                lenkeSpråkId={'kvittering.ettersend-dokumentasjon.lenke'}
            />
        </Steg>
    );
};

export default Kvittering;
