import React, { useState } from 'react';

import { useIntl } from 'react-intl';

import barn1 from '../../../assets/barn1.svg';
import barn2 from '../../../assets/barn2.svg';
import barn3 from '../../../assets/barn3.svg';
import { hentTilfeldigElement } from '../../../utils/hjelpefunksjoner';

export const TilfeldigBarnIkon: React.FC<{ byttVedRerender?: boolean }> = ({
    byttVedRerender = true,
}) => {
    const ikoner = [barn1, barn2, barn3];
    // Bruker callback istedenfor direkte verdi slik at vi kun kaller hentTilfeldigElement ved første render
    const [fastsattIkon] = useState(() => hentTilfeldigElement(ikoner));
    const { formatMessage } = useIntl();

    return (
        <img
            src={byttVedRerender ? hentTilfeldigElement(ikoner) : fastsattIkon}
            alt={formatMessage({ id: 'felles.barneillustrasjon.tittel' })}
        />
    );
};
