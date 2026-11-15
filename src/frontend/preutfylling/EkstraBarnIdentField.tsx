import { TextField } from '@navikt/ds-react';
import { idnr } from '@navikt/fnrvalidator';
import type { ChangeEvent } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { useAppContext } from '../context/AppContext';

import { PreutfyllingFormFields, type PreutfyllingFormValues } from './usePreutfyllingForm';

export function EkstraBarnIdentField() {
    const { søknad } = useAppContext();
    const { control } = useFormContext<PreutfyllingFormValues>();

    const barnFraFolkeregisteret = søknad.søker.barn;

    const {
        field: { value, onChange, onBlur, ref },
        fieldState: { error },
    } = useController({
        name: PreutfyllingFormFields.EKSTRA_BARN_IDENT,
        control,
        rules: {
            validate: (ident, { barnIder }) => {
                if (ident === '') {
                    return barnIder.length > 0 || 'Velg minst ett barn, eller legg til et barn med fødselsnummer.';
                }
                if (barnFraFolkeregisteret.some(barn => barn.ident === ident)) {
                    return 'Barnet med dette fødselsnummeret er allerede hentet fra folkeregisteret.';
                }
                if (idnr(ident).status !== 'valid') {
                    return 'Fødselsnummeret er ikke gyldig.';
                }
            },
        },
    });

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value.replace(/\s/g, ''));
    }

    return (
        <TextField
            label="Legg til barn med fødselsnummer (valgfritt)"
            description="For barn som ikke hentes fra folkeregisteret, for eksempel barn med adressebeskyttelse."
            ref={ref}
            value={value}
            onChange={handleOnChange}
            onBlur={onBlur}
            inputMode="numeric"
            autoComplete="off"
            htmlSize={14}
            error={error?.message}
        />
    );
}
