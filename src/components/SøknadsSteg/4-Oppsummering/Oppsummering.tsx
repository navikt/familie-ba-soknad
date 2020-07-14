import React from 'react';
import Steg from '../Steg/Steg';
import Oppsummeringsbolk from './Oppsummeringsbolk';
import { visLabelOgSvar } from '../../../utils/visning';
import { useApp } from '../../../context/AppContext';
import { RouteEnum } from '../../../routing/Routes';

const Oppsummering: React.FC = () => {
    const { søknad } = useApp();

    return (
        <Steg tittel={'Oppsummering'} erSpørsmålBesvart={true}>
            <Oppsummeringsbolk tittel="Søknadstype" lenke={RouteEnum.Søknadstype}>
                {visLabelOgSvar(søknad.søknadstype)}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk tittel="Om Deg">
                {visLabelOgSvar(søknad.søker.navn)}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk tittel="Barna du søker for">
                {søknad.barn
                    .filter(barn => barn.medISøknad)
                    .map(barn => (
                        <div className={'barn__detaljer'}>
                            {Object.values(barn).map(felt => visLabelOgSvar(felt))}
                        </div>
                    ))}
            </Oppsummeringsbolk>
        </Steg>
    );
};

export default Oppsummering;
