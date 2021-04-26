import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react';

import { Checkbox, CheckboxGruppe } from 'nav-frontend-skjema';

import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/person';

export type BarnetsIdent = string;

interface Props {
    legend: ReactNode;
    skjemafelt: Felt<BarnetsIdent[]>;
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
    const [valgteBarn, settValgteBarn] = useState<BarnetsIdent[]>(
        søknad.barnInkludertISøknaden
            .filter(barn => barn[søknadsdatafelt].svar === ESvar.JA)
            .map(barn => barn.ident)
    );

    useEffect(() => {
        skjemafelt.hentNavInputProps(false).onChange(valgteBarn);
    }, [valgteBarn]);

    useEffect(() => {
        settValgteBarn([]);
    }, [nullstillValgteBarn]);

    const oppdaterListeMedBarn = async (event: ChangeEvent) => {
        const barnetsIdent = event.target.id.substring(`${skjemafelt.id}`.length);

        const barnetFinnesIListen = !!valgteBarn.find(ident => ident === barnetsIdent);
        const barnChecked = (event.target as HTMLInputElement).checked;

        // Legg til barn i listen i lokal state
        if (barnChecked && !barnetFinnesIListen) {
            settValgteBarn(prevState => [...prevState].concat(barnetsIdent));
        }

        // Fjern barn fra listen i lokal state
        if (!barnChecked && barnetFinnesIListen) {
            settValgteBarn(prevState => [...prevState].filter(ident => ident !== barnetsIdent));
        }
    };

    return skjemafelt.erSynlig ? (
        <CheckboxGruppe
            legend={legend}
            {...skjemafelt.hentNavBaseSkjemaProps(visFeilmelding)}
            utenFeilPropagering
        >
            {søknad.barnInkludertISøknaden.map((barnISøknad, index) => {
                return (
                    <Checkbox
                        key={index}
                        label={barnISøknad.navn}
                        defaultChecked={!!valgteBarn.find(barn => barn === barnISøknad.ident)}
                        id={`${skjemafelt.id}${barnISøknad.ident}`}
                        onChange={event => oppdaterListeMedBarn(event)}
                    />
                );
            })}
        </CheckboxGruppe>
    ) : null;
};

export default HvilkeBarnCheckboxGruppe;
