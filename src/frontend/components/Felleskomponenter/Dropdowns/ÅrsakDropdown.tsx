import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import {
    muligeÅrsaker,
    Årsak,
} from '../../SøknadsSteg/Utvidet-DinLivssituasjon/types-and-utilities';
import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

const ÅrsakDropdown: React.FC<StyledDropdownProps<Årsak | ''>> = props => {
    const intl = useIntl();
    return (
        <StyledDropdown<Årsak | ''> {...props} bredde={'fullbredde'}>
            {muligeÅrsaker.map(
                (årsak): ReactNode => (
                    <option value={årsak} label={intl.formatMessage({ id: årsak })} key={årsak} />
                )
            )}
        </StyledDropdown>
    );
};

export default ÅrsakDropdown;
