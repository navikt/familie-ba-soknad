import React from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Sidetittel } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../../assets/VeilederSnakkeboble';
import { useApp } from '../../../context/AppContext';
import { RouteEnum } from '../../../context/RoutesContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import Miljø from '../../../Miljø';
import { logSidevisningBarnetrygd } from '../../../utils/amplitude';
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

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto;
`;

const Forside: React.FC = () => {
    const { formatMessage } = useIntl();
    const { sluttbruker, mellomlagretVerdi, erUtvidet, søknad } = useApp();

    useFørsteRender(() => {
        logSidevisningBarnetrygd(`${RouteEnum.Forside}`);
    });

    const kanFortsettePåSøknad =
        mellomlagretVerdi &&
        mellomlagretVerdi.modellVersjon === Miljø().modellVersjon &&
        mellomlagretVerdi.søknad.søknadstype === søknad.søknadstype;

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    return (
        <InnholdContainer>
            <VeilederSnakkeboble
                tekst={formatMessage(
                    { id: 'forside.veilederhilsen' },
                    { navn: navn.toUpperCase() }
                )}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <SpråkTekst id={erUtvidet ? 'forside.utvidet.sidetittel' : 'forside.sidetittel'} />
            </StyledSidetittel>

            <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />
            <Informasjonsbolk>
                <SpråkTekst id={'forside.info.punktliste'} values={{ b: msg => <b>{msg}</b> }} />
                <EksternLenke
                    lenkeSpråkId={'forside.plikter.lenke'}
                    lenkeTekstSpråkId={'forside.plikter.lenketekst'}
                    target="_blank"
                />
                {erUtvidet && (
                    <EksternLenke
                        lenkeSpråkId={'forside.hvemharrettpåutvidet.lenke'}
                        lenkeTekstSpråkId={'forside.hvemharrettpåutvidet.lenketekst'}
                        target="_blank"
                    />
                )}
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
