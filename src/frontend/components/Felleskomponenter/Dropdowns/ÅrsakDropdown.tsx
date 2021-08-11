import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

export enum Årsak {
    SEPARERT = 'omdeg.velgårsak.separert',
    SKILT = 'omdeg.velgårsak.skilt',
    BRUDD_SAMBOER = 'omdeg.velgårsak.bruddsamboer',
    BODD_ALENE = 'omdeg.velgårsak.boddalene',
    ENKE_ENKEMANN = 'omdeg.velgårsak.enkeenkemann',
    FENGSEL_VARETEKT = 'omdeg.velgårsak.fengselvaretekt',
    BURDD_GIFT = 'omdeg.velgårsak.burddgift',
}

export const muligeÅrsaker: Årsak[] = [
    Årsak.SEPARERT,
    Årsak.SKILT,
    Årsak.BRUDD_SAMBOER,
    Årsak.BODD_ALENE,
    Årsak.ENKE_ENKEMANN,
    Årsak.FENGSEL_VARETEKT,
    Årsak.BURDD_GIFT,
];

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
