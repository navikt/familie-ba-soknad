import React, { useState } from 'react';
import { Sidetittel, Systemtittel, Undertittel, Ingress } from 'nav-frontend-typografi';
import Tekstområde, { BoldRule } from 'nav-frontend-tekstomrade';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp } from 'nav-frontend-knapper';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import Panel from 'nav-frontend-paneler';
import Informasjonsbolk from '../Felleskomponenter/Informasjonsbolk/Informasjonsbolk';

const Forside: React.FC = () => {
    const LOREM =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sed consectetur maiores veniam voluptas obcaecati, cumque hic laboriosamcorporis vel temporibus optio blanditiis. Dolorum autem exercitationem nulla, sed porro eum!x';

    const [bekreftet, settBekreftet] = useState<boolean>(false);

    const handleOnChange = () => {
        settBekreftet(!bekreftet);
    };

    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Panel className={'forside__innhold__panel'}>
                    <div className={'veileder'}>
                        <VeilederSnakkeboble />
                    </div>
                    <Sidetittel>Søknad om barnetrygd</Sidetittel>

                    <Informasjonsbolk
                        tittel={<Ingress className={'ingress__tekstområde'}>{LOREM}</Ingress>}
                    >
                        <Lenke href={'https://www.nav.no'}>Mer om barnetrygd</Lenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Systemtittel className={'opplysninger__systemtittel'}>
                                Det er viktig at du gir oss riktige opplysninger
                            </Systemtittel>
                        }
                    >
                        <Ingress className={'opplysninger__tekstområde'}>
                            For at vi skal kunne behandle søknaden din, må du gi oss riktige
                            opplysninger. {'\n\n'}Hvis du får barnetrygd, må du melde fra når det
                            skjer viktige endringer i livet ditt, for eksempel bo-og
                            familiesituasjonen eller arbeid og utdanning.
                        </Ingress>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Undertittel>Det kan hende du må sende inn dokumentasjon</Undertittel>
                        }
                    >
                        <Ingress className={'dokumentasjon__tekstområde'}>
                            {`Du får beskjed underveis i søknaden hvis du må dokumentere noen av opplysningene dine. Noen ganger kan vi også trenge mer informasjon. Da gir vi deg beskjed om dette.`}
                        </Ingress>
                        <Lenke href={`https://www.nav.no`}>
                            Oversikt over hva som krever dokumentasjon
                        </Lenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={<Undertittel>Vi vil hente informasjon om deg</Undertittel>}
                    >
                        <Ingress>
                            {`I tillegg til den informasjonen du oppgir i søknaden, henter vi inn informasjon om deg for å avgjøre om du har rett til stønad.
                            
                            Vi henter:`}
                        </Ingress>
                        <ul>
                            <li>
                                <Tekstområde rules={[BoldRule]}>
                                    _personinformasjon:_ om deg, barnet/barna dine og den andre
                                    forelderen til barna dine fra Folkeregisteret
                                </Tekstområde>
                            </li>
                        </ul>
                        <Ingress>
                            Vi kan også bruke tidligere opplysninger du har gitt oss, eller
                            opplysninger du gir oss i andre sammenhenger, hvis det er relevant og
                            nødvendig.
                        </Ingress>
                        <Lenke href={`https://www.nav.no`}>
                            Slik behandler vi personopplysningene dine
                        </Lenke>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Undertittel className={'søker__undertittel'}>
                                Slik søker du
                            </Undertittel>
                        }
                    >
                        <Ingress>
                            {`Vi lagrer søknaden din i x dager. Derfor kan du ta pauser når du fyller ut. Du kan også slette i disse x dagene.
                            
                            Mangler du dokumentasjon, kan du ettersende dette.`}
                        </Ingress>
                    </Informasjonsbolk>

                    <Informasjonsbolk
                        tittel={
                            <Undertittel
                                className={'bekreftelse__undertittel'}
                            >{`Vi stoler på deg`}</Undertittel>
                        }
                    >
                        <BekreftCheckboksPanel
                            onChange={() => handleOnChange()}
                            label={`Jeg, Kari Nordmann, bekrefter at jeg vil gi riktige og fullstendige\n
                                opplysninger`}
                            checked={bekreftet}
                        >
                            {
                                <Ingress className={'bekreftelse__tekstområde'}>
                                    Jeg er klar over at jeg kan miste retten til barnetrygd dersom
                                    jeg ikke har gitt riktige opplysninger. Jeg er også klar over at
                                    jeg må betale tilbake dersom jeg får penger jeg ikke har rett
                                    til og som skyldes at jeg har latt være å informere eller gitt
                                    feil opplysninger.
                                </Ingress>
                            }
                        </BekreftCheckboksPanel>
                    </Informasjonsbolk>

                    <div className={'hovedknapp'}>
                        {bekreftet ? (
                            <Hovedknapp onClick={() => {}}>Start søknaden</Hovedknapp>
                        ) : null}
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default Forside;
