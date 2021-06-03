import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import AlertStripe from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { Sidetittel } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../../assets/VeilederSnakkeboble';
import { useApp } from '../../../context/AppContext';
import Miljø from '../../../Miljø';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';
import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

const StyledSidetittel = styled(Sidetittel)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

const StyledAlertStripe = styled(AlertStripe)`
    && {
        margin-top: 2rem;
    }
`;

const Forside: React.FC = () => {
    const { formatMessage } = useIntl();

    const { sluttbruker, mellomlagretVerdi } = useApp();

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';
    const kanFortsettePåSøknad =
        mellomlagretVerdi && mellomlagretVerdi.modellVersjon === Miljø().modellVersjon;

    return (
        <InnholdContainer>
            <VeilederSnakkeboble
                tekst={formatMessage({ id: 'forside.veilederhilsen' }, { navn: navn })}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <SpråkTekst id="forside.sidetittel" />
            </StyledSidetittel>

            <Sprakvelger støttedeSprak={[LocaleType.nn, LocaleType.nb]} />
            <StyledAlertStripe type={'info'}>
                <div>
                    This application is currently only available in Norwegian. If you need to apply
                    in English you have to use the PDF-form.
                </div>
                <Lenke
                    href={'https://www.nav.no/soknader/en/person/familie/barnetrygd'}
                    target={'_blank'}
                    rel="noopener noreferrer"
                >
                    {'Use PDF-form'}
                </Lenke>
            </StyledAlertStripe>
            <Informasjonsbolk>
                <SpråkTekst id="forside.info.punktliste" values={{ b: msg => <b>{msg}</b> }} />
                <EksternLenke
                    lenkeSpråkId={'forside.plikter.lenke'}
                    lenkeTekstSpråkId={'forside.plikter.lenketekst'}
                    target="_blank"
                />
            </Informasjonsbolk>

            {kanFortsettePåSøknad ? <FortsettPåSøknad /> : <BekreftelseOgStartSoknad />}

            <Informasjonsbolk>
                <EksternLenke
                    lenkeSpråkId={'forside.behandling-av-personopplysning.lenke'}
                    lenkeTekstSpråkId={'forside.behandling-av-personopplysning.lenketekst'}
                    target="_blank"
                />
            </Informasjonsbolk>
        </InnholdContainer>
    );
};

export default Forside;
