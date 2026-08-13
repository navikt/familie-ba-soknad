import { Fieldset, VStack } from '@navikt/ds-react';

import type { FC, ReactNode } from 'react';

const SkjemaFieldset: FC<{
    legend?: ReactNode;
    dynamisk?: boolean;
    children?: ReactNode;
}> = ({ legend, dynamisk = false, children }) => {
    return (
        <Fieldset aria-live={dynamisk ? 'polite' : 'off'} legend={legend}>
            <VStack gap="space-40">{children}</VStack>
        </Fieldset>
    );
};

export default SkjemaFieldset;
