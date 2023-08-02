import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';
import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import Miljø from '../../../../shared-utils/Miljø';
import VeilederSnakkeboble from '../../../assets/VeilederSnakkeboble';
import { useApp } from '../../../context/AppContext';
import useFørsteRender from '../../../hooks/useFørsteRender';
import { RouteEnum } from '../../../typer/routes';
import { logSidevisningBarnetrygd } from '../../../utils/amplitude';
import EksternLenke from '../../Felleskomponenter/EksternLenke/EksternLenke';
import FamilieAlert from '../../Felleskomponenter/FamilieAlert/FamilieAlert';
import Informasjonsbolk from '../../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';
import FortsettPåSøknad from './FortsettPåSøknad';

const StyledHeading = styled(Heading)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

const StyledSpråkvelger = styled(Sprakvelger)`
    margin: auto;
`;

const StyledAlertStripeUtvidetInfo = styled(FamilieAlert)`
    margin-top: 3rem;
`;

const Forside: React.FC = () => {
    const { formatMessage } = useIntl();

    const { sluttbruker, mellomlagretVerdi, erUtvidet, søknad, settNåværendeRoute } = useApp();

    useFørsteRender(() => logSidevisningBarnetrygd(`${RouteEnum.Forside}`));

    useEffect(() => {
        settNåværendeRoute(RouteEnum.Forside);
    }, []);

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

            <StyledHeading>
                <SpråkTekst id={erUtvidet ? 'forside.utvidet.sidetittel' : 'forside.sidetittel'} />
            </StyledHeading>

            <StyledSpråkvelger støttedeSprak={[LocaleType.nn, LocaleType.nb, LocaleType.en]} />

            {!erUtvidet && (
                <StyledAlertStripeUtvidetInfo variant={'info'} inline={false}>
                    <SpråkTekst id={'forside.utvidetinfo.info'} />
                    <EksternLenke
                        lenkeSpråkId={'forside.utvidetinfo.lenke'}
                        lenkeTekstSpråkId={'forside.utvidetinfo.lenketekst'}
                        target="_blank"
                    />
                </StyledAlertStripeUtvidetInfo>
            )}

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
