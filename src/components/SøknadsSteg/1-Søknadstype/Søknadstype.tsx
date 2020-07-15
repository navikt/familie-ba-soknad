import React from 'react';
import Steg from '../Steg/Steg';
import { Select } from 'nav-frontend-skjema';
import { useApp } from '../../../context/AppContext';
import { ESøknadstype, søknadstyper } from '../../../typer/søknad';

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
                    return <option value={key}>{søknadstyper[key].navn}</option>;
                })}
            </Select>
        </Steg>
    );
};

export default Søknadstype;
