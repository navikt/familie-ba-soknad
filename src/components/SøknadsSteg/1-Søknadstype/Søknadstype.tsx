import React from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';
import { useApp } from '../../../context/AppContext';
import { ESøknadstype } from '../../../typer/søknad';

const Søknadstype: React.FC = () => {
    const { søknad, settSøknad } = useApp();
    const label = 'Velg type søknad';

    const erSpørsmålBesvart = søknad.søknadstype.verdi !== ESøknadstype.IKKE_SATT;

    return (
        <Steg tittel={'Søknadstype'} erSpørsmålBesvart={erSpørsmålBesvart}>
            <Select
                label={label}
                bredde="l"
                onChange={e =>
                    settSøknad({
                        ...søknad,
                        søknadstype: {
                            label,
                            verdi: e.target.value as ESøknadstype,
                        },
                    })
                }
                defaultValue={søknad.søknadstype.verdi}
            >
                <option value={ESøknadstype.IKKE_SATT}>{ESøknadstype.IKKE_SATT}</option>
                <option value={ESøknadstype.ORDINÆR}>{ESøknadstype.ORDINÆR}</option>
                <option value={ESøknadstype.UTVIDET}>{ESøknadstype.UTVIDET}</option>
                <option value={ESøknadstype.EØS}>{ESøknadstype.EØS}</option>
            </Select>
        </Steg>
    );
};

export default Søknadstype;
