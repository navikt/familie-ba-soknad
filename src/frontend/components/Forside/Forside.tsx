import React, { useEffect } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import navFarger from 'nav-frontend-core';
import Lenke from 'nav-frontend-lenker';
import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useApp } from '../../context/AppContext';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';

const ForsideContainer = styled.div`
    width: var(--panel-innhold-bredde);
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

    @media all and (max-width: var(--tablet)) {
        width: 100%;
        padding: 2rem;
    }
`;

const StyledSidetittel = styled(Sidetittel)`
    && {
        margin: 4rem 0 2.3rem 0;
    }
`;

const StyledLenke = styled(Lenke)`
    margin-top: 1.125rem;
    display: inline-block;
`;

const Forside: React.FC = () => {
    const { formatMessage } = useIntl();

    const { sluttbruker, nullstillSøknadsobjekt, settUtfyltSteg } = useApp();

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    useEffect(() => {
        nullstillSøknadsobjekt(sluttbruker);
        settUtfyltSteg(0);
    }, []);

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

            <BekreftelseOgStartSoknad navn={navn} />
        </ForsideContainer>
    );
};

export default Forside;
