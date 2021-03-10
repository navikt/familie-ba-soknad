import React, { useState, useEffect } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import KnappBase from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useApp } from '../../context/AppContext';
import { StegRoutes } from '../../routing/Routes';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import BekreftelsePanel from './BekreftelsePanel';

const panelBredde = '524px';
const tablet = '959px';

const ForsideContainer = styled.div`
    width: ${panelBredde};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 2rem auto 20rem auto;
    color: ${navFarger.navMorkGra};

    && label,
    a,
    p {
        font-size: 18px;
        line-height: 26px;
    }

    @media all and (max-width: ${tablet}) {
        width: 100%;
        padding: 2rem;
    }
`;

const StyledSidetittel = styled(Sidetittel)`
    margin: 4rem 0 2.3rem 0;
`;

const StyledLenke = styled(Lenke)`
    margin-top: 1.125rem;
    display: inline-block;
`;

const StyledKnappBase = styled(KnappBase)`
    margin: 2.3rem auto 0 auto;
`;

export enum BekreftelseStatus {
    NORMAL = 'NORMAL',
    BEKREFTET = 'BEKREFTET',
    FEIL = 'FEIL',
}

const Forside: React.FC = () => {
    const [bekreftelseStatus, settBekreftelseStatus] = useState<BekreftelseStatus>(
        BekreftelseStatus.NORMAL
    );

    const { formatMessage } = useIntl();
    const history = useHistory();

    const { sluttbruker, nullstillSøknadsobjekt, settUtfyltSteg } = useApp();

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    useEffect(() => {
        nullstillSøknadsobjekt(sluttbruker);
        settUtfyltSteg(0);
    }, []);

    const startSøknadOnClick = () => {
        bekreftelseStatus === BekreftelseStatus.BEKREFTET
            ? history.push(Object.values(StegRoutes)[0].path)
            : settBekreftelseStatus(BekreftelseStatus.FEIL);
    };

    const bekreftelseOnChange = () => {
        settBekreftelseStatus(prevState =>
            prevState !== BekreftelseStatus.BEKREFTET
                ? BekreftelseStatus.BEKREFTET
                : BekreftelseStatus.NORMAL
        );
    };

    return (
        <ForsideContainer>
            <VeilederSnakkeboble
                tekst={formatMessage({ id: 'forside.veileder.hilsen' }, { navn: navn })}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <FormattedMessage id="forside.sidetittel" />
            </StyledSidetittel>

            <Sprakvelger støttedeSprak={[LocaleType.en, LocaleType.nb]} />

            <Informasjonsbolk>
                <Normaltekst>
                    <FormattedMessage
                        id="forside.rett-på-barnetrygd"
                        values={{ linjeskift: <br /> }}
                    />
                </Normaltekst>
                <StyledLenke href={'https://www.nav.no'}>
                    <FormattedMessage id="forside.barnetrygd-lenke-tekst" />
                </StyledLenke>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.oppmaning.tittel">
                <Normaltekst>
                    <FormattedMessage
                        id="forside.oppmaning.brødtekst"
                        values={{ linjeskift: <br /> }}
                    />
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.dokumentasjonskrav.tittel">
                <Normaltekst>
                    <FormattedMessage id="forside.dokumentasjonskrav.brødtekst" />
                </Normaltekst>
                <StyledLenke href={`https://www.nav.no`}>
                    <FormattedMessage id="forside.dokumentasjonskrav.lenke" />
                </StyledLenke>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.infoinnhenting.tittel">
                <Normaltekst>
                    <FormattedMessage
                        id="forside.infoinnhenting.brødtekst"
                        values={{ linjeskift: <br /> }}
                    />
                </Normaltekst>
                <ul>
                    <li>
                        <Normaltekst>
                            <FormattedMessage
                                id="forside.infoinnhenting.personinformasjon"
                                values={{ b: msg => <b>{msg}</b> }}
                            />
                        </Normaltekst>
                    </li>
                </ul>
                <Normaltekst>
                    <FormattedMessage id="forside.infoinnhenting.tidligereinfo" />
                </Normaltekst>
                <StyledLenke href={`https://www.nav.no`}>
                    <FormattedMessage id="forside.infoinnhenting.bruksinfolenke" />
                </StyledLenke>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.sliksokerdu.tittel">
                <Normaltekst>
                    <FormattedMessage
                        id="forside.sliksokerdu.brødtekst"
                        values={{ linjeskift: <br /> }}
                    />
                </Normaltekst>
            </Informasjonsbolk>

            <BekreftelsePanel
                navn={navn}
                bekreftelseStatus={bekreftelseStatus}
                onChange={bekreftelseOnChange}
            />

            <StyledKnappBase
                type={bekreftelseStatus === BekreftelseStatus.BEKREFTET ? 'hoved' : 'standard'}
                onClick={startSøknadOnClick}
            >
                Start søknaden
            </StyledKnappBase>
        </ForsideContainer>
    );
};

export default Forside;
