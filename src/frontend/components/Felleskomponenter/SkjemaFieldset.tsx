import React, { ReactNode } from 'react';

import { Fieldset, VStack } from '@navikt/ds-react';

import SpråkTekst from './SpråkTekst/SpråkTekst';

const SkjemaFieldset: React.FC<{
    legend?: ReactNode;
    legendSpråkId: string;
    språkValues?: { [key: string]: ReactNode };
    dynamisk?: boolean;
    children?: ReactNode;
}> = ({ legend, legendSpråkId, språkValues, dynamisk = false, children }) => {
    return (
        <Fieldset
            aria-live={dynamisk ? 'polite' : 'off'}
            legend={legend ? legend : <SpråkTekst id={legendSpråkId} values={språkValues} />}
        >
            <VStack gap="10">{children}</VStack>
        </Fieldset>
    );
};

export default SkjemaFieldset;
