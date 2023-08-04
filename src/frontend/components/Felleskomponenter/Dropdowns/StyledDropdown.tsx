import React, { PropsWithChildren, ReactNode } from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';
import { Felt, ISkjema } from '@navikt/familie-skjema';

import { SkjemaFeltTyper } from '../../../typer/skjema';

export interface StyledDropdownProps<ConstrainedString extends string> {
    felt: Felt<ConstrainedString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    placeholder: string;
    label?: ReactNode;
    dynamisk?: boolean;
}

const StyledSelect = styled(Select)`
    label {
        font-size: 1.125rem;
    }
`;

const StyledDropdown = <ConstrainedString extends string>({
    children,
    felt,
    skjema,
    placeholder,
    label,
    dynamisk = false,
}: PropsWithChildren<StyledDropdownProps<ConstrainedString>>) =>
    felt.erSynlig ? (
        <div id={felt.id} aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledSelect
                label={label}
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                id={undefined}
            >
                <option disabled={true} value={''}>
                    {placeholder}
                </option>
                {children}
                <optgroup
                    label="" /* En tom optgroup hindrer teksten i dropdown på ios å bli truncated */
                />
            </StyledSelect>
        </div>
    ) : null;

export default StyledDropdown;
