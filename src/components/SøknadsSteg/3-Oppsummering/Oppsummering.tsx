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
                {visLabelOgSvar(søknad.søker.verdi.navn)}
            </Oppsummeringsbolk>
            <Oppsummeringsbolk tittel="Barna du søker for" lenke={RouteEnum.VelgBarn}>
                {søknad.barn.verdi
                    .filter(barn => barn.verdi.medISøknad.verdi)
                    .map(barn => {
                        return (
                            <div className={'barn__detaljer'} key={barn.verdi.ident.verdi}>
                                {Object.values(barn.verdi)
                                    .filter(felt => typeof felt.verdi !== 'boolean')
                                    .map(felt => visLabelOgSvar(felt))}
                            </div>
                        );
                    })}
            </Oppsummeringsbolk>
        </Steg>
    );
};

export default Oppsummering;
