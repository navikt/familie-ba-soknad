import React from 'react';

import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

interface IProps {
    avgrensMinMåned?: Date;
    avgrensMaxMåned?: Date;
    label: React.ReactNode;
    onChange: (date: Date) => void;
}

export const MånedÅrVelger: React.FC<IProps> = ({
    avgrensMinMåned,
    avgrensMaxMåned,
    label,
    onChange,
}) => {
    const [valgtLocale] = useSprakContext();

    const { monthpickerProps, inputProps } = useMonthpicker({
        fromDate: avgrensMinMåned,
        toDate: avgrensMaxMåned,
        locale: valgtLocale,
        onMonthChange: (date?: Date) => date && onChange(date),
    });

    return (
        <MonthPicker {...monthpickerProps}>
            <MonthPicker.Input {...inputProps} label={label} />
        </MonthPicker>
    );
};
