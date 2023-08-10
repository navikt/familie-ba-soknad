import React, { ReactNode, useEffect, useState } from 'react';

import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { ESvar } from '@navikt/familie-form-elements';
import { Felt } from '@navikt/familie-skjema';

import { useApp } from '../../../context/AppContext';
import { barnDataKeySpørsmål } from '../../../typer/barn';
import { BarnetsId } from '../../../typer/common';
import SpråkTekst from '../../Felleskomponenter/SpråkTekst/SpråkTekst';

interface Props {
    legendSpråkId: string;
    skjemafelt: Felt<BarnetsId[]>;
    visFeilmelding: boolean;
    søknadsdatafelt: barnDataKeySpørsmål;
    nullstillValgteBarn: boolean;
    children?: ReactNode;
}

const HvilkeBarnCheckboxGruppe: React.FC<Props> = ({
    legendSpråkId,
    skjemafelt,
    søknadsdatafelt,
    nullstillValgteBarn,
    visFeilmelding,
    children,
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

    return skjemafelt.erSynlig ? (
        <>
            <CheckboxGroup
                aria-live={'polite'}
                legend={<SpråkTekst id={legendSpråkId} />}
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
        </>
    ) : null;
};

export default HvilkeBarnCheckboxGruppe;
