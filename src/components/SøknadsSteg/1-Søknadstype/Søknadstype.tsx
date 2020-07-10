import React, { useEffect } from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';
import { useApp, ESøknadstype, ISøknad } from '../../../context/AppContext';

const Søknadstype: React.FC = () => {
    const { søknad, settSøknad, axiosRequest } = useApp();
    const label = 'Velg type søknad';

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
                label={label}
                bredde="l"
                onChange={e =>
                    settSøknad({
                        søknadstype: { label: label, verdi: e.currentTarget.value as ESøknadstype },
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
