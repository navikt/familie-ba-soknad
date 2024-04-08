import React, { useEffect, useState } from 'react';

import { formatISO } from 'date-fns';

import { MonthPicker, useMonthpicker } from '@navikt/ds-react';
import { Felt } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { ISODateString } from '../../../typer/common';
import { formaterDatoKunMåned } from '../../../utils/dato';

interface IProps {
    tidligsteValgbareMåned?: Date;
    senesteValgbareMåned?: Date;
    label: React.ReactNode;
    felt: Felt<ISODateString>;
    visFeilmeldinger?: boolean;
}

/*
- vurder å lagre som Date og gjøre parsing/format mot mellomlagring og innsending - neste runde
- onValidate slik at vi kan validere manuell input av disabled måneder
- sjekk om feilmelding propageres riktig
*/

export enum Feilmelding {
    FØR_MIN_DATO = 'FØR_MIN_DATO',
    ETTER_MAKS_DATO = 'ETTER_MAKS_DATO',
    UGYLDIG_DATO = 'UGYLDIG_DATO',
}

export const MånedÅrVelger: React.FC<IProps> = ({
    tidligsteValgbareMåned,
    senesteValgbareMåned,
    label,
    felt,
    visFeilmeldinger = false,
}) => {
    const [valgtLocale] = useSprakContext();
    const [error, setError] = useState<Feilmelding | undefined>(undefined);

    const nullstillOgSettFeilmelding = (feilmelding: Feilmelding) => {
        if (error !== feilmelding) {
            setError(feilmelding);
            felt.nullstill();
        }
    };

    const feilmeldingForDatoFørMinDato = () => {
        if (tidligsteValgbareMåned) {
            return `Du kan ikke velge en dato før ${formaterDatoKunMåned(tidligsteValgbareMåned, valgtLocale)}`;
        }
        return 'Du må velge en gyldig dato';
    };

    const feilmeldingForDatoEtterMaksDato = () => {
        if (senesteValgbareMåned) {
            return `Du kan ikke velge en dato etter ${formaterDatoKunMåned(senesteValgbareMåned, valgtLocale)}`;
        }
        return 'Du må velge en gyldig dato';
    };

    const feilmeldinger: Record<Feilmelding, string> = {
        UGYLDIG_DATO: 'Du må velge en gyldig dato',
        FØR_MIN_DATO: feilmeldingForDatoFørMinDato(),
        ETTER_MAKS_DATO: feilmeldingForDatoEtterMaksDato(),
    };

    const { monthpickerProps, inputProps, reset, selectedMonth } = useMonthpicker({
        fromDate: tidligsteValgbareMåned,
        toDate: senesteValgbareMåned,
        locale: valgtLocale,
        onMonthChange: (dato: Date | undefined): void => {
            console.log(dato);
            if (dato === undefined) {
                felt.nullstill();
            } else {
                felt.validerOgSettFelt(formatISO(dato, { representation: 'date' }));
            }
        },
        onValidate: val => {
            if (val.isBefore) {
                nullstillOgSettFeilmelding(Feilmelding.FØR_MIN_DATO);
            } else if (val.isAfter) {
                nullstillOgSettFeilmelding(Feilmelding.ETTER_MAKS_DATO);
            } else if (val.isEmpty || val.isDisabled || !val.isValidMonth) {
                nullstillOgSettFeilmelding(Feilmelding.UGYLDIG_DATO);
            } else {
                setError(undefined);
            }
        },
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
            <MonthPicker.Input
                {...inputProps}
                label={label}
                error={
                    error && visFeilmeldinger
                        ? feilmeldinger[error]
                        : felt.hentNavBaseSkjemaProps(visFeilmeldinger).error
                }
            />
        </MonthPicker>
    );
};
