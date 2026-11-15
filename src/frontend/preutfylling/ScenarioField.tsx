import { Select } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';

import { Scenario, scenarioNavn } from './scenario';
import { PreutfyllingFormFields, type PreutfyllingFormValues } from './usePreutfyllingForm';

export function ScenarioField() {
    const { control } = useFormContext<PreutfyllingFormValues>();

    const {
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
    } = useController({
        name: PreutfyllingFormFields.SCENARIO,
        control,
        // Kombinasjonen valideres på avvikene, så de må valideres på nytt når scenarioet endres.
        rules: { deps: [PreutfyllingFormFields.AVVIK] },
    });

    return (
        <Select label="Scenario" ref={ref} value={value} onChange={onChange} onBlur={onBlur} error={error?.message}>
            {Object.values(Scenario).map(scenario => (
                <option key={scenario} value={scenario}>
                    {scenarioNavn[scenario]}
                </option>
            ))}
        </Select>
    );
}
