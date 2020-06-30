import React, { useState } from 'react';
import {
    Element,
    Sidetittel,
    Normaltekst,
    Systemtittel,
    Undertittel,
} from 'nav-frontend-typografi';
import Tekstområde, { BoldRule } from 'nav-frontend-tekstomrade';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import Lenke from 'nav-frontend-lenker';
import KnappBase from 'nav-frontend-knapper';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import Panel from 'nav-frontend-paneler';

const Forside: React.FC = () => {
    const LOREM =
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sed consectetur maiores veniam voluptas obcaecati, cumque hic laboriosamcorporis vel temporibus optio blanditiis. Dolorum autem exercitationem nulla, sed porro eum!x';
    const LOREM_list: String[] = [
        'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        'Saepe sed consectetur maiores veniam voluptas obcaecati, cumque hic laboriosamcorporis vel temporibus optio blanditiis.',
        'Dolorum autem exercitationem nulla, sed porro eum!x',
    ];

    const [bekreftet, settBekreftet] = useState<boolean>(false);

    const handleOnChange = () => {
        settBekreftet(!bekreftet);
    };

    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Panel className={'forside__panel'}>
                    <div className={'veileder'}>
                        <VeilederSnakkeboble />
                    </div>
                    <Sidetittel>Søknad om barnetrygd</Sidetittel>

                    <div className={'ingress'}>
                        <Tekstområde>{LOREM}</Tekstområde>
                        <Lenke href={'https://www.nav.no'}>Mer om barnetrygd.</Lenke>
                    </div>

                    <div className={'opplysninger'}>
                        <Systemtittel>
                            Det er viktig at du gir oss riktige opplysninger
                        </Systemtittel>
                        <Tekstområde>
                            {`For at vi skal kunne behandle søknaden din, må du gi oss riktige opplysninger. 
                            
                            Hvis du får overgangsstønad, må du melde fra når det skjer viktige endringer i livet ditt, for eksempel bo-og familiesituasjonen eller arbeid og utdanning. Det samme gjelder dersom inntekten din endrer seg.`}
                        </Tekstområde>
                    </div>

                    <div className={'dokumentasjon'}>
                        <Undertittel>Det kan hende du må sende inn dokumentasjon</Undertittel>
                        <Tekstområde>{`Du får beskjed underveis i søknaden hvis du må dokumentere noen 
                        av opplysningene dine. Noen ganger kan vi også trenge mer informasjon. Da gir vi deg beskjed om dette.`}</Tekstområde>
                        <Lenke href={`https://www.nav.no`}>
                            Oversikt over hva som krever dokumentasjon
                        </Lenke>
                    </div>

                    <div className={'informasjon'}>
                        <Undertittel>Vi vil hente informasjon om deg</Undertittel>
                        <Tekstområde className={'forside__innhold'}>
                            {`I tillegg til den informasjonen du oppgir i søknaden, henter vi inn 
                            informasjon om deg for å avgjøre om du har rett til stønad.\n \nVi henter:`}
                        </Tekstområde>
                        <ul>
                            <li>
                                <Tekstområde rules={[BoldRule]}>
                                    _personinformasjon:_ om deg, barnet/barna dine og den andre
                                    forelderen til barna dine fra Folkeregisteret
                                </Tekstområde>
                            </li>
                            <li>
                                <Tekstområde rules={[BoldRule]}>
                                    _inntektsinformasjon:_ fra Skatteetaten
                                </Tekstområde>
                            </li>
                            <li>
                                <Tekstområde rules={[BoldRule]}>
                                    _opplysinger om arbeidsforholdet:_ ditt fra arbeidsgiver- og
                                    arbeidstakerregisteret
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
                        <Undertittel>Slik søker du</Undertittel>
                        <Tekstområde>
                            {`Vi lagrer søknaden din i x dager. Derfor kan du ta
                            pauser når du fyller ut.
                            Du kan også slette i disse x dagene. Mangler du dokumentasjon,
                            kan du ettersende dette.`}
                        </Tekstområde>
                    </div>

                    <div className={'bekreftelse'}>
                        <Undertittel>{`Vi stoler på deg`}</Undertittel>
                        <BekreftCheckboksPanel
                            onChange={() => handleOnChange()}
                            label={
                                'Jeg, Kari Nordmann, bekrefter at jeg vil gi riktige og fullstendige opplysninger'
                            }
                            checked={bekreftet}
                        >
                            {`Jeg er klar over at jeg kan miste retten til overgangsstønad dersom jeg
                            ikke har gitt riktige opplysninger. Jeg er også klar over at jeg må betale tilbake dersom jeg får penger jeg ikke har rett til og som skyldes at jeg har latt være å informere eller gitt feil opplysninger.`}
                        </BekreftCheckboksPanel>
                    </div>

                    {bekreftet ? (
                        <div className={'knappbase'}>
                            <KnappBase onClick={() => console.log('Knapp trykket')}>
                                <h3>Start søknaden</h3>
                            </KnappBase>
                        </div>
                    ) : null}
                </Panel>
            </div>
        </div>
    );
};

export default Forside;
