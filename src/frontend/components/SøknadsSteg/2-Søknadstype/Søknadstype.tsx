import React from 'react';

import { Select } from 'nav-frontend-skjema';

import { useApp } from '../../../context/AppContext';
import { ESøknadstype, søknadstyper } from '../../../typer/søknad';
import Steg from '../Steg/Steg';

const Søknadstype: React.FC = () => {
    const { søknad, settSøknad } = useApp();
    const label = 'Hva slags barnetrygd søker du om?';

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
                {Object.keys(søknadstyper).map((key: string) => {
                    return (
                        <option key={key} value={key}>
                            {søknadstyper[key].navn}
                        </option>
                    );
                })}
            </Select>
        </Steg>
    );
};

export default Søknadstype;
