import React, { useState, useEffect } from 'react';
import { Element, Sidetittel, Normaltekst } from 'nav-frontend-typografi';
import { BekreftCheckboksPanel } from 'nav-frontend-skjema';
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
                <Panel className={'forside__panel'}>
                    <div className={'veileder'}>
                        <VeilederSnakkeboble />
                    </div>
                    <Sidetittel>Søknad om barnetrygd tittel</Sidetittel>
                    <Normaltekst className={'forside__innhold'}>{LOREM}</Normaltekst>
                    <div className={'seksjon'}>
                        <Element className="disclaimer-tittel">Dette er en disclaimer</Element>
                        <Normaltekst>{LOREM}</Normaltekst>
                    </div>
                    <BekreftCheckboksPanel
                        onChange={e => handleOnChange()}
                        label={LOREM}
                        checked={bekreftet}
                    ></BekreftCheckboksPanel>
                </Panel>
            </div>
        </div>
    );
};

export default Forside;
