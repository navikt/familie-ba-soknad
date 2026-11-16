import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';

import { Avvik, avvikNavn, feilmeldingForUgyldigKombinasjon } from '../scenario';

import { PreutfyllingFormFields, type PreutfyllingFormValues } from './usePreutfyllingForm';

export function AvvikField() {
    const { control } = useFormContext<PreutfyllingFormValues>();

    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name: PreutfyllingFormFields.AVVIK,
        control,
        rules: {
            validate: (avvik, { scenario }) => feilmeldingForUgyldigKombinasjon({ scenario, avvik }),
        },
    });

    return (
        <CheckboxGroup
            legend="Avvik (valgfritt)"
            description="Svar som avviker fra happy case. Avvikene som gjelder barn, gjelder alle barna i søknaden."
            value={value}
            onChange={onChange}
            error={error?.message}
        >
            {Object.values(Avvik).map(avvik => (
                <Checkbox key={avvik} value={avvik}>
                    {avvikNavn[avvik]}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
