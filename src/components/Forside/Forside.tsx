import React, { useState } from 'react';
import { Sidetittel, Systemtittel, Undertittel, Ingress } from 'nav-frontend-typografi';
import Tekstområde, { BoldRule } from 'nav-frontend-tekstomrade';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import Lenke from 'nav-frontend-lenker';
import { Hovedknapp } from 'nav-frontend-knapper';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import Panel from 'nav-frontend-paneler';

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

                    <div className={'ingress'}>
                        <Ingress className={'ingress__tekstområde'}>{LOREM}</Ingress>
                        <Lenke href={'https://www.nav.no'}>Mer om barnetrygd</Lenke>
                    </div>

                    <div className={'opplysninger'}>
                        <Systemtittel className={'opplysninger__systemtittel'}>
                            Det er viktig at du gir oss riktige opplysninger
                        </Systemtittel>
                        <Tekstområde className={'opplysninger__tekstområde'}>
                            {`For at vi skal kunne behandle søknaden din, må du gi oss riktige opplysninger. 
                            
                            Hvis du får barnetrygd, må du melde fra når det skjer viktige endringer i livet ditt, for eksempel bo-og familiesituasjonen eller arbeid og utdanning.`}
                        </Tekstområde>
                    </div>

                    <div className={'dokumentasjon'}>
                        <Undertittel>Det kan hende du må sende inn dokumentasjon</Undertittel>
                        <Tekstområde
                            className={'dokumentasjon__tekstområde'}
                        >{`Du får beskjed underveis i søknaden hvis du må dokumentere noen av opplysningene dine. Noen ganger kan vi også trenge mer informasjon. Da gir vi deg beskjed om dette.`}</Tekstområde>
                        <Lenke href={`https://www.nav.no`}>
                            Oversikt over hva som krever dokumentasjon
                        </Lenke>
                    </div>

                    <div className={'informasjon'}>
                        <Undertittel>Vi vil hente informasjon om deg</Undertittel>
                        <Tekstområde>
                            {`I tillegg til den informasjonen du oppgir i søknaden, henter vi inn informasjon om deg for å avgjøre om du har rett til stønad.
                            
                            Vi henter:`}
                        </Tekstområde>
                        <ul>
                            <li>
                                <Tekstområde rules={[BoldRule]}>
                                    _personinformasjon:_ om deg, barnet/barna dine og den andre
                                    forelderen til barna dine fra Folkeregisteret
                                </Tekstområde>
                            </li>
                        </ul>
                        <Tekstområde>
                            Vi kan også bruke tidligere opplysninger du har gitt oss, eller
                            opplysninger du gir oss i andre sammenhenger, hvis det er relevant og
                            nødvendig.
                        </Tekstområde>
                        <Lenke href={`https://www.nav.no`}>
                            Slik behandler vi personopplysningene dine
                        </Lenke>
                    </div>

                    <div className={`søker`}>
                        <Undertittel className={'søker__undertittel'}>Slik søker du</Undertittel>
                        <Tekstområde>
                            {`Vi lagrer søknaden din i x dager. Derfor kan du ta pauser når du fyller ut. Du kan også slette i disse x dagene.
                            
                            Mangler du dokumentasjon, kan du ettersende dette.`}
                        </Tekstområde>
                    </div>

                    <div className={'bekreftelse'}>
                        <Undertittel
                            className={'bekreftelse__undertittel'}
                        >{`Vi stoler på deg`}</Undertittel>
                        <BekreftCheckboksPanel
                            onChange={() => handleOnChange()}
                            label={`Jeg, Kari Nordmann, bekrefter at jeg vil gi riktige og fullstendige\n
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
                            <Hovedknapp onClick={() => {}}>Start søknaden</Hovedknapp>
                        ) : null}
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default Forside;
