import React, { useEffect } from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';
import { useApp, ESøknadstype } from '../../../context/AppContext';

const Søknadstype: React.FC = () => {
    const { søknad, settSøknad } = useApp();

    const SØKNADS_SELECT_ID = 'søknadstype-select';
    const options = document.getElementById(SØKNADS_SELECT_ID)?.children;

    console.log(søknad);

    useEffect(() => {
        settSelected();
    }, []);

    const settSelected = () => {
        if (options) {
            Array.from(options).forEach(option =>
                option.getAttribute('value') === søknad.søknadstype
                    ? option.setAttribute('selected', 'selected')
                    : ''
            );
        }
    };

    return (
        <Steg tittel={'Søknadstype'}>
            <Select
                label="Velg type søknad"
                bredde="l"
                onChange={e => settSøknad({ søknadstype: e.target.value as ESøknadstype })}
                id={SØKNADS_SELECT_ID}
            >
                <option value={ESøknadstype.IKKE_SATT}>Velg type søknad</option>
                <option value={ESøknadstype.ORDINÆR}>Ordinær</option>
                <option value={ESøknadstype.UTVIDET}>Utvidet</option>
                <option value={ESøknadstype.EØS}>EØS</option>
            </Select>
        </Steg>
    );
};

export default Søknadstype;
