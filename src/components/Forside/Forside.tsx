import React from 'react';
import { Element, Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
import VeilederSnakkeboble from '../../assets/VeilederSnakkeboble';
import Panel from 'nav-frontend-paneler';

const Forside: React.FC = () => {
    return (
        <div className={'forside'}>
            <div className={'forside__innhold'}>
                <Panel className={'forside__panel'}>
                    <div className={'veileder'}>
                        <VeilederSnakkeboble />
                    </div>
                    <Sidetittel>Søknad om barnetrygd tittel</Sidetittel>
                    <Normaltekst className={'forside__innhold'}>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro, repudiandae
                        veritatis, voluptate asperiores quos architecto voluptatem fugiat eveniet
                        doloremque provident fugit vel ullam inventore at magnam laborum minima
                        aspernatur facere!
                    </Normaltekst>
                    <div className={'seksjon'}>
                        <Element className="disclaimer-tittel">Dette er en disclaimer</Element>
                        <Normaltekst>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sed
                            consectetur maiores veniam voluptas obcaecati, cumque hic laboriosam
                            corporis vel temporibus optio blanditiis. Dolorum autem exercitationem
                            nulla, sed porro eum!x
                        </Normaltekst>
                    </div>
                    <BekreftCheckboksPanel
                        onChange={() => {}}
                        label={'Bekreftelse'}
                        checked={false}
                    ></BekreftCheckboksPanel>
                </Panel>
            </div>
        </div>
    );
};

export default Forside;
