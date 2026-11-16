import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';

import { useAppContext } from '../../context/AppContext';
import type { IBarn } from '../../typer/person';
import { formaterFnr } from '../../utils/visning';

import { PreutfyllingFormFields, type PreutfyllingFormValues } from './usePreutfyllingForm';

const lagBarnLabel = ({ navn, ident, alder, adressebeskyttelse }: IBarn) => {
    const hvem = adressebeskyttelse ? 'Barn med adressebeskyttelse' : `${navn}, ${formaterFnr(ident)}`;
    return alder ? `${hvem}, ${alder} år` : hvem;
};

export function BarnField() {
    const { søknad } = useAppContext();
    const { control } = useFormContext<PreutfyllingFormValues>();

    const {
        field: { value, onChange },
    } = useController({
        name: PreutfyllingFormFields.BARN_IDER,
        control,
        // Kravet om minst ett barn valideres på feltet for fødselsnummer, så det må valideres på nytt når valget endres.
        rules: { deps: [PreutfyllingFormFields.EKSTRA_BARN_IDENT] },
    });

    const barnFraFolkeregisteret = søknad.søker.barn;

    if (barnFraFolkeregisteret.length === 0) {
        return null;
    }

    return (
        <CheckboxGroup legend="Hvilke barn skal søknaden gjelde?" value={value} onChange={onChange}>
            {barnFraFolkeregisteret.map(barn => (
                <Checkbox key={barn.id} value={barn.id}>
                    {lagBarnLabel(barn)}
                </Checkbox>
            ))}
        </CheckboxGroup>
    );
}
