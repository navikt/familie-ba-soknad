import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';

import { Felt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';

export type BarnasIdenter = string[];

interface Props {
    legend: ReactNode;
    felt: Felt<BarnasIdenter>;
}

const HvilkeBarnCheckboxGruppe: React.FC<Props> = ({ legend, felt }) => {
    const { søknad } = useApp();
    const [valgteBarn, settValgteBarn] = useState<BarnasIdenter>([]);

    useEffect(() => {
        felt.hentNavInputProps(false).onChange(valgteBarn);
    }, [valgteBarn]);

    const oppdaterListeMedBarn = async (event: ChangeEvent) => {
        const barnetsIdent = event.target.id;

        const barnetFinnesIListen = !!valgteBarn.find(ident => ident === barnetsIdent);
        const barnChecked = (event.target as HTMLInputElement).checked;

        // Legg til barn i listen i lokal state
        if (barnChecked && !barnetFinnesIListen) {
            await settValgteBarn(prevState => [...prevState].concat(barnetsIdent));
        }

        // Fjern barn fra listen i lokal state
        if (!barnChecked && barnetFinnesIListen) {
            await settValgteBarn(prevState =>
                [...prevState].filter(ident => ident !== barnetsIdent)
            );
        }
    };

    return (
        <CheckboxGruppe legend={legend}>
            {søknad.barn.map((barnISøknad, index) => {
                return (
                    <Checkbox
                        key={index}
                        label={barnISøknad.navn}
                        id={barnISøknad.ident}
                        onChange={event => oppdaterListeMedBarn(event)}
                    />
                );
            })}
        </CheckboxGruppe>
    );
};

export default HvilkeBarnCheckboxGruppe;
