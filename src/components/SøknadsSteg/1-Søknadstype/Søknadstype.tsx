import React from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';

const Søknadstype: React.FC = () => {
    return (
        <Steg tittel={'Velg søknadstype'}>
            <Select label="Velg type søknad" bredde="l">
                <option value="">Velg type søknad</option>
                <option value="Ordinær">Ordinær</option>
                <option value="Utvidet">Utvidet</option>
                <option value="EØS">EØS</option>
            </Select>
        </Steg>
    );
};

export default Søknadstype;
