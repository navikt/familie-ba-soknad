import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/person';

export type BarnetsId = string;

interface Props {
    legend: ReactNode;
    skjemafelt: Felt<BarnetsId[]>;
    visFeilmelding: boolean;
    søknadsdatafelt: barnDataKeySpørsmål;
    nullstillValgteBarn: boolean;
}

const HvilkeBarnCheckboxGruppe: React.FC<Props> = ({
    legend,
    skjemafelt,
    søknadsdatafelt,
    nullstillValgteBarn,
    visFeilmelding,
}) => {
    const { søknad } = useApp();
    const [valgteBarn, settValgteBarn] = useState<BarnetsId[]>(
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadsdatafelt].svar === ESvar.JA)
            .map(barn => barn.id)
    );

    useEffect(() => {
        skjemafelt.hentNavInputProps(false).onChange(valgteBarn);
    }, [valgteBarn]);

    useEffect(() => {
        nullstillValgteBarn && settValgteBarn([]);
    }, [nullstillValgteBarn]);

    const oppdaterListeMedBarn = async (event: ChangeEvent, barnetsId: BarnetsId) => {
        const barnetFinnesIListen = !!valgteBarn.find(id => id === barnetsId);
        const barnChecked = (event.target as HTMLInputElement).checked;

        // Legg til barn i listen i lokal state
        if (barnChecked && !barnetFinnesIListen) {
            settValgteBarn(prevState => [...prevState].concat(barnetsId));
        }

        // Fjern barn fra listen i lokal state
        if (!barnChecked && barnetFinnesIListen) {
            settValgteBarn(prevState => [...prevState].filter(id => id !== barnetsId));
        }
    };

    return skjemafelt.erSynlig ? (
        <CheckboxGruppe
            aria-live={'polite'}
            legend={legend}
            {...skjemafelt.hentNavBaseSkjemaProps(visFeilmelding)}
            utenFeilPropagering
        >
            {søknad.barnInkludertISøknaden.map((barnISøknad, index) => {
                return (
                    <Checkbox
                        key={index}
                        label={barnISøknad.navn}
                        defaultChecked={!!valgteBarn.find(barnId => barnId === barnISøknad.id)}
                        id={`${skjemafelt.id}${barnISøknad.id}`}
                        onChange={event => oppdaterListeMedBarn(event, barnISøknad.id)}
                    />
                );
            })}
        </CheckboxGruppe>
    ) : null;
};

export default HvilkeBarnCheckboxGruppe;
