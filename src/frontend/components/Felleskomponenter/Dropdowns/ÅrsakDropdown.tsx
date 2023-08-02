import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import { muligeÅrsaker } from '../../../typer/søknad';
import { Årsak } from '../../../typer/utvidet';
import { toÅrsakSpråkId } from '../../../utils/språk';

import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

const ÅrsakDropdown: React.FC<StyledDropdownProps<Årsak | ''>> = props => {
    const intl = useIntl();
    return (
        <StyledDropdown<Årsak | ''> {...props} bredde={'fullbredde'}>
            {muligeÅrsaker.map(
                (årsak): ReactNode => (
                    <option value={årsak} key={årsak}>
                        {intl.formatMessage({ id: toÅrsakSpråkId(årsak) })}
                    </option>
                )
            )}
        </StyledDropdown>
    );
};

export default ÅrsakDropdown;
