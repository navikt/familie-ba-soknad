import React, { PropsWithChildren, ReactNode } from 'react';

import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { Select } from 'nav-frontend-skjema';

import { Felt, ISkjema } from '@navikt/familie-skjema';

import { muligeSlektsforhold } from '../../../typer/barn';
import { Slektsforhold } from '../../../typer/kontrakt/barn';
import { SkjemaFeltTyper } from '../../../typer/skjema';
import { toSlektsforholdSpråkId } from '../../../utils/språk';

interface StyledSlektsforholdDropdownProps<ConstrainedString extends string> {
    felt: Felt<ConstrainedString>;
    skjema: ISkjema<SkjemaFeltTyper, string>;
    placeholder: string;
    label?: ReactNode;
    dynamisk?: boolean;
    bredde?: 'fullbredde' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs';
    gjelderSøker?: boolean;
}

const StyledSelect = styled(Select)`
    label {
        font-size: 1.125rem;
    }
`;

const StyledSlektsforholdDropdown = <ConstrainedString extends string>({
    children,
    felt,
    skjema,
    placeholder,
    label,
    dynamisk = false,
    bredde,
}: PropsWithChildren<StyledSlektsforholdDropdownProps<ConstrainedString>>) =>
    felt.erSynlig ? (
        <div id={felt.id} aria-live={dynamisk ? 'polite' : 'off'}>
            <StyledSelect
                label={label}
                {...felt.hentNavInputProps(skjema.visFeilmeldinger)}
                id={undefined}
                bredde={bredde || 'l'}
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

const SlektsforholdDropdown: React.FC<StyledSlektsforholdDropdownProps<Slektsforhold | ''>> =
    props => {
        const intl = useIntl();
        const aktuelleSlektsforhold = props.gjelderSøker
            ? muligeSlektsforhold
            : muligeSlektsforhold.filter(slektsforhold => slektsforhold !== Slektsforhold.FORELDER);
        return (
            <StyledSlektsforholdDropdown<Slektsforhold | ''> {...props} bredde={'fullbredde'}>
                {aktuelleSlektsforhold.map(
                    (slektsforhold): ReactNode => (
                        <option value={slektsforhold} key={slektsforhold}>
                            {intl.formatMessage({ id: toSlektsforholdSpråkId(slektsforhold) })}
                        </option>
                    )
                )}
            </StyledSlektsforholdDropdown>
        );
    };

export default SlektsforholdDropdown;
