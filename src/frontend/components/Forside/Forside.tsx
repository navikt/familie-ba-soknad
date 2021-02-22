import React, { useState, useEffect } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Panel from 'nav-frontend-paneler';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import { Sidetittel, Systemtittel, Undertittel, Normaltekst } from 'nav-frontend-typografi';

import { LocaleType, Sprakvelger } from '@navikt/familie-sprakvelger';
import { RessursStatus } from '@navikt/familie-typer';

import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import { useApp } from '../../context/AppContext';
import { StegRoutes } from '../../routing/Routes';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';

const StyledLenke = styled(Lenke)`
    margin-top: 0.75rem;
    display: inline-block;
`;

const Forside: React.FC = () => {
    const [bekreftet, settBekreftet] = useState<boolean>(false);
    const { formatMessage } = useIntl();
    const history = useHistory();

    const { sluttbruker, nullstillSøknadsobjekt, settUtfyltSteg } = useApp();

    const navn = sluttbruker.status === RessursStatus.SUKSESS ? sluttbruker.data.navn : '-';

    const handleOnChange = () => {
        settBekreftet(!bekreftet);
    };

    useEffect(() => {
        nullstillSøknadsobjekt(sluttbruker);
        settUtfyltSteg(0);
    }, []);

    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Sprakvelger
                    støttedeSprak={[
                        { tittel: 'English', locale: LocaleType.en },
                        { tittel: 'Bokmål', locale: LocaleType.nb },
                    ]}
                />
                <Panel className={'forside__innhold--panel'}>
                    <div className={'veileder'}>
                        <VeilederSnakkeboble
                            tekst={formatMessage({ id: 'forside.greeting' }, { navn: navn })}
                            posisjon={'høyre'}
                        />
                    </div>

                    <Informasjonsbolk
                        tittel={
                            <Sidetittel>
                                <FormattedMessage id={'forside.sidetittel'} />
                            </Sidetittel>
                        }
                    >
                        <Normaltekst>
                            <FormattedMessage
                                id="forside.rett-på-barnetrygd"
                                values={{ linjeskift: <br /> }}
                            />
                        </Normaltekst>
                        <StyledLenke href={'https://www.nav.no'}>
                            <FormattedMessage id={'forside.barnetrygd-lenke-tekst'} />
                        </StyledLenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Systemtittel>
                                <FormattedMessage id="forside.oppmaning.tittel" />
                            </Systemtittel>
                        }
                    >
                        <Normaltekst>
                            <FormattedMessage
                                id="forside.oppmaning.brødtekst"
                                values={{ linjeskift: <br /> }}
                            />
                        </Normaltekst>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Undertittel>
                                <FormattedMessage id="forside.dokumentasjonskrav.tittel" />
                            </Undertittel>
                        }
                    >
                        <Normaltekst>
                            <FormattedMessage id="forside.dokumentasjonskrav.brødtekst" />
                        </Normaltekst>
                        <StyledLenke href={`https://www.nav.no`}>
                            <FormattedMessage id="forside.dokumentasjonskrav.lenke" />
                        </StyledLenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Undertittel>
                                {' '}
                                <FormattedMessage id="forside.infoinnhenting.tittel" />
                            </Undertittel>
                        }
                    >
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

                    <Informasjonsbolk
                        tittel={
                            <Undertittel>
                                <FormattedMessage id="forside.sliksokerdu.tittel" />
                            </Undertittel>
                        }
                    >
                        <Normaltekst>
                            <FormattedMessage
                                id="forside.sliksokerdu.brødtekst"
                                values={{ linjeskift: <br /> }}
                            />
                        </Normaltekst>
                    </Informasjonsbolk>

                    <div className={'bekreftelse'}>
                        <Undertittel className={'bekreftelse__undertittel'}>
                            <FormattedMessage id="forside.bekreftelsesboks.tittel" />
                        </Undertittel>

                        <BekreftCheckboksPanel
                            onChange={() => handleOnChange()}
                            label={formatMessage(
                                { id: 'forside.bekreftelsesboks.erklæring' },
                                { navn: navn }
                            )}
                            checked={bekreftet}
                        >
                            {
                                <div className={'bekreftelse__tekstområde'}>
                                    <Normaltekst>
                                        <FormattedMessage id="forside.dokumentasjonskrav.brødtekst" />
                                    </Normaltekst>
                                </div>
                            }
                        </BekreftCheckboksPanel>
                    </div>

                    <div className={'hovedknapp'}>
                        {bekreftet ? (
                            <Hovedknapp
                                onClick={() => history.push(Object.values(StegRoutes)[0].path)}
                            >
                                Start søknaden
                            </Hovedknapp>
                        ) : null}
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default Forside;
