import React from 'react';

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

const Kvittering: React.FC = () => {
    const intl = useIntl();

    const { innsendingStatus } = useApp();
    const innsendtDato =
        innsendingStatus.status === RessursStatus.SUKSESS
            ? new Date(innsendingStatus.data.mottattDato)
            : null;

    const klokkeslett = innsendtDato?.toLocaleTimeString();
    const dato = innsendtDato?.toLocaleDateString();

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
                            lenke: (
                                <Lenke href={'https://www.nav.no/no/ditt-nav'}>
                                    <SpråkTekst id={'kvittering.info.lenketittel'} />
                                </Lenke>
                            ),
                        }}
                    />
                    <Lenke
                        href={
                            'https://www.nav.no/no/nav-og-samfunn/om-nav/saksbehandlingstider-i-nav'
                        }
                    >
                        <SpråkTekst id={'kvittering.info.finn-saksbehandlingstid'} />
                    </Lenke>
                </Normaltekst>
            </KomponentGruppe>

            <Informasjonsbolk tittelId={'kvittering.ikke-lastet-opp'}>
                <Normaltekst>
                    <SpråkTekst id={'kvittering.ettersend-dokumentasjon.info'} />
                </Normaltekst>
            </Informasjonsbolk>
            <EksternLenke
                lenkeTekstSpråkId={'kvittering.ettersend-dokumentasjon.lenketekst'}
                lenkeSpråkId={'https://www.nav.no/soknader/nb/person/familie/barnetrygd'}
            />
        </Steg>
    );
};

export default Kvittering;
