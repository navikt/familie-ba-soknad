import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';

import AlertStripe from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst } from 'nav-frontend-typografi';

import { RessursStatus } from '@navikt/familie-typer';

import { useApp } from '../../../context/AppContext';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import Steg from '../../Felleskomponenter/Steg/Steg';
import { SpråkLenke } from '../../Felleskomponenter/SpråkLenke/SpråkLenke';

const Kvittering: React.FC = () => {
    const intl = useIntl();
    const { settSisteUtfylteStegIndex } = useApp();

    const { innsendingStatus } = useApp();
    const innsendtDato =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : null;

    const klokkeslett = innsendtDato?.toLocaleTimeString();
    const dato = innsendtDato?.toLocaleDateString();

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
                    {` ${intl.formatMessage({ id: 'kvittering.mottatt' })} 
                (${klokkeslett}, ${dato})`}
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
