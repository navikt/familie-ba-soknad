import React, { ReactNode, useEffect, useState } from 'react';

import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import type { Felt } from '@navikt/familie-skjema';

import { useAppContext } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/person';
import KomponentGruppe from '../../Felleskomponenter/KomponentGruppe/KomponentGruppe';

interface Props {
    legendTekst: ReactNode;
    skjemafelt: Felt<BarnetsId[]>;
    visFeilmelding: boolean;
    søknadsdatafelt: barnDataKeySpørsmål;
    nullstillValgteBarn: boolean;
    children?: ReactNode;
}

const HvilkeBarnCheckboxGruppe: React.FC<Props> = ({
    legendTekst,
    skjemafelt,
    søknadsdatafelt,
    nullstillValgteBarn,
    visFeilmelding,
    children,
}) => {
    const { søknad } = useAppContext();
    const [valgteBarn, settValgteBarn] = useState<BarnetsId[]>(
        søknad.barnInkludertISøknaden.filter(barn => barn[søknadsdatafelt].svar === ESvar.JA).map(barn => barn.id)
    );

    useEffect(() => {
        skjemafelt.hentNavInputProps(false).onChange(valgteBarn);
    }, [valgteBarn]);

    useEffect(() => {
        if (nullstillValgteBarn) {
            settValgteBarn([]);
        }
    }, [nullstillValgteBarn]);

    return skjemafelt.erSynlig ? (
        <KomponentGruppe>
            <CheckboxGroup
                aria-live={'polite'}
                legend={legendTekst}
                {...skjemafelt.hentNavBaseSkjemaProps(visFeilmelding)}
                error={visFeilmelding ? skjemafelt.feilmelding : ''}
                onChange={value => settValgteBarn(value)}
            >
                {søknad.barnInkludertISøknaden.map((barnISøknad, index) => {
                    return (
                        <Checkbox key={index} value={barnISøknad.id}>
                            {barnISøknad.navn}
                        </Checkbox>
                    );
                })}
            </CheckboxGroup>
            {children}
        </KomponentGruppe>
    ) : null;
};

export default HvilkeBarnCheckboxGruppe;
