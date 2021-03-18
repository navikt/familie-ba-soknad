import React, { useEffect } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import Lenke from 'nav-frontend-lenker';
import { Sidetittel, Normaltekst } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useApp } from '../../context/AppContext';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';
import InnholdContainer from '../Felleskomponenter/InnholdContainer/InnholdContainer';
import SpråkTekst from '../Felleskomponenter/SpråkTekst/SpråkTekst';
import BekreftelseOgStartSoknad from './BekreftelseOgStartSoknad';

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
        <InnholdContainer>
            <VeilederSnakkeboble
                tekst={formatMessage({ id: 'forside.veileder.hilsen' }, { navn: navn })}
                posisjon={'høyre'}
            />

            <StyledSidetittel>
                <SpråkTekst id="forside.sidetittel" />
            </StyledSidetittel>

            <Sprakvelger støttedeSprak={[LocaleType.en, LocaleType.nb]} />

            <Informasjonsbolk>
                <Normaltekst>
                    <SpråkTekst id="forside.rett-på-barnetrygd" values={{ linjeskift: <br /> }} />
                </Normaltekst>
                <StyledLenke href={'https://www.nav.no'}>
                    <SpråkTekst id="forside.barnetrygd-lenke-tekst" />
                </StyledLenke>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.oppmaning.tittel">
                <Normaltekst>
                    <SpråkTekst id="forside.oppmaning.brødtekst" values={{ linjeskift: <br /> }} />
                </Normaltekst>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.dokumentasjonskrav.tittel">
                <Normaltekst>
                    <SpråkTekst id="forside.dokumentasjonskrav.brødtekst" />
                </Normaltekst>
                <StyledLenke href={`https://www.nav.no`}>
                    <SpråkTekst id="forside.dokumentasjonskrav.lenke" />
                </StyledLenke>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.infoinnhenting.tittel">
                <Normaltekst>
                    <SpråkTekst
                        id="forside.infoinnhenting.brødtekst"
                        values={{ linjeskift: <br /> }}
                    />
                </Normaltekst>
                <ul>
                    <li>
                        <Normaltekst>
                            <SpråkTekst
                                id="forside.infoinnhenting.personinformasjon"
                                values={{ b: msg => <b>{msg}</b> }}
                            />
                        </Normaltekst>
                    </li>
                </ul>
                <Normaltekst>
                    <SpråkTekst id="forside.infoinnhenting.tidligereinfo" />
                </Normaltekst>
                <StyledLenke href={`https://www.nav.no`}>
                    <SpråkTekst id="forside.infoinnhenting.bruksinfolenke" />
                </StyledLenke>
            </Informasjonsbolk>

            <Informasjonsbolk tittelId="forside.sliksokerdu.tittel">
                <Normaltekst>
                    <SpråkTekst
                        id="forside.sliksokerdu.brødtekst"
                        values={{ linjeskift: <br /> }}
                    />
                </Normaltekst>
            </Informasjonsbolk>

            <BekreftelseOgStartSoknad navn={navn} />
        </InnholdContainer>
    );
};

export default Forside;
