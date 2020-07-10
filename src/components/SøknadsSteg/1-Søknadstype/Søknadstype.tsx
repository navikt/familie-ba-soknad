import React from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';
import { useApp, ESøknadstype } from '../../../context/AppContext';

const Søknadstype: React.FC = () => {
    const { søknad, settSøknad } = useApp();

    return (
        <Steg tittel={'Søknadstype'}>
            <Select
                label="Velg type søknad"
                bredde="l"
                onChange={e =>
                    settSøknad({
                        ...søknad,
                        søknadstype: {
                            label: 'Velg type søknad',
                            verdi: e.target.value as ESøknadstype,
                        },
                    })
                }
                defaultValue={søknad.søknadstype.verdi}
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
