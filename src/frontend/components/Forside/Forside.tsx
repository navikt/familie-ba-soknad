import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import Panel from 'nav-frontend-paneler';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import Tekstområde from 'nav-frontend-tekstomrade';
import { Sidetittel, Systemtittel, Undertittel, Normaltekst } from 'nav-frontend-typografi';

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
                <Panel className={'forside__innhold--panel'}>
                    <div className={'veileder'}>
                        <VeilederSnakkeboble tekst={`Hei, ${navn}`} posisjon={'høyre'} />
                    </div>

                    <Informasjonsbolk tittel={<Sidetittel>Søknad om barnetrygd</Sidetittel>}>
                        <Normaltekst>
                            Hvis du har omsorg for barn under 18 år som bor hos deg i Norge, kan du
                            ha rett på barnetrygd. Enslig mor eller far kan i tillegg få utvidet
                            barnetrygd og småbarnstillegg.
                            <br />
                            <br />
                            Hvis du er statsborger i et EU/ EØS-land og arbeider i Norge, kan du ha
                            rett til barnetrygd selv om du skal være bosatt i Norge i mindre enn 12
                            måneder.
                        </Normaltekst>
                        <StyledLenke href={'https://www.nav.no'}>Mer om barnetrygd</StyledLenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Systemtittel>
                                Det er viktig at du gir oss riktige opplysninger
                            </Systemtittel>
                        }
                    >
                        <Normaltekst>
                            For at vi skal kunne behandle søknaden din, må du gi oss riktige
                            opplysninger.
                            <br />
                            <br />
                            Hvis du får barnetrygd, må du melde fra når det skjer viktige endringer
                            i livet ditt, for eksempel bo-og familiesituasjonen eller arbeid og
                            utdanning.
                        </Normaltekst>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Undertittel>Det kan hende du må sende inn dokumentasjon</Undertittel>
                        }
                    >
                        <Normaltekst>
                            Du får beskjed underveis i søknaden hvis du må dokumentere noen av
                            opplysningene dine. Noen ganger kan vi også trenge mer informasjon. Da
                            gir vi deg beskjed om dette.
                        </Normaltekst>
                        <StyledLenke href={`https://www.nav.no`}>
                            Oversikt over hva som krever dokumentasjon
                        </StyledLenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={<Undertittel>Vi vil hente informasjon om deg</Undertittel>}
                    >
                        <Normaltekst>
                            I tillegg til den informasjonen du oppgir i søknaden, henter vi inn
                            informasjon om deg for å avgjøre om du har rett til stønad.
                            <br />
                            <br />
                            Vi henter:
                        </Normaltekst>
                        <ul>
                            <li>
                                <Normaltekst>
                                    <b>personinformasjon:</b> om deg, barnet/barna dine og den andre
                                    forelderen til barna dine fra Folkeregisteret
                                </Normaltekst>
                            </li>
                        </ul>
                        <Normaltekst>
                            Vi kan også bruke tidligere opplysninger du har gitt oss, eller
                            opplysninger du gir oss i andre sammenhenger, hvis det er relevant og
                            nødvendig.
                        </Normaltekst>
                        <StyledLenke href={`https://www.nav.no`}>
                            Slik behandler vi personopplysningene dine
                        </StyledLenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk tittel={<Undertittel>Slik søker du</Undertittel>}>
                        <Normaltekst>
                            Vi lagrer søknaden din i x dager. Derfor kan du ta pauser når du fyller
                            ut. Du kan også slette i disse x dagene.
                            <br />
                            <br />
                            Mangler du dokumentasjon, kan du ettersende dette.
                        </Normaltekst>
                    </Informasjonsbolk>

                    <div className={'bekreftelse'}>
                        <Undertittel className={'bekreftelse__undertittel'}>
                            Vi stoler på deg
                        </Undertittel>

                        <BekreftCheckboksPanel
                            onChange={() => handleOnChange()}
                            label={`Jeg, ${navn}, bekrefter at jeg vil gi riktige og fullstendige\n
         opplysninger`}
                            checked={bekreftet}
                        >
                            {
                                <Tekstområde className={'bekreftelse__tekstområde'}>
                                    Jeg er klar over at jeg kan miste retten til barnetrygd dersom
                                    jeg ikke har gitt riktige opplysninger. Jeg er også klar over at
                                    jeg må betale tilbake dersom jeg får penger jeg ikke har rett
                                    til og som skyldes at jeg har latt være å informere eller gitt
                                    feil opplysninger.
                                </Tekstområde>
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
