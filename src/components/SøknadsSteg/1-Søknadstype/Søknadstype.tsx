import React, { useEffect } from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';
import { useApp, ESøknadstype, ISøknad } from '../../../context/AppContext';

const Søknadstype: React.FC = () => {
    const { søknad, settSøknad, axiosRequest } = useApp();

    useEffect(() => {
        axiosRequest<string, ISøknad>({
            url: '/api/kontrakt',
            method: 'POST',
            withCredentials: true,
            data: søknad,
        })
            .then(console.log)
            .catch(console.log);
    }, [søknad]);

    return (
        <Steg tittel={'Søknadstype'}>
            <Select
                label="Velg type søknad"
                bredde="l"
                onChange={e => settSøknad({ søknadstype: e.currentTarget.value as ESøknadstype })}
                defaultValue={søknad.søknadstype}
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
