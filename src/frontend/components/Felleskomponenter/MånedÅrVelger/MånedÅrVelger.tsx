import React from 'react';

import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

interface IProps {
    avgrensMaxDato?: Date;
    label: React.ReactNode;
    onChange: (date: Date) => void;
}

export const MånedÅrVelger: React.FC<IProps> = ({ avgrensMaxDato, label, onChange }) => {
    const [valgtLocale] = useSprakContext();

    const { monthpickerProps, inputProps } = useMonthpicker({
        toDate: avgrensMaxDato,
        locale: valgtLocale,
        onMonthChange: (date?: Date) => date && onChange(date),
    });

    return (
        <MonthPicker {...monthpickerProps}>
            <MonthPicker.Input {...inputProps} label={label} />
        </MonthPicker>
    );
};
