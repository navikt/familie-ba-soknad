import React, { ReactNode } from 'react';

import { Box } from '@navikt/ds-react';

export const BarnekortContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <Box padding="space-6" background="neutral-soft" borderRadius="8">
            {children}
        </Box>
    );
};
