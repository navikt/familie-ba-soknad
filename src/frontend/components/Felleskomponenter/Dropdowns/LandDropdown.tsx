import React, { ReactNode } from 'react';

import { Alpha3Code, getAlpha3Codes, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';

import { Felt, ISkjema } from '@navikt/familie-skjema';
import { useSprakContext } from '@navikt/familie-sprakvelger';

import { SkjemaFeltTyper } from '../../../typer/skjema';
import StyledDropdown from './StyledDropdown';

interface LandDropdownProps {
    felt: Felt<Alpha3Code | ''>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    label?: ReactNode;
    dynamisk?: boolean;
}

export const LandDropdown: React.FC<LandDropdownProps> = props => {
    const intl = useIntl();
    const [valgtLocale] = useSprakContext();

    const landkoderSortertPåNavn = Object.keys(getAlpha3Codes()).sort((a, b) => {
        return getName(a, valgtLocale) >= getName(b, valgtLocale) ? 1 : -1;
    });

    return (
        <StyledDropdown<Alpha3Code | ''>
            placeholder={intl.formatMessage({ id: 'felles.velg-land.placeholder' })}
            {...props}
        >
            {landkoderSortertPåNavn.map(
                (alphaCode): ReactNode => (
                    <option value={alphaCode} key={alphaCode}>
                        {getName(alphaCode, valgtLocale)}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};
