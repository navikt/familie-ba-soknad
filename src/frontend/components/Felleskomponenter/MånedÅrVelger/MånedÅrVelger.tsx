import React, { useEffect } from 'react';

import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import { useSprakContext } from '@navikt/familie-sprakvelger';

interface IProps {
    tidligsteValgbareMåned?: Date;
    senesteValgbareMåned?: Date;
    label: React.ReactNode;
    onChange: (date: Date) => void;
}

export const MånedÅrVelger: React.FC<IProps> = ({
    tidligsteValgbareMåned,
    senesteValgbareMåned,
    label,
    onChange,
}) => {
    const [valgtLocale] = useSprakContext();

    const { monthpickerProps, inputProps, reset, selectedMonth } = useMonthpicker({
        fromDate: tidligsteValgbareMåned,
        toDate: senesteValgbareMåned,
        locale: valgtLocale,
        onMonthChange: (date?: Date) => date && onChange(date),
    });

    useEffect(() => {
        if (selectedMonth) {
            if (
                (!!tidligsteValgbareMåned && tidligsteValgbareMåned > selectedMonth) ||
                (!!senesteValgbareMåned && senesteValgbareMåned < selectedMonth)
            ) {
                reset();
            }
        }
    }, [tidligsteValgbareMåned, senesteValgbareMåned]);

    return (
        <MonthPicker {...monthpickerProps}>
            <MonthPicker.Input {...inputProps} label={label} />
        </MonthPicker>
    );
};
