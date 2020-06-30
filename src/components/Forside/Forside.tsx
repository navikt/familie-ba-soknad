import React, { useState } from 'react';
import {
    Element,
    Sidetittel,
    Normaltekst,
    Systemtittel,
    Undertittel,
} from 'nav-frontend-typografi';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
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
                    <Normaltekst className={'forside__innhold'}>{LOREM}</Normaltekst>

                    <div className={'rettigheter'}>
                        <Systemtittel>
                            Det er viktig at du gir oss riktige opplysninger
                        </Systemtittel>
                        <Normaltekst className={'forside__innhold'}>{LOREM}</Normaltekst>
                    </div>

                    {LOREM_list &&
                        LOREM_list.map((tekst: String, index: number) => {
                            return (
                                <div className={'seksjon'} key={index}>
                                    <Element className="disclaimer-tittel">
                                        Dette er en disclaimer
                                    </Element>
                                    <Normaltekst>{tekst}</Normaltekst>
                                </div>
                            );
                        })}

                    <div className={'informasjon'}>
                        <Undertittel>Vi vil hente informasjon om deg</Undertittel>
                        <Normaltekst className={'forside__innhold'}>{LOREM}</Normaltekst>
                    </div>

                    <BekreftCheckboksPanel
                        onChange={() => handleOnChange()}
                        label={'Ja, jeg samtykker.'}
                        checked={bekreftet}
                    >
                        {LOREM}
                    </BekreftCheckboksPanel>

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
