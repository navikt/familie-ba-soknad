import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import { muligeSlektsforhold } from '../../../typer/barn';
import { Slektsforhold } from '../../../typer/kontrakt/barn';
import { toSlektsforholdSpråkId } from '../../../utils/språk';
import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

const SlektsforholdDropdown: React.FC<StyledDropdownProps<Slektsforhold | ''>> = props => {
    const intl = useIntl();
    const slektsforholdSøker = props.slektsforholdSøker;
    const aktuelleSlektsforhold = slektsforholdSøker
        ? muligeSlektsforhold
        : muligeSlektsforhold.filter(mulighet => mulighet !== Slektsforhold.FORELDER);
    return (
        <StyledDropdown<Slektsforhold | ''> {...props} bredde={'fullbredde'}>
            {aktuelleSlektsforhold.map(
                (slektsforhold): ReactNode => (
                    <option value={slektsforhold} key={slektsforhold}>
                        {intl.formatMessage({ id: toSlektsforholdSpråkId(slektsforhold) })}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};

export default SlektsforholdDropdown;
