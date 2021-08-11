import React, { ReactNode } from 'react';

import { useIntl } from 'react-intl';

import StyledDropdown, { StyledDropdownProps } from './StyledDropdown';

enum Årsak {
    SEPARERT = 'SEPARERT ',
    SKILT = 'SKILT',
    BRUDD_I_SAMBOERFORHOLD = 'BRUDD_I_SAMBOERFORHOLD',
    BODD_ALENE_ETTER_AT_JEG_FIKK_BARN = 'BODD_ALENE_ETTER_AT_JEG_FIKK_BARN',
    ENKE_ENKEMANN = 'ENKE_ENKEMANN',
    SAMBOER_EKTEFELLE_FENGSEL_VARETEKT = 'SAMBOER_EKTEFELLE_FENGSEL_VARETEKT',
    GIFT_MEN_BRUDD_I_FORHOLD = 'GIFT_MEN_BRUDD_I_FORHOLD',
}

const options: Årsak[] = [
    Årsak.SEPARERT,
    Årsak.SKILT,
    Årsak.BRUDD_I_SAMBOERFORHOLD,
    Årsak.BODD_ALENE_ETTER_AT_JEG_FIKK_BARN,
    Årsak.ENKE_ENKEMANN,
    Årsak.SAMBOER_EKTEFELLE_FENGSEL_VARETEKT,
    Årsak.GIFT_MEN_BRUDD_I_FORHOLD,
];

const ÅrsakDropdown: React.FC<StyledDropdownProps<Årsak>> = props => {
    const intl = useIntl();
    return (
        <StyledDropdown {...props}>
            {options.map(
                (årsak): ReactNode => (
                    <option
                        value={årsak}
                        label={intl.formatMessage({ id: 'fix.dropdown.label.arsak' })}
                        key={årsak}
                    />
                )
            )}
        </StyledDropdown>
    );
};

export default ÅrsakDropdown;
