import React from 'react';

import FamilieAlert from '../FamilieAlert/FamilieAlert';
import SpråkTekst from '../SpråkTekst/SpråkTekst';

export const Feilside: React.FC = () => {
    return (
        <div>
            <FamilieAlert variant={'error'} dynamisk>
                <SpråkTekst id={'felles.crashmelding'} />
            </FamilieAlert>
        </div>
    );
};
