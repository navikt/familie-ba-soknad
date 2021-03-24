import React, { ReactNode } from 'react';

import { Alpha3Code, getAlpha3Codes, getName } from 'i18n-iso-countries';
import { useIntl } from 'react-intl';
import styled from 'styled-components/macro';

import { Select } from 'nav-frontend-skjema';

import { NavInputProps } from '@navikt/familie-skjema';

interface LandDropdownProps<Verdi> extends NavInputProps<Verdi> {
    label?: ReactNode;
}

const StyledSelect = styled(Select)`
    padding-top: 1rem;
    label {
        font-size: 1.125rem;
    }
`;

export const LandDropdown: React.FC<LandDropdownProps<Alpha3Code | undefined>> = ({
    label,
    ...navSkjemaProps
}) => {
    const intl = useIntl();

    const landkoderSortertPåNavn = Object.keys(getAlpha3Codes()).sort((a, b) => {
        return getName(a, intl.locale) >= getName(b, intl.locale) ? 1 : -1;
    });

    return (
        <span id={navSkjemaProps.id}>
            <StyledSelect label={label} defaultValue={''} {...navSkjemaProps} id={undefined}>
                <option
                    disabled={true}
                    value={''}
                    label={intl.formatMessage({ id: 'landdropdown.velgland' })}
                />
                {landkoderSortertPåNavn.map(
                    (alphaCode): ReactNode => (
                        <option
                            value={alphaCode}
                            label={getName(alphaCode, intl.locale)}
                            key={alphaCode}
                        />
                    )
                )}
            </StyledSelect>
        </span>
    );
};
