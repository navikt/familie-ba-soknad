import React, { ReactNode } from 'react';

import { Fieldset, VStack } from '@navikt/ds-react';

const SkjemaFieldset: React.FC<{
    legend?: ReactNode;
    dynamisk?: boolean;
    children?: ReactNode;
}> = ({ legend, dynamisk = false, children }) => {
    return (
        <Fieldset aria-live={dynamisk ? 'polite' : 'off'} legend={legend}>
            <VStack gap="space-12">{children}</VStack>
        </Fieldset>
    );
};

export default SkjemaFieldset;
