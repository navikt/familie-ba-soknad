import React from 'react';

import classNames from 'classnames';

import { useApp } from '../../../context/AppContext';
import Steg from '../Steg/Steg';
import Barnekort from './Barnekort/Barnekort';

const VelgBarn: React.FC = () => {
    const { søknad } = useApp();

    const erSpørsmålBesvart = søknad.barn.verdi.some(barn => barn.verdi.medISøknad.verdi);
    const kunEttBarn = søknad.barn.verdi.length === 1;

    return (
        <Steg tittel={'Velg barn'} erSpørsmålBesvart={erSpørsmålBesvart}>
            Velg hvilke barn du vil inkludere i søknaden din
            <div className={classNames('barnekort-container', { 'ett-barn': kunEttBarn })}>
                {søknad.barn.verdi.map(barn => (
                    <Barnekort key={barn.verdi.ident.verdi} {...barn.verdi} />
                ))}
            </div>
        </Steg>
    );
};

export default VelgBarn;
